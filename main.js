var searchParams = new URLSearchParams(document.location.search);
var cards = {
    positive: searchParams.getAll("positiveCard").map(
        card => JSON.parse(card)
    ),
    negative: searchParams.getAll("negativeCard").map(
        card => JSON.parse(card)
    )
}

function updateURL() {

    var params = new URLSearchParams();
    cards.positive.forEach(card => {
        params.append("positiveCard", JSON.stringify(card));
    });
    cards.negative.forEach(card => {
        params.append("negativeCard", JSON.stringify(card));
    });

    history.replaceState({}, "", `?${params.toString()}`);
}

// A new card
function appendCard(column, updateDOM, props) {
    cards[column].push(props);

    if(updateDOM != null && updateDOM == true) {
        appendCardToDOM(column);
    }

    updateURL();
}

function updateCard(column, card, field, value) {

    var sibling = card,
        i = 0;
    while( (sibling = sibling.previousElementSibling) != null ) {
        if(sibling.classList.contains("card")) {
            i++;
        }
    }

    var props = cards[column][i];
    props[field] = value;

    updateURL();
}

function deleteCard(column, card) {
    var sibling = card,
        i = 0;
    while( (sibling = sibling.previousElementSibling) != null ) {
        if(sibling.classList.contains("card")) {
            i++;
        }
    }

    card.parentNode.removeChild(card);

    cards[column].splice(i, 1);

    updateURL();
}

function clearColumn(column) {
    cards[column] = [];
    [...document.querySelectorAll(`#${column} .card`)].forEach(card => {
        card.parentNode.removeChild(card);
    });

    updateURL();
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