#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { generateProject } = require('./lib/generator');

program
  .name('express-ts-generator')
  .description('CLI tool to create Express applications written in Typescript!')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <url>', 'Custom template repository URL')
  .action(async (projectName, options) => {
    try {
      const answers = await promptForProjectDetails(projectName);
      await generateProject(answers, options.template);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();

async function promptForProjectDetails(projectName) {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: projectName || 'my-express-app',
      validate: (input) => {
        if (!input) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'What is your project description?',
      default: 'A new Express TypeScript application'
    },
    {
      type: 'input',
      name: 'author',
      message: 'What is your name?',
      default: '@developer'
    },
    {
      type: 'input',
      name: 'version',
      message: 'What version should your project start with?',
      default: '1.0.0'
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Would you like to install dependencies now?',
      default: true
    }
  ];

  return inquirer.prompt(questions);
} 