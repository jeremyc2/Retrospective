var searchParams = new URLSearchParams(document.location.search);
var cards = {
    positive: searchParams.getAll("positiveCard").map(
        card => JSON.parse(card)
    ),
    negative: searchParams.getAll("negativeCard").map(
        card => JSON.parse(card)
    )
}

function appendCard(column, props) {
    cards[column].push(props);
}

function appendCardToDOM(column, props) {

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

    deleteButton.addEventListener("click", function() {
        var card = this.parentNode.parentNode;
        card.parentNode.removeChild(card);
    });

    // Fill in props
    if(props != null) {
        if(props.content != null) {
            textarea.value = props.content;
        }
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(textarea, cardActions);

    document.querySelector(`#${column} .cards`).append(card);

    return card;

}

document.addEventListener("DOMContentLoaded", () => {
    cards.positive.forEach(card => {
        appendCardToDOM('positive', card);
    });

    cards.negative.forEach(card => {
        appendCardToDOM('negative', card);
    });
});