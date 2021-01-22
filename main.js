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
    var index = cards[column].length;
    cards[column].push(props);

    if(updateDOM != null && updateDOM == true) {
        appendCardToDOM(column, index);
    }
}

// Append card that already exists in "cards" to the DOM
function appendCardToDOM(column, index) {

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

        var props = cards[column][index];

        console.log(props, this.value);
        
        props.content = this.value;
    });

    deleteButton.addEventListener("click", function() {
        var card = this.parentNode.parentNode;

        var sibling = card,
            i = 0;
        while( (sibling = child.previousElementSibling) != null ) {
            if(sibling.classList.contains("card")) {
                i++;
            }
        }

        card.parentNode.removeChild(card);

        cards[column] = cards[column].splice(i, 1);
    });

    // Fill in props
    var props = cards[column][index];
    if(props.content != null) {
        textarea.value = props.content;
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(textarea, cardActions);

    document.querySelector(`#${column} .cards`).append(card);

    return card;

}

document.addEventListener("DOMContentLoaded", () => {
    var i = 0;
    cards.positive.forEach(card => {
        appendCardToDOM('positive', i++);
    });

    i = 0;
    cards.negative.forEach(card => {
        appendCardToDOM('negative', i++);
    });
});