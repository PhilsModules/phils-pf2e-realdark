Hooks.once('diceSoNiceReady', (dice3d) => {
    
    // List of texture filenames (without extension)
    // Colors updated to match 'RealDark UI Presets' (Accent colors) defined in main.js
    const textures = [
        { id: "bgbamboo", name: "Bamboo", foreground: "#8fb339" }, // Preset: bamboo (Accent)
        { id: "bgblackgold", name: "Black Gold", foreground: "#ffd700" }, // Preset: ore (Accent)
        { id: "bgblackred", name: "Black Red", foreground: "#ff3333" }, // Matching Accent Style
        { id: "bgblackwhite", name: "Black White", foreground: "#ffffff" }, // Standard High Contrast
        { id: "bgcelestialnightfall", name: "Celestial Nightfall", foreground: "#ffd700" }, // Preset: celestial (Accent)
        { id: "bgcrimsonamber", name: "Crimson Amber", foreground: "#ffd700" }, // Preset: crimson (Accent)
        { id: "bgcroc", name: "Croc Skin", foreground: "#7da33f" }, // Preset: croc (Accent)
        { id: "bgdragon", name: "Dragon Scale", foreground: "#ff3333" }, // Preset: dragon (Accent)
        { id: "bgebony", name: "Ebony", foreground: "#cd853f" }, // Preset: ebony (Accent)
        { id: "bgetheral", name: "Ethereal", foreground: "#ff69b4", outline: "#ffffff" }, // Preset: ethereal (Accent)
        { id: "bgfrostgilded", name: "Frost Gilded", foreground: "#ffd700" }, // Preset: frost (Accent)
        { id: "bginferno", name: "Inferno", foreground: "#ffff00" }, // Preset: inferno (Accent)
        { id: "bgleather", name: "Leather", foreground: "#cd853f" }, // Preset: leather (Accent)
        { id: "bgmoon", name: "Moon", foreground: "#66aaff" }, // Preset: moon (Accent)
        { id: "bgmoss", name: "Moss", foreground: "#7ea35c" }, // Preset: moss (Accent)
        { id: "bgmystictides", name: "Mystic Tides", foreground: "#ffd700" }, // Preset: mystic (Accent)
        { id: "bgpaper", name: "Paper", foreground: "#a35c5c" }, // Preset: paper (Accent)
        { id: "bgrelic", name: "Relic", foreground: "#20b2aa" }, // Preset: relic (Accent)
        { id: "bgritual", name: "Ritual", foreground: "#ffa500" }, // Preset: ritual (Accent)
        { id: "bgroses", name: "Roses", foreground: "#ff4d6d" }, // Preset: roses (Accent)
        { id: "bgscales", name: "Scales", foreground: "#00fa9a" }, // Preset: obsidian (Accent)
        { id: "bgstarfall", name: "Starfall", foreground: "#00bfff" }, // Preset: shadow_star (Accent)
        { id: "bgstars", name: "Stars", foreground: "#a64dff" }, // Preset: stars (Accent)
        { id: "bgstone", name: "Stone", foreground: "#5ea3ba" }, // Preset: stone (Accent)
        { id: "bgswamp", name: "Swamp", foreground: "#7cfc00" }, // Preset: swamp (Accent)
        { id: "bgvelet", name: "Velvet", foreground: "#ba55d3" }, // Preset: velvet (Accent)
        { id: "bgvenomwilds", name: "Venom Wilds", foreground: "#ff4500" }, // Preset: venom (Accent)
        { id: "bgweave", name: "Weave", foreground: "#adff2f" }, // Preset: weave (Accent)
        { id: "bgwing", name: "Wing", foreground: "#9370db" }, // Preset: shadowwing (Accent)
        { id: "bgwood", name: "Wood", foreground: "#8b0000" } // Preset: wood (Accent)
    ];

    const LABELS = {
        d2: ["1", "2"],
        d4: ["1", "2", "3", "4"],
        d6: ["1", "2", "3", "4", "5", "6"],
        d8: ["1", "2", "3", "4", "5", "6", "7", "8"],
        d10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        d12: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        d20: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
        d100: ["10", "20", "30", "40", "50", "60", "70", "80", "90", "00"]
    };

    const modulePath = "modules/phils-pf2e-realdark/assets";
    
    // Array to store promises for texture loading
    const promises = [];

    console.log("RealDark Dice | Starting texture registration...");

    textures.forEach(tex => {
        const textureId = `rd_${tex.id}`;
        // Standard path string as per documentation
        const texturePath = `${modulePath}/${tex.id}.webp`;

        // 1. Register the texture and capture promise
        const p = dice3d.addTexture(textureId, {
            name: `RealDark - ${tex.name}`,
            composite: "source-over",
            source: texturePath,
            no_atlas: true
        }).catch(err => {
            console.error(`RealDark Dice | Failed to load texture ${tex.name}:`, err);
        });
        
        promises.push(p);
    });

    // Wait for all textures to finish adding
    Promise.all(promises).then(() => {
        
        // Expose function for dynamic updates
        window.RealDark = window.RealDark || {};
        window.RealDark.updateDiceColors = () => {
            // Get global override setting (if any)
            const globalColor = game.settings.get("phils-pf2e-realdark", "colorDiceText");
            
            textures.forEach(tex => {
                const textureId = `rd_${tex.id}`; // Match the ID registered in addTexture
                // Use global override if set, otherwise fallback to theme-specific "Signal" color
                // Default to Gold (#ffbd4a) if neither is defined, for safety
                const fgColor = globalColor || tex.foreground || "#ffbd4a";
                const outlineColor = tex.outline || "#000000";

                dice3d.addColorset({
                    name: textureId,
                    description: `RealDark - ${tex.name}`,
                    category: "RealDark",
                    foreground: fgColor,
                    background: "#000000",
                    outline: outlineColor,
                    edge: "none", // Removes white edges/wireframe
                    texture: textureId,
                    material: "plastic",
                    font: "Metamorphous",
                    visibility: 'visible'
                });
            });
        };

        // Initial Registration
        window.RealDark.updateDiceColors();

        // 3. REGISTER SYSTEM & PRESETS (Once)
        dice3d.addSystem({ id: "realdark", name: "RealDark", group: "RealDark" }, "default");
        
        const dtypes = ["d4", "d6", "d8", "d10", "d12", "d20"];

        dtypes.forEach(dtype => {
            dice3d.addDicePreset({
                type: dtype,
                labels: LABELS[dtype],
                system: "realdark",
                font: "Metamorphous"
                // No colorset here, so it uses the one selected in Dice So Nice settings
            });
        });

    }).catch(err => {
        console.error("RealDark Dice | Texture Loading Failed:", err);
    });
});
