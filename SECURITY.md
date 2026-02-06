# Security Policy                                                             
                                           
## Supported Versions                                                         
                                                                        
Currently, the following versions of BossFlow are being supported with
security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

We take the security of BossFlow seriously. If you have discovered a security
vulnerability, please report it to us privately.

### How to Report

**Please do NOT open a public issue for security vulnerabilities.**

Instead, please report vulnerabilities through one of the following methods:

1. **GitHub Security Advisories** (preferred): Use the "Security" tab in this
repository to privately report a vulnerability
2. **Email**: Contact the development team directly through the repository
maintainers

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48-72 hours
- **Status Update**: Within 1 week
- **Fix Timeline**: Depends on severity (critical issues prioritized)

## Security Best Practices

When deploying BossFlow:

- Always use environment variables for sensitive configuration
- Keep dependencies up to date
- Use HTTPS in production
- Review and rotate credentials regularly
- Follow the principle of least privilege for database access

## Scope

This security policy applies to:

- BossFlow backend (FastAPI)
- BossFlow frontend (React + Vite)
- Docker deployment configurations
- Dependencies and third-party libraries

## Disclaimer

This is an educational project developed as part of a school assignment. While
we strive to follow security best practices, this software is provided "as
is" without warranty of any kind.

---

Thank you for helping keep BossFlow and its users safe!
