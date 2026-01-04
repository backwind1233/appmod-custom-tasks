# Custom Tasks Repository

This repository contains custom migration tasks for the GitHub Copilot App Modernization extension.

## Repository Structure

This repository has a consolidated `metadata.json` file in the root that indexes all available tasks:

```
metadata.json            # Central metadata for all tasks (required)
task-id/
  ├── task.md           # Main task definition (required)
  ├── example.java      # Code examples (optional)
  ├── config.json       # Configuration files (optional)
  └── changes.diff      # Git diff files (optional)
```

**Note:** Task folders use a flat structure - all files are placed directly in the task folder, not in subdirectories.

## Repository Requirements

### 1. metadata.json (Required - Root Level)
Central metadata file containing all tasks:
```json
{
  "tasks": [
    {
      "id": "task-id",
      "name": "Task Display Name",
      "description": "Brief description",
      "author": "Author Name",
      "version": "1.0.0",
      "tags": ["migration", "azure"],
      "category": "storage",
      "difficulty": "intermediate",
      "estimatedTime": "2-4 hours",
      "path": "task-id/task.md"
    }
  ]
}
```

### 2. task.md (Required - Per Task)
The main task definition file with YAML front matter and markdown content:
```markdown
---
id: task-id
name: Task Name
type: task
---

**Prompt:**

Your task instructions here

**References:**
- file:///example.java
- git+file:///changes.diff
```

### 3. Additional Files (Optional)
All additional files should be placed directly in the task folder:
- Code examples (e.g., `example.java`, `sample.py`)
- Configuration files (e.g., `config.json`, `settings.properties`)
- Git diff files (e.g., `changes.diff`)
- Any other reference materials

## Using This Repository

1. **Local Testing**: Place this folder in your workspace
2. **Remote Hosting**: Push to a public Git repository
3. **Configuration**: Add the repository URL to the extension settings

## Contributing

To add a new task:
1. Create a new folder with a descriptive ID
2. Add task.md with the migration instructions
3. Update the root metadata.json to include your task
4. Include helpful examples and documentation
5. Test locally before publishing
