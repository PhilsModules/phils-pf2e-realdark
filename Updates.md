# 1.4.1

- **Localization:** Corrected missing German translation for "Presets" (now "Voreinstellungen").
- **UI Polish:** Centered section headers ("Voreinstellungen", "Colors") and the Save button for a cleaner layout.

# 1.4.0

**Major Content & UI Update (01.01.2026)**

- **New Presets:** Added 17 new premium themes including Ebony, Relic, Velvet, Weave, Frost & Gilded, Crimson & Amber, Mystic Waters, and more.
- **Color Logic:** Implemented high-contrast text and complementary accent colors for all new presets.
- **Readability:** Enhanced text-shadow logic to ensure legibility on busy backgrounds.
- **Wizard UI:** Completely redesigned configuration wizard with a cleaner, compact grid layout and categorized controls.
- **Localization:** Added German translations for all new presets and UI elements.

# 1.3.0

**Major Update: Auto-Theming, Configurable Colors & Polish (31.12.2025)**

- **Feature:** "Whisper" and "Blind" chat card colors are now fully configurable in the wizard.
  - You can now choose any color for your Whisper (Private) and Blind (Secret) messages.
  - Defaults remain Blue (Whisper) and Red (Blind).
  - These settings are now independent of the chosen theme accent color.
- **Feature:** Added "Auto-Theming" engine ("Greedy Mode"). Third-party module buttons, inputs, and panels now automatically adopt the RealDark theme.
- **Feature:** Implemented a "Bright Killer" system that aggressively overrides hardcoded white backgrounds in other modules to ensure they blend in.
- **UX:** Complete overhaul of the Configuration Wizard labels (Semantic names & Refined German translations).
- **Fix:** Fixed an issue where Blind rolls would appear Green in certain themes.
- **Fix:** Fixed a missing translation key for "Enable on Actors".
- **Layout Fix:** Adjusted XP bar styling to ensure the progress bar and input numbers form a cohesive, aligned unit with sufficient width.
- **Layout Fix:** Ensured "Auto-Themed" form controls utilize `box-sizing: border-box` to prevent 2px layout shifts when borders are applied.

# 1.2.13

- **Fix:** Context menus now correctly appear above chat cards (z-index adjustment).
- **Fix:** Corrected styling for "Effect Area" indicators (e.g. Burst/Cone) in chat cards to match the dark theme, removing the bright white background.
- **Fix:** Updated styling for chat card lists (e.g. inventory/currency items) to ensure they have transparent backgrounds and readable text.

# 1.2.12

- **UI Improvements:** Styled the "GM Notes" editor field to be distinct from normal inputs. It now features a dark background and a dashed border to clearly indicate its "Secret/GM Only" status, removing the previous bright white background.
- **Bug Fix:** Fixed an issue where Item Rarity tags (Common, Rare, etc.) were incorrectly styled as red "Tags" instead of preserving their system-defined colors.
- **UI Polish:** Dropdowns now utilize the native system/browser layout to ensure perfect alignment and consistency across all field types (including Rarity). The custom dark color theme is applied without altering the structural rendering of the inputs.

# 1.2.11

- **Critical Fix:** Removed an overly aggressive "Button Icon" fix that was causing Effect buttons (and others) in chat to display incorrectly (visual artifacts) and potentially causing layout spacing issues.

# 1.2.10

- **Bug Fix:** Fixed an issue where "Effect" links and other content links in chat cards were rendered with a solid black background. They are now standard transparent links with a subtle underline to match the theme better.

# 1.2.9

- **Feature:** Added a "Chat Header Color Bar" setting which injects a colored bar at the top of chat messages matching the player's color for easier identification.
- **Bug Fixes:** Various backend optimizations and stability improvements for cleaner rendering.

## 1.2.8

- **Fix:** Fixed the Pathfinder Society (PFS) icon appearing black. It now correctly uses the theme's gold color via a CSS mask strategy.
- **Fix:** Excluded Skill Proficiency selectors from global styling to ensure they retain their system-defined colors (untrained/trained/etc).
- **Update:** Switched PFS icon color to use "Primary Gold" to better match other navigation icons in certain presets.
- **Performance:** Removed temporary JavaScript fixes for the icon to ensure zero performance impact.

