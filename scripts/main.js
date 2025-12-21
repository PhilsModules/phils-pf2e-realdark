const MODULE_ID = "phils-pf2e-realdark";

Hooks.once("init", () => {
    // REGISTER SETTINGS

    // GLOBAL KILL SWITCH (Debug Mode)
    game.settings.register(MODULE_ID, "globalEnable", {
        name: "REALDARK.Settings.GlobalEnable.Name",
        hint: "REALDARK.Settings.GlobalEnable.Hint",
        scope: "client",
        config: true, // Show in standard menu for easy access
        type: Boolean,
        default: true,
        onChange: () => {
            updateTheme();
            // Force reload to ensure clean state if needed, or just let updateTheme handle it
            // For now, let updateTheme handle cleanup
            Object.values(ui.windows).forEach(app => {
                if (app.element) applyRealDarkTheme(app, app.element);
            });
        }
    });

    // Wizard Menu Button
    game.settings.registerMenu(MODULE_ID, "wizardMenu", {
        name: "REALDARK.Settings.Menu.Name",
        label: "REALDARK.Settings.Menu.Label",
        hint: "REALDARK.Settings.Menu.Hint",
        icon: "fas fa-magic",
        type: RealDarkSettingsShim,
        restricted: false
    });

    // Wizard State
    game.settings.register(MODULE_ID, "wizardShown", {
        name: "REALDARK.Settings.WizardShown.Name",
        scope: "client",
        config: false,
        type: Boolean,
        default: false
    });

    // Background Image
    game.settings.register(MODULE_ID, "backgroundImage", {
        name: "REALDARK.Settings.BackgroundImage.Name",
        hint: "REALDARK.Settings.BackgroundImage.Hint",
        scope: "client",
        config: false,
        type: String,
        filePicker: "image",
        default: "",
        onChange: () => updateTheme()
    });

    // Sheet Background Color
    game.settings.register(MODULE_ID, "colorBackground", {
        name: "REALDARK.Settings.ColorBackground.Name",
        hint: "REALDARK.Settings.ColorBackground.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#111111",
        onChange: () => updateTheme()
    });

    // Background Size
    game.settings.register(MODULE_ID, "bgSize", {
        name: "REALDARK.Settings.BgSize.Name",
        hint: "REALDARK.Settings.BgSize.Hint",
        scope: "client",
        config: false,
        type: String,
        default: "cover",
        onChange: () => updateTheme()
    });

    // Plaque Image
    game.settings.register(MODULE_ID, "plaqueImage", {
        name: "REALDARK.Settings.PlaqueImage.Name",
        hint: "REALDARK.Settings.PlaqueImage.Hint",
        scope: "client",
        config: false,
        type: String,
        filePicker: "image",
        default: "",
        onChange: () => updateTheme()
    });

    // Primary Color (Gold)
    game.settings.register(MODULE_ID, "colorGold", {
        name: "REALDARK.Settings.ColorGold.Name",
        hint: "REALDARK.Settings.ColorGold.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#ffbd4a",
        onChange: () => updateTheme()
    });

    // Dim Color
    game.settings.register(MODULE_ID, "colorGoldDim", {
        name: "REALDARK.Settings.ColorGoldDim.Name",
        hint: "REALDARK.Settings.ColorGoldDim.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#b8860b",
        onChange: () => updateTheme()
    });

    // Accent Color (Red)
    game.settings.register(MODULE_ID, "colorAccent", {
        name: "REALDARK.Settings.ColorAccent.Name",
        hint: "REALDARK.Settings.ColorAccent.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#ff3333",
        onChange: () => updateTheme()
    });


    // Light Text Color
    game.settings.register(MODULE_ID, "colorLight", {
        name: "REALDARK.Settings.ColorLight.Name",
        hint: "REALDARK.Settings.ColorLight.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#fff0d4",
        onChange: () => updateTheme()
    });

    // Input Config
    game.settings.register(MODULE_ID, "inputBg", {
        name: "REALDARK.Settings.InputBg.Name",
        hint: "REALDARK.Settings.InputBg.Hint",
        scope: "client",
        config: false,
        type: String,
        default: "rgba(0, 0, 0, 0.7)",
        onChange: () => updateTheme()
    });

    // Sidebar Opacity
    game.settings.register(MODULE_ID, "sidebarOpacity", {
        name: "REALDARK.Settings.SidebarOpacity.Name",
        hint: "REALDARK.Settings.SidebarOpacity.Hint",
        scope: "client",
        config: false,
        type: Number,
        default: 0.8,
        onChange: () => updateTheme()
    });

    // Banner Color
    game.settings.register(MODULE_ID, "colorBanner", {
        name: "REALDARK.Settings.ColorBanner.Name",
        hint: "REALDARK.Settings.ColorBanner.Hint",
        scope: "client",
        config: false,
        type: new foundry.data.fields.ColorField(),
        default: "#7a0000",
        onChange: () => updateTheme()
    });

    // MODULE SCOPES (Modular Settings)
    game.settings.register(MODULE_ID, "themeEnabledChat", {
        name: "REALDARK.Settings.ThemeEnabledChat.Name", // New Key
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
        onChange: () => updateTheme()
    });

    game.settings.register(MODULE_ID, "themeEnabledActor", {
        name: "REALDARK.Settings.ThemeEnabledActor.Name",
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
        onChange: () => updateTheme()
    });

    game.settings.register(MODULE_ID, "themeEnabledJournal", {
        name: "REALDARK.Settings.ThemeEnabledJournal.Name",
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
        onChange: () => updateTheme()
    });

    game.settings.register(MODULE_ID, "themeEnabledItem", {
        name: "REALDARK.Settings.ThemeEnabledItem.Name",
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
        onChange: () => updateTheme()
    });

    // Chat Header Color Bar
    game.settings.register(MODULE_ID, "chatHeaderColor", {
        name: "REALDARK.Settings.ChatHeaderColor.Name",
        hint: "REALDARK.Settings.ChatHeaderColor.Hint",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    // INITIALIZE THEME
    updateTheme();

});

// ========================================================================
// SETUP WIZARD
// ========================================================================
Hooks.once("ready", () => {
    if (!game.settings.get(MODULE_ID, "wizardShown")) {
        new RealDarkWizard().render(true);
    }
    ui.notifications.info(game.i18n.localize("REALDARK.Notify.Loaded"));

    // PHIL'S PFS ICON FIXER
    // The previous JS fixes (Intervals, Replacements) have been removed.
    // The fix is now purely CSS-based using a mask image in realdark-theme.css.
    // This ensures 0.00% performance impact.
});

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// ========================================================================
// SETTINGS SHIM (For V12 Menu Compatibility)
// ========================================================================
class RealDarkSettingsShim extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "realdark-shim",
            title: "RealDark Config",
            template: "modules/phils-pf2e-realdark/templates/settings-shim.hbs",
            width: 400,
            height: 200,
            minimizable: false,
            resizable: false
        });
    }

    render() {
        new RealDarkWizard().render(true);
        return this;
    }

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

        let inputVal = game.settings.get(MODULE_ID, "inputBg");
        let sliderVal = 0.7;
        const match = inputVal.match(/rgba\(0, 0, 0, ([0-9.]+)\)/);
        if (match) {
            sliderVal = parseFloat(match[1]);
        }

        return {
            goldVal, dimVal, accVal, textVal, bannerVal, bgVal,
            bgImgVal, bgSizeVal, sidebarOpVal, inputVal, sliderVal,
            toggleActor: game.settings.get(MODULE_ID, "themeEnabledActor"),
            toggleJournal: game.settings.get(MODULE_ID, "themeEnabledJournal"),
            toggleItem: game.settings.get(MODULE_ID, "themeEnabledItem"),
            toggleChat: game.settings.get(MODULE_ID, "themeEnabledChat"), // Pass new setting
            bgSizeOptions: {
                "cover": "Cover (Scale to Fit)",
                "contain": "Contain (Full Image)",
                "auto": "Auto (Original Size)"
            }
        };
    }

    _onRender(context, options) {
        // Expose helpers globally for inline oninput handlers
        window.updatePreview = (key, value) => {
            if (key === 'colorGold') {
                document.documentElement.style.setProperty('--realdark-gold', value);
                const hex = value.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                if (yiq < 100) {
                    document.documentElement.style.setProperty('--realdark-text-shadow', '0 0 2px white, 0 0 1px white');
                } else {
                    document.documentElement.style.setProperty('--realdark-text-shadow', '0 0 1px black');
                }
            }
            else if (key === 'colorGoldDim') document.documentElement.style.setProperty('--realdark-gold-dim', value);
            else if (key === 'colorAccent') document.documentElement.style.setProperty('--realdark-red-bright', value);
            else if (key === 'colorBanner') {
                document.documentElement.style.setProperty('--realdark-banner-color', value);
                if (window.updateSidebarRGBA) window.updateSidebarRGBA();
            }
            else if (key === 'colorBackground') document.documentElement.style.setProperty('--realdark-sheet-bg', value);
            else if (key === 'colorLight') document.documentElement.style.setProperty('--realdark-text-light', value);

            else if (key === 'bgSize') document.documentElement.style.setProperty('--realdark-bg-size', value);
            else if (key === 'backgroundImage') {
                let url = value;
                if (url && !url.startsWith("/") && !url.startsWith("http")) url = "/" + url;
                document.documentElement.style.setProperty('--realdark-bg-url', url ? `url('${url}')` : 'none');
            }
            else if (key === 'sidebarOpacity') {
                if (window.updateSidebarRGBA) window.updateSidebarRGBA();
            }
        };

        window.updateSidebarRGBA = function () {
            const hexInput = document.querySelector("input[name='colorBanner']");
            const opInput = document.querySelector("input[name='sidebarOpacity']");
            if (!hexInput || !opInput) return;

            const hexVal = hexInput.value || "#7a0000";
            const opacity = opInput.value || 0.8;

            let hex = String(hexVal);
            if (!hex.startsWith("#")) hex = "#7a0000";

            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);

            const rgbaTop = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            const rgbaBot = `rgba(0, 0, 0, ${opacity})`;

            document.documentElement.style.setProperty('--realdark-sidebar-rgba-top', rgbaTop);
            document.documentElement.style.setProperty('--realdark-sidebar-rgba-bottom', rgbaBot);
        };

        // Bind File Picker Manually
        const filePickerBtn = this.element.querySelector('.file-picker');
        if (filePickerBtn) {
            filePickerBtn.addEventListener('click', event => {
                const target = event.currentTarget.dataset.target;
                const fp = new FilePicker({
                    type: "image",
                    current: this.element.querySelector(`input[name="${target}"]`).value,
                    callback: path => {
                        this.element.querySelector(`input[name="${target}"]`).value = path;
                        window.updatePreview(target, path);
                        this.element.querySelector(`input[name="${target}"]`).dispatchEvent(new Event('change'));
                    }
                });
                fp.browse();
            });
        }

        // Trigger initial color inputs for swatch updates
        this.element.querySelectorAll(".rd-hex-input").forEach(el => el.dispatchEvent(new Event('input')));

        // MANUAL BINDING FOR SAVE BUTTON TO PREVENT RELOAD
        const saveBtn = this.element.querySelector(".rd-submit-btn");
        if (saveBtn) {
            saveBtn.type = "button"; // Force it to be a button
            saveBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Gather data manually because form submission is unreliable here
                const form = this.element.querySelector("form.rd-form-body");
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => data[key] = value);

                // FIX: Manually handle checkboxes because FormData ignores unchecked ones
                form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    data[cb.name] = cb.checked;
                });

                // Call static submit handler manually
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

        // Highlight preset button
        this.element.querySelectorAll(".rd-preset-btn").forEach(btn => {
            btn.style.borderColor = "var(--realdark-gold-dim)";
            btn.style.color = "#888";
        });
        target.style.borderColor = "var(--realdark-gold)";
        target.style.color = "white";

        // Manually trigger previews
        if (window.updatePreview) {
            window.updatePreview('colorGold', preset.gold);
            window.updatePreview('colorBanner', preset.banner);
            window.updatePreview('backgroundImage', preset.bgImg);
            window.updateSidebarRGBA();
        }
    }

    static async onSubmit(event, form, formData) {
        event.preventDefault();
        event.stopImmediatePropagation();

        try {
            // AppV2 passes the processed data object as the 3rd argument (formData).
            // We use this directly which is more reliable than manual FormData extraction.
            const data = formData.object;

            console.log("RealDark | Saving Data:", data);

            await game.settings.set(MODULE_ID, "colorGold", data.colorGold);
            await game.settings.set(MODULE_ID, "colorGoldDim", data.colorGoldDim);
            await game.settings.set(MODULE_ID, "colorAccent", data.colorAccent);
            await game.settings.set(MODULE_ID, "colorLight", data.colorLight);
            await game.settings.set(MODULE_ID, "colorBanner", data.colorBanner);
            await game.settings.set(MODULE_ID, "colorBackground", data.colorBackground);

            // Handle hidden input for inputBg if it wasn't captured correctly (sometimes hidden fields are tricky)
            // But usually formData.object has it. 
            await game.settings.set(MODULE_ID, "inputBg", data.inputBg);

            await game.settings.set(MODULE_ID, "backgroundImage", data.backgroundImage);
            await game.settings.set(MODULE_ID, "bgSize", data.bgSize);
            await game.settings.set(MODULE_ID, "sidebarOpacity", Number(data.sidebarOpacity));

            await game.settings.set(MODULE_ID, "themeEnabledActor", data.themeEnabledActor);
            await game.settings.set(MODULE_ID, "themeEnabledJournal", data.themeEnabledJournal);
            await game.settings.set(MODULE_ID, "themeEnabledItem", data.themeEnabledItem);
            await game.settings.set(MODULE_ID, "themeEnabledChat", data.themeEnabledChat); // Save setting

            await game.settings.set(MODULE_ID, "wizardShown", true);

            updateTheme();
            ui.notifications.info(game.i18n.localize("REALDARK.Notify.Saved"));

        } catch (err) {
            console.error("RealDark | Save Error:", err);
            ui.notifications.error("RealDark Save Failed! Check Console.");
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
        if (data.themeEnabledChat !== undefined) setCheck("themeEnabledChat", data.themeEnabledChat); // Import support

        ui.notifications.info(game.i18n.localize("REALDARK.Notify.ImportSuccess"));
    }
}





