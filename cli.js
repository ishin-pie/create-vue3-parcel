#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import { readFile } from 'fs/promises';
import path from 'path';
import initit from './initit.js'

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
    .description(packageJson.description)
    .version(packageJson.version)
    .argument('[project-name]', 'project name')
    .action((arg) => {
        if (!arg) {
            log.error('Project should not be empty!')
            program.help()
        } else {
            const name = (arg === '.') ? path.basename(process.cwd()) : arg
            log(chalk.green(`Initializing ${name} project...`))
            log('Start generating...')

            const template = 'ishin-pie/vue-parcel-boilerplate';

            initit({ name: arg, template })
                .then(res => {
                    log(chalk.green('Initializing completed!'))
                    log('To get started')
                    if (arg !== '.') {
                        log(`cd ${name}`)
                    }
                    log('npm run serve')
                    process.exit(0)
                })
                .catch(err => {
                    log.error(`Generation failed. ${err}`)
                    process.exit(1)
                })
        }
    })
    .parse()