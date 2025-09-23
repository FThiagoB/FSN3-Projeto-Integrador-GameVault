const fs = require("fs");
const path = require("path");

const downloadImageFromUrl = require("./downloadImage");
const { generateFileHash } = require("./miscellaneous");

async function handleImageUpload( req, id, type ){
    // Campos usados para gerar o hash pro filename
    // id: game id ou user id
    // type: game ou user
    
    let relative_filename = false;

    const url = req.body?.url;
    const folder = (type === "user")? "users" : "games";

    // Verifica se a imagem foi passada por uma URL ou via input file
    if(req.body?.url || req.file){
        console.log("type: ", type)
        console.log("ID: ", String(id))
        console.log("Hash: ",  generateFileHash(type, String(id)))
        const image_title = generateFileHash(type, String(id));
        const fileFolder = path.resolve(__dirname, "..", "uploads", folder);
        let filename;
        
        if (req.file && req.file.buffer){
            const ext = path.extname(req.file.originalname);
            filename = `${image_title}${ext}`;

            const localFilePath = path.join(fileFolder, filename);
            fs.writeFileSync(localFilePath, req.file.buffer);
        }
        else if( url ){
            const ext = path.extname(url).split("?")[0] || ".jpg";
            filename = `${image_title}${ext}`;

            const localFilePath = path.join(fileFolder, filename);
            await downloadImageFromUrl(url, localFilePath);
        }

        relative_filename = filename;
    }

    return relative_filename;
}

module.exports = { handleImageUpload };