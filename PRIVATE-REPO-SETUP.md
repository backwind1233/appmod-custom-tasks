# Private Repository Setup

For teams that want to maintain their own private task repository, there are two options available.

## Option 1: Fork and Make Private

1. Fork this repository
2. Make the fork private in repository settings
3. Add your custom tasks to the `tasks/` folder
4. Configure the extension to use your private repository URL

## Option 2: Use the Template Branch

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

## Repository Structure

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

## Authentication

For private repositories, you may need to configure authentication:

- **GitHub Private**: Use a personal access token or GitHub App
- **GitHub Enterprise**: Configure your enterprise URL and credentials
- **Azure DevOps**: Use Azure DevOps PAT
- **GitLab**: Use GitLab access token

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

## Best Practices

1. **Security**: Never commit secrets - use environment variables
2. **Review**: Review all tasks even for internal use
3. **Consistency**: Follow the same naming conventions as the public repo
4. **Testing**: Test tasks locally before sharing with your team
