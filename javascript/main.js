function showDetails() {
    // TODO
    document.querySelector("#").classList.add("hide");
}

function closeModal() {
    document.querySelector("#").classList.remove("hide");
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
        showDetails();
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
    var i = 0;
    cards.positive.forEach(() => {
        appendCardToDOM('positive', i++);
    });

    i = 0;
    cards.negative.forEach(() => {
        appendCardToDOM('negative', i++);
    });
});