## 1.2.7

**Date:** 2025-12-14

### Bug Fixes

- **Wizard Color Save**: Fixed an issue where the background color setting in the Wizard would revert to default upon saving, ignoring user input.
- **Window Sizing**: Resolved a bug where certain dialog windows (e.g., Damage Roll, Roll Modifiers) opened with incorrect initial height and squashy layout.
- **Chat Sidebar**: Fixed an issue where the chat sidebar was transparent on the system tab, now correctly applying the dark theme background to the content area.

### Improvements

- **Chat Card Styling**: comprehensive update to "Blind" and "Whisper" chat card styling:
  - Removed distracting solid background colors (Pink/Blue) and inset glows.
  - Cards now feature a clean, transparent dark background.
  - Added distinct 2px outer borders that dynamically match the Active Theme (e.g., Teal for Whispers in Perry theme, Orange for Blind rolls).
  - Neutralized internal system dividers (headers and horizontal rules) to match the border color, creating a unified look.

## [1.2.6] - 2025-12-13

### Bug Fix

- **External Consistency**: Fixed an issue where "Attribute Builder" and "Language Selector" windows appeared light on external connections/browsers.
- **Explicit Hooks**: Added specific code hooks for `AttributeBuilder`, `TagSelector`, `DamageDialog`, and `RollModifiersDialog` to guarantee theme application.

## [1.2.5] - 2025-12-13

### Improvements

- **Invested Icon**: Fixed visibility of the "Invested" (Gem) icon on the dark background. It is now Light Gray when inactive and Theme Gold when active, ensuring it doesn't disappear into the void.

## [1.2.4] - 2025-12-13

### Bug Fix

- **Persistent Backgrounds**: Fixed an issue where the dark theme background would persist on Actor and Journal sheets even when the theme was disabled for those scopes in the wizard.

## [1.2.1] - 2025-12-13

### UI Polish & Remaster Support

- **Remaster Tables**: Fixed styling for new PF2e Remaster-style tables to match the dark theme (removed white backgrounds).
- **Item Sheets**: Removed the large custom logo from Item/Spell/Feat sheets to fix layout and scaling issues. Special thanks to Tiatan for reporting this!
- **Dark Content Links**: Fixed "bright field" issues for dragged content links, inline checks, and GM-visibility elements.

## [1.2.0] - 2025-12-12

### AppV2 & File Picker Update

- **Native Import**: Theme Import now uses your operating system's native file picker for a faster workflow.
- **ApplicationV2**: Migrated the Import Dialog to Foundry's V2 API, resolving "deprecated" warnings.
- **Localization**: Added missing translations for Import/Export buttons in English and German.
- **Bug Fixes**: General stability improvements for the Wizard.

## [1.1.1] - 2025-12-12

### Bug Fix: Tag Styling

- **Tag Fixes**: Correctly styles all tags (languages, traits, etc.) with a dark background and correct text color.
- **Dynamic Detection**: Implemented robust detection for lazily-loaded tags to ensure they are always styled correctly.

## [1.1.0] - 2025-12-12

### Performance & Polish Update

- **Optimized Performance**: Significant improvements to rendering speed by removing heavy DOM scanning and implementing smoother frame scheduling.
- **Unified Backgrounds**: The "Background Color" setting now universally controls Character Sheets, Chat Cards, and Journal Entries.
- **New "Void" Preset**: Added a pure black preset with no texture for a cleaner, high-contrast look.
- **Code Cleanup**: Removed legacy styling logic and duplicate CSS for a smaller module footprint.

## [1.0.0] - 2025-12-11

### Initial Release

- **True Dark Mode**: Complete overhaul of the Pathfinder 2e UI to a dark, immersive theme.
- **Live Preview Wizard**: Configuration tool with real-time preview of theme settings.
- **Presets**: Includes Leather, Wood, Stone, Dragon, Stars, Moon, Moss, Bamboo, Croc, Paper, Roses, and Perry themes.
- **Optimized Assets**: High-performance WebP assets.
- **Softened UI**: Modernized UI with transparent borders and improved readability.
- **Bug Fixes**: Solved Journal Flash (FOUC), Character Sheet, and Chat Message rendering issues.
