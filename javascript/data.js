
var searchParams = new URLSearchParams(document.location.search);
var cards = {
    positiveMaxIndex: -1,
    negativeMaxIndex: -1,
    positive: [],
    negative: []
}

function reflectChanges() {
    if(autosaveEnabled) {
        saveFile();
    }
}

function calculateTimeDiff(element) {

    if(element == null) {
        element = document.getElementById("last-save");
    }

    if(element != null) {

        if(!file.lastSave) {
            return;
        }

        var current = new Date(),
            diffMin = Math.floor((current.getTime() - file.lastSave.getTime()) / 60000);

        if(diffMin == 0) {
            if(autosaveEnabled) {
                element.innerHTML = "AutoSave Enabled (updated less than a minute ago)";
            } else {
                element.innerHTML = "Saved less than a minute ago";
            }
        } else if(diffMin > 60) {
            if(autosaveEnabled) {
                element.innerHTML = "AutoSave Enabled (updated over an hour ago)";
            } else {
                element.innerHTML = "Saved over an hour ago";
            }
        } else{
            if(autosaveEnabled) {
                element.innerHTML = `AutoSave Enabled (updated ${diffMin} minute${diffMin > 1? "s": ""} ago)`;
            } else {
                element.innerHTML = `Saved ${diffMin} minute${diffMin > 1? "s": ""} ago`;
            }
        }
            
    }

}

window.setInterval(calculateTimeDiff, 1000);

function updateFooter(text, filename, resetLastSave) {
    var footer = document.querySelector("footer");
    if(text == null) {

        if(filename == null) {
            footer.innerHTML = "Not Saved";
            return;
        }

        var filenameDiv = document.createElement("div"),
            timestampDiv = document.createElement("div");

        timestampDiv.id = "last-save";

        filenameDiv.innerHTML = "File: " + filename.substring(0, filename.lastIndexOf(".json"));

        if(resetLastSave) {
            file.lastSave = new Date();
            if(autosaveEnabled) {
                timestampDiv.innerHTML = "AutoSave Enabled (updated less than a minute ago)";
            } else {
                timestampDiv.innerHTML = "Saved less than a minute ago";
            }
        } else {
            calculateTimeDiff(timestampDiv);
        }

        footer.innerHTML = "";
        footer.append(filenameDiv, timestampDiv);
    } else {
        footer.innerHTML = text;
    }

}

function setData(data, save) {
    cards = JSON.parse(data);
    loadCards();

    if(save)
        reflectChanges();
}

function loadData() {
    var urlInput = document.querySelector("#data-url");
    var string = urlInput.value;

    try {
        cards = JSON.parse(string);
    } catch (e) {
        return;
    }
    
    loadCards();

    urlInput.parentElement.parentElement.style.display = "none";


}

function copy() {

    var input = document.createElement("textarea"),
        string = JSON.stringify(cards, null, "\t");

    input.innerHTML = string;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    return string;

}

// A new card
function appendCard(column) {
    var index = ++cards[column + "MaxIndex"];
    cards[column].push({i: index});

    appendCardToDOM(index, column, false);

    reflectChanges();
}

function getCardIndex(card) {
    return parseInt(card.getAttribute("data-index"));
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

    cards[column + "MaxIndex"]--;
    while(i < cards[column].length) {
        cards[column][i].i--;
        var element = document.querySelector(`#${column} .card[data-index='${i + 1}']`);
        if(element) {
            element.setAttribute("data-index", i);
        }
        i++;
    }

    reflectChanges();
}

function clearColumn(column) {
    [...document.querySelectorAll(`#${column} .card`)].forEach(card => {
        deleteCard(column, card);
    });
}
