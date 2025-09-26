const crypto = require('crypto');
const bcrypt = require("bcrypt");

const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

async function getImagesFromGamesData(products, outputPath) {
  // Certifique-se de que a pasta games existe
  const gamesDir = path.join(__dirname, "../uploads/games");
  const jsonPath = path.join(__dirname, "../../game_data/products_info.json");
  
  // Função para baixar e salvar imagem
  async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = path.join(__dirname, "../uploads/games", filename);

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  function getExtensionFromUrl(url) {
    const parsed = path.parse(url);
    return parsed.ext || '.jpg'; // fallback para .jpg se não encontrar extensão
  }

  function sanitizeFileName(name) {
    return name
      .normalize("NFD")                     // Remove acentos
      .replace(/[\u0300-\u036f]/g, "")     // Remove marcas diacríticas
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "") // Remove caracteres proibidos
      .replace(/\s+/g, "_")                // Substitui espaços por _
      .replace(/[^a-zA-Z0-9_-]/g, "")      // Remove outros símbolos
      .trim();
  }

  if (!fs.existsSync(gamesDir)) {
    fs.mkdirSync(gamesDir);
  }

  // Percorre os produtos
  for (const product of products) {
    const cleanName = sanitizeFileName(product.name);
    const ext = getExtensionFromUrl(product.url);
    const filename = `thumbnail_${product.id}_${cleanName}${ext}`;

    try {
      await downloadImage(product.url, filename);
      product.image = `${filename}`;
      console.log(`Imagem salva como ${filename}`);
    } catch (error) {
      console.error(`Erro ao baixar imagem de ${product.name}:`, error.message);
    }
  }

  // Aqui você pode salvar o array atualizado em um novo arquivo, se quiser
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  console.log(`Produtos atualizados salvos em ${outputPath}`);
}

// Gera um hash para senhas
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      password, salt
    );

    return hashedPassword;
  }
  catch (error) {
    console.error("Error hashing password.");
    throw error;
  }
}

// Função para comparar senhas
async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }
  catch (error) {
    console.error("Error compare password.");
    throw error;
  }
}

module.exports = { generateFileHash, findExistingImage, hashPassword, comparePassword, getImagesFromGamesData };