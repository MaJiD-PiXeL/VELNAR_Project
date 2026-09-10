# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in VELNAR, please **do not** open a public
issue. Instead, open a private security advisory on the GitHub repository, or
contact the maintainers directly with details of the issue and steps to reproduce.

We aim to respond within 5 business days.

## Security Practices

- VELNAR never uses `eval()` or `Function()` constructors.
- Custom CSS is validated before injection (balanced braces, no `javascript:`,
  no `expression()`, no `@import`).
- No remote code is ever fetched or executed.
- No GitHub cookies, tokens, or session data are read, stored, or transmitted.
- No network requests are made by the extension in its default configuration.
- Permissions are kept to the minimum required (`storage`, and host access
  scoped to `github.com` only).
