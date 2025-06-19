# Changelog

[![semantic-release: the automated publishing robot](https://img.shields.io/badge/semantic--release-enabled-brightgreen)]()

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Documentation note on running optimization sprint scripts
- Support for named capture groups in regular expression literals
- Project scaffold for experimental-js-lexer
- Spec, tests, CI, lint, promptMap, issue templates
- Benchmark script and initial throughput measurements

### Changed
- Optimized CharStream with length caching for faster lexing
- Deduplicated numeric literal readers via shared utils
- Inlined CharStream hot paths for speed
- Added support for `**` and `**=` operators

### Fixed
- N/A

## [0.1.0] - YYYY-MM-DD
### Added
- Initial release of experimental-js-lexer
