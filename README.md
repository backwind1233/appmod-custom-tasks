# Custom Tasks Repository

This repository contains custom migration tasks for the GitHub Copilot App Modernization extension.

## Repository Structure

Each task is stored in its own folder with the following structure:

```
task-id/
  ├── task.md              # Main task definition (required)
  ├── metadata.json        # Task metadata (required)
  ├── examples/            # Code examples (optional)
  │   ├── before.java
  │   └── after.java
  ├── config/              # Configuration files (optional)
  │   └── settings.json
  └── docs/                # Additional documentation (optional)
      └── guide.md
```

## Task Folder Requirements

### 1. task.md (Required)
The main task definition file containing:
- Task description
- Migration instructions
- Step-by-step guide
- Best practices

### 2. metadata.json (Required)
Task metadata:
```json
{
  "id": "task-id",
  "name": "Task Display Name",
  "description": "Brief description",
  "author": "Author Name",
  "version": "1.0.0",
  "tags": ["migration", "azure"],
  "category": "storage"
}
```

### 3. Additional Files (Optional)
- Examples: Before/after code samples
- Configs: Sample configuration files
- Docs: Additional documentation

## Using This Repository

1. **Local Testing**: Place this folder in your workspace
2. **Remote Hosting**: Push to a public Git repository
3. **Configuration**: Add the repository URL to the extension settings

## Contributing

To add a new task:
1. Create a new folder with a descriptive ID
2. Add task.md and metadata.json
3. Include helpful examples and documentation
4. Test locally before publishing
