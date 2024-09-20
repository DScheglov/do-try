import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'do-try-tuple': 'src/index.ts',
    global: 'src/global.ts',
  },
  globalName: 'DoTryTuple',
  format: ['iife'],
  outExtension() {
    return {
      js: '.min.js',
    };
  },
  dts: false,
  minify: true,
  splitting: false,
  sourcemap: true,
  outDir: 'dist/build',
});
