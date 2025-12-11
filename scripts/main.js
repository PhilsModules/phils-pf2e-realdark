console.error("PHIL THEME: MODULE JS IS RUNNING!");

const MODULE_ID = "phils-pf2e-realdark";

Hooks.once("init", () => {
    console.error("PHIL THEME: INIT HOOK FIRED!");
    document.body.classList.add("realdark-theme-active");

    // ========================================================================
    // REGISTER SETTINGS
    // ========================================================================

    // 0. Wizard State
    game.settings.register(MODULE_ID, "wizardShown", {
        name: "REALDARK.Settings.WizardShown.Name",
        scope: "client",
        config: false,
        type: Boolean,
        default: false
    });

    // 1. Background Image (Legacy/Optional)
    game.settings.register(MODULE_ID, "backgroundImage", {
        name: "REALDARK.Settings.BackgroundImage.Name",
        hint: "REALDARK.Settings.BackgroundImage.Hint",
        scope: "client",
        config: true,
        type: String,
        filePicker: "image",
        default: "",
        onChange: () => updateTheme()
    });

    // 1.5. Sheet Background Color (New)
    game.settings.register(MODULE_ID, "colorBackground", {
        name: "REALDARK.Settings.ColorBackground.Name",
        hint: "REALDARK.Settings.ColorBackground.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#111111",
        onChange: () => updateTheme()
    });

    // 1.7. Background Size (New)
    game.settings.register(MODULE_ID, "bgSize", {
        name: "REALDARK.Settings.BgSize.Name",
        hint: "REALDARK.Settings.BgSize.Hint",
        scope: "client",
        config: true,
        type: String,
        default: "cover",
        onChange: () => updateTheme()
    });

    // 2. Plaque Image (Legacy/Optional)
    game.settings.register(MODULE_ID, "plaqueImage", {
        name: "REALDARK.Settings.PlaqueImage.Name",
        hint: "REALDARK.Settings.PlaqueImage.Hint",
        scope: "client",
        config: true,
        type: String,
        filePicker: "image",
        default: "",
        onChange: () => updateTheme()
    });

    // 3. Primary Color (Gold)
    game.settings.register(MODULE_ID, "colorGold", {
        name: "REALDARK.Settings.ColorGold.Name",
        hint: "REALDARK.Settings.ColorGold.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#ffbd4a",
        onChange: () => updateTheme()
    });

    // 4. Dim Color
    game.settings.register(MODULE_ID, "colorGoldDim", {
        name: "REALDARK.Settings.ColorGoldDim.Name",
        hint: "REALDARK.Settings.ColorGoldDim.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#b8860b",
        onChange: () => updateTheme()
    });

    // 5. Accent Color (Red)
    game.settings.register(MODULE_ID, "colorAccent", {
        name: "REALDARK.Settings.ColorAccent.Name",
        hint: "REALDARK.Settings.ColorAccent.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#ff3333",
        onChange: () => updateTheme()
    });


    // 6. Light Text Color
    game.settings.register(MODULE_ID, "colorLight", {
        name: "REALDARK.Settings.ColorLight.Name",
        hint: "REALDARK.Settings.ColorLight.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#fff0d4",
        onChange: () => updateTheme()
    });

    // 7. Input Config
    game.settings.register(MODULE_ID, "inputBg", {
        name: "REALDARK.Settings.InputBg.Name",
        hint: "REALDARK.Settings.InputBg.Hint",
        scope: "client",
        config: true,
        type: String,
        default: "rgba(0, 0, 0, 0.7)",
        onChange: () => updateTheme()
    });

    // 7.5 Sidebar Opacity
    game.settings.register(MODULE_ID, "sidebarOpacity", {
        name: "REALDARK.Settings.SidebarOpacity.Name",
        hint: "REALDARK.Settings.SidebarOpacity.Hint",
        scope: "client",
        config: true,
        type: Number,
        default: 0.8,
        onChange: () => updateTheme()
    });

    // 8. Banner Color (New)
    game.settings.register(MODULE_ID, "colorBanner", {
        name: "REALDARK.Settings.ColorBanner.Name",
        hint: "REALDARK.Settings.ColorBanner.Hint",
        scope: "client",
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: "#7a0000",
        onChange: () => updateTheme()
    });

    // INITIALIZE THEME
    updateTheme();

    ui.notifications.info(game.i18n.localize("REALDARK.Notify.Loaded"));
});

