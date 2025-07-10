const pool = require("../database/db");
const model = {};

model.uploadImage = async function(imageData, uploaderId) {
    try {
        const relativePath = "id" + uploaderId + "_" + Math.floor(Math.random() * 10000) + "_" + imageData.name;
        const path = __dirname + "/../public/upload/" + relativePath;
        const query = await pool.query("INSERT INTO public.image (image_name, account_id) VALUES ($1, $2) RETURNING *;", [relativePath, uploaderId]);
        imageData.mv(path);

        return query;
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
}

module.exports = model;