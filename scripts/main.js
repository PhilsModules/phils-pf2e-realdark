const MODULE_ID = "phils-pf2e-realdark";
window.RealDark = window.RealDark || {};

Hooks.once("init", () => {
    const SETTINGS = [
        { key: "globalEnable", name: "GlobalEnable", type: Boolean, default: true, config: true, onChange: true },
        { key: "wizardMenu", name: "Menu", type: RealDarkSettingsShim, menu: true },
        { key: "wizardShown", name: "WizardShown", type: Boolean, default: false },
        { key: "backgroundImage", name: "BackgroundImage", type: String, default: "", filePicker: "image", onChange: true },
        { key: "colorBackground", name: "ColorBackground", type: new foundry.data.fields.ColorField(), default: "#111111", onChange: true },
        { key: "bgSize", name: "BgSize", type: String, default: "cover", onChange: true },
        { key: "plaqueImage", name: "PlaqueImage", type: String, default: "", filePicker: "image", onChange: true },
        { key: "colorGold", name: "ColorGold", type: new foundry.data.fields.ColorField(), default: "#ffbd4a", onChange: true },
        { key: "colorGoldDim", name: "ColorGoldDim", type: new foundry.data.fields.ColorField(), default: "#b8860b", onChange: true },
        { key: "colorAccent", name: "ColorAccent", type: new foundry.data.fields.ColorField(), default: "#ff3333", onChange: true },
        { key: "colorLight", name: "ColorLight", type: new foundry.data.fields.ColorField(), default: "#fff0d4", onChange: true },
        { key: "inputBg", name: "InputBg", type: String, default: "rgba(0, 0, 0, 0.7)", onChange: true },
        { key: "sidebarOpacity", name: "SidebarOpacity", type: Number, default: 0.8, onChange: true },
        { key: "colorBanner", name: "ColorBanner", type: new foundry.data.fields.ColorField(), default: "#7a0000", onChange: true },
        { key: "colorWhisper", name: "ColorWhisper", type: new foundry.data.fields.ColorField(), default: "#3399ff", onChange: true },
        { key: "colorBlind", name: "ColorBlind", type: new foundry.data.fields.ColorField(), default: "#ff3333", onChange: true },
        { key: "colorDiceText", name: "ColorDiceText", type: new foundry.data.fields.ColorField(), default: "", onChange: () => window.RealDark?.updateDiceColors?.() },
        { key: "themeEnabledChat", name: "ThemeEnabledChat", type: Boolean, default: true, onChange: true },
        { key: "themeEnabledActor", name: "ThemeEnabledActor", type: Boolean, default: true, onChange: true },
        { key: "themeEnabledJournal", name: "ThemeEnabledJournal", type: Boolean, default: true, onChange: true },
        { key: "themeEnabledItem", name: "ThemeEnabledItem", type: Boolean, default: true, onChange: true },
        { key: "chatHeaderColor", name: "ChatHeaderColor", type: Boolean, default: true, config: true }
    ];

    SETTINGS.forEach(s => {
        const data = {
            name: `REALDARK.Settings.${s.name}.Name`,
            scope: "client",
            config: s.config ?? false,
            type: s.type,
            default: s.default
        };
        if (s.onChange === true) data.onChange = updateTheme;
        else if (typeof s.onChange === 'function') data.onChange = s.onChange;
        
        if (s.menu) {
            game.settings.registerMenu(MODULE_ID, s.key, {
                name: `REALDARK.Settings.${s.name}.Name`,
                label: `REALDARK.Settings.${s.name}.Label`,
                hint: `REALDARK.Settings.${s.name}.Hint`,
                icon: "fas fa-magic",
                type: s.type,
                restricted: false
            });
        } else {
            if (s.hint) data.hint = `REALDARK.Settings.${s.name}.Hint`;
            game.settings.register(MODULE_ID, s.key, data);
        }
    });

    updateTheme();
});

// Setup & Compatibility
Hooks.once("ready", () => {
    updateTheme();
    if (!game.settings.get(MODULE_ID, "wizardShown")) new RealDarkWizard().render(true);
    ui.notifications.info(game.i18n.localize("REALDARK.Notify.Loaded"));
});

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class RealDarkSettingsShim extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "realdark-shim", title: "RealDark Config", width: 400, height: 200, resizable: false,
            template: "modules/phils-pf2e-realdark/templates/settings-shim.hbs"
        });
    }
    render() { new RealDarkWizard().render(true); return this; }
    _updateObject() { }
}

