# Changelog

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
