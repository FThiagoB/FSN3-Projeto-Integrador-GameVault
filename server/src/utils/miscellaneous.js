const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateFileHash({ seed_text, seed_id }) {
  const rawString = `${seed_text}-${seed_id}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
}

// Verifica se um arquivo existe em um path
function findExistingImage(baseName, folderPath) {
  const files = fs.readdirSync(folderPath);

  const match = files.find(file => {
    const nameWithoutExt = path.parse(file).name;
    return nameWithoutExt === baseName;
  });

  return match ? path.join(folderPath, match) : null;
}

module.exports = {generateFileHash, findExistingImage};