class RealDarkWizard extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);
        this.options.window.controls = [
            {
                icon: "fas fa-file-import",
                label: game.i18n.localize("REALDARK.Wizard.Button.Import"),
                action: "importTheme"
            },
            {
                icon: "fas fa-file-export",
                label: game.i18n.localize("REALDARK.Wizard.Button.Export"),
                action: "exportTheme"
            }
        ];
    }

    static DEFAULT_OPTIONS = {
        id: "realdark-wizard",
        tag: "form",
        window: {
            title: "REALDARK.Wizard.Title",
            icon: "fas fa-magic",
            resizable: false
        },
        position: {
            width: 550,
            height: "auto"
        },
        classes: ["realdark-wizard-window"],
        actions: {
            applyPreset: RealDarkWizard.onApplyPreset,
            exportTheme: RealDarkWizard.onExportTheme,
            importTheme: RealDarkWizard.onImportTheme
        },
        form: {
            handler: RealDarkWizard.onSubmit,
            closeOnSubmit: true
        }
    };

    static PARTS = {
        form: {
            template: "modules/phils-pf2e-realdark/templates/wizard.hbs",
            scrollable: [".rd-form-body"]
        }
    };

    async _prepareContext(options) {
        const goldVal = game.settings.get(MODULE_ID, "colorGold");
        const dimVal = game.settings.get(MODULE_ID, "colorGoldDim");
        const accVal = game.settings.get(MODULE_ID, "colorAccent");
        const textVal = game.settings.get(MODULE_ID, "colorLight");
        const bannerVal = game.settings.get(MODULE_ID, "colorBanner");
        const bgVal = game.settings.get(MODULE_ID, "colorBackground");

        const bgImgVal = game.settings.get(MODULE_ID, "backgroundImage");
        const bgSizeVal = game.settings.get(MODULE_ID, "bgSize");
        const sidebarOpVal = game.settings.get(MODULE_ID, "sidebarOpacity");

        const whisperVal = game.settings.get(MODULE_ID, "colorWhisper");
        const blindVal = game.settings.get(MODULE_ID, "colorBlind");
        const diceVal = game.settings.get(MODULE_ID, "colorDiceText");

        let inputVal = game.settings.get(MODULE_ID, "inputBg");
        let sliderVal = 0.7;
        const match = inputVal.match(/rgba\(\s*0,\s*0,\s*0,\s*([0-9.]+)\s*\)/);
        if (match) {
            sliderVal = parseFloat(match[1]);
        }

        return {
            goldVal, dimVal, accVal, textVal, bannerVal, bgVal,
            bgImgVal, bgSizeVal, sidebarOpVal, inputVal, sliderVal,
            whisperVal, blindVal, diceVal,
            toggleActor: game.settings.get(MODULE_ID, "themeEnabledActor"),
            toggleJournal: game.settings.get(MODULE_ID, "themeEnabledJournal"),
            toggleItem: game.settings.get(MODULE_ID, "themeEnabledItem"),
            toggleChat: game.settings.get(MODULE_ID, "themeEnabledChat"),
            bgSizeOptions: {
                "cover": "Cover (Scale to Fit)",
                "contain": "Contain (Full Image)",
                "auto": "Auto (Original Size)"
            }
        };
    }

    _onRender(context, options) {
        window.RealDark.updatePreview = (key, value) => {
            const cssMap = {
                colorGold: '--realdark-gold',
                colorGoldDim: '--realdark-gold-dim',
                colorAccent: '--realdark-red-bright',
                colorBanner: '--realdark-banner-color',
                colorBackground: '--realdark-sheet-bg',
                colorLight: '--realdark-text-light',
                colorWhisper: '--realdark-color-whisper',
                colorBlind: '--realdark-color-blind',
                bgSize: '--realdark-bg-size'
            };

            if (cssMap[key]) {
                document.documentElement.style.setProperty(cssMap[key], value);
                
                if (key === 'colorBanner') window.RealDark.updateSidebarRGBA?.();
                if (key === 'colorGold') {
                    const hex = value.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
                    const isDark = ((r * 299) + (g * 587) + (b * 114)) / 1000 < 128;
                    document.documentElement.style.setProperty('--realdark-text-shadow', isDark ? 
                        '0 0 3px #ffffff, 0 0 1px #ffffff' : '1px 1px 3px black, 0 0 2px black');
                }
            } else if (key === 'backgroundImage') {
               const url = (value && !value.startsWith("/") && !value.startsWith("http")) ? "/" + value : value;
               document.documentElement.style.setProperty('--realdark-bg-url', url ? `url('${url}')` : 'none');
            } else if (key === 'sidebarOpacity') {
               window.RealDark.updateSidebarRGBA?.();
            }
        };

        window.RealDark.updateSidebarRGBA = () => {
            const hex = this.element.querySelector("input[name='colorBanner']")?.value || "#7a0000";
            const op = this.element.querySelector("input[name='sidebarOpacity']")?.value || 0.8;
            
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            document.documentElement.style.setProperty('--realdark-sidebar-rgba-top', `rgba(${r}, ${g}, ${b}, ${op})`);
            document.documentElement.style.setProperty('--realdark-sidebar-rgba-bottom', `rgba(0, 0, 0, ${op})`);
        };

        const filePickerBtn = this.element.querySelector('.file-picker');
        if (filePickerBtn) {
            filePickerBtn.addEventListener('click', event => {
                const target = event.currentTarget.dataset.target;
                const fp = new FilePicker({
                    type: "image",
                    current: this.element.querySelector(`input[name="${target}"]`).value,
                    callback: path => {
                        this.element.querySelector(`input[name="${target}"]`).value = path;
                        window.RealDark.updatePreview(target, path);
                        this.element.querySelector(`input[name="${target}"]`).dispatchEvent(new Event('change'));
                    }
                });
                fp.browse();
            });
        }

        // Trigger initial color inputs for swatch updates
        this.element.querySelectorAll(".rd-hex-input").forEach(el => el.dispatchEvent(new Event('input')));

        // Save Button Handler
        const saveBtn = this.element.querySelector(".rd-submit-btn");
        if (saveBtn) {
            saveBtn.type = "button"; 
            saveBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const form = this.element.querySelector("form.rd-form-body");
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => data[key] = value);

                formData.forEach((value, key) => data[key] = value);

                form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    data[cb.name] = cb.checked;
                });

                RealDarkWizard.onSubmit(e, form, { object: data });
            };
        }
    }

    static async onApplyPreset(event, target) {
        const presetKey = target.dataset.preset;
        const presets = {
            leather: { gold: "#ffbd4a", dim: "#d2a679", accent: "#cd853f", text: "#ffe4b5", banner: "#3e2723", bg: "#2b1b17", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgleather.webp", sidebarOp: 0.5 },
            wood: { gold: "#d4af37", dim: "#aa8e7e", accent: "#8b0000", text: "#faebd7", banner: "#2e1b0f", bg: "#1a100a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgwood.webp", sidebarOp: 0.6 },
            // NEW PRESETS
            bamboo: { gold: "#e0d8a0", dim: "#8ea67a", accent: "#8fb339", text: "#f0f5e5", banner: "#1e300f", bg: "#0f1a08", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgbamboo.webp", sidebarOp: 0.6 },
            
            // NEW PRESETS EXTENDED - High Contrast V2 (Complementary Accents)
            frost: { gold: "#ffffff", dim: "#b0c4de", accent: "#ffd700", text: "#f0f8ff", banner: "#1c2e4a", bg: "#0f1a2b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgfrostgilded.webp", sidebarOp: 0.7 },
            crimson: { gold: "#fff0e0", dim: "#d4af37", accent: "#ffd700", text: "#fff5ee", banner: "#3d0a0a", bg: "#1a0505", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcrimsonamber.webp", sidebarOp: 0.8 },
            shadow_star: { gold: "#e0e0ff", dim: "#483d8b", accent: "#00bfff", text: "#f8f8ff", banner: "#101030", bg: "#05051a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstarfall.webp", sidebarOp: 0.8 },
            venom: { gold: "#f0fff0", dim: "#9acd32", accent: "#ff4500", text: "#f5fffa", banner: "#1a2e1a", bg: "#0a1f0a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgvenomwilds.webp", sidebarOp: 0.7 },
            mystic: { gold: "#e0ffff", dim: "#20b2aa", accent: "#ffd700", text: "#f0ffff", banner: "#0a2b2b", bg: "#001a1a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmystictides.webp", sidebarOp: 0.7 },
            celestial: { gold: "#fffacd", dim: "#4169e1", accent: "#ffd700", text: "#f0f8ff", banner: "#0a0a2e", bg: "#00001a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcelestialnightfall.webp", sidebarOp: 0.8 },
            ritual: { gold: "#ffe0df", dim: "#800000", accent: "#ffa500", text: "#fff0f0", banner: "#2b0a0a", bg: "#1a0505", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgritual.webp", sidebarOp: 0.7 },
            ethereal: { gold: "#f0ffff", dim: "#87ceeb", accent: "#ff69b4", text: "#ffffff", banner: "#203a45", bg: "#102025", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgetheral.webp", sidebarOp: 0.6 },
            inferno: { gold: "#ffffff", dim: "#ff8c00", accent: "#ffff00", text: "#fff5ee", banner: "#330500", bg: "#1a0300", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bginferno.webp", sidebarOp: 0.8 },
            ebony: { gold: "#e8e0d5", dim: "#8b7e66", accent: "#cd853f", text: "#f0f0e0", banner: "#1a1005", bg: "#171813", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgebony.webp", sidebarOp: 0.9 },
            obsidian: { gold: "#f0fff5", dim: "#2e8b57", accent: "#00fa9a", text: "#f0fffa", banner: "#0f2b20", bg: "#05140f", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgscales.webp", sidebarOp: 0.8 },
            shadowwing: { gold: "#f5f0ff", dim: "#6a5acd", accent: "#9370db", text: "#f8f8ff", banner: "#1a0a2e", bg: "#0d0517", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgwing.webp", sidebarOp: 0.8 },
            relic: { gold: "#fff8dc", dim: "#8fbc8f", accent: "#20b2aa", text: "#f0fff0", banner: "#202020", bg: "#202624", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgrelic.webp", sidebarOp: 0.8 },
            ore: { gold: "#ffefdb", dim: "#cd853f", accent: "#ffd700", text: "#fff8dc", banner: "#202020", bg: "#1a1a1a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgblackgold.webp", sidebarOp: 0.8 },
            velvet: { gold: "#f8f8ff", dim: "#9932cc", accent: "#ba55d3", text: "#ffffff", banner: "#140026", bg: "#010201", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgvelet.webp", sidebarOp: 0.9 },
            weave: { gold: "#ffffe0", dim: "#a2cd5a", accent: "#adff2f", text: "#f0fff0", banner: "#0f1a0f", bg: "#070701", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgweave.webp", sidebarOp: 0.8 },
            swamp: { gold: "#f0fff0", dim: "#6b8e23", accent: "#7cfc00", text: "#f5f5dc", banner: "#1a261a", bg: "#0d140d", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgswamp.webp", sidebarOp: 0.7 },

            croc: { gold: "#c0cfa0", dim: "#8e9e7a", accent: "#7da33f", text: "#e8ede0", banner: "#1b2611", bg: "#0d1406", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcroc.webp", sidebarOp: 0.7 },
            dragon: { gold: "#ffbd4a", dim: "#e66a6a", accent: "#ff3333", text: "#ffe5e5", banner: "#4a0808", bg: "#1a0404", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgdragon.webp", sidebarOp: 0.6 },
            moon: { gold: "#c0e0ff", dim: "#6a8ac6", accent: "#66aaff", text: "#e0f0ff", banner: "#0b1421", bg: "#050810", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmoon.webp", sidebarOp: 0.7 },
            moss: { gold: "#b8c7a3", dim: "#9aa68a", accent: "#7ea35c", text: "#e8f0e0", banner: "#202917", bg: "#10140b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmoss.webp", sidebarOp: 0.6 },
            paper: { gold: "#d4c5a3", dim: "#a69685", accent: "#a35c5c", text: "#efebe0", banner: "#3b2e22", bg: "#1f160f", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgpaper.webp", sidebarOp: 0.6 },
            roses: { gold: "#eebbc3", dim: "#d66a7a", accent: "#ff4d6d", text: "#ffe0e5", banner: "#330a0f", bg: "#1a0406", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgroses.webp", sidebarOp: 0.7 },
            stars: { gold: "#e0f0ff", dim: "#8a86c6", accent: "#a64dff", text: "#f0f0ff", banner: "#100e26", bg: "#050412", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstars.webp", sidebarOp: 0.8 },
            stone: { gold: "#c0c0c0", dim: "#9a9aa6", accent: "#5ea3ba", text: "#e0e0e5", banner: "#2b2b30", bg: "#15151a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstone.webp", sidebarOp: 0.7 },
            perry: { gold: "#4dc0c0", dim: "#3a8e8e", accent: "#f7941d", text: "#e0f5f5", banner: "#004d4d", bg: "#002b2b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgperry.webp", sidebarOp: 0.7 },
            void: { gold: "#cccccc", dim: "#888888", accent: "#ffffff", text: "#e0e0e0", banner: "#000000", bg: "#000000", bgSize: "auto", bgImg: "", sidebarOp: 0.9 }
        };

        const preset = presets[presetKey];
        if (!preset) return;

        const app = this;

        const setVal = (name, val) => {
            const el = this.element.querySelector(`input[name='${name}']`);
            if (el) {
                el.value = val;
                el.dispatchEvent(new Event('input'));
                el.dispatchEvent(new Event('change'));
            }
            const picker = this.element.querySelector(`input[name='${name}Picker']`);
            if (picker) {
                picker.value = val;
                picker.dispatchEvent(new Event('input'));
            }
        };

        setVal("colorGold", preset.gold);
        setVal("colorGoldDim", preset.dim);
        setVal("colorAccent", preset.accent);
        setVal("colorLight", preset.text);
        setVal("colorBanner", preset.banner || "#7a0000");
        setVal("colorBackground", preset.bg || "#111111");

        const bgSizeSelect = this.element.querySelector("select[name='bgSize']");
        if (bgSizeSelect) { bgSizeSelect.value = preset.bgSize || "cover"; bgSizeSelect.dispatchEvent(new Event('change')); }



        setVal("backgroundImage", preset.bgImg || "");

        const slider = this.element.querySelector("input[name='sidebarOpacity']");
        if (slider) {
            slider.value = preset.sidebarOp;
            slider.dispatchEvent(new Event('input'));
        }

        this.element.querySelectorAll(".rd-preset-btn").forEach(btn => {
            btn.style.borderColor = "var(--realdark-gold-dim)";
            btn.style.color = "#888";
        });
        target.style.borderColor = "var(--realdark-gold)";
        target.style.color = "white";

        if (window.RealDark.updatePreview) {
            window.RealDark.updatePreview('colorGold', preset.gold);
            window.RealDark.updatePreview('colorBanner', preset.banner);
            window.RealDark.updatePreview('backgroundImage', preset.bgImg);
            window.RealDark.updateSidebarRGBA();
        }
    }

    static async onSubmit(event, form, formData) {
        event.preventDefault();
        event.stopImmediatePropagation();

        try {
            const data = formData.object;
            const settingsToSave = [
                "colorGold", "colorGoldDim", "colorAccent", "colorLight", "colorBanner", "colorBackground",
                "colorWhisper", "colorBlind", "colorDiceText", "inputBg", "backgroundImage", "bgSize",
                "themeEnabledActor", "themeEnabledJournal", "themeEnabledItem", "themeEnabledChat"
            ];

            for (const key of settingsToSave) {
                await game.settings.set(MODULE_ID, key, data[key]);
            }
            await game.settings.set(MODULE_ID, "sidebarOpacity", Number(data.sidebarOpacity));
            await game.settings.set(MODULE_ID, "wizardShown", true);

            updateTheme();
            ui.notifications.info(game.i18n.localize("REALDARK.Notify.Saved"));
        } catch (err) {
            console.error("RealDark Save Fail:", err);
            ui.notifications.error("RealDark Save Failed!");
        }
    }

    static async onExportTheme(event, target) {
        // Collect current form data
        const form = this.element.querySelector("form.rd-form-body");
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        // Sanitize data
        delete data.inputBg;

        // Create JSON
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Trigger Download
        const a = document.createElement("a");
        a.href = url;
        a.download = "realdark-theme.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    static async onImportTheme(event, target) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.onchange = async () => {
            if (input.files.length === 0) return;
            const file = input.files[0];
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                await RealDarkWizard.applyThemeData(this, json);
            } catch (err) {
                ui.notifications.error(game.i18n.localize("REALDARK.Notify.ImportError"));
                console.error(err);
            }
        };

        input.click();
    }

    static async applyThemeData(wizard, data) {
        // Helper to set value on the wizard
        const setVal = (name, val) => {
            const el = wizard.element.querySelector(`input[name='${name}']`);
            if (el) {
                el.value = val;
                el.dispatchEvent(new Event('input'));
                el.dispatchEvent(new Event('change'));
            }
            const picker = wizard.element.querySelector(`input[name='${name}Picker']`);
            if (picker) {
                picker.value = val;
                picker.dispatchEvent(new Event('input'));
            }
        };

        if (data.colorGold) setVal("colorGold", data.colorGold);
        if (data.colorGoldDim) setVal("colorGoldDim", data.colorGoldDim);
        if (data.colorAccent) setVal("colorAccent", data.colorAccent);
        if (data.colorLight) setVal("colorLight", data.colorLight);
        if (data.colorBanner) setVal("colorBanner", data.colorBanner);
        if (data.colorBackground) setVal("colorBackground", data.colorBackground);
        
        if (data.colorWhisper) setVal("colorWhisper", data.colorWhisper);
        if (data.colorBlind) setVal("colorBlind", data.colorBlind);
        if (data.colorDiceText !== undefined) setVal("colorDiceText", data.colorDiceText);

        if (data.bgSize) {
            const bgSizeSelect = wizard.element.querySelector("select[name='bgSize']");
            if (bgSizeSelect) { bgSizeSelect.value = data.bgSize; bgSizeSelect.dispatchEvent(new Event('change')); }
        }

        if (data.backgroundImage) setVal("backgroundImage", data.backgroundImage || "");

        if (data.sidebarOpacity) {
            const slider = wizard.element.querySelector("input[name='sidebarOpacity']");
            if (slider) {
                slider.value = data.sidebarOpacity;
                slider.dispatchEvent(new Event('input'));
            }
        }

        const setCheck = (name, val) => {
            const el = wizard.element.querySelector(`input[name='${name}']`);
            if (el) el.checked = val;
        };

        if (data.themeEnabledActor !== undefined) setCheck("themeEnabledActor", data.themeEnabledActor);
        if (data.themeEnabledJournal !== undefined) setCheck("themeEnabledJournal", data.themeEnabledJournal);
        if (data.themeEnabledItem !== undefined) setCheck("themeEnabledItem", data.themeEnabledItem);
        if (data.themeEnabledChat !== undefined) setCheck("themeEnabledChat", data.themeEnabledChat);

        ui.notifications.info(game.i18n.localize("REALDARK.Notify.ImportSuccess"));
    }
}





// Theme Core Logic
function updateTheme() {
    const root = document.documentElement;
    if (!document.body) return;
    if (!game.settings.get(MODULE_ID, "globalEnable")) {
        document.body.classList.remove("realdark-theme-active");
        Object.values(ui.windows).forEach(app => app.element && applyRealDarkTheme(app, app.element));
        return;
    }

    document.body.classList.add("realdark-theme-active");
    game.settings.get(MODULE_ID, "themeEnabledChat") ? 
        document.body.classList.add("realdark-chat-active") : document.body.classList.remove("realdark-chat-active");

    const get = (k, d) => { const v = game.settings.get(MODULE_ID, k); return (v == null) ? d : v; };
    const cleanUrl = (u) => (u && !u.startsWith("/") && !u.startsWith("http")) ? "/" + u : u;

    root.style.setProperty("--realdark-bg-url", cleanUrl(get("backgroundImage", "")) ? `url('${cleanUrl(get("backgroundImage", ""))}')` : 'none');
    root.style.setProperty("--realdark-plaque-url", cleanUrl(get("plaqueImage", "")) ? `url('${cleanUrl(get("plaqueImage", ""))}')` : 'none');
    root.style.setProperty("--realdark-sheet-bg", get("colorBackground", "#111111"));
    root.style.setProperty("--realdark-gold", get("colorGold", "#ffbd4a"));
    root.style.setProperty("--realdark-gold-dim", get("colorGoldDim", "#b8860b"));
    root.style.setProperty("--realdark-red-bright", get("colorAccent", "#ff3333"));
    root.style.setProperty("--realdark-text-light", get("colorLight", "#fff0d4"));
    root.style.setProperty("--realdark-input-bg", get("inputBg", "rgba(0, 0, 0, 0.7)"));
    root.style.setProperty("--realdark-banner-color", get("colorBanner", "#7a0000"));
    root.style.setProperty("--realdark-bg-size", get("bgSize", "cover"));
    
    // Chat Colors
    root.style.setProperty("--realdark-color-whisper", get("colorWhisper", "#3399ff"));
    root.style.setProperty("--realdark-color-blind", get("colorBlind", "#ff3333"));
    root.style.setProperty("--realdark-color-blind", get("colorBlind", "#ff3333"));

    // Sidebar Opacity
    const bannerHex = get("colorBanner", "#7a0000");
    let sidebarOp = get("sidebarOpacity", 0.8);
    if (sidebarOp === null || sidebarOp === undefined || isNaN(sidebarOp)) sidebarOp = 0.8;

    let hex = String(bannerHex).replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) hex = "7a0000"; // Fallback

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const fullRGBA = `rgba(${r}, ${g}, ${b}, ${sidebarOp})`;
    const bottomRGBA = `rgba(0, 0, 0, ${sidebarOp})`;

    // console.log(`PHIL THEME: Updating Sidebar RGBA | Hex: ${ hex } | Opacity: ${ sidebarOp } | Result: ${ fullRGBA }`);

    root.style.setProperty("--realdark-sidebar-rgba-top", fullRGBA);
    root.style.setProperty("--realdark-sidebar-rgba-bottom", bottomRGBA);

    // Smart Contrast
    root.removeAttribute("data-realdark-atmosphere");

    const primaryColor = get("colorGold", "#ffbd4a");
    const pHex = String(primaryColor).replace(/^#/, '');
    const pr = parseInt(pHex.substring(0, 2), 16), pg = parseInt(pHex.substring(2, 4), 16), pb = parseInt(pHex.substring(4, 6), 16);
    const pYiq = ((pr * 299) + (pg * 587) + (pb * 114)) / 1000;
    
    if (pYiq < 128) {
         root.style.setProperty("--realdark-text-shadow", "0 0 3px #ffffff, 0 0 1px #ffffff");
    } else {
         root.style.setProperty("--realdark-text-shadow", "1px 1px 3px black, 0 0 2px black");
    }

    Object.values(ui.windows).forEach(app => {
        if (app.element && app.element.hasClass("realdark-theme-window")) {
            applyRealDarkTheme(app, app.element);
        }
    });
}

function applyRealDarkTheme(app, html, forcedType = null) {
    if (!app.element) return;
    const el = app.element[0] || app.element;
    const docName = app.document?.documentName || app.object?.documentName;

    // Determine Sheet Type
    let isActor = forcedType === "Actor";
    let isItem = forcedType === "Item";
    let isJournal = forcedType === "JournalEntry";

    if (!forcedType) {
        isActor = el.classList.contains("actor-sheet");
        isItem = el.classList.contains("item-sheet");
        isJournal = el.classList.contains("journal-sheet") || el.classList.contains("journal-entry-page");
    }

    let isDisabled = false;

    if (!game.settings.get(MODULE_ID, "globalEnable")) {
        isDisabled = true;
    }

    // Check Settings against determined type
    if (isActor && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
    if (isItem && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
    if (isJournal && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;

    if (!forcedType && !isDisabled && !isActor && !isItem && !isJournal) {
        if (docName === "Actor" && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
        if (docName === "Item" && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
        if ((docName === "JournalEntry" || docName === "JournalEntryPage") && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;
    }

    if (isDisabled) {
        // Cleanup
        el.removeAttribute("data-realdark-theme");
        el.classList.remove("realdark-theme-window");

        const customLogo = el.querySelector(".realdark-logo");
        if (customLogo) customLogo.remove();

        const logoCont = el.querySelector(".realdark-logo-container");
        if (logoCont) {
            logoCont.classList.remove("realdark-logo-container");
            logoCont.innerHTML = "";
            logoCont.style = "";
        }

        const content = el.querySelector(".window-content");
        if (content) {
            content.style.removeProperty("background-color");
            content.style.removeProperty("background-image");
            content.style.removeProperty("background");
        }

        const stubborns = el.querySelectorAll(".journal-entry-page, .sheet-body, article, section, .editor-content");
        for (const p of stubborns) {
            p.style.removeProperty("background");
            p.style.removeProperty("background-color");
            p.style.removeProperty("color");
        }

        const invHeaders = el.querySelectorAll(".inventory-header, .inventory-list header, .item-list header");
        for (const h of invHeaders) {
            h.style.removeProperty("background");
            h.style.removeProperty("color");
        }

        const initSelect = el.querySelector('select[name="system.initiative.statistic"]');
        if (initSelect) {
            initSelect.style = "";
            initSelect.querySelectorAll("option").forEach(o => o.style = "");
        }

        return;
    }

    // Apply Theme
    el.setAttribute("data-realdark-theme", "dark");
    el.classList.add("realdark-theme-window");

    requestAnimationFrame(() => {
        const content = el.querySelector(".window-content");
        if (content) {
            content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
            if (content.style.backgroundImage) content.style.removeProperty("background-image");
        }

        // Sidebar Logo Injection
        const isItem = (app.document && app.document.documentName === "Item") || (app.object && app.object.documentName === "Item");
        const isJournal = (app.document && app.document.documentName === "JournalEntry") || (app.object && app.object.documentName === "JournalEntry");

        const sidebar = el.querySelector("aside.sidebar, .sidebar, .sheet-sidebar");
        if (sidebar && !isItem && !isJournal) {
            if (sidebar.style.backgroundImage) sidebar.style.removeProperty("background-image");

            const existingLogoContainer = el.querySelector(".logo");

            if (el.querySelector(".realdark-logo")) return;

            const logoImg = document.createElement("img");
            logoImg.classList.add("realdark-logo");
            logoImg.dataset.tooltip = "RealDark Custom Logo";
            logoImg.src = "/modules/phils-pf2e-realdark/assets/Logo.webp";
            logoImg.style.cssText = "display: block; margin: 0; width: 100%; height: auto; border: none; background: transparent; position: relative; z-index: 1000; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));";

            if (existingLogoContainer) {
                existingLogoContainer.innerHTML = "";
                existingLogoContainer.appendChild(logoImg);

                existingLogoContainer.classList.add("realdark-logo-container");
                existingLogoContainer.style.setProperty("display", "block", "important");
                existingLogoContainer.style.setProperty("margin", "0", "important");
                existingLogoContainer.style.setProperty("padding", "0", "important");
                existingLogoContainer.style.setProperty("height", "auto", "important");
                existingLogoContainer.style.setProperty("opacity", "1", "important");
                existingLogoContainer.style.setProperty("visibility", "visible", "important");
                existingLogoContainer.style.setProperty("width", "auto", "important");
            } else if (sidebar) {
                const isNPC = (app.document?.type === 'npc' || app.document?.type === 'hazard');

                if (isNPC) {
                    logoImg.style.margin = "0";
                    logoImg.style.width = "100%";
                } else {
                    logoImg.style.margin = "0 -8px 0px -8px";
                    logoImg.style.width = "calc(100% + 16px)";
                }
                sidebar.prepend(logoImg);
            }
        }

        // Journal Specifics
        if (app.options && app.options.classes && app.options.classes.includes("journal-sheet")) {
            if (!game.settings.get(MODULE_ID, "themeEnabledJournal")) return;

            const stubborns = el.querySelectorAll(".journal-entry-page, .sheet-body, article, section");
            for (const p of stubborns) {
                p.style.setProperty("background", "transparent", "important");
                p.style.setProperty("color", "#f0f0f0", "important");
            }
        }

        // Inventory Headers
        const invHeaders = el.querySelectorAll(".inventory-header, .inventory-list header, .item-list header");
        for (const h of invHeaders) {
            h.style.setProperty("background", "rgba(0, 0, 0, 0.4)", "important");
            h.style.setProperty("color", "var(--realdark-gold)", "important");
        }

        // Clean up Initiative Dropdown
        const initSelect = el.querySelector('select[name="system.initiative.statistic"]');
        if (initSelect) {
            initSelect.style.setProperty("background-color", "var(--realdark-input-bg)", "important");
            initSelect.style.setProperty("color", "var(--realdark-gold)", "important");
            initSelect.style.setProperty("color-scheme", "dark", "important");
            initSelect.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.2)", "important");

            const opts = initSelect.querySelectorAll("option");
            for (const opt of opts) {
                opt.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
                opt.style.setProperty("color", "var(--realdark-gold)", "important");
            }
        }
    });
}

// Hooks
Hooks.on("renderActorSheet", (app, html, data) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderItemSheet", (app, html, data) => applyRealDarkTheme(app, html, "Item"));
Hooks.on("renderJournalSheet", (app, html, data) => applyRealDarkTheme(app, html, "JournalEntry"));
Hooks.on("renderDialog", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderCheckModifiersDialog", (app, html, data) => applyRealDarkTheme(app, html));

// PF2e Specific Hooks
Hooks.on("renderAttributeBuilder", (app, html, data) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderTagSelector", (app, html, data) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderDamageDialog", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderRollModifiersDialog", (app, html, data) => applyRealDarkTheme(app, html));

// General Application Hook
Hooks.on("renderApplication", (app, html, data) => {
    const el = html[0];
    if (!el) return;

    if (el.classList.contains("tag-selector") ||
        el.classList.contains("attribute-builder") ||
        el.classList.contains("damage-dialog") ||
        el.classList.contains("roll-modifiers-dialog")) {
        applyRealDarkTheme(app, html);
    }
});

// Chat Message Header Styling
Hooks.on("renderChatMessage", (message, html, data) => {
    if (!game.settings.get(MODULE_ID, "chatHeaderColor")) return;
    if (!game.settings.get(MODULE_ID, "globalEnable")) return;
    if (!game.settings.get(MODULE_ID, "themeEnabledChat")) return;

    const user = message.author ?? message.user;
    if (!user || !user.color) return;

    const header = html.find(".message-header");
    if (header.length) {
        header.css("border-top", `3px solid ${user.color}`);
    }
});



Hooks.once('ready', async () => {
    const bg = game.settings.get(MODULE_ID, 'backgroundImage');
    const pl = game.settings.get(MODULE_ID, 'plaqueImage');

    if (bg && bg.includes('Parchmentblack.webp')) {
        console.log('PHIL THEME: Migrating broken background setting...');
        await game.settings.set(MODULE_ID, 'backgroundImage', '');
    }

    if (pl && pl.includes('Plaqueblack.webp')) {
        console.log('PHIL THEME: Migrating broken plaque setting...');
        await game.settings.set(MODULE_ID, 'plaqueImage', '');
    }

    updateTheme();
    setupTagObserver();
});

/**
 * Watch for DOM updates to style lazy-loaded tags
 */
function setupTagObserver() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            const isInsideTheme = target.closest && target.closest(".realdark-theme-window");
            if (!isInsideTheme) continue;

            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const el = $(node);
                        if (el.hasClass("tag") || el.hasClass("trait")) {
                            applyTagStyles(el);
                        } else {
                            const tags = el.find(".tag, .trait");
                            if (tags.length > 0) {
                                applyTagStyles(tags);
                            }
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function applyTagStyles(elements) {
    const $els = $(elements);
    const isThemed = $els.closest(".realdark-theme-window").length > 0;

    if (!isThemed) return;

    $els.each((i, el) => {
        el.style.setProperty("background", "rgba(0, 0, 0, 0.8)", "important");
        el.style.setProperty("background-color", "rgba(0, 0, 0, 0.8)", "important");
        if (el.tagName !== "SELECT") {
            el.style.setProperty("background-image", "none", "important");
        } else {
            el.style.removeProperty("background-image");
        }
        el.style.setProperty("color", "var(--realdark-text-light)", "important");
        el.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.2)", "important");
        el.style.setProperty("box-shadow", "none", "important");
        el.style.setProperty("text-shadow", "none", "important");
        el.style.setProperty("border-radius", "3px", "important");

        // Ensure inner spans also comply
        const spans = el.querySelectorAll("span");
        spans.forEach(span => {
            span.style.setProperty("color", "var(--realdark-text-light)", "important");
            span.style.setProperty("background", "transparent", "important");
        });
    });
}


