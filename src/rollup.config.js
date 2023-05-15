import babel from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';

function uuid(length) {
  return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
}


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
          "@babel/preset-env",
          {
            targets: {
                browsers: ["last 2 versions", "IE 11"],
            },
          }
        ],
      ],
    }),
    // html(),
  ]
};
