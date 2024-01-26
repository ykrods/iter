import path from 'node:path';

const defaultOptions = {
  extensions: ['txt'],
};

/**
 * rollup plugin to import file as text string
 */
export default (options = defaultOptions) => {
  return {
    name: "textImport",
    transform(code, id) {
      const ext = path.extname(id).slice(1);
      if (options.extensions.includes(ext)) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: ""},
        }
      }
    }
  };
}