// ========================================================================
// SETUP WIZARD
// ========================================================================
Hooks.once("ready", () => {
    if (!game.settings.get(MODULE_ID, "wizardShown")) {
        new RealDarkWizard().render(true);
    }
});

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

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
            perry: { gold: "#4dc0c0", dim: "#3a8e8e", accent: "#f7941d", text: "#e0f5f5", banner: "#004d4d", bg: "#002b2b", bgSize: "cover", bgImg: "modules/phils-pf2e-realdark/assets/bgperry.webp", sidebarOp: 0.7 }
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
        const object = formData.object;
        await game.settings.set(MODULE_ID, "colorGold", object.colorGold);
        await game.settings.set(MODULE_ID, "colorGoldDim", object.colorGoldDim);
        await game.settings.set(MODULE_ID, "colorAccent", object.colorAccent);
        await game.settings.set(MODULE_ID, "colorLight", object.colorLight);
        await game.settings.set(MODULE_ID, "colorBanner", object.colorBanner);
        await game.settings.set(MODULE_ID, "colorBackground", object.colorBackground);


        await game.settings.set(MODULE_ID, "inputBg", object.inputBg);
        await game.settings.set(MODULE_ID, "backgroundImage", object.backgroundImage);
        await game.settings.set(MODULE_ID, "bgSize", object.bgSize);
        await game.settings.set(MODULE_ID, "sidebarOpacity", parseFloat(object.sidebarOpacity));

        await game.settings.set(MODULE_ID, "wizardShown", true);

        updateTheme();
        ui.notifications.info(game.i18n.localize("REALDARK.Notify.Saved"));
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

    // Ensure paths are absolute to avoid CSS relative path issues (404s)
    let bgUrl = game.settings.get(MODULE_ID, "backgroundImage");
    if (bgUrl && !bgUrl.startsWith("/") && !bgUrl.startsWith("http")) {
        bgUrl = "/" + bgUrl;
    }

    let plaqueUrl = game.settings.get(MODULE_ID, "plaqueImage");
    if (plaqueUrl && !plaqueUrl.startsWith("/") && !plaqueUrl.startsWith("http")) {
        plaqueUrl = "/" + plaqueUrl;
    }

    const primaryColor = game.settings.get(MODULE_ID, "colorGold");

    root.style.setProperty("--realdark-bg-url", bgUrl ? `url('${bgUrl}')` : 'none');
    root.style.setProperty("--realdark-plaque-url", plaqueUrl ? `url('${plaqueUrl}')` : 'none');

    root.style.setProperty("--realdark-sheet-bg", game.settings.get(MODULE_ID, "colorBackground"));
    root.style.setProperty("--realdark-gold", primaryColor);
    root.style.setProperty("--realdark-gold-dim", game.settings.get(MODULE_ID, "colorGoldDim"));
    root.style.setProperty("--realdark-red-bright", game.settings.get(MODULE_ID, "colorAccent"));
    root.style.setProperty("--realdark-text-light", game.settings.get(MODULE_ID, "colorLight"));
    root.style.setProperty("--realdark-input-bg", game.settings.get(MODULE_ID, "inputBg"));
    root.style.setProperty("--realdark-banner-color", game.settings.get(MODULE_ID, "colorBanner"));
    root.style.setProperty("--realdark-bg-size", game.settings.get(MODULE_ID, "bgSize"));

    // CALCULATE SIDEBAR RGBA
    const bannerHex = game.settings.get(MODULE_ID, "colorBanner") || "#7a0000";
    let sidebarOp = game.settings.get(MODULE_ID, "sidebarOpacity");

    // Safety check for opacity
    if (sidebarOp === null || sidebarOp === undefined) sidebarOp = 0.8;

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

    el.setAttribute("data-realdark-theme", "dark");
    el.classList.add("realdark-theme-window");

    // Use setTimeout to ensure CSS vars are picked up if we need to force inline
    // But now we use var() in inline styles to allow hot-swapping!
    setTimeout(() => {
        // 1. Apply Custom Background & Fog
        // 1. Apply Custom Background & Fog
        const content = el.querySelector(".window-content");
        if (content) {
            // Apply CSS Variable locally to be sure
            content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");

            // Apply CSS Variable locally to be sure
            content.style.setProperty("background-color", "var(--realdark-sheet-bg)", "important");
            content.style.removeProperty("background-image");
        }

        // 2. Content Panels (GLASS) - DISABLED TO ALLOW BACKGROUND COLOR TO SHINE
        // We rely on CSS 'background: transparent' for these containers mostly.
        /*
        const glassContainers = el.querySelectorAll(".sheet-body, .sheet-content, .tab, .primary-body, .group-panel, .directory-list");
        glassContainers.forEach(div => {
            // This stacking caused the background to become pitch black.
            // div.style.setProperty("background", "rgba(0, 0, 0, 0.4)", "important");
            // div.style.setProperty("backdrop-filter", "blur(4px)", "important");
        });
        */

        // 3. Navigation (TRANSPARENT)
        // Start fresh for navs to ensure no background clipping
        const navContainers = el.querySelectorAll("nav, .sheet-navigation, .secondary-navigation");
        navContainers.forEach(div => {
            div.style.setProperty("background", "transparent", "important");
            div.style.setProperty("box-shadow", "none", "important");
            div.style.setProperty("border", "none", "important");
        });

        // 4. Inputs
        const inputs = el.querySelectorAll("input, select, textarea");
        inputs.forEach(inp => {
            if (inp.type === "range") return;

            inp.style.setProperty("background", "var(--realdark-input-bg)", "important");
            inp.style.setProperty("color", "#fff", "important");
            inp.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.2)", "important");
            inp.style.setProperty("border-radius", "4px", "important");
        });

        // 5. Force Text Colors
        const stubbornText = el.querySelectorAll("label, span.label, .h1, .h2, .h3, .h4, h1, h2, h3, h4, span");
        stubbornText.forEach(t => {
            // Updated to exclude .sidebar children from forced color overrides if needed, but gold is usually fine
            if (!t.closest(".rd-preset-btn") && !t.closest(".rd-header-panel")) {
                t.style.setProperty("color", "var(--realdark-gold)", "important");
                // APPLY DYNAMIC SHADOW
                t.style.setProperty("text-shadow", "var(--realdark-text-shadow)", "important");
            }
        });

        // ATMOSPHERE INJECTION: REMOVED
        // We now rely purely on the :root[data-realdark-atmosphere] CSS rules to apply the backgrounds.
        // This JS used to set 'background-image: none' which killed the CSS.

        // 6. Window Frame
        el.style.setProperty("border", "1px solid rgba(130, 130, 130, 0.3)", "important");
        el.style.setProperty("box-shadow", "0 0 10px rgba(0,0,0,0.8)", "important");

        // 7. SPECIFIC SIDEBAR OVERRIDE (JS FORCE)
        // We use the CSS variable so it updates live with the theme engine
        // 7. SPECIFIC SIDEBAR OVERRIDE (JS FORCE)
        // 7. SPECIFIC SIDEBAR OVERRIDE - REMOVED TO RELY ON CSS VARIABLES --realdark-banner-color AND --realdark-sidebar-opacity
        const sidebar = el.querySelector("aside.sidebar, .sidebar, .sheet-sidebar");
        if (sidebar) {
            sidebar.style.removeProperty("background-image");
            sidebar.style.removeProperty("background");
            // Force height for older systems
            sidebar.style.setProperty("height", "100%", "important");
            sidebar.style.setProperty("min-height", "100%", "important");
        }

        // 7. Plaque Swap
        const plaqueElements = el.querySelectorAll('*');
        plaqueElements.forEach(node => {
            const computedStyle = window.getComputedStyle(node);
            const bgImage = computedStyle.backgroundImage;
            if (bgImage && bgImage.includes("plaque")) {
                node.style.setProperty("background-image", "var(--realdark-plaque-url)", "important");
                node.style.setProperty("color", "var(--realdark-gold)", "important");
                node.style.setProperty("text-shadow", "none", "important");
            }
        });

        // 8. FORCED LOGO SWAP (JS)
        // CSS content replacement can be flaky. We do it live.
        // 8. FORCED LOGO INJECTION (JS)
        // Target the SIDEBAR, not the header
        // 'sidebar' is already defined at line 563
        if (sidebar) {
            // Check if we already injected it
            let myLogo = sidebar.querySelector(".realdark-logo");

            // If not found, create it
            if (!myLogo) {
                myLogo = document.createElement("img");
                myLogo.classList.add("realdark-logo");
                myLogo.dataset.tooltip = "RealDark Custom Logo";
                myLogo.src = "/modules/phils-pf2e-realdark/assets/Logo.webp";

                // Sidebar specific styling
                // "Oben links" -> Top Left (User updated: wants it centered in sidebar, larger, less bottom gap)
                // "Immer noch nicht ganz" -> Force Width 100%, Remove Margins
                // "Jetzt links aber Abstand" -> Negative margins to offset system padding
                // "Links bündig nicht zentriert" -> Padding guess was wrong. Using symmetric expansion.
                const logoStyle = "display: block; margin: 0 -8px 0px -8px; width: calc(100% + 16px); max-width: none; height: auto; border: none; background: transparent; position: relative; z-index: 1000; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));";

                myLogo.style.cssText = logoStyle;

                sidebar.prepend(myLogo);
            } else {
                // Ensure it's visible if it already exists AND update styles (Fix for "nothing changed")
                myLogo.style.cssText = "display: block; margin: 0 -8px 0px -8px; width: calc(100% + 16px); max-width: none; height: auto; border: none; background: transparent; position: relative; z-index: 1000; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));";
            }
        }

        // 9. FORCE JOURNAL BACKGROUND REMOVAL (JS OVERRIDE)
        // CSS is failing to remove the parchment, so we do it here.
        if (app.options && app.options.classes && app.options.classes.includes("journal-sheet")) {
            const pages = el.querySelectorAll(".journal-entry-page, .sheet-body, article, section");
            pages.forEach(p => {
                p.style.setProperty("background", "transparent", "important");
                p.style.setProperty("background-image", "none", "important");
                p.style.setProperty("background-color", "transparent", "important");
                p.style.setProperty("color", "#f0f0f0", "important"); // Force light text
            });

            // Hide logo specifically for journals (Redundant but safe)
            const logo = el.querySelector(".realdark-logo");
            if (logo) logo.style.display = "none";
        }

        // 10. FORCE INVENTORY HEADER DARKENING (JS OVERRIDE)
        // User provided path: ... div.tab.inventory.item-container.active > section > header
        const invHeaders = el.querySelectorAll("li.inventory-header, .inventory-list header, .item-list header, .tab.inventory header, .item-container header, .inventory-header, .currency-pane, header");
        invHeaders.forEach(h => {
            // Safety check: specific headers only to avoid breaking other things
            // If it's a generic header, ensure it's inside an inventory tab or item list
            if (h.tagName === "HEADER" && !h.closest(".tab.inventory") && !h.closest(".item-container") && !h.closest(".inventory-list") && !h.closest(".currency-pane")) {
                return;
            }

            h.style.setProperty("background", "rgba(0, 0, 0, 0.4)", "important");
            h.style.setProperty("background-color", "rgba(0, 0, 0, 0.4)", "important");
            h.style.setProperty("background-image", "none", "important"); // Critical for textures
            h.style.setProperty("color", "var(--realdark-gold)", "important");
            h.style.setProperty("border-color", "rgba(130, 130, 130, 0.3)", "important");
            h.style.setProperty("box-shadow", "none", "important");
            h.style.setProperty("border-radius", "4px", "important"); // Clean up corners
            h.style.setProperty("margin-bottom", "2px", "important");
        });

    }, 200);
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
});
