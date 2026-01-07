const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Tasks are stored in the tasks/ directory
const TASKS_DIR = 'tasks';

function generateMetadata() {
  const tasks = [];
  const rootDir = path.join(__dirname, '..');
  const tasksDir = path.join(rootDir, TASKS_DIR);

  // Ensure tasks directory exists
  if (!fs.existsSync(tasksDir)) {
    console.log('No tasks directory found. Creating empty metadata.json');
    fs.writeFileSync(path.join(rootDir, 'metadata.json'), JSON.stringify({ tasks: [] }, null, 2), 'utf8');
    return;
  }

  // Read all directories in the tasks folder
  const entries = fs.readdirSync(tasksDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      const taskMdPath = path.join(tasksDir, entry.name, 'task.md');

      // Check if task.md exists
      if (fs.existsSync(taskMdPath)) {
        try {
          const fileContent = fs.readFileSync(taskMdPath, 'utf8');
          const { data } = matter(fileContent);

          // Extract only properties available from the YAML frontmatter
          if (data.id && data.name) {
            tasks.push({
              id: data.id,
              name: data.name,
              path: `${TASKS_DIR}/${entry.name}`
            });
          } else {
            console.warn(`Warning: ${entry.name}/task.md is missing required frontmatter (id, name)`);
          }
        } catch (error) {
          console.error(`Error processing ${taskMdPath}:`, error.message);
        }
      }
    }
  }

  // Sort tasks by id for consistent output
  tasks.sort((a, b) => a.id.localeCompare(b.id));

  // Write metadata.json
  const metadata = {
    tasks: tasks
  };

  fs.writeFileSync(
    path.join(rootDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );

  console.log(`Generated metadata.json with ${tasks.length} tasks`);
  tasks.forEach(task => console.log(`  - ${task.id}: ${task.name}`));
}

generateMetadata();
