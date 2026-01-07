# appmod-custom-tasks

This repository contains custom migration tasks for the GitHub Copilot App Modernization extension.

## Repository Structure

This repository has a consolidated `metadata.json` file in the root that indexes all available tasks:

```
metadata.json            # Central metadata for all tasks (auto-generated)
scripts/
  ├── generate-metadata.js  # Script to generate metadata.json
  ├── package.json          # Node.js dependencies
  └── node_modules/         # Installed dependencies
task-id/
  ├── task.md           # Main task definition (required)
  ├── example.java      # Code examples (optional)
  ├── config.json       # Configuration files (optional)
  └── changes.diff      # Git diff files (optional)
```

**Note:** Task folders use a flat structure - all files are placed directly in the task folder, not in subdirectories.

## Generating Metadata

The `metadata.json` file is auto-generated from the task.md files:

```bash
cd scripts
npm install  # First time only
npm start    # Generates metadata.json
```

The script scans all task folders and extracts information from the YAML frontmatter in each `task.md` file.

## Repository Requirements

### 1. metadata.json (Auto-Generated - Root Level)
Central metadata file containing all tasks. Generated automatically by running `npm start` in the scripts folder:
```json
{
  "tasks": [
    {
      "id": "task-id",
      "name": "Task Display Name",
      "path": "task path"
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
3. **Configuration**: Add the repository URL (e.g., `my-new-task`)
2. Add `task.md` with YAML frontmatter:
   ```markdown
   ---
   id: my-new-task
   name: My New Task Name
   type: task
   ---
   
   # Your task content here
   ```
3. Include helpful examples and documentation in the task folder
4. Run `cd scripts && npm start` to regenerate `metadata.json`
To add a new task:
1. Create a new folder with a descriptive ID
2. Add task.md with the migration instructions
3. Update the root metadata.json to include your task
4. Include helpful examples and documentation
5. Test locally before publishing
