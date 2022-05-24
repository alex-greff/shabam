import typescript from 'rollup-plugin-typescript2';
// TODO: need to figure out how to bundle the native modules
// import nativePlugin from 'rollup-plugin-natives';
// import native from 'rollup-plugin-native';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    // nativePlugin({

    //   copyTo: "dist/build",
    //   destDir: "./build",
    // })
    // native(),
  ],
}