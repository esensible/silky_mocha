import babel from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'esbuild';
import { createFilter } from '@rollup/pluginutils';
import image from '@rollup/plugin-image';
import smartAsset from "rollup-plugin-smart-asset"

function uuid(length) {
  return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
}

const silkJSX = () => {
  const jsxExtensionsRE = /\.jsx?$/
  const filter = createFilter(jsxExtensionsRE);
  const importStatement = `import { createElement } from 'silkjs';\n`;
  var injected = false;

  return {
    name: 'esbuild-jsx',
    transform(code, id) {
      if (!filter(id)) return;

      return esbuild
        .transform(code, {
          loader: 'jsx',
          sourcefile: id,
          sourcemap: true,
          target: 'es2015',
          jsxFactory: 'createElement',
          jsxFragment: 'Fragment',
        })
        .then((result) => {
          // if (!injected && jsxExtensionsRE.test(id)) {
          //   result.code = importStatement + result.code;
          //   injected = true;
          // }
          return {
            code: result.code,
            map: result.map,
        }});
    },
  };
};

export default {
  input: 'src/index.jsx',
  output: {
    format: 'umd',
    name: 'main',
    file: 'dist/bundle-' + uuid(8) + '.js',
  },
  cache: false,
  plugins: [
    silkJSX(),
    resolve(),
    // image(),
    smartAsset({mode: "copy"}),
    babel({
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
    postcss({
      extract: true,
    }),
    html(),
    // terser(),
  ]
};
