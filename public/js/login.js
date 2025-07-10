const form = document.forms[0];
const button = form.querySelector("button");

button.addEventListener("click", async e =>  {
    e.preventDefault();

    let search = new URLSearchParams(window.location.search);
    let redirect = search.get("redirect");

    let formData = new FormData(form);
    let convertedJson = {};

    formData.forEach((value, key) => {
        convertedJson[key] = value;
    });

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedJson),
    };

    const response = await fetch(`/account/login`, options);
    console.log(response)
    const result = await response.json();
    
    if (response.ok && response.status === 202) {
        localStorage.setItem("so-token", result.accessToken);
        
        if (redirect) {
            window.location.href = redirect;
        };
    } else {
        console.log(result) 
    };
});