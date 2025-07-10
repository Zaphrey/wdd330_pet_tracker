const pool = require("../database/db");
const imageModel = require("../models/image");
const model = {};

model.createPet = async function(
    account_id, 
    image, 
    pet_name,
    pet_breed,
    pet_age, 
    pet_weight,
    pet_lastvetvisit, 
    pet_vaccinated_id
) {
    try {
        const imageQuery = await imageModel.uploadImage(image, account_id);
        const imageId = imageQuery.rows[0].image_id
        
        const petQuery = await pool.query(
            `INSERT INTO public.pets 
                (
                    pet_name, 
                    pet_breed, 
                    pet_weight,
                    pet_age, 
                    pet_lastvetvisit, 
                    pet_vaccinated_id,
                    account_id,
                    image_id
                ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
            `, 
            [
                pet_name, 
                pet_breed, 
                pet_weight, 
                pet_age, 
                pet_lastvetvisit, 
                pet_vaccinated_id, 
                account_id, 
                imageId
            ]
        );

        return petQuery;
    } catch (error) {
        console.error(error.message);
        return error.message
    }
};

model.getPetsFromUser = async function(userId) {
    try  {
        const query = await pool.query("SELECT * FROM public.pets LEFT JOIN public.image ON public.pets.image_id = public.image.image_id WHERE pets.account_id = $1;", [userId]);
        return query
    } catch(error) {
        return error.message
    }
};

module.exports = model;