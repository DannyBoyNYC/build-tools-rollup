// Plugins
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

// Configs
var configs = {
  name: 'BuildToolsCookbook',
  // files: ['main.js', 'detects.js', 'another-file.js'],
  files: ['index.js'],
  // formats: ['iife', 'es', 'amd', 'cjs'],
  formats: ['es'],
  default: 'iife',
  pathIn: 'src/js',
  pathOut: 'dist/js',
  minify: true,
  sourceMap: false,
};

// Banner
var banner = `/*! ${configs.name ? configs.name : pkg.name} v${
  pkg.version
} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${
  pkg.license
} License | ${pkg.repository.url} */`;

var createOutput = function (filename, minify) {
  return configs.formats.map(function (format) {
    var output = {
      file: `${configs.pathOut}/${filename}${
        format === configs.default ? '' : `.${format}`
      }${minify ? '.min' : ''}.js`,
      format: format,
      banner: banner,
    };
    if (format === 'iife') {
      output.name = configs.name ? configs.name : pkg.name;
    }
    if (minify) {
      output.plugins = [terser()];
    }

    output.sourcemap = configs.sourceMap;

    return output;
  });
};

/**
 * Create output formats
 * @param  {String} filename The filename
 * @return {Array}           The outputs array
 */
var createOutputs = function (filename) {
  // Create base outputs
  var outputs = createOutput(filename);
  // If not minifying, return outputs
  if (!configs.minify) return outputs;
  // Otherwise, create second set of outputs
  var outputsMin = createOutput(filename, true);
  // Merge and return the two arrays
  return outputs.concat(outputsMin);
};

/**
 * Create export object
 * @return {Array} The export object
 */
const createExport = () => {
  return configs.files.map((file) => {
    const filename = file.replace('.js', '');
    console.log(' filename ', filename); // index
    return {
      input: `${configs.pathIn}/${file}`,
      // E.G.: output: [
      //   {
      //     file: 'dist/js/index.js',
      //     format: 'cjs',
      //   },
      // ],
      output: createOutputs(filename),
    };
  });
};

export default createExport();
