# Contributing to appmod-custom-tasks

Thank you for your interest in contributing to the App Modernization Custom Tasks repository! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Creating a New Task](#creating-a-new-task)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Quality Standards](#quality-standards)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and constructive in discussions
- Focus on the content, not the person
- Accept constructive criticism gracefully
- Help others learn and grow

## How to Contribute

### Types of Contributions

1. **New Tasks**: Add migration patterns for new technology combinations
2. **Task Improvements**: Enhance existing tasks with better examples or documentation
3. **Bug Fixes**: Fix issues in existing tasks
4. **Documentation**: Improve README, comments, or add tutorials
5. **Tools**: Enhance the validation or scanning scripts

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/appmod-custom-tasks.git
   cd appmod-custom-tasks
   ```
3. **Install dependencies**:
   ```bash
   cd scripts
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-new-task
   ```

## Creating a New Task

### Step 1: Plan Your Task

Before creating a task, consider:

- What technologies does this task migrate between?
- What are the key transformation steps?
- What code examples would be helpful?
- Are there any prerequisites or limitations?

### Step 2: Create the Task Folder

Create a new folder inside `tasks/` with a descriptive, lowercase, hyphenated name:

```bash
mkdir tasks/my-source-to-my-target
```

**Naming Guidelines:**
- Use lowercase letters and hyphens only
- Format: `source-to-target` or `descriptive-action`
- Examples: `aws-s3-to-azure-blob`, `log4j-to-azure-monitor`, `spring-security-upgrade`

### Step 3: Create task.md

Create the main task file with required YAML frontmatter and standard format:

```markdown
---
id: my-source-to-my-target
name: Migrate My Source to My Target
type: task
---

**Prompt:**

Brief description of what this task accomplishes. This is the main prompt that will guide the migration.

## Prerequisites
- Required software/versions
- Required accounts/access

## Migration Steps

### 1. Update Dependencies
Explain dependency changes...

### 2. Update Configuration
Explain configuration changes...

### 3. Transform Code
Explain code transformations...

**References:**
- https://docs.example.com/migration-guide
- https://docs.example.com/api-reference
```

**Required Sections:**
- `**Prompt:**` - The main task description (required)
- `**References:**` - List of reference URLs (recommended)

### Step 4: Add Supporting Files (Optional)

Include helpful examples and templates:

- `before-example.java` - Code before migration
- `after-example.java` - Code after migration
- `config.properties.template` - Configuration template
- `changes.diff` - Git diff showing transformations

### Step 5: Update Metadata

Run the metadata generation script:

```bash
cd scripts
npm start
```

### Step 6: Validate Your Task

```bash
cd scripts
npm run validate
npm run security-scan
```

### Step 7: Test Locally

If possible, test your task with the App Modernization extension locally before submitting.

## Pull Request Process

### Before Submitting

1. ✅ Ensure your task follows the format specification
2. ✅ Run `npm start` to update metadata.json
3. ✅ Run `npm run validate` with no errors
4. ✅ Run `npm run security-scan` with no critical/high issues
5. ✅ Review your changes for sensitive information

### Submitting Your PR

1. **Push your branch** to your fork:
   ```bash
   git add .
   git commit -m "Add: my-source-to-my-target migration task"
   git push origin feature/my-new-task
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what the task does
   - Any relevant context or testing information

### PR Review Process

1. **Automated Checks**: 
   - Format validation
   - Security scan
   - Metadata verification

2. **Manual Review**:
   - Content quality
   - Technical accuracy
   - Documentation clarity

3. **Feedback**: Address any requested changes

4. **Merge**: Once approved, your PR will be merged

### PR Title Format

Use conventional commit format:

- `Add: task-name` - New task
- `Fix: task-name` - Bug fix
- `Update: task-name` - Task improvement
- `Docs: description` - Documentation update
- `Chore: description` - Maintenance/tooling

## Style Guidelines

### Task Content

- Use clear, concise language
- Provide step-by-step instructions
- Include code examples with proper syntax highlighting
- Document prerequisites and assumptions
- Include testing/verification steps

### Code Examples

```markdown
**Before (Source Technology):**
```java
// Source code example
```

**After (Target Technology):**
```java
// Target code example
```
```

### Markdown Formatting

- Use proper heading hierarchy (# → ## → ###)
- Use code blocks with language identifiers
- Use tables for comparison/mapping information
- Include blank lines between sections

## Quality Standards

### Task Content Must:

- ✅ Be technically accurate
- ✅ Work with current versions of technologies
- ✅ Include practical, runnable examples
- ✅ Cover common use cases
- ✅ Document known limitations

### Task Content Must NOT:

- ❌ Include hardcoded credentials or secrets
- ❌ Include personal or proprietary information
- ❌ Contain prompt injection attempts
- ❌ Include malicious commands or code
- ❌ Violate any copyrights

### Security Considerations

Since tasks are used as AI prompts, be mindful of:

- Avoid patterns that could be interpreted as prompt injection
- Don't include commands that could be destructive if misinterpreted
- Be explicit about when elevated permissions are needed
- Use placeholders for sensitive values (e.g., `${CONNECTION_STRING}`)

## Getting Help

- 📖 Check existing tasks for examples
- 💬 Open a Discussion for questions
- 🐛 Open an Issue for problems

## Recognition

Contributors are recognized in:
- Git commit history
- Release notes (for significant contributions)
- Contributors section (coming soon)

Thank you for contributing to the App Modernization community! 🎉
