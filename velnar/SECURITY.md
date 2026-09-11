# Security Policy

VELNAR stores settings locally, requests storage permission and limits host access to github.com. It does not read GitHub cookies or tokens and has no analytics.

Settings writes are serialized in the service worker, restricted to the extension's own pages, and validated against known fields. Theme colors and typography are checked before stylesheet generation. Custom CSS blocks imports and external resources, including escaped URL syntax. Validation is deliberately conservative; it is not a complete CSS parser.

For a security issue, use a private advisory or contact the maintainer on the distribution repository. Do not include credentials or private repository content in public reports. Supported version: 2.x.
