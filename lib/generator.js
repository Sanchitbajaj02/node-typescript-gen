const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');
const os = require('os');
const simpleGit = require('simple-git');

// Default external repository URL
const DEFAULT_TEMPLATE_REPO_URL = 'https://github.com/Sanchitbajaj02/express-typescript-template.git';

async function generateProject(answers, templateUrl) {
  const { name, description, author, version, installDependencies, initializeRepository } = answers;
  const projectPath = path.resolve(name);

  // Store project config globally for template processing
  global.projectConfig = { name, description, author, version };

  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Directory "${name}" already exists. Please choose a different name.`);
  }

  const spinner = ora('Creating your Express TypeScript application...').start();

  try {
    // Create project directory
    await fs.ensureDir(projectPath);

    // Clone template repository
    const cloneSpinner = ora('Cloning template repository...').start();
    try {
      const templateUrlToUse = templateUrl || DEFAULT_TEMPLATE_REPO_URL;
      await cloneTemplateRepository(projectPath, templateUrlToUse);
      cloneSpinner.succeed(chalk.green('Template cloned successfully!'));
    } catch (error) {
      cloneSpinner.fail(chalk.red('Failed to clone template'));
      throw error;
    }

    // Clean up unnecessary files
    const cleanupSpinner = ora('Cleaning up template files...').start();
    try {
      await cleanupTemplateFiles(projectPath);
      cleanupSpinner.succeed(chalk.green('Template cleaned up!'));
    } catch (error) {
      cleanupSpinner.fail(chalk.red('Failed to clean up template'));
      throw error;
    }

    // Create .env file
    await createEnvFile(projectPath);

    // Create README.md
    await createReadme(projectPath, { name, description, author });

    // Initialize git repository
    if (initializeRepository) {
      cleanupSpinner.succeed(chalk.green('Initializing and setting up git repository!'));
      await initializeGitRepository(projectPath);
    }

    spinner.succeed(chalk.green('Project created successfully!'));

    console.log('\n' + chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${name}`));
    
    if (installDependencies) {
      console.log(chalk.white('  npm install'));
      console.log(chalk.white('  npm run dev'));
    } else {
      console.log(chalk.white('  npm install'));
      console.log(chalk.white('  npm run dev'));
    }

    console.log('\n' + chalk.yellow('Happy coding! 🚀'));

    // Install dependencies if requested
    if (installDependencies) {
      const installSpinner = ora('Installing dependencies...').start();
      try {
        process.chdir(projectPath);
        execSync('npm install', { stdio: 'pipe' });
        installSpinner.succeed(chalk.green('Dependencies installed successfully!'));
      } catch (error) {
        installSpinner.fail(chalk.red('Failed to install dependencies'));
        console.log(chalk.yellow('You can install dependencies manually by running: npm install'));
      }
    }

  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    throw error;
  }
}

async function cloneTemplateRepository(projectPath, templateUrl = DEFAULT_TEMPLATE_REPO_URL) {
  const tempDir = path.join(os.tmpdir(), `express-ts-template-${Date.now()}`);
  const git = simpleGit();
  
  try {
    // Clone the repository to a temporary directory
    await git.clone(templateUrl, tempDir);

    // Copy files from temp directory to project directory
    await fs.copy(tempDir, projectPath, {
      filter: (src) => {
        const basename = path.basename(src);
        // Skip git directory and other unnecessary files
        return !['.git', '.DS_Store', 'node_modules'].includes(basename);
      }
    });

    // Process template variables
    await processTemplateVariables(projectPath);

  } catch (error) {
    throw new Error(`Failed to clone template repository: ${error.message}`);
  } finally {
    // Clean up temporary directory
    if (await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
  }
}

async function cleanupTemplateFiles(projectPath) {
  const filesToRemove = [
    'LICENSE',
    '.env.example',
    '.prettierrc.json',
    'README.md'
  ];

  for (const file of filesToRemove) {
    const filePath = path.join(projectPath, file);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
  }

  // Remove .git directory if it exists
  const gitPath = path.join(projectPath, '.git');
  if (await fs.pathExists(gitPath)) {
    await fs.remove(gitPath);
  }
}

async function initializeGitRepository(projectPath) {
  try {
    const git = simpleGit(projectPath);
    await git.init();
    await git.add('.');
    await git.commit('Initial commit');
  } catch (error) {
    // Git initialization is optional, don't fail the whole process
    console.log(chalk.yellow('Note: Git repository initialization failed. You can initialize it manually.'));
  }
}

async function processTemplateVariables(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    let content = await fs.readFile(packageJsonPath, 'utf8');
    
    // Parse the package.json
    const packageJson = JSON.parse(content);
    
    // Update the fields with our project configuration
    packageJson.name = global.projectConfig.name;
    packageJson.version = global.projectConfig.version;
    packageJson.description = global.projectConfig.description;
    packageJson.author = global.projectConfig.author;
    
    // Write back the updated package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

async function createEnvFile(projectPath) {
  const envContent = `##### Environment variables #####
PORT = 
NODE_ENV = 
RATE_LIMIT_LIMIT = 
RATE_LIMIT_WINDOW_SECONDS = 
DATABASE_URL = 
DATABASE_TYPE = 
BLOCK_ON_THREAT = 
LOG_THREATS = 
`;

  await fs.writeFile(path.join(projectPath, '.env'), envContent);
}

async function createReadme(projectPath, { name, description, author }) {
  const readmeContent = `# ${name}

${description}

## Features

- Express.js with TypeScript
- Dependency injection container
- Error handling middleware
- Rate limiting
- Logging with Winston
- CORS support
- XSS protection
- Environment configuration
- Hot reload for development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd ${name}
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file in the root directory and add your environment variables.

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The server will start on \`http://localhost:3000\`

## Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build the project for production
- \`npm start\` - Start production server
- \`npm run format\` - Format code with Prettier

## Project Structure

\`\`\`
src/
├── app.factory.ts      # Application factory
├── config/            # Configuration files
├── container/         # Dependency injection container
├── lib/              # Utility libraries
├── logger/           # Logging configuration
├── middleware/       # Express middleware
├── types/           # TypeScript type definitions
└── server.ts        # Server entry point
\`\`\`

## License

MIT

${author ? `## Author

${author}` : ''}
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}

module.exports = {
  generateProject
}; 