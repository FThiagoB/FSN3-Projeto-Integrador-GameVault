const axios = require('axios'); // Usado para criar a requisição
const fs = require('fs');
const path = require('path');

async function downloadImageFromUrl(imageUrl, localPath) {
    // Monta a requisição
    const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream',
    });

    // Salva o arquivo
    await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    return localPath;
}

// Disponibilia a função para que seja acessível via require
module.exports = downloadImageFromUrl;