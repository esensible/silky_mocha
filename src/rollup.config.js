import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import presetEnv from '@babel/preset-env';

export default {
  output: {
    format: 'umd',
    name: 'main',
  },
  cache: false,
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          presetEnv,
          {
            targets: {
                browsers: ["last 2 versions", "IE 11"],
            },
          }
        ],
      ],
    }),
  ]
};