// ========================================================================
// THEME ENGINE (GLASSMORPHISM)
// ========================================================================

/**
 * Helper: Check luminance of a hex color
 * Returns true if color is dark (needs light text/shadow)
 */
function isColorDark(hexColor) {
    if (typeof hexColor !== "string" || !hexColor || !hexColor.startsWith("#")) return false;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // YIQ equation
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 100; // Threshold for text darkness
}

function updateTheme() {
    const root = document.documentElement;
    const enabled = game.settings.get(MODULE_ID, "globalEnable");

    if (!enabled) {
        console.log("RealDark: Global Kill Switch Active - Disabling Theme");
        document.body.classList.remove("realdark-theme-active");
        // Force cleanup on all open windows
        Object.values(ui.windows).forEach(app => {
            if (app.element) applyRealDarkTheme(app, app.element);
        });
        return;
    }

    document.body.classList.add("realdark-theme-active");

    // Chat Scoping - Toggle class based on setting
    const chatEnabled = game.settings.get(MODULE_ID, "themeEnabledChat");
    if (chatEnabled && enabled) {
        document.body.classList.add("realdark-chat-active");
    } else {
        document.body.classList.remove("realdark-chat-active");
    }

    // Helper to safely get string settings
    const getSetting = (key, fallback) => {
        const val = game.settings.get(MODULE_ID, key);
        return (val === null || val === undefined) ? fallback : val;
    };

    // Ensure paths are absolute to avoid CSS relative path issues (404s)
    let bgUrl = getSetting("backgroundImage", "");
    if (bgUrl && !bgUrl.startsWith("/") && !bgUrl.startsWith("http")) {
        bgUrl = "/" + bgUrl;
    }

    let plaqueUrl = getSetting("plaqueImage", "");
    if (plaqueUrl && !plaqueUrl.startsWith("/") && !plaqueUrl.startsWith("http")) {
        plaqueUrl = "/" + plaqueUrl;
    }

    const primaryColor = getSetting("colorGold", "#ffbd4a");

    root.style.setProperty("--realdark-bg-url", bgUrl ? `url('${bgUrl}')` : 'none');
    root.style.setProperty("--realdark-plaque-url", plaqueUrl ? `url('${plaqueUrl}')` : 'none');

    root.style.setProperty("--realdark-sheet-bg", getSetting("colorBackground", "#111111"));
    root.style.setProperty("--realdark-gold", primaryColor);
    root.style.setProperty("--realdark-gold-dim", getSetting("colorGoldDim", "#b8860b"));
    root.style.setProperty("--realdark-red-bright", getSetting("colorAccent", "#ff3333"));
    root.style.setProperty("--realdark-text-light", getSetting("colorLight", "#fff0d4"));
    root.style.setProperty("--realdark-input-bg", getSetting("inputBg", "rgba(0, 0, 0, 0.7)"));
    root.style.setProperty("--realdark-banner-color", getSetting("colorBanner", "#7a0000"));
    root.style.setProperty("--realdark-bg-size", getSetting("bgSize", "cover"));

    // CALCULATE SIDEBAR RGBA
    const bannerHex = getSetting("colorBanner", "#7a0000");
    let sidebarOp = getSetting("sidebarOpacity", 0.8);

    // Safety check for opacity
    if (sidebarOp === null || sidebarOp === undefined || isNaN(sidebarOp)) sidebarOp = 0.8;

    // Robust Hex Parsing
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

    // Set Atmosphere Mode - REMOVED
    root.removeAttribute("data-realdark-atmosphere");

    // SMART CONTRAST
    if (isColorDark(primaryColor)) {
        // If primary color is dark (e.g. Black), give it a white glow so it's readable
        root.style.setProperty("--realdark-text-shadow", "0 0 2px white, 0 0 1px white");
    } else {
        // Standard black shadow for light colors
        root.style.setProperty("--realdark-text-shadow", "0 0 1px black");
    }

    // Force Repaint of existing windows to be safe
    // This finds all windows we've themed and re-runs the inline style application
    // just in case they were stuck on old values (though vars should handle it)
    Object.values(ui.windows).forEach(app => {
        if (app.element && app.element.hasClass("realdark-theme-window")) {
            applyRealDarkTheme(app, app.element);
        }
    });

    console.log("PHIL THEME: Settings Updated & Applied");
}

