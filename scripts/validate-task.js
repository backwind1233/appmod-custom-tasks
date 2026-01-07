const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Task Validation Script
 * Validates that task folders follow the required format specification
 */

const REQUIRED_FRONTMATTER_FIELDS = ['id', 'name', 'type'];
const VALID_TASK_TYPES = ['task'];
const TASKS_DIR = 'tasks';
const FORBIDDEN_PATTERNS = [
  // Potentially dangerous patterns in task content
  /\beval\s*\(/gi,
  /\bexec\s*\(/gi,
  /\bprocess\.env/gi,
  /\brequire\s*\(['"]\s*child_process/gi,
  /\bspawn\s*\(/gi,
  /\bshell\s*:/gi,
  /rm\s+-rf\s+\//gi,
  /\bsudo\b/gi,
  /\bcurl\s+.*\|\s*sh/gi,
  /\bwget\s+.*\|\s*sh/gi,
];

const SECURITY_PATTERNS = [
  // Prompt injection patterns
  { pattern: /ignore\s+(all\s+)?(previous|above)\s+(instructions?|prompts?)/gi, description: 'Prompt injection attempt' },
  { pattern: /disregard\s+(all\s+)?(previous|above)/gi, description: 'Prompt injection attempt' },
  { pattern: /forget\s+(all\s+)?(previous|above)/gi, description: 'Prompt injection attempt' },
  { pattern: /you\s+are\s+now\s+(a|an)/gi, description: 'Role hijacking attempt' },
  { pattern: /act\s+as\s+(if|a|an)/gi, description: 'Potential role manipulation' },
  { pattern: /pretend\s+(you|to\s+be)/gi, description: 'Potential role manipulation' },
  // Dangerous commands
  { pattern: /\bformat\s+[a-z]:/gi, description: 'Potentially dangerous disk command' },
  { pattern: /\bdel\s+\/[fqs]/gi, description: 'Potentially dangerous delete command' },
  { pattern: /\brmdir\s+\/s/gi, description: 'Potentially dangerous directory removal' },
];

class TaskValidator {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a single task folder
   */
  validateTask(taskFolderName) {
    const taskPath = path.join(this.rootDir, TASKS_DIR, taskFolderName);
    const taskMdPath = path.join(taskPath, 'task.md');

    // Check if task.md exists
    if (!fs.existsSync(taskMdPath)) {
      this.errors.push({
        task: taskFolderName,
        type: 'missing_file',
        message: `Missing required file: task.md`
      });
      return false;
    }

    // Validate task.md content
    try {
      const content = fs.readFileSync(taskMdPath, 'utf8');
      return this.validateTaskMd(taskFolderName, content);
    } catch (error) {
      this.errors.push({
        task: taskFolderName,
        type: 'read_error',
        message: `Error reading task.md: ${error.message}`
      });
      return false;
    }
  }

  /**
   * Validate task.md content
   */
  validateTaskMd(taskFolderName, content) {
    let isValid = true;

    // Parse frontmatter
    let data;
    try {
      const parsed = matter(content);
      data = parsed.data;
    } catch (error) {
      this.errors.push({
        task: taskFolderName,
        type: 'frontmatter_error',
        message: `Invalid YAML frontmatter: ${error.message}`
      });
      return false;
    }

    // Check required fields
    for (const field of REQUIRED_FRONTMATTER_FIELDS) {
      if (!data[field]) {
        this.errors.push({
          task: taskFolderName,
          type: 'missing_field',
          message: `Missing required frontmatter field: ${field}`
        });
        isValid = false;
      }
    }

    // Validate field values
    if (data.id && data.id !== taskFolderName) {
      this.warnings.push({
        task: taskFolderName,
        type: 'id_mismatch',
        message: `Task id "${data.id}" does not match folder name "${taskFolderName}"`
      });
    }

    if (data.type && !VALID_TASK_TYPES.includes(data.type)) {
      this.errors.push({
        task: taskFolderName,
        type: 'invalid_type',
        message: `Invalid task type: ${data.type}. Valid types: ${VALID_TASK_TYPES.join(', ')}`
      });
      isValid = false;
    }

    // Check for forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) {
        this.errors.push({
          task: taskFolderName,
          type: 'forbidden_pattern',
          message: `Content contains forbidden pattern: ${pattern.toString()}`
        });
        isValid = false;
      }
    }

    // Check for security patterns
    for (const { pattern, description } of SECURITY_PATTERNS) {
      if (pattern.test(content)) {
        this.warnings.push({
          task: taskFolderName,
          type: 'security_warning',
          message: `${description}: ${pattern.toString()}`
        });
      }
    }

    return isValid;
  }

  /**
   * Validate folder name format
   */
  validateFolderName(folderName) {
    // Folder names should be lowercase with hyphens
    const validPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!validPattern.test(folderName)) {
      this.warnings.push({
        task: folderName,
        type: 'naming_convention',
        message: `Folder name should be lowercase with hyphens (e.g., "my-task-name")`
      });
    }
  }

  /**
   * Validate all tasks in the repository
   */
  validateAll() {
    const tasksDir = path.join(this.rootDir, TASKS_DIR);
    
    if (!fs.existsSync(tasksDir)) {
      console.log('No tasks directory found.');
      return { valid: 0, invalid: 0, errors: [], warnings: [] };
    }

    const entries = fs.readdirSync(tasksDir, { withFileTypes: true });

    let validTasks = 0;
    let invalidTasks = 0;

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        // Check if this looks like a task folder (has task.md)
        const taskMdPath = path.join(tasksDir, entry.name, 'task.md');
        if (fs.existsSync(taskMdPath)) {
          this.validateFolderName(entry.name);
          if (this.validateTask(entry.name)) {
            validTasks++;
          } else {
            invalidTasks++;
          }
        }
      }
    }

    return {
      valid: validTasks,
      invalid: invalidTasks,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Validate only changed tasks (for PR validation)
   */
  validateChangedTasks(changedFolders) {
    let validTasks = 0;
    let invalidTasks = 0;

    for (const folder of changedFolders) {
      this.validateFolderName(folder);
      if (this.validateTask(folder)) {
        validTasks++;
      } else {
        invalidTasks++;
      }
    }

    return {
      valid: validTasks,
      invalid: invalidTasks,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Generate report
   */
  generateReport(results) {
    let report = '# Task Validation Report\n\n';

    report += `## Summary\n`;
    report += `- ✅ Valid tasks: ${results.valid}\n`;
    report += `- ❌ Invalid tasks: ${results.invalid}\n`;
    report += `- ⚠️ Warnings: ${results.warnings.length}\n\n`;

    if (results.errors.length > 0) {
      report += `## Errors\n\n`;
      for (const error of results.errors) {
        report += `### ${error.task}\n`;
        report += `- **Type:** ${error.type}\n`;
        report += `- **Message:** ${error.message}\n\n`;
      }
    }

    if (results.warnings.length > 0) {
      report += `## Warnings\n\n`;
      for (const warning of results.warnings) {
        report += `### ${warning.task}\n`;
        report += `- **Type:** ${warning.type}\n`;
        report += `- **Message:** ${warning.message}\n\n`;
      }
    }

    return report;
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const rootDir = args[0] || path.join(__dirname, '..');
  const changedFolders = args.slice(1);

  const validator = new TaskValidator(rootDir);
  
  let results;
  if (changedFolders.length > 0) {
    console.log(`Validating changed tasks: ${changedFolders.join(', ')}`);
    results = validator.validateChangedTasks(changedFolders);
  } else {
    console.log('Validating all tasks...');
    results = validator.validateAll();
  }

  const report = validator.generateReport(results);
  console.log(report);

  // Exit with error code if there are errors
  if (results.errors.length > 0) {
    process.exit(1);
  }
}

module.exports = { TaskValidator };
