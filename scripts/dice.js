Hooks.once('diceSoNiceReady', (dice3d) => {
    const PATH = "modules/phils-pf2e-realdark/assets";
    const PRESETS = [
        { id: "bgbamboo", name: "Bamboo", fg: "#8fb339" }, 
        { id: "bgblackgold", name: "Black Gold", fg: "#ffd700" }, 
        { id: "bgblackred", name: "Black Red", fg: "#ff3333" }, 
        { id: "bgblackwhite", name: "Black White", fg: "#ffffff" }, 
        { id: "bgcelestialnightfall", name: "Celestial Nightfall", fg: "#ffd700" }, 
        { id: "bgcrimsonamber", name: "Crimson Amber", fg: "#ffd700" }, 
        { id: "bgcroc", name: "Croc Skin", fg: "#7da33f" }, 
        { id: "bgdragon", name: "Dragon Scale", fg: "#ff3333" }, 
        { id: "bgebony", name: "Ebony", fg: "#cd853f" }, 
        { id: "bgetheral", name: "Ethereal", fg: "#ff69b4", outline: "#ffffff" }, 
        { id: "bgfrostgilded", name: "Frost Gilded", fg: "#ffd700" }, 
        { id: "bginferno", name: "Inferno", fg: "#ffff00" }, 
        { id: "bgleather", name: "Leather", fg: "#cd853f" }, 
        { id: "bgmoon", name: "Moon", fg: "#66aaff" }, 
        { id: "bgmoss", name: "Moss", fg: "#7ea35c" }, 
        { id: "bgmystictides", name: "Mystic Tides", fg: "#ffd700" }, 
        { id: "bgpaper", name: "Paper", fg: "#a35c5c" }, 
        { id: "bgrelic", name: "Relic", fg: "#20b2aa" }, 
        { id: "bgritual", name: "Ritual", fg: "#ffa500" }, 
        { id: "bgroses", name: "Roses", fg: "#ff4d6d" }, 
        { id: "bgscales", name: "Scales", fg: "#00fa9a" }, 
        { id: "bgstarfall", name: "Starfall", fg: "#00bfff" }, 
        { id: "bgstars", name: "Stars", fg: "#a64dff" }, 
        { id: "bgstone", name: "Stone", fg: "#5ea3ba" }, 
        { id: "bgswamp", name: "Swamp", fg: "#7cfc00" }, 
        { id: "bgvelet", name: "Velvet", fg: "#ba55d3" }, 
        { id: "bgvenomwilds", name: "Venom Wilds", fg: "#ff4500" }, 
        { id: "bgweave", name: "Weave", fg: "#adff2f" }, 
        { id: "bgwing", name: "Wing", fg: "#9370db" }, 
        { id: "bgwood", name: "Wood", fg: "#8b0000" } 
    ];

    const promises = PRESETS.map(p => dice3d.addTexture(`rd_${p.id}`, {
        name: `RealDark - ${p.name}`, composite: "source-over", source: `${PATH}/${p.id}.webp`, no_atlas: true
    }).catch(e => console.error(`RealDark Texture Error: ${p.name}`, e)));

    Promise.all(promises).then(() => {
        window.RealDark = window.RealDark || {};
        window.RealDark.updateDiceColors = () => {
            const global = game.settings.get("phils-pf2e-realdark", "colorDiceText");
            PRESETS.forEach(p => {
                dice3d.addColorset({
                    name: `rd_${p.id}`, description: `RealDark - ${p.name}`, category: "RealDark",
                    foreground: global || p.fg || "#ffbd4a", background: "#000000", outline: p.outline || "#000000",
                    edge: "none", texture: `rd_${p.id}`, material: "plastic", font: "Metamorphous", visibility: 'visible'
                });
            });
        };

        window.RealDark.updateDiceColors();
        dice3d.addSystem({ id: "realdark", name: "RealDark", group: "RealDark" }, "default");
        
        const labels = {
            d2: ["1", "2"], d4: ["1", "2", "3", "4"], d6: ["1", "2", "3", "4", "5", "6"],
            d8: ["1", "2", "3", "4", "5", "6", "7", "8"], d10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            d12: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            d20: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
            d100: ["10", "20", "30", "40", "50", "60", "70", "80", "90", "00"]
        };

        for (const [type, lbl] of Object.entries(labels)) {
            dice3d.addDicePreset({ type, labels: lbl, system: "realdark", font: "Metamorphous" });
        }
    });
});
