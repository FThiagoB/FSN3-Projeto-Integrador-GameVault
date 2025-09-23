const crypto = require('crypto');
const bcrypt = require("bcrypt");

const fs = require('fs');
const path = require('path');

// Gera um hash que servirá como nome da imagem
function generateFileHash(seed_text, seed_id) {
  const rawString = `${seed_text}-${seed_id}`;
  console.log("Raw string:", rawString);
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

// Gera um hash para senhas
async function hashPassword( password ){
  try{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      password, salt
    );

    return hashedPassword;
  }
  catch( error ){
    console.error("Error hashing password.");
    throw error;
  }
}

// Função para comparar senhas
async function comparePassword( password, hashedPassword ) {
  try{
    const match = await bcrypt.compare( password, hashedPassword );
    return match;
  }
  catch( error ){
    console.error("Error compare password.");
    throw error;
  }
}

module.exports = {generateFileHash, findExistingImage, hashPassword, comparePassword};