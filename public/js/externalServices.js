
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
}