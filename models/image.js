const fs = require("fs");
const pool = require("../database/db");
const model = {};

model.uploadImage = async function(imageData, uploaderId) {
    try {
        const relativePath = "id" + uploaderId + "_" + Math.floor(Math.random() * 10000) + "_" + imageData.name;
        const path = __dirname + "/../public/upload/" + relativePath;
        const query = await pool.query("INSERT INTO image (image_name, account_id) VALUES ($1, $2) RETURNING *;", [relativePath, uploaderId]);
        imageData.mv(path);

        return query;
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
}

model.removeImage = async function(imageId) {
    try {
        const image = await pool.query("SELECT * FROM image WHERE image_id = $1", [imageId]);
        
        if (!image) {
            return "Image not found."
        }
        
        let path = __dirname + "/../public/upload/" + image.rows[0].image_name;

        if (fs.existsSync(path)) {
            fs.unlink(path, (error) => {
                if (error) { 
                    console.log(error) ;
                } else {
                    console.log("Deleted.")
                }
            })
        }

        return await pool.query("DELETE FROM image WHERE image_id = $1", [imageId]);
    } catch (error) {
        return error.message;
    }
}

module.exports = model;