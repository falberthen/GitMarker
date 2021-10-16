# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1 Unreleased]

- Initial release.

<br>

## [0.1.0] - 2021-08-14
### Added

- Import bookmarks feature.
- Export bookmarks feature.
- Added owner's name into repository tooltip.

### Changed

- Better grouping for "..." view/title menu.

<br>

## [1.0.0] - 2021-08-19
### Added

- If you sync a repository, it will do it for all its existing references within other categories.

### Changed

- Changed the way the data is organized and stored, resulting in a way smaller export file.
- Centralized the search on GitHub at the top navigation menu for a better UI.

<br>

## [1.1.0] - 2021-08-20
### Added

- Git Clone feature.
- Settings for defining default clone path and, when use it.

### Changed

- Exchanged centralized search icon.

<br>

## [1.2.0] - 2021-09-02
### Added

- Settings for defining the number of search results per page when searching repositories.

<br>

## [1.3.0] - 2021-09-03
### Added

- Implemented *Clear PAT* option

### Changed

- Removed the requirement to have a PAT for searching.

<br>

## [1.4.0] - 2021-09-06
### Added

- Implemented *Pagination* for searching repositories with GitHubApi.

<br>

## [1.5.0] - 2021-09-10
### Added

- Implemented right-bottom StatusBarItem allowing the user to reuse the latest cached search result.
- Added repository count number beside each Category.

<br>

## [1.6.0] - 2021-09-11
### Added

- Implemented AutoSync feature for synchronizing repositories when the extension is active.
it can be enabled/disabled from the extension settings.

<br>

## [1.6.4] - 2021-10-16
### Changed

- Removed dependency of the class-validator package after potential security vulnerabilities were found.
- Improved error handling for inactive/non-available bookmarked repositories.