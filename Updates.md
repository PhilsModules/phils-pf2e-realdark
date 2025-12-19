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
*   **Wizard Color Save**: Fixed an issue where the background color setting in the Wizard would revert to default upon saving, ignoring user input.
*   **Window Sizing**: Resolved a bug where certain dialog windows (e.g., Damage Roll, Roll Modifiers) opened with incorrect initial height and squashy layout.
*   **Chat Sidebar**: Fixed an issue where the chat sidebar was transparent on the system tab, now correctly applying the dark theme background to the content area.

### Improvements
*   **Chat Card Styling**: comprehensive update to "Blind" and "Whisper" chat card styling:
    *   Removed distracting solid background colors (Pink/Blue) and inset glows.
    *   Cards now feature a clean, transparent dark background.
    *   Added distinct 2px outer borders that dynamically match the Active Theme (e.g., Teal for Whispers in Perry theme, Orange for Blind rolls).
    *   Neutralized internal system dividers (headers and horizontal rules) to match the border color, creating a unified look.


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
