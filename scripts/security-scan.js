#!/usr/bin/env node
/**
 * Security Scanner for Task Files
 * 
 * Scans task content for potential security issues:
 * - Prompt injection attempts
 * - Malicious commands
 * - Data exfiltration patterns
 * - Hardcoded credentials
 * 
 * Usage:
 *   npm run security-scan           # Scan all tasks
 *   npm run security-scan [folder]  # Scan specific folders
 *   npm run security-scan --json    # Output JSON format
 */

const fs = require('fs');
const path = require('path');

const { TASKS_DIR, SECURITY_RULES } = require('./lib/constants');
const { getRootDir, getTasksDir, getTaskFolders, getTaskMdPath } = require('./lib/task-utils');

/**
 * Security Scanner Class
 */
class SecurityScanner {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.tasksDir = getTasksDir(rootDir);
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

    const taskFolders = getTaskFolders(this.rootDir);

    for (const entry of taskFolders) {
      const taskMdPath = getTaskMdPath(this.rootDir, entry.name);
      if (fs.existsSync(taskMdPath)) {
        this.findings.push(...this.scanTask(entry.name));
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
   * Generate markdown report
   */
  generateReport(summary) {
    let report = '# Security Scan Report\n\n';

    // Summary table
    report += '## Summary\n\n';
    report += '| Severity | Count |\n';
    report += '|----------|-------|\n';
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
