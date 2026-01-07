# appmod-custom-tasks

A community-driven repository of custom migration tasks for the GitHub Copilot App Modernization VS Code extension.

## Overview

This repository serves as a central hub for sharing and distributing custom migration tasks. Users can:

- 🔍 **Browse** existing tasks to find migration patterns
- 📥 **Download** tasks to use in their local development environment
- 📤 **Contribute** new tasks by submitting pull requests
- 🔒 **Host privately** using the template branch for private/enterprise repositories

## Quick Start

### Using Tasks from This Repository

1. **Configure the repository URL** in your VS Code settings for the GitHub Copilot App Modernization extension
2. **Browse available tasks** in the extension
3. **Download and use** any task that fits your migration needs

### Contributing a New Task

1. Fork this repository
2. Create a new folder in `tasks/` with your task ID (e.g., `tasks/mysql-to-postgresql`)
3. Add required files following the [Task Format Specification](#task-format-specification)
4. Run `cd scripts && npm install && npm start` to update metadata
5. Submit a pull request

## Repository Structure

```
appmod-custom-tasks/
├── metadata.json              # Auto-generated task index
├── README.md                  # This file
├── CONTRIBUTING.md            # Contribution guidelines
├── SECURITY.md               # Security policy
├── scripts/
│   ├── generate-metadata.js  # Generates metadata.json
│   ├── validate-task.js      # Validates task format
│   ├── security-scan.js      # Security scanner
│   └── package.json          # Node.js dependencies
├── tasks/                     # All task folders go here
│   └── <task-id>/
│       ├── task.md           # Main task definition (required)
│       └── ...               # Additional files (optional)
├── templates/                 # Templates for private repos
└── .github/
    └── workflows/
        ├── pr-validation.yml  # PR format validation
        └── security-scan.yml  # Security scanning
```

## Task Format Specification

### Folder Structure

Each task must be in its own folder inside the `tasks/` directory:

```
tasks/
└── my-task-id/
    ├── task.md                    # Required: Main task definition
    ├── example-before.java        # Optional: Before code example
    ├── example-after.java         # Optional: After code example
    ├── config.properties.template # Optional: Configuration template
    └── README.md                  # Optional: Additional documentation
```

### Naming Conventions

- **Folder name**: Lowercase with hyphens (e.g., `aws-s3-to-azure-blob`)
- **Folder name should match the task ID** in the frontmatter

### task.md Requirements

The `task.md` file must include YAML frontmatter:

```markdown
---
id: my-task-id
name: Human Readable Task Name
type: task
---

# Task Title

Your task content in Markdown format...
```

#### Required Frontmatter Fields

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier (should match folder name) | `aws-s3-to-azure-blob` |
| `name` | Human-readable display name | `Migrate AWS S3 to Azure Blob Storage` |
| `type` | Task type (currently only `task`) | `task` |

### Additional Files

You can include any supporting files in your task folder:

- **Code examples** (`.java`, `.py`, `.cs`, etc.)
- **Configuration templates** (`.properties`, `.yml`, `.json`)
- **Git diff files** (`.diff`, `.patch`)
- **Documentation** (`.md`)

All files should be placed directly in the task folder (no subdirectories).

## Available Tasks

| Task ID | Description |
|---------|-------------|
| `aws-s3-to-azure-blob` | Migrate AWS S3 to Azure Blob Storage |
| `kafka-to-eventhubs` | Migrate Kafka to Azure Event Hubs |
| `log4j-to-azure-monitor-03` | Integrate Azure Monitor Application Insights |
| `rabbitmq-to-servicebus` | Migrate RabbitMQ to Azure Service Bus |

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Setup

```bash
cd scripts
npm install
```

### Generate Metadata

After adding or modifying tasks, regenerate the metadata:

```bash
cd scripts
npm start
```

### Validate Tasks

To validate task format locally:

```bash
cd scripts
npm run validate
```

### Security Scan

To run security scan locally:

```bash
cd scripts
npm run security-scan
```

## Private Repository Setup

For teams that want to maintain their own private task repository:

### Option 1: Fork and Make Private

1. Fork this repository
2. Make the fork private in repository settings
3. Add your custom tasks
4. Configure the extension to use your private repository URL

### Option 2: Use the Template Branch

1. Create a new private repository
2. Copy the template structure from the `template` branch:
   ```bash
   git clone --branch template https://github.com/backwind1233/appmod-custom-tasks.git my-private-tasks
   cd my-private-tasks
   git remote remove origin
   git remote add origin <your-private-repo-url>
   git push -u origin main
   ```
3. See [templates/TEMPLATE-README.md](templates/TEMPLATE-README.md) for detailed setup instructions

## Pull Request Process

1. **Format Validation**: Automated checks ensure your task follows the correct format
2. **Security Scan**: Tasks are scanned for potential security issues (prompt injection, malicious content)
3. **Review**: Maintainers review the task content and quality
4. **Merge**: Once approved, your task becomes available to all users

### PR Requirements

- [ ] Task folder follows naming conventions
- [ ] `task.md` includes required frontmatter
- [ ] `metadata.json` is updated (run `npm start`)
- [ ] No security scan warnings
- [ ] Clear documentation in task content

## Security

Tasks in this repository are prompts used by AI agents. We take security seriously:

- **Automated scanning** for prompt injection attempts
- **Pattern detection** for malicious commands
- **Manual review** of all contributions

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Types of Contributions

- 🆕 **New Tasks**: Migration patterns for different technologies
- 🐛 **Bug Fixes**: Fixes to existing tasks
- 📖 **Documentation**: Improvements to task documentation
- 🔧 **Tools**: Improvements to scripts and automation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/backwind1233/appmod-custom-tasks/wiki)
- 🐛 [Issue Tracker](https://github.com/backwind1233/appmod-custom-tasks/issues)
- 💬 [Discussions](https://github.com/backwind1233/appmod-custom-tasks/discussions)
