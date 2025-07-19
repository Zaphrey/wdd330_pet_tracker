const jwtName = "so-token";

export function getUserTokenFromStorage() {
    const jwt = localStorage.getItem(jwtName);
    return jwt;
}

export function  processPetFormData(form) {
    let formData = new FormData(form);
    
    let vaccineCount = 0;
    let dateCount = 0;

    let formattedFormData = new FormData();

    formData.forEach((value, key) => {
        if (key == "vaccine") {
            vaccineCount++;
            formattedFormData.set(`vaccine[${ vaccineCount }]`, value);
        } else if (key == "vaccinated_date") {
            dateCount++;
            formattedFormData.set(`vaccinated_date[${ dateCount }]`, value);
        } else {
            formattedFormData.set(key, value);
        }
    })
    console.log(formattedFormData, "FORMATTED DATA")
    return formattedFormData
}

export function createVaccineEntry(vaccineList, vaccineId, vaccinatedDate, elementClass) {
    let html = `<div class="${elementClass}"><label>Vaccine<select name="vaccine" id="vaccine" required>`
    
    vaccineList.forEach((vaccine, index) => {
        html += `<option ${index == vaccineId && "selected" || ""} value="${vaccine.vaccine_id}">${vaccine.vaccine_name}</option>`;
    });

    html += "</select></label>";

    html += `<label>Administered<input id="vaccinated_date" name="vaccinated_date" ${ vaccinatedDate && `value="${vaccinatedDate}"` || ""} type="date" required></label>
        <button class="delete-vaccine-button" type="button" aria-label="vaccine delete button">
                <span class="material-symbols-outlined">
                    delete
                </span>
        </button>
    </div>`

    return html;
}

export function validateImageExtension(file) {
    let allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    let fileExtension = file.name.split(".").pop().toLowerCase();

    return allowedExtensions.some(extension => fileExtension == extension);
}

export function validateImageSize(file) {
    let maxSize = 8000000 // 8mb
    return file.size <= maxSize;
}

export function convertFormDataToJson(form) {
    let formData = new FormData(form);
    let convertedJson = {};

    formData.forEach((value, key) => {
        convertedJson[key] = value;
    });

    return convertedJson;
}