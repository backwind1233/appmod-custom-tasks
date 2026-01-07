const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Security Scanner for Task Files
 * Scans task content for potential security issues, prompt injections, and malicious content
 */

// Security rule definitions
const SECURITY_RULES = {
  critical: [
    {
      id: 'PROMPT_INJECTION_001',
      name: 'Instruction Override Attempt',
      patterns: [
        /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?|guidelines?)/gi,
        /disregard\s+(all\s+)?(previous|above|prior)/gi,
        /forget\s+(all\s+)?(previous|above|prior|everything)/gi,
        /override\s+(all\s+)?(previous|above|prior|system)/gi,
      ],
      description: 'Detected attempt to override AI instructions',
    },
    {
      id: 'PROMPT_INJECTION_002',
      name: 'System Prompt Extraction',
      patterns: [
        /what\s+(is|are)\s+(your|the)\s+(system\s+)?prompt/gi,
        /show\s+(me\s+)?(your|the)\s+(system\s+)?prompt/gi,
        /reveal\s+(your|the)\s+(system\s+)?prompt/gi,
        /print\s+(your|the)\s+(system\s+)?prompt/gi,
      ],
      description: 'Detected attempt to extract system prompts',
    },
    {
      id: 'MALICIOUS_CMD_001',
      name: 'Dangerous System Command',
      patterns: [
        /rm\s+-rf\s+\/(?!tmp)/gi,
        /rmdir\s+\/s\s+\/q\s+[a-z]:\\/gi,
        /format\s+[a-z]:\s*\/[qy]/gi,
        /del\s+\/[fqs]\s+[a-z]:\\/gi,
        /mkfs\s+/gi,
        /dd\s+if=.*of=\/dev\//gi,
      ],
      description: 'Detected potentially destructive system command',
    },
    {
      id: 'DATA_EXFIL_001',
      name: 'Data Exfiltration Pattern',
      patterns: [
        /curl\s+.*-d\s+.*\$\(/gi,
        /wget\s+.*--post-data/gi,
        /curl\s+.*@.*\/etc\/passwd/gi,
        /curl\s+.*@.*\.ssh\/id_rsa/gi,
      ],
      description: 'Detected potential data exfiltration attempt',
    },
    {
      id: 'SHELL_INJECT_001',
      name: 'Remote Code Execution',
      patterns: [
        /curl\s+.*\|\s*sh/gi,
        /wget\s+.*\|\s*sh/gi,
        /curl\s+.*\|\s*bash/gi,
        /wget\s+.*\|\s*bash/gi,
        /\$\(curl\s+/gi,
        /\$\(wget\s+/gi,
      ],
      description: 'Detected remote code execution pattern',
    },
  ],
  high: [
    {
      id: 'ROLE_HIJACK_001',
      name: 'Role Hijacking Attempt',
      patterns: [
        /you\s+are\s+now\s+(a|an|the)/gi,
        /from\s+now\s+on,?\s+you\s+(are|will\s+be)/gi,
        /pretend\s+(you\s+are|to\s+be)/gi,
        /act\s+as\s+(if\s+you|a|an|the)/gi,
        /roleplay\s+as/gi,
      ],
      description: 'Detected attempt to change AI role',
    },
    {
      id: 'JAILBREAK_001',
      name: 'Jailbreak Attempt',
      patterns: [
        /\bDAN\b/g,
        /do\s+anything\s+now/gi,
        /jailbreak/gi,
        /\bunlocked\s+mode\b/gi,
        /developer\s+mode\s+(enabled|activated|on)/gi,
      ],
      description: 'Detected potential jailbreak attempt',
    },
    {
      id: 'CREDENTIAL_001',
      name: 'Hardcoded Credentials',
      patterns: [
        // Match actual credentials, but exclude obvious placeholders
        /password\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /api[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /secret[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /access[_-]?token\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /private[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
      ],
      description: 'Detected potential hardcoded credentials',
      // Skip matches that look like placeholders
      skipPatterns: [
        /<your-/i,
        /\${/,
        /your-.*-here/i,
        /example/i,
        /placeholder/i,
        /xxx/i,
        /\*\*\*/,
      ],
    },
  ],
  medium: [
    {
      id: 'ENCODING_001',
      name: 'Encoded Content',
      patterns: [
        /base64[_-]?decode/gi,
        /atob\s*\(/gi,
        /btoa\s*\(/gi,
        /Buffer\.from\s*\([^)]+,\s*['"]base64['"]\)/gi,
      ],
      description: 'Detected base64 encoding/decoding which could hide malicious content',
    },
    {
      id: 'EVAL_001',
      name: 'Dynamic Code Execution',
      patterns: [
        /\beval\s*\(/gi,
        /\bexec\s*\(/gi,
        /Function\s*\(\s*["']/gi,
        /new\s+Function\s*\(/gi,
        /setTimeout\s*\(\s*["']/gi,
        /setInterval\s*\(\s*["']/gi,
      ],
      description: 'Detected dynamic code execution pattern',
    },
  ],
  low: [
    {
      id: 'OVERRIDE_001',
      name: 'Configuration Override',
      patterns: [
        /--no-verify/gi,
        /--skip-validation/gi,
        /-f\s+--force/gi,
        /--allow-root/gi,
      ],
      description: 'Detected security bypass flags',
    },
    {
      id: 'SUDO_001',
      name: 'Elevated Privilege Request',
      patterns: [
        /\bsudo\s+/gi,
        /\bsu\s+-\s+/gi,
        /Run\s+as\s+administrator/gi,
      ],
      description: 'Detected request for elevated privileges',
    },
  ],
};

const TASKS_DIR = 'tasks';

class SecurityScanner {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.tasksDir = path.join(rootDir, TASKS_DIR);
    this.findings = [];
  }

  /**
   * Scan a single file for security issues
   */
  scanFile(filePath, content) {
    const findings = [];
    const relativePath = path.relative(this.rootDir, filePath);

    for (const [severity, rules] of Object.entries(SECURITY_RULES)) {
      for (const rule of rules) {
        for (const pattern of rule.patterns) {
          // Reset regex lastIndex
          pattern.lastIndex = 0;
          let match;
          while ((match = pattern.exec(content)) !== null) {
            // Check if match should be skipped (e.g., placeholders)
            if (rule.skipPatterns) {
              const shouldSkip = rule.skipPatterns.some(skipPattern => skipPattern.test(match[0]));
              if (shouldSkip) continue;
            }

            // Get line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;

            findings.push({
              severity,
              ruleId: rule.id,
              ruleName: rule.name,
              description: rule.description,
              file: relativePath,
              line: lineNumber,
              match: match[0].substring(0, 100), // Truncate long matches
            });
          }
        }
      }
    }

    return findings;
  }

  /**
   * Scan a task folder
   */
  scanTask(taskFolderName) {
    const taskPath = path.join(this.tasksDir, taskFolderName);
    const findings = [];

    if (!fs.existsSync(taskPath) || !fs.statSync(taskPath).isDirectory()) {
      return findings;
    }

    // Scan all files in task folder
    const files = fs.readdirSync(taskPath);
    for (const file of files) {
      const filePath = path.join(taskPath, file);
      if (fs.statSync(filePath).isFile()) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          findings.push(...this.scanFile(filePath, content));
        } catch (error) {
          console.error(`Error scanning ${filePath}: ${error.message}`);
        }
      }
    }

    return findings;
  }

  /**
   * Scan all tasks in the repository
   */
  scanAll() {
    if (!fs.existsSync(this.tasksDir)) {
      console.error('No tasks directory found.');
      return this.summarizeFindings();
    }

    const entries = fs.readdirSync(this.tasksDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const taskMdPath = path.join(this.tasksDir, entry.name, 'task.md');
        if (fs.existsSync(taskMdPath)) {
          this.findings.push(...this.scanTask(entry.name));
        }
      }
    }

    return this.summarizeFindings();
  }

  /**
   * Scan specific folders (for PR scanning)
   */
  scanFolders(folders) {
    for (const folder of folders) {
      this.findings.push(...this.scanTask(folder));
    }

    return this.summarizeFindings();
  }

  /**
   * Summarize findings by severity
   */
  summarizeFindings() {
    const summary = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      total: this.findings.length,
    };

    for (const finding of this.findings) {
      summary[finding.severity].push(finding);
    }

    return summary;
  }

  /**
   * Generate security report
   */
  generateReport(summary) {
    let report = '# Security Scan Report\n\n';

    // Summary section
    report += '## Summary\n\n';
    report += `| Severity | Count |\n`;
    report += `|----------|-------|\n`;
    report += `| 🔴 Critical | ${summary.critical.length} |\n`;
    report += `| 🟠 High | ${summary.high.length} |\n`;
    report += `| 🟡 Medium | ${summary.medium.length} |\n`;
    report += `| 🟢 Low | ${summary.low.length} |\n`;
    report += `| **Total** | **${summary.total}** |\n\n`;

    // Status
    if (summary.critical.length > 0 || summary.high.length > 0) {
      report += '> ❌ **FAILED**: Critical or high severity issues found\n\n';
    } else if (summary.medium.length > 0) {
      report += '> ⚠️ **WARNING**: Medium severity issues found - review recommended\n\n';
    } else if (summary.low.length > 0) {
      report += '> ✅ **PASSED with notes**: Low severity issues found\n\n';
    } else {
      report += '> ✅ **PASSED**: No security issues found\n\n';
    }

    // Details by severity
    const severities = ['critical', 'high', 'medium', 'low'];
    const severityLabels = {
      critical: '🔴 Critical',
      high: '🟠 High',
      medium: '🟡 Medium',
      low: '🟢 Low',
    };

    for (const severity of severities) {
      if (summary[severity].length > 0) {
        report += `## ${severityLabels[severity]} Issues\n\n`;
        
        for (const finding of summary[severity]) {
          report += `### ${finding.ruleId}: ${finding.ruleName}\n`;
          report += `- **File:** ${finding.file}:${finding.line}\n`;
          report += `- **Description:** ${finding.description}\n`;
          report += `- **Match:** \`${finding.match}\`\n\n`;
        }
      }
    }

    return report;
  }

  /**
   * Generate JSON report for CI/CD
   */
  generateJsonReport(summary) {
    return JSON.stringify({
      passed: summary.critical.length === 0 && summary.high.length === 0,
      summary: {
        critical: summary.critical.length,
        high: summary.high.length,
        medium: summary.medium.length,
        low: summary.low.length,
        total: summary.total,
      },
      findings: this.findings,
    }, null, 2);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const outputFormat = args.includes('--json') ? 'json' : 'markdown';
  const filteredArgs = args.filter(arg => arg !== '--json');
  
  const rootDir = filteredArgs[0] || path.join(__dirname, '..');
  const foldersToScan = filteredArgs.slice(1);

  const scanner = new SecurityScanner(rootDir);
  
  let summary;
  if (foldersToScan.length > 0) {
    console.error(`Scanning folders: ${foldersToScan.join(', ')}`);
    summary = scanner.scanFolders(foldersToScan);
  } else {
    console.error('Scanning all tasks...');
    summary = scanner.scanAll();
  }

  if (outputFormat === 'json') {
    console.log(scanner.generateJsonReport(summary));
  } else {
    console.log(scanner.generateReport(summary));
  }

  // Exit with error code if critical or high issues found
  if (summary.critical.length > 0 || summary.high.length > 0) {
    process.exit(1);
  }
}

module.exports = { SecurityScanner };
