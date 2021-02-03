var searchParams = new URLSearchParams(document.location.search);
var cards = {
    positive: [],
    negative: []
}

if(searchParams.has("a")) {
    cards = JSON.parse(searchParams.get("a"));
}

function reflectChanges() {
    if(autosaveEnabled) {
        saveFile();
    }
}

function verifyContentLength(url) {
    var percent = url.length / 8203 * 100;
    var percentString = `${percent}`.substring(0, `${percent}`.lastIndexOf(".") + 3) + "%";

    if(percent > 100) {
        alert(`URL max length exceeded. Currently at ${percentString} capacity.`);
        return false;
    }

    return true;

}

window.setInterval(() => {
    var timestampDiv = document.getElementById("last-save");

    if(timestampDiv != null) {
        var timestamp = parseInt(timestampDiv.getAttribute("data-last-save")),
            old = new Date(timestamp),
            current = new Date(),
            mindif = Math.floor((current.getTime() - old.getTime()) / 60000);

        if(mindif == 0)
            return;
            
        timestampDiv.innerHTML = `Saved ${mindif} minute${mindif > 1? "s": ""} ago`;
    }

}, 1000);

function updateFooter(text) {
    var footer = document.querySelector("footer");
    if(text == null) {
        var filenameDiv = document.createElement("div"),
            timestampDiv = document.createElement("div"),
            time = new Date();

        timestampDiv.id = "last-save";
        timestampDiv.setAttribute("data-last-save", time.valueOf());

        filenameDiv.innerHTML = `Filename: ${file.handle.name}`;
        timestampDiv.innerHTML = "Saved less than a minute ago";

        footer.innerHTML = "";
        footer.append(filenameDiv, timestampDiv);
    } else {
        footer.innerHTML = text;
    }

}

function setData(data) {
    cards = JSON.parse(data);
    loadCards();
    reflectChanges();
}

function loadData() {
    var urlInput = document.querySelector("#data-url");
    var params = new URLSearchParams(urlInput.value.substring(urlInput.value.indexOf("?"), urlInput.length));

    if(params.has("a")) {
        setData(params.get("a"));
    }

    urlInput.parentElement.parentElement.style.display = "none";


}

function condenseURL(string) {

    string = string.replaceAll("%22", "\"");
    string = string.replaceAll("%7B", "{");
    string = string.replaceAll("%7D", "}");
    string = string.replaceAll("%5B", "[");
    string = string.replaceAll("%5D", "]");
    string = string.replaceAll("%2C", ",");
    string = string.replaceAll("%3A", ":");

    return string;
}

function copyURL() {

    var params = new URLSearchParams(window.location.search);
    params.append("a", JSON.stringify(cards));

    var input = document.createElement("textarea"),
        string = condenseURL(window.location.href + `?${params.toString()}`);

    if(verifyContentLength(string)) {

        input.innerHTML = string;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        return string;
        
    }

}

// A new card
function appendCard(column, updateDOM, props) {
    cards[column].push(props);

    if(updateDOM != null && updateDOM == true) {
        appendCardToDOM(column, false);
    }

    reflectChanges();
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

    reflectChanges();
}

function deleteCard(column, card) {
    var i = getCardIndex(card);

    card.parentNode.removeChild(card);

    cards[column].splice(i, 1);

    reflectChanges();
}

function clearColumn(column) {
    cards[column] = [];
    [...document.querySelectorAll(`#${column} .card`)].forEach(card => {
        card.parentNode.removeChild(card);
    });

    reflectChanges();
}