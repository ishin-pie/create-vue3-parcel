#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import { readFile } from 'fs/promises';
import path from 'path';
import initit from './initit.js'

// Define Logger
const logo = chalk.hex('#01A0E9')('[vue-parcel]');
const log = (...args) => {
    console.log(logo, ...args);
};
log.error = (...args) => {
    console.log(chalk.red('[ERROR]'), ...args);
};
const packageJson = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);
program.name('vue-parcel')
program.usage('<command>')
program.description(packageJson.description)
program.version(packageJson.version)
program
    .command('init')
    .description('init a project')
    .usage('[project-name]')
    .argument('[project-name]', 'project name')
    .action((args) => {
        if (!args) {
            log.error('Project should not be empty!')
            program.help()
        } else {
            const name = (args === '.') ? path.basename(process.cwd()) : args
            log(chalk.green(`Initializing ${name} project...`))
            log('Start generating...')

            const template = 'ishin-pie/vue-parcel-boilerplate'

            initit({ name, template })
                .then(res => {
                    log(chalk.green('Initializing completed!'))
                    log('To get started')
                    log(`cd ${name}`)
                    process.exit(0)
                })
                .catch(err => {
                    log.error(`Generation failed. ${err}`)
                    process.exit(1)
                })
        }
    })

program.parse()