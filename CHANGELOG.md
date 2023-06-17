# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1 Unreleased]

- Initial release.

---

## [0.1.0] - 2021-08-14
### Added
`[Minor]`
- Import bookmarks feature.
- Export bookmarks feature.
- Added owner's name into repository tooltip.

### Changed

- Better grouping for "..." view/title menu.

---

## [1.0.0] - 2021-08-19
### Added
`[Major]`
- If you sync a repository, it will do it for all its existing references within other categories.

### Changed

- Changed the way the data is organized and stored, resulting in a way smaller export file.
- Centralized the search on GitHub at the top navigation menu for a better UI.

---

## [1.1.0] - 2021-08-20
### Added
`[Minor]`
- Git Clone feature.
- Settings for defining default clone path and, when use it.

### Changed

- Exchanged centralized search icon.

---

## [1.2.0] - 2021-09-02
`[Minor]`
### Added

- Settings for defining the number of search results per page when searching repositories.

<br>

## [1.3.0] - 2021-09-03
`[Minor]`
### Added

- Implemented *Clear PAT* option

### Changed

- Removed the requirement to have a PAT for searching.

---

## [1.4.0] - 2021-09-06
`[Minor]`
### Added

- Implemented *Pagination* for searching repositories with GitHubApi.

---

## [1.5.0] - 2021-09-10
`[Minor]`
### Added

- Implemented right-bottom StatusBarItem allowing the user to reuse the latest cached search result.
- Added repository count number beside each Category.

---

## [1.6.0] - 2021-09-11
`[Minor]`
### Added

- Implemented AutoSync feature for synchronizing repositories when the extension is active.
it can be enabled/disabled from the extension settings.

---

## [1.6.4] - 2021-10-16
`[Patch]`
### Changed

- Removed dependency of the class-validator package after potential security vulnerabilities were found.
- Improved error handling for inactive/non-available bookmarked repositories.

---

## [1.6.5] - 2022-02-22
`[Patch]`
### Changed
- Updated all dependencies.

---

## [1.7.0/1.7.1] - 2022-02-22
`[Patch]`
### Added
- Implemented `inactive` reddish icon to indicate no-longer available repositories.
- Appended current date [yyyy-MM-dd] to the export json file name.

### Changed
- Fixed bug that cleared the categories when importing an invalid bookmark.
- Fixed bug that prevented creating categories right away after clearing them all.
- Insured input trimming for category naming.
- Improved code standards and internal constants.

---

## [1.7.2] - 2022-10-09
`[Patch]`
### Changed
- Fixed a bug that allowed clearPAT to be shown outside the extension.

---

## [1.7.3] - 2022-10-16
`[Patch]`
### Changed
- Fixed a bug that prevented auto-syncing all bookmarks if having some inactive bookmarks.

---

## [1.7.4/1.7.5] - 2022-10-28
`[Patch]`
### Changed
- Updated all dependencies.
- Updated README.md

---

## [1.7.6/1.7.7] - 2023-05-09
`[Patch]`
### Changed
- Fixed issue with DateTimeHelper affecting the auto-sync when breaking due to nullability.
- Fixed issue with deactivated repository icon.
- Small UI improvements like repository tooltips and messages.

## [1.7.8] - 2023-06-14
`[Patch]`
### Changed
- Improved PAT (Token) validation check to prevent rate limit issues when
AutoSyncing.