import svelte from 'rollup-plugin-svelte';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import {
    chromeExtension,
    simpleReloader,
} from 'rollup-plugin-chrome-extension';
import copy from 'rollup-plugin-copy';
import size from 'rollup-plugin-size';
import zip from 'rollup-plugin-zip';
import cleaner from 'rollup-plugin-cleaner';

const production = !process.env.ROLLUP_WATCH;

export default {
    // input: 'src/main.js',
    // output: {
    //     sourcemap: true,
    //     format: 'iife',
    //     name: 'app',
    //     file: 'public/build/bundle.js'
    // },
    input: 'src/manifest.json',
    output: {
        sourcemap: true,
        dir: 'dist',
        format: 'esm'
    },
    plugins: [
        cleaner({
            targets: [
                'dist/'
            ]
        }),
        // always put chromeExtension() before other plugins
        chromeExtension(),
        simpleReloader(),

        size(),

        copy({
            targets: [
                { src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'src' },
                { src: 'node_modules/pretty-checkbox/dist/pretty-checkbox.min.css', dest: 'src' }
            ]
        }),

        nodeResolve({
            browser: true,
            dedupe: ['svelte']
        }),
        // teach rollup how to handle typescript imports
        typescript({ sourceMap: !production }),
        svelte({
            preprocess: autoPreprocess({
                sourcemap: !production
            }),
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('src/css/bundle.css');
            }
        }),

        copy({
            targets: [
                { src: 'node_modules/pretty-checkbox/dist/pretty-checkbox.min.css', dest: 'dist/css' },
                { src: 'public/build/bundle.*', dest: 'dist/css' }
            ]
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        zip(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
