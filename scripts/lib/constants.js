/**
 * Shared constants for task scripts
 */

// Tasks directory name
const TASKS_DIR = 'tasks';

// Required frontmatter fields in task.md
const REQUIRED_FRONTMATTER_FIELDS = ['id', 'name', 'type'];

// Valid task types
const VALID_TASK_TYPES = ['task'];

// File extensions that should be included as references
const REFERENCE_EXTENSIONS = [
  '.java', '.xml', '.properties', '.json', '.yaml', '.yml',
  '.template', '.diff', '.txt', '.py', '.js', '.ts', '.md',
  '.groovy', '.kt', '.scala', '.gradle', '.sh', '.bat', '.ps1'
];

// Files to exclude from references
const EXCLUDED_FILES = ['task.md', 'README.md'];

// Forbidden patterns in task content (validation)
const FORBIDDEN_PATTERNS = [
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

// Security patterns for validation warnings
const SECURITY_PATTERNS = [
  { pattern: /ignore\s+(all\s+)?(previous|above)\s+(instructions?|prompts?)/gi, description: 'Prompt injection attempt' },
  { pattern: /disregard\s+(all\s+)?(previous|above)/gi, description: 'Prompt injection attempt' },
  { pattern: /forget\s+(all\s+)?(previous|above)/gi, description: 'Prompt injection attempt' },
  { pattern: /you\s+are\s+now\s+(a|an)/gi, description: 'Role hijacking attempt' },
  { pattern: /act\s+as\s+(if|a|an)/gi, description: 'Potential role manipulation' },
  { pattern: /pretend\s+(you|to\s+be)/gi, description: 'Potential role manipulation' },
  { pattern: /\bformat\s+[a-z]:/gi, description: 'Potentially dangerous disk command' },
  { pattern: /\bdel\s+\/[fqs]/gi, description: 'Potentially dangerous delete command' },
  { pattern: /\brmdir\s+\/s/gi, description: 'Potentially dangerous directory removal' },
];

// Security scan rules (comprehensive)
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
        /password\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /api[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /secret[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /access[_-]?token\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
        /private[_-]?key\s*[=:]\s*["'][^"'$<{\[\]]+["']/gi,
      ],
      description: 'Detected potential hardcoded credentials',
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

module.exports = {
  TASKS_DIR,
  REQUIRED_FRONTMATTER_FIELDS,
  VALID_TASK_TYPES,
  REFERENCE_EXTENSIONS,
  EXCLUDED_FILES,
  FORBIDDEN_PATTERNS,
  SECURITY_PATTERNS,
  SECURITY_RULES,
};
