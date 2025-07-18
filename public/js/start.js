const main = document.querySelector("main");
main.classList.add("hide");

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        main.classList.add("fade-in");
        main.classList.remove("hide");
    }
}