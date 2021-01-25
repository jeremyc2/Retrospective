function showDetails(column, card) {

    // TODO SWITCH COLORS AND LOGIC 


    var modalContent = document.querySelector("#details-modal .modal-content"),
        i = getCardIndex(card),
        props = cards[column][i];

    if(column == "positive") {
        modalContent.style.backgroundColor = "hsl(88, 52%, 94%)";

        var mainDiv = modalContent.querySelector("div"),
            heading = document.createElement("h3"),
            textArea = document.createElement("textarea");

        mainDiv.innerHTML = "";
        heading.innerHTML = "Action Items";

        if(props.actions != null) {
            textArea.innerHTML = props.actions;
        }

        textArea.style.borderColor = "hsl(88, 52%, 84%)";

        mainDiv.appendChild(heading);
        mainDiv.appendChild(textArea);

    } else if(column == "negative") {
        modalContent.style.backgroundColor = "hsl(351, 100%, 96%)";
        modalContent.querySelector("textarea").style.borderColor = "hsl(351, 100%, 86%)";
    }

    openModal();
}

function openModal() {
    var detailsModal = document.querySelector("#details-modal");

    animateCSS(detailsModal.querySelector(".modal-content"), "backInUp");
    detailsModal.style.display = "block";
}

function closeModal() {
    var detailsModal = document.querySelector("#details-modal");

    animateCSS(detailsModal.querySelector(".modal-content"), "backOutDown", 
        () => detailsModal.style.display = "none");
}

// Append new card that already exists in "cards" to the DOM
function appendCardToDOM(column) {

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

    textarea.addEventListener("input", function() {
        updateCard(column, this.parentElement, "content", this.value);
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
    if(props.content != null) {
        textarea.value = props.content;
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(textarea, cardActions);

    container.append(card);

    return card;

}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".modal-content").addEventListener("click", function(e) {
        e.stopPropagation();
    });

    var i = 0;
    cards.positive.forEach(() => {
        appendCardToDOM('positive', i++);
    });

    i = 0;
    cards.negative.forEach(() => {
        appendCardToDOM('negative', i++);
    });
});
