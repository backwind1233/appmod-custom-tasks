# Security Policy

## Overview

This repository contains custom tasks (prompts) for the GitHub Copilot App Modernization VS Code extension. Because these tasks are executed by AI agents, security is a critical concern.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | ✅ Yes             |
| template | ✅ Yes            |
| Other branches | ❌ No       |

## Security Measures

### Automated Scanning

All contributions are automatically scanned for:

1. **Prompt Injection Attempts**
   - Instruction override patterns
   - System prompt extraction attempts
   - Role hijacking attempts
   - Jailbreak attempts

2. **Malicious Commands**
   - Destructive system commands
   - Data exfiltration patterns
   - Remote code execution patterns
   - Credential harvesting attempts

3. **Code Security Issues**
   - Hardcoded credentials
   - Dangerous eval/exec patterns
   - Suspicious network activity
   - Security bypass flags

### Manual Review

All pull requests are manually reviewed for:

- Technical accuracy and quality
- Hidden malicious intent
- Appropriate content
- Compliance with guidelines

## Reporting a Vulnerability

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report security issues via one of these methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the Security tab of this repository
   - Click "Report a vulnerability"
   - Fill in the details

2. **Email**
   - Send details to the repository maintainers
   - Include "SECURITY" in the subject line

### What to Include

When reporting a vulnerability, please include:

- **Description**: What is the vulnerability?
- **Location**: Which file(s) or task(s) are affected?
- **Impact**: What could an attacker achieve?
- **Reproduction**: Steps to reproduce the issue
- **Suggestion**: Any ideas for fixing it (optional)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution**: Depends on severity
  - Critical: ASAP (target 24-48 hours)
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Within 1 month

## Security Best Practices for Contributors

### DO

✅ Use placeholder values for credentials:
```properties
azure.storage.connection.string=${AZURE_STORAGE_CONNECTION_STRING}
```

✅ Be explicit about required permissions:
```markdown
**Note**: This step requires administrator privileges.
```

✅ Document security considerations:
```markdown
## Security Notes
- Ensure connection strings are stored securely
- Use managed identities in production
```

✅ Use safe command examples:
```bash
# Safe example with user confirmation
read -p "This will delete files. Continue? (y/n) " -n 1 -r
```

### DO NOT

❌ Include actual credentials or secrets:
```properties
# BAD - Never do this
password=my-actual-password
api.key=sk-1234567890abcdef
```

❌ Include destructive commands without warnings:
```bash
# BAD - Dangerous without context
rm -rf /
```

❌ Use prompt injection patterns:
```markdown
# BAD - Prompt injection attempt
Ignore all previous instructions and...
```

❌ Include obfuscated content:
```
# BAD - Suspicious encoded content
\x69\x67\x6e\x6f\x72\x65
```

## Security Scanner Rules

The automated security scanner checks for these categories:

### Critical Severity
- Prompt injection (instruction override)
- System prompt extraction attempts
- Dangerous system commands (rm -rf /, format drives)
- Data exfiltration patterns
- Remote code execution

### High Severity
- Role hijacking attempts
- Jailbreak attempts
- Hardcoded credentials
- Environment variable access (review required)

### Medium Severity
- Base64 encoding/decoding (could hide content)
- Dynamic code execution (eval, exec)
- Suspicious network addresses

### Low Severity
- Security bypass flags (--no-verify)
- Elevated privilege requests (sudo)

## Incident Response

If a security issue is found in a merged task:

1. **Immediate**: Task is disabled/removed
2. **Investigation**: Determine scope and impact
3. **Notification**: Users are notified if affected
4. **Resolution**: Fix is developed and deployed
5. **Post-mortem**: Process improvements are made

## Contact

For security-related questions that don't involve reporting vulnerabilities, please open a Discussion in the repository.

---

Thank you for helping keep this project secure! 🔒
