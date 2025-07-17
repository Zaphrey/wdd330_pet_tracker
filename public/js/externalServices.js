
export async function getUserPets(userToken) {
    try {
        const response = await fetch("/pets/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ userToken }`
            }
        })
    
        if (response.ok) {
            const result = await response.json();
            return result;
        }

        throw new Error("Invalid response " + response.status);
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
};

export async function removeUserPet(userToken, petId) {
    try {
        console.log("/pets/" + petId)
        const response = await fetch("/pets/" + petId, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${ userToken }`
            }
        })
    
        if (response.ok) {
            const result = await response.json();
            console.log(result)
            return result;
        }

        throw new Error("Invalid response " + response.status);
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
};

export async function createUserPet(userToken, petForm) {
    // let req = new XMLHttpRequest();
    const options = {
        method: "POST",
        headers: {
            // "Content-Type": "multipart/formdata",
            "Authorization": `Bearer ${userToken}`,
        },
        body: petForm,
    };

    const response = await fetch("/pets/add", options);

    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

export async function getAllVaccines() {
    const response = await fetch("/vaccine/all");

    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

export async function getVaccinationsForPet(userToken, petId) {
    const options = {
        method: "GET",
        headers: {
            // "Content-Type": "multipart/formdata",
            "Authorization": `Bearer ${userToken}`,
        },
    };

    const response = await fetch("/pets/" + petId + "/vaccines", options);

    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

export async function updateUserPet(userToken, petId, petForm) {
    // let req = new XMLHttpRequest();
    const options = {
        method: "PUT",
        headers: {
            // "Content-Type": "multipart/formdata",
            "Authorization": `Bearer ${userToken}`,
        },
        body: petForm,
    };

    console.log(options)

    const response = await fetch(`/pets/update/${Number.parseInt(petId)}`, options);

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
    }
}