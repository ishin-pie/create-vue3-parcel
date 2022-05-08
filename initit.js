/*
 * A self-bundled copy of a customized version of initit,
 * due to: https://github.com/c8r/initit/issues/3
 */
import fsx from 'fs-extra';
import { resolve as _resolve, basename, join } from 'path';
import { EOL } from 'os';
import { execSync as exec } from 'child_process';
import spawn from 'cross-spawn';
import { readFile } from 'fs/promises';

const install = () => {
    return new Promise((resolve, reject) => {
        const child = spawn('npm', ['install'], {
            stdio: 'inherit'
        });
        child.on('close', code => {
            if (code !== 0) {
                reject();
                return;
            }
            resolve();
        });
    });
};

const gitInit = () => {
    exec('git --version', { stdio: 'inherit' });
    exec('git init', { stdio: 'inherit' });
    // exec('git add .', { stdio: 'inherit' });
    // exec('git commit -am "Init"', { stdio: 'inherit' });
    return true;
};
const getTar = ({ user, repo, path = '', name, depth }) => {
    const url = `https://codeload.github.com/${user}/${repo}/tar.gz/main`;
    let cmd = `curl ${url} | tar -xz -C ${name} --strip=${depth} ${repo}-main/${path}`;
    if (basename(process.cwd()) === name) {
        cmd = `curl ${url} | tar -xz -C . --strip=${depth} ${repo}-main/${path}`;
    }
    exec(cmd, { stdio: 'inherit' });
};

const create = async (opts = {}) => {
    if (!opts.name) {
        throw new Error('name argument required');
        return;
    }

    if (!opts.template) {
        throw new Error('template argument required');
        return;
    }

    const dirname = _resolve(opts.name);
    const name = basename(dirname);
    const [user, repo, ...paths] = opts.template.split('/');
    const depth = paths.length + 1;
    console.log(`depth (paths.length): ${depth}`);

    fsx.ensureDirSync(name);

    getTar(
        Object.assign({}, opts, {
            name,
            user,
            repo,
            path: paths.join('/'),
            depth
        })
    );


    const templatePkg = JSON.parse(
        await readFile(join(dirname, 'package.json'))
    );

    const pkg = Object.assign({}, templatePkg, {
        name,
        version: '1.0.0'
    });

    fsx.writeFileSync(
        join(dirname, 'package.json'),
        JSON.stringify(pkg, null, 2) + EOL
    );

    process.chdir(dirname);

    await install();
    gitInit();

    // exec('npm test', { stdio: 'inherit' });
    return { name, dirname };
};

export default create;