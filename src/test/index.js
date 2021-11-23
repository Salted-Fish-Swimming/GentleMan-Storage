const fs = require('fs/promises');
const path = require('path')

module.exports = function (filepath) {
  console.log(__dirname);
  return async function (filename, content) {
    const fullPath = path.join(filepath, filename);
    await fs.writeFile(fullPath, content, { encoding: 'utf-8' });
  }
}