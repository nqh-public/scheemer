# Changelog

All notable changes to Scheemer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-02

### Added
- Initial release of Scheemer (formerly framer-export)
- Component metadata extraction from Framer designs
- Support for frames, component instances, and component masters
- JSON export functionality with batch download
- Visual property extraction (colors, backgrounds, gradients, borders)
- Layout property extraction (flex, padding, gap, alignment)
- Text property extraction (fonts, sizes, weights, colors)
- Position and sizing data export
- Real-time selection tracking with auto-refresh
- Interactive UI with checkbox-based selection
- Testing infrastructure with Vitest and React Testing Library
- CI/CD pipeline with GitHub Actions
- TypeScript type safety improvements
- Error handling with user notifications
- Filename sanitization for safe downloads

### Changed
- Renamed project from "framer-export" to "Scheemer"
- Streamlined documentation (68% reduction)
- Improved type safety by removing `any` types
- Enhanced error messages for better UX

### Fixed
- Type safety issues with Framer node properties
- Filename sanitization to prevent download errors

[1.0.0]: https://github.com/nqh-public/scheemer/releases/tag/v1.0.0
