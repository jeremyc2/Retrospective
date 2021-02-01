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

    heading.innerHTML = headingText;

    if(props[propName] != null) {
        textarea.innerHTML = props[propName];
    }

    textarea.addEventListener("input", function() {
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

    animateCSS(detailsModal.querySelector(".modal-content"), "backInUp");
    detailsModal.style.display = "flex";
}

function closeModal() {
    var detailsModal = document.querySelector("#details-modal");

    animateCSS(detailsModal.querySelector(".modal-content"), "backOutDown", 
        () => detailsModal.style.display = "none");
}

// Append new card that already exists in "cards" to the DOM
function appendCardToDOM(column, initialLoad) {

    var card = document.createElement("div"),
        textarea = document.createElement("textarea"),
        cardActions = document.createElement("div"),
        deleteButton = document.createElement("button"),
        detailsButton = document.createElement("button");

    card.classList.add("card");
    cardActions.classList.add("card-actions");
    deleteButton.classList.add("delete", "card-action");
    detailsButton.classList.add("open-details", "card-action");
    
    deleteButton.innerHTML = "remove";
    detailsButton.innerHTML = "details";

    if(initialLoad == false) {
        card.classList.add("expand");
        card.addEventListener('animationend', () => {
            card.classList.remove("expand");
        }, {once: true});
    }

    textarea.addEventListener("input", function() {
        updateCard(column, this.parentElement, "c", this.value);
    });

    deleteButton.addEventListener("click", function() {
        deleteCard(column, this.parentNode.parentNode);
    });

    detailsButton.addEventListener("click", function() {
        showDetails(column, this.parentNode.parentNode);
    });

    container = document.querySelector(`#${column} .cards`)

    // Fill in props
    var props = cards[column][container.querySelectorAll(".card").length];
    if(props.c != null) {
        textarea.value = props.c;
    }

    // Add one more for negative columns
    if(column == "negative") {
        var resolvedIcon = document.createElement("div");
        resolvedIcon.classList.add("resolved");
        if(props.r != null && props.r != false) {
            resolvedIcon.classList.toggle("active");
        }
        resolvedIcon.addEventListener("click", function() {
            this.classList.toggle("active");
            updateCard(column, card, "r", this.classList.contains("active"));
        });
        card.append(resolvedIcon);
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(textarea, cardActions);

    container.insertBefore(card, container.firstElementChild);

    if(initialLoad == false) {
        textarea.focus();
    }

    return card;

}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".modal-content").addEventListener("click", function(e) {
        e.stopPropagation();
    });

    var i = 0;
    cards.positive.forEach(() => {
        appendCardToDOM('positive', true);
        i++;
    });

    i = 0;
    cards.negative.forEach(() => {
        appendCardToDOM('negative', true);
        i++;
    });

    document.addEventListener('keydown', function(e) {
        if(e.code == "Escape") {
            if(document.querySelector("#details-modal").style.display == "flex") {
                closeModal();
            }
        }
    });
});
