# 2.0.0 - Next-Gen Theme Release & Major Contrast Overhaul

### 🌟 Highlights & New Features

- **Redesigned Live Preview Theme Wizard:**
  - Complete overhaul of the configuration wizard with a smooth, responsive side-by-side live preview.
  - See changes to primary colors, secondary accents, text brightness, and backgrounds immediately on a simulated character sheet before saving.
  - Modernized color controls with synchronized color pickers and hex inputs for precise fine-tuning.

- **Superior Contrast & Readability:**
  - **Damage Chat Cards:** Complete contrast overhaul ensuring damage formulas, breakdown rows, dice instances, and action buttons (*Damage, Half, Double, Triple, Block*) are crystal clear and easy to read.
  - **Condition & Content Links:** Re-styled inline links and condition badges in journal sheets and character sheets so they stand out boldly across all backgrounds.
  - **GM Secrets & Target Information:** Secret GM notices and opponent target DCs now feature dedicated high-contrast styling while maintaining clean, single-line text formatting.

- **Strict Layout Fidelity & Module Compatibility:**
  - RealDark now focuses strictly on color, background, and contrast adjustments.
  - Eliminated all artificial sizing, spacing, and padding overrides to preserve 100% of Foundry's and PF2e's native element dimensions.
  - Full compatibility with third-party module buttons, custom action triggers, and active toggle states.

- **Curated Preset Collection:**
  - Instant one-click access to over 30 handcrafted theme styles, including *Ebony, Velvet, Relic, Frost, Crimson, Mystic Waters*, and classics like *Leather, Wood, Stone*, and *Dragon*.

- **Expanded System & Version Support:**
  - Fully verified and optimized for Foundry V12 through V14 on the latest Pathfinder 2e system versions.

---

# 1.6.1 - UI & Module Compatibility Fixes

- **Fix:** Fixed an issue where the Elite/Weak toggle buttons on the NPC sheet were not dynamically updating their visual active state.
- **Fix:** Improved compatibility with chat cards from other modules by removing aggressive background overrides that made text unreadable.
- **Style:** Chat message links now have a subtle dark badge background to ensure they remain readable across various card styles.

---

# 1.6.0 - Skill Styling Override

- **Feature:** Added **"Override Skill Styling"** option to the settings and wizard.
  - Defaults to **ON**: Matches all proficiency indicators (Skills, Defenses, Spells, Class DC) to the dark theme.
  - When **OFF**: Restores the colorful standard system badges (Blue, Green, Red, Purple) for all proficiency elements.
- **Localization:** Added full English and German translations for the setting.

---

# 1.5.7 - Styling Fix (Proficiency Dropdowns)

- **Fix:** Resolved an issue where Skill Proficiency Dropdowns (Trained, Expert, Master, Legendary) displayed with inconsistent colors.
- **Style:** Ensured dropdown menus and options respect system color coding while blending seamlessly into the dark theme.

---

# 1.5.6 - Dice Visibility Final

- **Fix:** Fixed visibility issues with dice icons in the Player Character sheet.
  - **Skills:** Dice icons are a soft off-white by default and brighten on hover.
  - **Speeds:** Movement speed dice icons use the theme's primary highlight color.
- **Polish:** Softened intense glows across sidebar dice for a cleaner, modern look.

---

# 1.5.5 - Console & Wizard Polish

- **Fix:** Updated application lifecycle calls to meet the latest Foundry standards.
- **Fix:** Fixed an issue where the color picker would fail when selecting automatic colors for dice numbers.

---

# 1.5.4 - High-Res Texture Fix

- **Fix:** Resolved a texture issue where dice faces could become dark during longer gaming sessions.
- **Optimization:** Optimized dice textures for maximum stability and atlas compatibility.
- **UI Fix:** Fixed the "Shield Block" and "Double Damage" button icon visibility in damage cards.

---

# 1.5.0 - Dice So Nice Integration

- **Dice So Nice Support:** Comprehensive integration with the *Dice So Nice* module.
  - **30+ Custom Textures:** High-quality textures matching every RealDark theme (Bamboo, Leather, Inferno, Frost, etc.).
  - **Smart Presets:** Selecting a UI theme automatically suggests the matching dice preset.
- **Wizard Extension:** Added dice color settings directly into the configuration wizard.
