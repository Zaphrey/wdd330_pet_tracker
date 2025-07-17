const pool = require("../database/db");
const model = {};

model.createVaccinatedEntryFromPetVaccineDate = async function(petId, vaccineId, date) {
    try {
        return await pool.query(`INSERT INTO public.vaccinated 
                                (vaccinated_date, vaccine_id, pet_id) 
                                VALUES ($1, $2, $3)`, [date, vaccineId, petId]);
    } catch(error) {
        return error.message
    }
}

model.getVaccinatedEntriesFromPet = async function(petId) {
    try {
        return await pool.query("SELECT * FROM public.vaccinated LEFT JOIN public.vaccine ON public.vaccinated.vaccine_id = public.vaccine.vaccine_id WHERE public.vaccinated.pet_id = $1", [petId]);
    } catch(error) {
        return error.message
    }
}

model.deleteVaccinatedEntry = async function(vaccinatedId) {
    try {
        return await pool.query("DELETE FROM public.vaccinated WHERE vaccinated_id = $1", [vaccinatedId]);
    } catch(error) {
        return error.message
    }
}

model.deleteAllVaccinatedEntriesFromPet = async function(petId) {
    try {
        return await pool.query("DELETE FROM public.vaccinated WHERE pet_id = $1", [petId]);
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
}

module.exports = model;