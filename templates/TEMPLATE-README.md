# Private Task Repository Template

This template provides everything you need to set up your own private task repository for the GitHub Copilot App Modernization VS Code extension.

## Quick Setup

### 1. Create Your Private Repository

```bash
# Option A: Clone the template branch
git clone --branch template https://github.com/backwind1233/appmod-custom-tasks.git my-company-tasks
cd my-company-tasks
git remote remove origin
git remote add origin <your-private-repo-url>
git push -u origin main

# Option B: Initialize a new repository
mkdir my-company-tasks
cd my-company-tasks
git init
# Copy template files from this folder
```

### 2. Repository Structure

Your private repository should follow this structure:

```
my-company-tasks/
├── metadata.json              # Auto-generated (run npm start)
├── README.md                  # Your documentation
├── scripts/
│   ├── generate-metadata.js   # Copy from template
│   ├── validate-task.js       # Copy from template (optional)
│   ├── security-scan.js       # Copy from template (optional)
│   └── package.json           # Copy from template
└── tasks/                     # All task folders go here
    └── your-task-folder/
        ├── task.md            # Your task definition
        └── ...                # Supporting files
```

### 3. Install Dependencies

```bash
cd scripts
npm install
```

### 4. Create Your First Task

1. Create a task folder:
   ```bash
   mkdir -p tasks/my-first-task
   ```

2. Create `tasks/my-first-task/task.md`:
   ```markdown
   ---
   id: my-first-task
   name: My First Migration Task
   type: task
   ---

   # My First Migration Task

   ## Overview
   Describe what this task does...

   ## Steps
   1. First step
   2. Second step
   ```

3. Generate metadata:
   ```bash
   cd scripts
   npm start
   ```

### 5. Configure VS Code Extension

Add your private repository URL to the extension settings. The format depends on how you host your repository:

- **GitHub Private**: `https://github.com/your-org/your-repo.git`
- **GitHub Enterprise**: `https://github.your-company.com/org/repo.git`
- **Azure DevOps**: `https://dev.azure.com/org/project/_git/repo`
- **GitLab**: `https://gitlab.com/your-org/your-repo.git`

**Note**: You may need to configure authentication tokens for private repositories.

## Template Files

### Required Files

| File | Purpose |
|------|---------|
| `scripts/generate-metadata.js` | Generates metadata.json from task folders |
| `scripts/package.json` | Node.js dependencies and scripts |

### Optional Files

| File | Purpose |
|------|---------|
| `scripts/validate-task.js` | Validates task format (for CI/CD) |
| `scripts/security-scan.js` | Security scanning (for CI/CD) |
| `.github/workflows/*.yml` | GitHub Actions (if using GitHub) |

## Task Format

### task.md Structure

```markdown
---
id: task-identifier
name: Human Readable Name
type: task
---

# Task Title

## Overview
Brief description of the migration task.

## Prerequisites
- Required tools/versions
- Required access/accounts

## Migration Steps

### Step 1: Description
Details...

### Step 2: Description
Details...

## Verification
How to verify the migration was successful.

## Common Issues
Known issues and solutions.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (should match folder name) |
| `name` | Yes | Display name shown in the extension |
| `type` | Yes | Must be `task` |

## CI/CD Integration

### GitHub Actions

Copy `.github/workflows/pr-validation.yml` and `.github/workflows/security-scan.yml` from the main repository to enable automated validation.

### Azure DevOps

Create a pipeline with:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: |
      cd scripts
      npm install
      npm run validate
      npm run security-scan
    displayName: 'Validate Tasks'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
validate:
  image: node:20
  script:
    - cd scripts
    - npm install
    - npm run validate
    - npm run security-scan
```

## Best Practices

### Security

1. **Never commit secrets** - Use environment variables or secret management
2. **Review all tasks** - Even internal tasks should be reviewed
3. **Use placeholders** - `${CONNECTION_STRING}` instead of actual values
4. **Run security scans** - Integrate into your CI/CD pipeline

### Organization

1. **Consistent naming** - Use `source-to-target` format
2. **Good documentation** - Include prerequisites and verification steps
3. **Code examples** - Provide before/after code samples
4. **Version control** - Tag releases for stability

### Maintenance

1. **Regular updates** - Keep tasks current with latest SDK versions
2. **Test periodically** - Verify tasks still work as expected
3. **Archive outdated tasks** - Move deprecated tasks to an archive folder

## Syncing with Upstream

To pull updates from the public repository:

```bash
# Add upstream remote (one-time)
git remote add upstream https://github.com/backwind1233/appmod-custom-tasks.git

# Fetch updates
git fetch upstream template

# Merge script updates (be selective)
git checkout upstream/template -- scripts/generate-metadata.js
git checkout upstream/template -- scripts/validate-task.js
git checkout upstream/template -- scripts/security-scan.js

# Commit
git commit -m "Update scripts from upstream"
```

## Support

For issues with:
- **Template setup**: Open an issue in the main repository
- **Extension features**: Contact GitHub Copilot support
- **Your private tasks**: Internal support channels
