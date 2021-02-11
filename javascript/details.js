function addDetailsInput(column, card, div, headingText, propName) {
    var heading = document.createElement("h3"),
        input = document.createElement("input"),
        i = getCardIndex(card),
        props = cards[column][i];

    heading.innerHTML = headingText;

    if(props[propName] != null) {
        input.value = props[propName];
    }

    input.addEventListener("input", function() {
        updateCard(column, card, propName, this.value);
    });

    div.appendChild(heading);
    div.appendChild(input);

    return input;
}

function addDetailsField(column, card, div, headingText, propName) {
    var heading = document.createElement("h3"),
        textarea = document.createElement("textarea"),
        i = getCardIndex(card),
        props = cards[column][i];

    if(propName == "a") {
        heading.innerHTML = "<img class=\"lightning\" src=\"lightning.svg\">";
    }
    heading.innerHTML += headingText;

    if(props[propName] != null) {
        textarea.innerHTML = props[propName];
    }

    textarea.addEventListener("input", function() {
        if(propName == "a") {
            if(this.value != null && this.value.trim() != "") {
                card.classList.add("has-actions");
            } else {
                card.classList.remove("has-actions");
            }
        }
        updateCard(column, card, propName, this.value);
    });

    div.appendChild(heading);
    div.appendChild(textarea);

    return textarea;
}

function showDetails(column, card) {

    var modal = document.querySelector("#details-modal"),
        mainDiv = modal.querySelector(".modal-content div");

    mainDiv.innerHTML = "";

    var sprintInput = addDetailsInput(column, card, mainDiv, "Sprint", "s");

    if(column == "positive") {
        modal.style.setProperty("--background-color", "hsl(88, 52%, 94%)");
        modal.style.setProperty("--border-color", "hsl(88, 52%, 64%)");

        addDetailsField(column, card, mainDiv, "Comments", "m");

    } else if(column == "negative") {
        modal.style.setProperty("--background-color", "hsl(351, 100%, 96%)");
        modal.style.setProperty("--border-color", "hsl(351, 100%, 86%)");

        addDetailsField(column, card, mainDiv, "Action Items", "a");
        addDetailsField(column, card, mainDiv, "Comments", "m");

    }

    sprintInput.size = 3;
    sprintInput.maxLength = 3;
    sprintInput.style.verticalAlign = "top";

    var sprintLabel = sprintInput.previousElementSibling;
    sprintLabel.style.display = "inline";
    sprintLabel.style.marginRight = "10px";

    openModal();
}

function openModal() {
    var detailsModal = document.querySelector("#details-modal");

    animateCSS(detailsModal.querySelector(".modal-content"), "backInUp",
        () => detailsModal.querySelector("input, textarea").focus());
    detailsModal.style.display = "flex";
}

function closeModal() {
    var detailsModal = document.querySelector("#details-modal");

    animateCSS(detailsModal.querySelector(".modal-content"), "backOutDown", 
        () => detailsModal.style.display = "none");
}