function applyRealDarkTheme(app, html, forcedType = null) {
    if (!app.element) return;
    const el = app.element[0] || app.element;

    // Check scopes and clean up if disabled
    const docName = app.document?.documentName || app.object?.documentName;

    // Determine type: Trust ForcedType > DOM Classes > Fallback Property
    let isActor = forcedType === "Actor";
    let isItem = forcedType === "Item";
    let isJournal = forcedType === "JournalEntry";

    if (!forcedType) {
        // Use DOM classes if app options aren't available
        isActor = el.classList.contains("actor-sheet");
        isItem = el.classList.contains("item-sheet");
        isJournal = el.classList.contains("journal-sheet") || el.classList.contains("journal-entry-page");
    }

    let isDisabled = false;

    // GLOBAL KILL SWITCH CHECK
    if (!game.settings.get(MODULE_ID, "globalEnable")) {
        isDisabled = true;
    }

    // Check Settings against determined type
    if (isActor && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
    if (isItem && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
    if (isJournal && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;

    // Fallback if classes missing (rare) and no forcedType
    if (!forcedType && !isDisabled && !isActor && !isItem && !isJournal) {
        if (docName === "Actor" && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
        if (docName === "Item" && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
        if ((docName === "JournalEntry" || docName === "JournalEntryPage") && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;
    }

    if (isDisabled) {
        console.log(`RealDark: Theme Disabled for ${docName} - Performing Cleanup`);

        // cleanup main markers
        el.removeAttribute("data-realdark-theme");
        el.classList.remove("realdark-theme-window");

        // remove custom logo
        const customLogo = el.querySelector(".realdark-logo");
        if (customLogo) customLogo.remove();

        const logoCont = el.querySelector(".realdark-logo-container");
        if (logoCont) {
            logoCont.classList.remove("realdark-logo-container");
            logoCont.innerHTML = ""; // Clear our logo
            logoCont.style = ""; // Reset inline styles
        }

        // reset content styles
        // Remove the style attribute completely to reset to stylesheet defaults
        const content = el.querySelector(".window-content");
        if (content) {
            content.style.removeProperty("background-color");
            content.style.removeProperty("background-image");
            content.style.removeProperty("background");
        }

        // reset stubborn elements
        const stubborns = el.querySelectorAll(".journal-entry-page, .sheet-body, article, section, .editor-content");
        for (const p of stubborns) {
            p.style.removeProperty("background");
            p.style.removeProperty("background-color");
            p.style.removeProperty("color");
        }

        // reset inventory headers
        const invHeaders = el.querySelectorAll(".inventory-header, .inventory-list header, .item-list header");
        for (const h of invHeaders) {
            h.style.removeProperty("background");
            h.style.removeProperty("color");
        }

        // reset initiative select
        const initSelect = el.querySelector('select[name="system.initiative.statistic"]');
        if (initSelect) {
            initSelect.style = "";
            initSelect.querySelectorAll("option").forEach(o => o.style = "");
        }

        return;
    }

    // Mark Window Immediately
    el.setAttribute("data-realdark-theme", "dark");
    el.classList.add("realdark-theme-window");

    // Defer heavy DOM manipulation
    requestAnimationFrame(() => {
        // Fix background
        const content = el.querySelector(".window-content");
        if (content) {
            content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
            if (content.style.backgroundImage) content.style.removeProperty("background-image");
        }

        // Sidebar Logo Injection
        // Skip for Items/Spells/Feats & Journals
        const isItem = (app.document && app.document.documentName === "Item") || (app.object && app.object.documentName === "Item");
        const isJournal = (app.document && app.document.documentName === "JournalEntry") || (app.object && app.object.documentName === "JournalEntry");

        const sidebar = el.querySelector("aside.sidebar, .sidebar, .sheet-sidebar");
        if (sidebar && !isItem && !isJournal) {
            // Clean sidebar background if inline
            if (sidebar.style.backgroundImage) sidebar.style.removeProperty("background-image");

            // Inject Logo into existing container if possible
            // Search in 'el' to catch it whether it is in sidebar or header
            const existingLogoContainer = el.querySelector(".logo");

            // Check if we already injected (prevent duplicates)
            if (el.querySelector(".realdark-logo")) return;

            const logoImg = document.createElement("img");
            logoImg.classList.add("realdark-logo");
            logoImg.dataset.tooltip = "RealDark Custom Logo";
            logoImg.src = "/modules/phils-pf2e-realdark/assets/Logo.webp";
            // Style managed by CSS largely, but key overrides kept for safety
            logoImg.style.cssText = "display: block; margin: 0; width: 100%; height: auto; border: none; background: transparent; position: relative; z-index: 1000; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));";

            if (existingLogoContainer) {
                // User Request: Insert our logo INTO the gap container instead of under it
                existingLogoContainer.innerHTML = ""; // Clear existing
                existingLogoContainer.appendChild(logoImg);

                // Ensure container is visible even if CSS tried to hide .logo
                existingLogoContainer.classList.add("realdark-logo-container");
                existingLogoContainer.style.setProperty("display", "block", "important");
                existingLogoContainer.style.setProperty("margin", "0", "important");
                existingLogoContainer.style.setProperty("padding", "0", "important");
                existingLogoContainer.style.setProperty("height", "auto", "important");
                existingLogoContainer.style.setProperty("opacity", "1", "important");
                existingLogoContainer.style.setProperty("visibility", "visible", "important");
                existingLogoContainer.style.setProperty("width", "auto", "important");
            } else if (sidebar) {
                // Fallback: Prepend if no container found
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
        // Kept because system updates might revert these specific elements
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
// Catch things that might not have their own precise hook
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

/**
 * Chat Message Hook
 * Adds a colored bar to the top of the chat card based on the user's color
 */
Hooks.on("renderChatMessage", (message, html, data) => {
    // Check if feature is enabled
    if (!game.settings.get(MODULE_ID, "chatHeaderColor")) return;

    // Check if the chat should be themed at all
    if (!game.settings.get(MODULE_ID, "globalEnable")) return;
    if (!game.settings.get(MODULE_ID, "themeEnabledChat")) return;

    // Get the user color
    const user = message.author ?? message.user; // V10/V11/V12 compatibility safe
    if (!user || !user.color) return;

    const header = html.find(".message-header");
    if (header.length) {
        // Apply the border
        header.css("border-top", `3px solid ${user.color}`);

        // Optional: Add a slight background tint to the header for better visibility
        // header.css("background", `linear-gradient(to bottom, ${user.color}1A, transparent)`);
    }
});



Hooks.once('ready', async () => {
    // MIGRATION: Check for old/broken default paths and clear them
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

    // Initial Apply
    updateTheme();

    // Start observing for dynamic tags
    setupTagObserver();
});

/**
 * Watch for DOM updates to style lazy-loaded tags
 */
function setupTagObserver() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    // Check if node is an element (nodeType 1)
                    if (node.nodeType === 1) {
                        const el = $(node);
                        // Check if the element itself is a tag or contains tags
                        if (el.hasClass("tag") || el.hasClass("trait")) {
                            applyTagStyles(el);
                        }
                        // Check for tags inside the added node
                        else {
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
    // Only apply if the CONTAINER is actually themed
    const $els = $(elements);
    const isThemed = $els.closest(".realdark-theme-window").length > 0;

    if (!isThemed) return;

    // Force styles directly on the element's style attribute
    // This cannot be overridden by class specificity
    $els.each((i, el) => {
        el.style.setProperty("background", "rgba(0, 0, 0, 0.8)", "important");
        el.style.setProperty("background-color", "rgba(0, 0, 0, 0.8)", "important");
        if (el.tagName !== "SELECT") {
            el.style.setProperty("background-image", "none", "important");
        } else {
            // For SELECTs, we want to allow the custom arrow, but ensure no OTHER background affects it
            // Actually, since our CSS handles it, we can just NOT set background-image inline here.
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

// ========================================================================
// PFS ICON FIX (FORCED INJECTION)
// ========================================================================
Hooks.on("renderSidebarTab", (app, html) => {
    // Attempt to find the PFS icon
    // We target the anchor AND the svg specifically
    const pfsTargets = html.find('a[data-tab="pfs"] .pfs-icon, a[data-tab="pfs"] svg');

    if (pfsTargets.length) {
        // Apply inline styles to override specificities
        pfsTargets.css({
            "fill": "var(--realdark-gold)",
            "color": "var(--realdark-gold)",
            // The Drop-Shadow Hack in JS form (Guaranteed to work)
            "filter": "drop-shadow(0px -100px 0px var(--realdark-gold))",
            "transform": "translateY(100px)",
            "overflow": "visible",
            "opacity": "1"
        });

        // Safety: Target children too (paths)
        pfsTargets.find("*").css({
            "fill": "var(--realdark-gold)",
            "stroke": "var(--realdark-gold)"
        });

        // Also force the parent anchor color
        html.find('a[data-tab="pfs"]').css("color", "var(--realdark-gold)");
    }
});
