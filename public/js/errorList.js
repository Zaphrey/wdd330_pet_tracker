export default class ErrorList {
    constructor(listElement) {
        this.animationPlayed = false
        this.errors = [];
        this.listElement = listElement;
    }

    addError(error) {
        this.errors.push(`<li ${this.animationPlayed && "class=\"no-animate\""}>${ error }</li>`);
    }

    addErrorArray(errorList) {
        errorList.forEach(error => {
            this.addError(error.msg);
        })
    }

    clearErrors() {
        this.errors = [];
    }

    showErrors() {
        this.listElement.innerHTML = "";
        this.listElement.classList.add("no-animate");
    
        this.errors.forEach(error => {
            this.listElement.insertAdjacentHTML("afterbegin", error);
        })

        this.animationPlayed;
        this.clearErrors();
    }

    hideErrors() {
        this.listElement.innerHTML = "";
        this.animationPlayed = false;
        this.listElement.classList.remove("no-animate");
    }
}