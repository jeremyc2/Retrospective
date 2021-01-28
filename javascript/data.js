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
        appendCardToDOM(column, false);
    }

    updateURL();
}

function getCardIndex(card) {
    var sibling = card,
        i = 0;
    while( (sibling = sibling.nextElementSibling) != null ) {
        if(sibling.classList.contains("card")) {
            i++;
        }
    }

    return i;
}

function updateCard(column, card, field, value) {
    var i = getCardIndex(card);

    var props = cards[column][i];
    props[field] = value;

    updateURL();
}

function deleteCard(column, card) {
    var i = getCardIndex(card);

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