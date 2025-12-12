const MODULE_ID = "phils-pf2e-realdark";

Hooks.once("init", () => {
    // REGISTER SETTINGS

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
        // Just open the actual wizard and close this shim (or don't render it at all)
        new RealDarkWizard().render(true);
        // We don't actually need to render this shim's window.
        return this;
    }

    _updateObject() { }
}

class RealDarkWizard extends HandlebarsApplicationMixin(ApplicationV2) {
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
            applyPreset: RealDarkWizard.onApplyPreset
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

        // Use standard DOM to populate
        const app = this; // 'this' in static method is class, but we need instance? 
        // ACTIONS bind 'this' to the application instance in V2? No, default is class-bound if static but passed instance as 3rd arg?
        // Documentation says: "The method is called with `this` bound to the application instance."
        // So 'this' is the app instance.

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

            await game.settings.set(MODULE_ID, "wizardShown", true);

            updateTheme();
            ui.notifications.info(game.i18n.localize("REALDARK.Notify.Saved"));

        } catch (err) {
            console.error("RealDark | Save Error:", err);
            ui.notifications.error("RealDark Save Failed! Check Console.");
        }
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

    // console.log(`PHIL THEME: Updating Sidebar RGBA | Hex: ${hex} | Opacity: ${sidebarOp} | Result: ${fullRGBA}`);

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

function applyRealDarkTheme(app, html) {
    if (!app.element) return;
    const el = app.element[0] || app.element;

    // 1. Mark Window Immediately
    el.setAttribute("data-realdark-theme", "dark");
    el.classList.add("realdark-theme-window");

    // 2. Schedule Heavy Lifting for Next Frame
    requestAnimationFrame(() => {
        // A. Custom Background Handling
        const content = el.querySelector(".window-content");
        if (content) {
            content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
            if (content.style.backgroundImage) content.style.removeProperty("background-image");
        }

        // B. Sidebar Logo Injection
        const sidebar = el.querySelector("aside.sidebar, .sidebar, .sheet-sidebar");
        if (sidebar) {
            // Clean sidebar background if inline
            if (sidebar.style.backgroundImage) sidebar.style.removeProperty("background-image");

            // Inject Logo if needed
            let myLogo = sidebar.querySelector(".realdark-logo");
            if (!myLogo) {
                myLogo = document.createElement("img");
                myLogo.classList.add("realdark-logo");
                myLogo.dataset.tooltip = "RealDark Custom Logo";
                myLogo.src = "/modules/phils-pf2e-realdark/assets/Logo.webp";
                // Style is now largely handled by CSS class .realdark-logo, 
                // but we keep some specific overrides here to match user tweaks
                myLogo.style.cssText = "display: block; margin: 0 -8px 0px -8px; width: calc(100% + 16px); max-width: none; height: auto; border: none; background: transparent; position: relative; z-index: 1000; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));";
                sidebar.prepend(myLogo);
            }
        }

        // C. Journal Specifics (Stubborn Sheets)
        if (app.options && app.options.classes && app.options.classes.includes("journal-sheet")) {
            // Use specific selectors instead of generic iteration where possible
            const stubborns = el.querySelectorAll(".journal-entry-page, .sheet-body, article, section");
            for (const p of stubborns) {
                p.style.setProperty("background", "transparent", "important");
                p.style.setProperty("color", "#f0f0f0", "important");
            }
        }

        // D. Inventory Headers (Specific Target)
        // Kept because system updates might revert these specific elements
        const invHeaders = el.querySelectorAll(".inventory-header, .inventory-list header, .item-list header");
        for (const h of invHeaders) {
            h.style.setProperty("background", "rgba(0, 0, 0, 0.4)", "important");
            h.style.setProperty("color", "var(--realdark-gold)", "important");
        }

        // REMOVED: Universal 'querySelectorAll(*)' loop for Plaque Swap. 
        // Improvement: This saves significant processing time per render.
        // REMOVED: loops for Inputs, Nav, Text Colors (Handled by CSS now).
    });
}

// Hooks
Hooks.on("renderActorSheet", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderItemSheet", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderJournalSheet", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderDialog", (app, html, data) => applyRealDarkTheme(app, html));
Hooks.on("renderCheckModifiersDialog", (app, html, data) => applyRealDarkTheme(app, html));


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
 * Nuclear option unique to RealDark:
 * Watch for ANY changes in the DOM and if a tag appears, force it to behave.
 * This handles lazy-loaded content in PF2e character sheets.
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
    console.log("RealDark | Tag Observer Active");
}

function applyTagStyles(elements) {
    // Force styles directly on the element's style attribute
    // This cannot be overridden by class specificity
    $(elements).each((i, el) => {
        el.style.setProperty("background", "rgba(0, 0, 0, 0.8)", "important");
        el.style.setProperty("background-color", "rgba(0, 0, 0, 0.8)", "important");
        el.style.setProperty("background-image", "none", "important");
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
