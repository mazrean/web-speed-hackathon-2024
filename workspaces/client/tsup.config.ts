import path from 'node:path';

import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import findPackageDir from 'pkg-dir';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig(async (): Promise<Options[]> => {
  const PACKAGE_DIR = (await findPackageDir(process.cwd()))!;

  const OUTPUT_DIR = path.resolve(PACKAGE_DIR, './dist');

  return [
    {
      bundle: true,
      clean: true,
      entry: {
        admin: path.resolve(PACKAGE_DIR, './src/admin.tsx'),
        client: path.resolve(PACKAGE_DIR, './src/index.tsx'),
      },
      env: {
        API_URL: '',
        NODE_ENV: process.env['NODE_ENV'] || 'development',
        PATH_LIST: '',
      },
      esbuildOptions(options) {
        options.define = {
          ...options.define,
          global: 'globalThis',
        };
        options.publicPath = '/';
      },
      esbuildPlugins: [
        polyfillNode({
          globals: {
            process: false,
          },
          polyfills: {
            events: true,
          },
        }),
      ],
      format: 'esm',
      loader: {
        '.json?file': 'file',
        '.wasm': 'binary',
      },
      metafile: true,
      minify: 'terser',
      noExternal: [/.*/],
      outDir: OUTPUT_DIR,
      outExtension: ({ format }) => ({
        js: format === 'esm' ? '.mjs' : '.js',
      }),
      platform: 'browser',
      shims: false,
      splitting: false,
      target: ['chrome128'],
      terserOptions: {
        compress: {
          passes: 10,
        },
      },
      treeshake: true,
    },
  ];
});
