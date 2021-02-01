var searchParams = new URLSearchParams(document.location.search);
var cards = {
    positive: [],
    negative: []
}

if(searchParams.has("a")) {
    cards = JSON.parse(searchParams.get("a"));
}

function updateURL() {

    var params = new URLSearchParams();
    params.append("a", JSON.stringify(cards));

    // Shorten the param so we don't run out of space
    var string = params.toString();
    string = string.replaceAll("%22", "\"");
    string = string.replaceAll("%7B", "{");
    string = string.replaceAll("%7D", "}");
    string = string.replaceAll("%5B", "[");
    string = string.replaceAll("%5D", "]");
    string = string.replaceAll("%2C", ",");
    string = string.replaceAll("%3A", ":");

    history.replaceState({}, "", `?${string}`);

    var percent = document.location.search.length / 8203 * 100;
    var percentString = `${percent}`.substring(0, `${percent}`.lastIndexOf(".") + 3) + "%";

    if(percent > 100) {
        alert(`Storage limit exceeded. Currently at ${percentString} capacity.`);
    }

    console.log(`Currently at ${percentString} capacity`);

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