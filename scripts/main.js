const MODULE_ID = "phils-pf2e-realdark";
window.RealDark = window.RealDark || {};

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class RealDarkWizard extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "realdark-wizard",
        tag: "form",
        window: {
            title: "REALDARK.Wizard.Title",
            icon: "fas fa-magic",
            resizable: false,
            controls: [
                {
                    icon: "fas fa-file-import",
                    label: "REALDARK.Wizard.Button.Import",
                    action: "importTheme"
                },
                {
                    icon: "fas fa-file-export",
                    label: "REALDARK.Wizard.Button.Export",
                    action: "exportTheme"
                },
                {
                    action: "close",
                    icon: "fa-solid fa-times",
                    label: "REALDARK.Wizard.Button.Close"
                }
            ]
        },
        position: {
            width: 920,
            height: 620
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
        const primaryVal = game.settings.get(MODULE_ID, "colorPrimary");
        const secondaryVal = game.settings.get(MODULE_ID, "colorSecondary");
        const accentVal = game.settings.get(MODULE_ID, "colorAccent");
        const textVal = game.settings.get(MODULE_ID, "colorText");
        const bannerVal = game.settings.get(MODULE_ID, "colorBanner");
        const bgVal = game.settings.get(MODULE_ID, "colorBackground");

        const bgImgVal = game.settings.get(MODULE_ID, "backgroundImage");
        const bgSizeVal = game.settings.get(MODULE_ID, "bgSize");
        const sidebarOpVal = game.settings.get(MODULE_ID, "sidebarOpacity");

        const whisperVal = game.settings.get(MODULE_ID, "colorWhisper");
        const blindVal = game.settings.get(MODULE_ID, "colorBlind");
        const diceVal = game.settings.get(MODULE_ID, "colorDiceText");
        const diceValPicker = diceVal || "#ffffff";

        const inputVal = game.settings.get(MODULE_ID, "inputBg");
        let sliderVal = 0.7;
        const match = inputVal.match(/rgba\(\s*0,\s*0,\s*0,\s*([0-9.]+)\s*\)/);
        if (match) {
            sliderVal = parseFloat(match[1]);
        }

        return {
            primaryVal, secondaryVal, accentVal, textVal, bannerVal, bgVal,
            bgImgVal, bgSizeVal, sidebarOpVal, inputVal, sliderVal,
            whisperVal, blindVal, diceVal, diceValPicker,
            toggleActor: game.settings.get(MODULE_ID, "themeEnabledActor"),
            toggleJournal: game.settings.get(MODULE_ID, "themeEnabledJournal"),
            toggleItem: game.settings.get(MODULE_ID, "themeEnabledItem"),
            toggleChat: game.settings.get(MODULE_ID, "themeEnabledChat"),
            toggleSkillColor: game.settings.get(MODULE_ID, "overrideSkillColor")
        };
    }

    _onRender(context, options) {
        const form = this.element;

        form.addEventListener("input", (event) => {
            const target = event.target;
            const name = target.name;
            const value = target.value;

            if (name && name.endsWith("Picker")) {
                const baseName = name.replace("Picker", "");
                const textInput = form.querySelector(`input[name='${baseName}']`);
                const swatch = target.closest(".rd-swatch");
                if (textInput) textInput.value = value;
                if (swatch) swatch.style.background = value;
                RealDarkWizard.updatePreview(baseName, value);
            } else if (name && form.querySelector(`input[name='${name}Picker']`)) {
                const picker = form.querySelector(`input[name='${name}Picker']`);
                const swatch = picker?.closest(".rd-swatch");
                if (picker) picker.value = value;
                if (swatch) swatch.style.background = value;
                RealDarkWizard.updatePreview(name, value);
            } else if (name === "sidebarOpacity") {
                const display = form.querySelector("#rd-sidebar-op-val");
                if (display) display.innerText = value;
                RealDarkWizard.updatePreview("sidebarOpacity", value);
                const bannerInput = form.querySelector("input[name='colorBanner']");
                if (bannerInput) RealDarkWizard.updateSidebarRGBA(bannerInput.value, value);
            } else if (target.id === "rd-input-darkness-range") {
                const val = `rgba(0, 0, 0, ${value})`;
                const hiddenInput = form.querySelector("#inputBgHidden");
                const display = form.querySelector("#rd-slider-val");
                if (hiddenInput) hiddenInput.value = val;
                if (display) display.innerText = value;
                document.documentElement.style.setProperty("--realdark-input-bg", val);
            }
        });
    }

    static updatePreview(key, value) {
        const cssMap = {
            colorPrimary: "--realdark-primary",
            colorSecondary: "--realdark-secondary",
            colorAccent: "--realdark-accent",
            colorBanner: "--realdark-banner-color",
            colorBackground: "--realdark-sheet-bg",
            colorText: "--realdark-text",
            colorWhisper: "--realdark-color-whisper",
            colorBlind: "--realdark-color-blind",
            bgSize: "--realdark-bg-size",
            colorGold: "--realdark-primary",
            colorGoldDim: "--realdark-secondary",
            colorLight: "--realdark-text"
        };

        if (cssMap[key]) {
            document.documentElement.style.setProperty(cssMap[key], value);
            if (key === "colorPrimary" || key === "colorGold") {
                document.documentElement.style.setProperty("--realdark-gold", value);
                const hex = value.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
                const isDark = ((r * 299) + (g * 587) + (b * 114)) / 1000 < 128;
                document.documentElement.style.setProperty("--realdark-text-shadow", isDark
                    ? "0 0 3px #ffffff, 0 0 1px #ffffff"
                    : "1px 1px 3px black, 0 0 2px black");
            }
            if (key === "colorSecondary" || key === "colorGoldDim") {
                document.documentElement.style.setProperty("--realdark-gold-dim", value);
            }
            if (key === "colorAccent") {
                document.documentElement.style.setProperty("--realdark-red-bright", value);
            }
            if (key === "colorText" || key === "colorLight") {
                document.documentElement.style.setProperty("--realdark-text-light", value);
            }
            if (key === "colorBanner") {
                const opacity = document.querySelector("#realdark-wizard input[name='sidebarOpacity']")?.value || 0.8;
                RealDarkWizard.updateSidebarRGBA(value, opacity);
            }
        } else if (key === "backgroundImage") {
            const url = (value && !value.startsWith("/") && !value.startsWith("http")) ? "/" + value : value;
            document.documentElement.style.setProperty("--realdark-bg-url", url ? `url('${url}')` : "none");
        }
    }

    static updateSidebarRGBA(bannerHex = "#7a0000", opacity = 0.8) {
        let hex = String(bannerHex).replace(/^#/, "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) hex = "7a0000";

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        document.documentElement.style.setProperty("--realdark-sidebar-rgba-top", `rgba(${r}, ${g}, ${b}, ${opacity})`);
        document.documentElement.style.setProperty("--realdark-sidebar-rgba-bottom", `rgba(0, 0, 0, ${opacity})`);
    }

    static async onApplyPreset(event, target) {
        const presetKey = target.dataset.preset;
        const presets = {
            leather: { primary: "#ffbd4a", secondary: "#d2a679", accent: "#cd853f", text: "#ffe4b5", banner: "#3e2723", bg: "#2b1b17", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgleather.webp", sidebarOp: 0.5 },
            wood: { primary: "#d4af37", secondary: "#aa8e7e", accent: "#8b0000", text: "#faebd7", banner: "#2e1b0f", bg: "#1a100a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgwood.webp", sidebarOp: 0.6 },
            bamboo: { primary: "#e0d8a0", secondary: "#8ea67a", accent: "#8fb339", text: "#f0f5e5", banner: "#1e300f", bg: "#0f1a08", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgbamboo.webp", sidebarOp: 0.6 },
            frost: { primary: "#ffffff", secondary: "#b0c4de", accent: "#ffd700", text: "#f0f8ff", banner: "#1c2e4a", bg: "#0f1a2b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgfrostgilded.webp", sidebarOp: 0.7 },
            crimson: { primary: "#fff0e0", secondary: "#d4af37", accent: "#ffd700", text: "#fff5ee", banner: "#3d0a0a", bg: "#1a0505", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcrimsonamber.webp", sidebarOp: 0.8 },
            shadow_star: { primary: "#e0e0ff", secondary: "#483d8b", accent: "#00bfff", text: "#f8f8ff", banner: "#101030", bg: "#05051a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstarfall.webp", sidebarOp: 0.8 },
            venom: { primary: "#f0fff0", secondary: "#9acd32", accent: "#ff4500", text: "#f5fffa", banner: "#1a2e1a", bg: "#0a1f0a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgvenomwilds.webp", sidebarOp: 0.7 },
            mystic: { primary: "#e0ffff", secondary: "#20b2aa", accent: "#ffd700", text: "#f0ffff", banner: "#0a2b2b", bg: "#001a1a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmystictides.webp", sidebarOp: 0.7 },
            celestial: { primary: "#fffacd", secondary: "#4169e1", accent: "#ffd700", text: "#f0f8ff", banner: "#0a0a2e", bg: "#00001a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcelestialnightfall.webp", sidebarOp: 0.8 },
            ritual: { primary: "#ffe0df", secondary: "#800000", accent: "#ffa500", text: "#fff0f0", banner: "#2b0a0a", bg: "#1a0505", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgritual.webp", sidebarOp: 0.7 },
            ethereal: { primary: "#f0ffff", secondary: "#87ceeb", accent: "#ff69b4", text: "#ffffff", banner: "#203a45", bg: "#102025", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgetheral.webp", sidebarOp: 0.6 },
            inferno: { primary: "#ffffff", secondary: "#ff8c00", accent: "#ffff00", text: "#fff5ee", banner: "#330500", bg: "#1a0300", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bginferno.webp", sidebarOp: 0.8 },
            ebony: { primary: "#e8e0d5", secondary: "#8b7e66", accent: "#cd853f", text: "#f0f0e0", banner: "#1a1005", bg: "#171813", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgebony.webp", sidebarOp: 0.9 },
            obsidian: { primary: "#f0fff5", secondary: "#2e8b57", accent: "#00fa9a", text: "#f0fffa", banner: "#0f2b20", bg: "#05140f", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgscales.webp", sidebarOp: 0.8 },
            shadowwing: { primary: "#f5f0ff", secondary: "#6a5acd", accent: "#9370db", text: "#f8f8ff", banner: "#1a0a2e", bg: "#0d0517", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgwing.webp", sidebarOp: 0.8 },
            relic: { primary: "#fff8dc", secondary: "#8fbc8f", accent: "#20b2aa", text: "#f0fff0", banner: "#202020", bg: "#202624", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgrelic.webp", sidebarOp: 0.8 },
            ore: { primary: "#ffefdb", secondary: "#cd853f", accent: "#ffd700", text: "#fff8dc", banner: "#202020", bg: "#1a1a1a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgblackgold.webp", sidebarOp: 0.8 },
            velvet: { primary: "#f8f8ff", secondary: "#9932cc", accent: "#ba55d3", text: "#ffffff", banner: "#140026", bg: "#010201", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgvelet.webp", sidebarOp: 0.9 },
            weave: { primary: "#ffffe0", secondary: "#a2cd5a", accent: "#adff2f", text: "#f0fff0", banner: "#0f1a0f", bg: "#070701", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgweave.webp", sidebarOp: 0.8 },
            swamp: { primary: "#f0fff0", secondary: "#6b8e23", accent: "#7cfc00", text: "#f5f5dc", banner: "#1a261a", bg: "#0d140d", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgswamp.webp", sidebarOp: 0.7 },
            croc: { primary: "#c0cfa0", secondary: "#8e9e7a", accent: "#7da33f", text: "#e8ede0", banner: "#1b2611", bg: "#0d1406", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgcroc.webp", sidebarOp: 0.7 },
            dragon: { primary: "#ffbd4a", secondary: "#e66a6a", accent: "#ff3333", text: "#ffe5e5", banner: "#4a0808", bg: "#1a0404", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgdragon.webp", sidebarOp: 0.6 },
            moon: { primary: "#c0e0ff", secondary: "#6a8ac6", accent: "#66aaff", text: "#e0f0ff", banner: "#0b1421", bg: "#050810", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmoon.webp", sidebarOp: 0.7 },
            moss: { primary: "#b8c7a3", secondary: "#9aa68a", accent: "#7ea35c", text: "#e8f0e0", banner: "#202917", bg: "#10140b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgmoss.webp", sidebarOp: 0.6 },
            paper: { primary: "#d4c5a3", secondary: "#a69685", accent: "#a35c5c", text: "#efebe0", banner: "#3b2e22", bg: "#1f160f", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgpaper.webp", sidebarOp: 0.6 },
            roses: { primary: "#eebbc3", secondary: "#d66a7a", accent: "#ff4d6d", text: "#ffe0e5", banner: "#330a0f", bg: "#1a0406", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgroses.webp", sidebarOp: 0.7 },
            stars: { primary: "#e0f0ff", secondary: "#8a86c6", accent: "#a64dff", text: "#f0f0ff", banner: "#100e26", bg: "#050412", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstars.webp", sidebarOp: 0.8 },
            stone: { primary: "#c0c0c0", secondary: "#9a9aa6", accent: "#5ea3ba", text: "#e0e0e5", banner: "#2b2b30", bg: "#15151a", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgstone.webp", sidebarOp: 0.7 },
            perry: { primary: "#4dc0c0", secondary: "#3a8e8e", accent: "#f7941d", text: "#e0f5f5", banner: "#004d4d", bg: "#002b2b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgperry.webp", sidebarOp: 0.7 },
            void: { primary: "#cccccc", secondary: "#888888", accent: "#ffffff", text: "#e0e0e0", banner: "#000000", bg: "#000000", bgSize: "auto", bgImg: "", sidebarOp: 0.9 }
        };

        const preset = presets[presetKey];
        if (!preset) return;

        const form = this.element;
        const setVal = (name, val) => {
            const el = form.querySelector(`input[name='${name}']`);
            if (el) el.value = val;
            const picker = form.querySelector(`input[name='${name}Picker']`);
            if (picker) {
                picker.value = val;
                const swatch = picker.closest(".rd-swatch");
                if (swatch) swatch.style.background = val;
            }
        };

        setVal("colorPrimary", preset.primary);
        setVal("colorSecondary", preset.secondary);
        setVal("colorAccent", preset.accent);
        setVal("colorText", preset.text);
        setVal("colorBanner", preset.banner || "#7a0000");
        setVal("colorBackground", preset.bg || "#111111");
        setVal("backgroundImage", preset.bgImg || "");

        const bgSizeSelect = form.querySelector("input[name='bgSize']");
        if (bgSizeSelect) bgSizeSelect.value = preset.bgSize || "cover";

        const slider = form.querySelector("input[name='sidebarOpacity']");
        if (slider) {
            slider.value = preset.sidebarOp;
            const display = form.querySelector("#rd-sidebar-op-val");
            if (display) display.innerText = preset.sidebarOp;
        }

        form.querySelectorAll(".rd-preset-btn").forEach(btn => {
            btn.style.borderColor = "var(--realdark-secondary)";
            btn.style.color = "#888";
        });
        target.style.borderColor = "var(--realdark-primary)";
        target.style.color = "white";

        RealDarkWizard.updatePreview("colorPrimary", preset.primary);
        RealDarkWizard.updatePreview("colorSecondary", preset.secondary);
        RealDarkWizard.updatePreview("colorAccent", preset.accent);
        RealDarkWizard.updatePreview("colorText", preset.text);
        RealDarkWizard.updatePreview("colorBanner", preset.banner || "#7a0000");
        RealDarkWizard.updatePreview("colorBackground", preset.bg || "#111111");
        RealDarkWizard.updatePreview("backgroundImage", preset.bgImg || "");
        RealDarkWizard.updateSidebarRGBA(preset.banner || "#7a0000", preset.sidebarOp);
    }

    static async onSubmit(event, form, formData) {
        try {
            const data = formData.object;
            const settingsToSave = [
                "colorPrimary", "colorSecondary", "colorAccent", "colorText", "colorBanner", "colorBackground",
                "colorWhisper", "colorBlind", "colorDiceText", "inputBg", "backgroundImage", "bgSize",
                "themeEnabledActor", "themeEnabledJournal", "themeEnabledItem", "themeEnabledChat",
                "overrideSkillColor"
            ];

            for (const key of settingsToSave) {
                if (data[key] !== undefined) {
                    await game.settings.set(MODULE_ID, key, data[key]);
                }
            }

            if (data.sidebarOpacity !== undefined) {
                await game.settings.set(MODULE_ID, "sidebarOpacity", Number(data.sidebarOpacity));
            }
            await game.settings.set(MODULE_ID, "wizardShown", true);

            updateTheme();
            ui.notifications.info(game.i18n.localize("REALDARK.Notify.Saved"));
        } catch (err) {
            console.error("RealDark Save Failed:", err);
            ui.notifications.error("RealDark Save Failed!");
        }
    }

    static async onExportTheme(event, target) {
        const formData = new FormData(this.element);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        this.element.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            data[cb.name] = cb.checked;
        });

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

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
                await RealDarkWizard.applyThemeData(this.element, json);
            } catch (err) {
                ui.notifications.error(game.i18n.localize("REALDARK.Notify.ImportError"));
                console.error(err);
            }
        };

        input.click();
    }

    static async applyThemeData(form, data) {
        const setVal = (name, val) => {
            const el = form.querySelector(`input[name='${name}']`);
            if (el) el.value = val;
            const picker = form.querySelector(`input[name='${name}Picker']`);
            if (picker) {
                picker.value = val;
                const swatch = picker.closest(".rd-swatch");
                if (swatch) swatch.style.background = val;
            }
            RealDarkWizard.updatePreview(name, val);
        };

        if (data.colorPrimary || data.colorGold) setVal("colorPrimary", data.colorPrimary || data.colorGold);
        if (data.colorSecondary || data.colorGoldDim) setVal("colorSecondary", data.colorSecondary || data.colorGoldDim);
        if (data.colorAccent) setVal("colorAccent", data.colorAccent);
        if (data.colorText || data.colorLight) setVal("colorText", data.colorText || data.colorLight);
        if (data.colorBanner) setVal("colorBanner", data.colorBanner);
        if (data.colorBackground) setVal("colorBackground", data.colorBackground);
        if (data.colorWhisper) setVal("colorWhisper", data.colorWhisper);
        if (data.colorBlind) setVal("colorBlind", data.colorBlind);
        if (data.colorDiceText !== undefined) setVal("colorDiceText", data.colorDiceText);
        if (data.backgroundImage !== undefined) setVal("backgroundImage", data.backgroundImage || "");

        if (data.sidebarOpacity) {
            const slider = form.querySelector("input[name='sidebarOpacity']");
            if (slider) {
                slider.value = data.sidebarOpacity;
                const display = form.querySelector("#rd-sidebar-op-val");
                if (display) display.innerText = data.sidebarOpacity;
            }
        }

        const setCheck = (name, val) => {
            const el = form.querySelector(`input[name='${name}']`);
            if (el) el.checked = Boolean(val);
        };

        if (data.themeEnabledActor !== undefined) setCheck("themeEnabledActor", data.themeEnabledActor);
        if (data.themeEnabledJournal !== undefined) setCheck("themeEnabledJournal", data.themeEnabledJournal);
        if (data.themeEnabledItem !== undefined) setCheck("themeEnabledItem", data.themeEnabledItem);
        if (data.themeEnabledChat !== undefined) setCheck("themeEnabledChat", data.themeEnabledChat);
        if (data.overrideSkillColor !== undefined) setCheck("overrideSkillColor", data.overrideSkillColor);

        ui.notifications.info(game.i18n.localize("REALDARK.Notify.ImportSuccess"));
    }
}

Hooks.once("init", () => {
    const SETTINGS = [
        { key: "globalEnable", name: "GlobalEnable", type: Boolean, default: true, config: true, onChange: true },
        { key: "wizardMenu", name: "Menu", type: RealDarkWizard, menu: true },
        { key: "wizardShown", name: "WizardShown", type: Boolean, default: false },
        { key: "backgroundImage", name: "BackgroundImage", type: String, default: "", filePicker: "image", onChange: true },
        { key: "colorBackground", name: "ColorBackground", type: new foundry.data.fields.ColorField(), default: "#111111", onChange: true },
        { key: "bgSize", name: "BgSize", type: String, default: "cover", onChange: true },
        { key: "plaqueImage", name: "PlaqueImage", type: String, default: "", filePicker: "image", onChange: true },
        { key: "colorPrimary", name: "ColorPrimary", type: new foundry.data.fields.ColorField(), default: "#ffbd4a", onChange: true },
        { key: "colorSecondary", name: "ColorSecondary", type: new foundry.data.fields.ColorField(), default: "#b8860b", onChange: true },
        { key: "colorAccent", name: "ColorAccent", type: new foundry.data.fields.ColorField(), default: "#ff3333", onChange: true },
        { key: "colorText", name: "ColorText", type: new foundry.data.fields.ColorField(), default: "#fff0d4", onChange: true },
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
        { key: "chatHeaderColor", name: "ChatHeaderColor", type: Boolean, default: true, config: true },
        { key: "overrideSkillColor", name: "OverrideSkillColor", type: Boolean, default: true, onChange: true }
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
        else if (typeof s.onChange === "function") data.onChange = s.onChange;

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
});

Hooks.once("ready", async () => {
    // Migrate legacy settings keys if present
    try {
        const clientStorage = game.settings.storage.get("client");
        if (clientStorage) {
            if (clientStorage[`${MODULE_ID}.colorGold`] && !clientStorage[`${MODULE_ID}.colorPrimary`]) {
                await game.settings.set(MODULE_ID, "colorPrimary", clientStorage[`${MODULE_ID}.colorGold`]);
            }
            if (clientStorage[`${MODULE_ID}.colorGoldDim`] && !clientStorage[`${MODULE_ID}.colorSecondary`]) {
                await game.settings.set(MODULE_ID, "colorSecondary", clientStorage[`${MODULE_ID}.colorGoldDim`]);
            }
            if (clientStorage[`${MODULE_ID}.colorLight`] && !clientStorage[`${MODULE_ID}.colorText`]) {
                await game.settings.set(MODULE_ID, "colorText", clientStorage[`${MODULE_ID}.colorLight`]);
            }
        }
    } catch (e) {
        console.warn("RealDark settings migration:", e);
    }

    const bg = game.settings.get(MODULE_ID, "backgroundImage");
    const pl = game.settings.get(MODULE_ID, "plaqueImage");

    if (bg && bg.includes("Parchmentblack.webp")) {
        await game.settings.set(MODULE_ID, "backgroundImage", "");
    }
    if (pl && pl.includes("Plaqueblack.webp")) {
        await game.settings.set(MODULE_ID, "plaqueImage", "");
    }

    updateTheme();

    if (!game.settings.get(MODULE_ID, "wizardShown")) {
        new RealDarkWizard().render(true);
    }
    ui.notifications.info(game.i18n.localize("REALDARK.Notify.Loaded"));
});

function updateTheme() {
    const root = document.documentElement;
    if (!document.body) return;

    if (!game.settings.get(MODULE_ID, "globalEnable")) {
        document.body.classList.remove("realdark-theme-active", "realdark-chat-active", "realdark-override-skills");
        Object.values(ui.windows).forEach(app => app.element && applyRealDarkTheme(app, app.element));
        return;
    }

    document.body.classList.add("realdark-theme-active");

    if (game.settings.get(MODULE_ID, "themeEnabledChat")) {
        document.body.classList.add("realdark-chat-active");
    } else {
        document.body.classList.remove("realdark-chat-active");
    }

    if (game.settings.get(MODULE_ID, "overrideSkillColor")) {
        document.body.classList.add("realdark-override-skills");
    } else {
        document.body.classList.remove("realdark-override-skills");
    }

    const get = (k, d) => {
        const v = game.settings.get(MODULE_ID, k);
        return (v == null) ? d : v;
    };
    const cleanUrl = (u) => (u && !u.startsWith("/") && !u.startsWith("http")) ? "/" + u : u;

    const primary = get("colorPrimary", "#ffbd4a");
    const secondary = get("colorSecondary", "#b8860b");
    const accent = get("colorAccent", "#ff3333");
    const text = get("colorText", "#fff0d4");
    const bg = get("colorBackground", "#111111");
    const banner = get("colorBanner", "#7a0000");

    root.style.setProperty("--realdark-bg-url", cleanUrl(get("backgroundImage", "")) ? `url('${cleanUrl(get("backgroundImage", ""))}')` : "none");
    root.style.setProperty("--realdark-plaque-url", cleanUrl(get("plaqueImage", "")) ? `url('${cleanUrl(get("plaqueImage", ""))}')` : "none");
    root.style.setProperty("--realdark-sheet-bg", bg);
    root.style.setProperty("--realdark-primary", primary);
    root.style.setProperty("--realdark-secondary", secondary);
    root.style.setProperty("--realdark-accent", accent);
    root.style.setProperty("--realdark-text", text);
    root.style.setProperty("--realdark-input-bg", get("inputBg", "rgba(0, 0, 0, 0.7)"));
    root.style.setProperty("--realdark-banner-color", banner);
    root.style.setProperty("--realdark-bg-size", get("bgSize", "cover"));
    root.style.setProperty("--realdark-color-whisper", get("colorWhisper", "#3399ff"));
    root.style.setProperty("--realdark-color-blind", get("colorBlind", "#ff3333"));

    // Backwards compatibility variables
    root.style.setProperty("--realdark-gold", primary);
    root.style.setProperty("--realdark-gold-dim", secondary);
    root.style.setProperty("--realdark-red-bright", accent);
    root.style.setProperty("--realdark-text-light", text);

    let sidebarOp = get("sidebarOpacity", 0.8);
    if (sidebarOp === null || sidebarOp === undefined || isNaN(sidebarOp)) sidebarOp = 0.8;
    RealDarkWizard.updateSidebarRGBA(banner, sidebarOp);

    const pHex = String(primary).replace(/^#/, "");
    const pr = parseInt(pHex.substring(0, 2), 16), pg = parseInt(pHex.substring(2, 4), 16), pb = parseInt(pHex.substring(4, 6), 16);
    const pYiq = ((pr * 299) + (pg * 587) + (pb * 114)) / 1000;

    if (pYiq < 128) {
        root.style.setProperty("--realdark-text-shadow", "0 0 3px #ffffff, 0 0 1px #ffffff");
    } else {
        root.style.setProperty("--realdark-text-shadow", "1px 1px 3px black, 0 0 2px black");
    }

    Object.values(ui.windows).forEach(app => {
        if (app.element && (app.element.classList?.contains("realdark-theme-window") || app.element.hasClass?.("realdark-theme-window"))) {
            applyRealDarkTheme(app, app.element);
        }
    });
}

function applyRealDarkTheme(app, html, forcedType = null) {
    if (!app.element) return;
    const el = app.element[0] || app.element;
    const docName = app.document?.documentName || app.object?.documentName;

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

    if (isActor && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
    if (isItem && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
    if (isJournal && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;

    if (!forcedType && !isDisabled && !isActor && !isItem && !isJournal) {
        if (docName === "Actor" && !game.settings.get(MODULE_ID, "themeEnabledActor")) isDisabled = true;
        if (docName === "Item" && !game.settings.get(MODULE_ID, "themeEnabledItem")) isDisabled = true;
        if ((docName === "JournalEntry" || docName === "JournalEntryPage") && !game.settings.get(MODULE_ID, "themeEnabledJournal")) isDisabled = true;
    }

    if (isDisabled) {
        el.removeAttribute("data-realdark-theme");
        el.classList.remove("realdark-theme-window");

        const customLogo = el.querySelector(".realdark-logo");
        if (customLogo) customLogo.remove();

        const logoCont = el.querySelector(".realdark-logo-container");
        if (logoCont) {
            logoCont.classList.remove("realdark-logo-container");
            logoCont.innerHTML = "";
            logoCont.removeAttribute("style");
        }

        const content = el.querySelector(".window-content");
        if (content) {
            content.style.removeProperty("background-color");
            content.style.removeProperty("background-image");
            content.style.removeProperty("background");
        }
        return;
    }

    el.setAttribute("data-realdark-theme", "dark");
    el.classList.add("realdark-theme-window");

    const content = el.querySelector(".window-content");
    if (content) {
        content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
        if (content.style.backgroundImage) content.style.removeProperty("background-image");
    }

    const isItemDoc = docName === "Item";
    const isJournalDoc = docName === "JournalEntry" || docName === "JournalEntryPage";

    const sidebar = el.querySelector("aside.sidebar, .sidebar, .sheet-sidebar");
    if (sidebar && !isItemDoc && !isJournalDoc) {
        if (sidebar.style.backgroundImage) sidebar.style.removeProperty("background-image");

        const existingLogoContainer = el.querySelector(".logo");
        if (!el.querySelector(".realdark-logo")) {
            const logoImg = document.createElement("img");
            logoImg.classList.add("realdark-logo");
            logoImg.alt = "RealDark Logo";
            logoImg.src = "modules/phils-pf2e-realdark/assets/Logo.webp";

            if (existingLogoContainer) {
                existingLogoContainer.innerHTML = "";
                existingLogoContainer.appendChild(logoImg);
                existingLogoContainer.classList.add("realdark-logo-container");
            } else if (sidebar) {
                sidebar.prepend(logoImg);
            }
        }
    }
}

Hooks.on("renderActorSheet", (app, html) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderItemSheet", (app, html) => applyRealDarkTheme(app, html, "Item"));
Hooks.on("renderJournalSheet", (app, html) => applyRealDarkTheme(app, html, "JournalEntry"));
Hooks.on("renderDialog", (app, html) => applyRealDarkTheme(app, html));
Hooks.on("renderCheckModifiersDialog", (app, html) => applyRealDarkTheme(app, html));
Hooks.on("renderAttributeBuilder", (app, html) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderTagSelector", (app, html) => applyRealDarkTheme(app, html, "Actor"));
Hooks.on("renderDamageDialog", (app, html) => applyRealDarkTheme(app, html));
Hooks.on("renderRollModifiersDialog", (app, html) => applyRealDarkTheme(app, html));

Hooks.on("renderApplication", (app, html) => {
    const el = html[0] || html;
    if (!el || !el.classList) return;

    if (el.classList.contains("tag-selector") ||
        el.classList.contains("attribute-builder") ||
        el.classList.contains("damage-dialog") ||
        el.classList.contains("roll-modifiers-dialog")) {
        applyRealDarkTheme(app, html);
    }
});

Hooks.on("renderChatMessage", (message, html) => {
    if (!game.settings.get(MODULE_ID, "chatHeaderColor")) return;
    if (!game.settings.get(MODULE_ID, "globalEnable")) return;
    if (!game.settings.get(MODULE_ID, "themeEnabledChat")) return;

    const user = message.author;
    if (!user || !user.color) return;

    const el = html[0] || html;
    const header = el.querySelector?.(".message-header");
    if (header) {
        header.style.borderTop = `3px solid ${user.color}`;
    }
});
