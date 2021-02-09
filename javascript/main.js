var isFullscreen = false;

function enableFullscreen() {
    document.documentElement.requestFullscreen();
}

function disableFullscreen() {
    document.exitFullscreen();
}

function toggleFullscreen() {
    if(isFullscreen) {
        disableFullscreen();
    } else {
        enableFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    console.log("Fullscreen change")
    if(document.fullscreenElement) {
        // Is fullscreen
        document.querySelector("header").style.display = "none";
        [...document.querySelectorAll(".container")].forEach(el => {
            el.style.height = "calc(100vh - 67px)";
        });
        document.querySelector(".fullscreen").src = "exit-fullscreen.svg";
        isFullscreen = true;
    } else {
        // Is not fullscreen
        document.querySelector("header").style.display = "block";
        [...document.querySelectorAll(".container")].forEach(el => {
            el.style.height = "calc(100vh - 108px)";
        });
        document.querySelector(".fullscreen").src = "fullscreen.svg";
        isFullscreen = false;
    }
});

// Append new card that already exists in "cards" to the DOM
function appendCardToDOM(index, column, initialLoad) {

    var card = document.createElement("div"),
        content = document.createElement("div"),
        cardActions = document.createElement("div"),
        deleteButton = document.createElement("button"),
        detailsButton = document.createElement("button");

    card.classList.add("card");
    content.classList.add("content");
    cardActions.classList.add("card-actions");
    deleteButton.classList.add("delete", "card-action");
    detailsButton.classList.add("open-details", "card-action");

    if(index > cards[column + "MaxIndex"]) {
        cards[column + "MaxIndex"] = index;
    }

    card.setAttribute("data-index", index);
    content.setAttribute("contenteditable","");
    
    deleteButton.innerHTML = "remove";
    detailsButton.innerHTML = "details";

    if(initialLoad == false) {
        card.classList.add("expand");
        card.addEventListener('animationend', () => {
            card.classList.remove("expand");
        }, {once: true});
    }

    content.addEventListener("input", function() {
        updateCard(column, this.parentElement, "c", this.innerHTML);
    });

    deleteButton.addEventListener("click", function() {
        deleteCard(column, this.parentNode.parentNode);
    });

    detailsButton.addEventListener("click", function() {
        showDetails(column, this.parentNode.parentNode);
    });

    container = document.querySelector(`#${column} .cards`);

    // Fill in props
    var props = cards[column][index];

    if(props == null)
        debugger

    if(props.c != null) {
        content.innerHTML = props.c;
    }

    var resolved = props.r != null && props.r != false;

    // Add one more for negative columns
    if(column == "negative") {
        var resolvedIcon = document.createElement("div");
        resolvedIcon.classList.add("resolved");
        if(resolved) {
            resolvedIcon.classList.toggle("active");
        }
        resolvedIcon.addEventListener("click", function() {
            this.classList.toggle("active");
            updateCard(column, card, "r", this.classList.contains("active"));
        });
        card.append(resolvedIcon);
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(content, cardActions);

    if(column == "negative") {
        if(resolved) {
            var topResolved = container.querySelector(".resolved.active"),
                el = topResolved? topResolved.parentElement: container.lastElementChild;
            container.insertBefore(card, el);
        } else {
            var topResolved = container.querySelector(".resolved:not(.active)"),
                el = topResolved? topResolved.parentElement: container.firstElementChild;
            container.insertBefore(card, el);
        }
    } else {
        container.insertBefore(card, container.firstElementChild)
    }

    if(initialLoad == false) {
        content.focus();
    }

    return card;

}

function loadCards() {

    [...document.querySelectorAll(`#positive .card`)].forEach(card => {
        card.parentNode.removeChild(card);
    });

    [...document.querySelectorAll(`#negative .card`)].forEach(card => {
        card.parentNode.removeChild(card);
    });

    cards.positive.forEach(card => {
        appendCardToDOM(card.i, 'positive', true);
    });

    cards.negative.forEach(card => {
        appendCardToDOM(card.i, 'negative', true);
    });

}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".modal-content").addEventListener("click", function(e) {
        e.stopPropagation();
    });

    if(searchParams.has("load")) {
        document.querySelector("#load-data").style.display = "block";
    }

    loadCards();

    document.addEventListener('keydown', function(e) {
        if(e.code == "Escape") {
            if(document.querySelector("#details-modal").style.display == "flex") {
                closeModal();
            }
        } else if (e.altKey && e.key == 'n') {
            newFile();
            e.preventDefault();
        } else if (e.ctrlKey && e.key == 'o') {
            openFile();
            e.preventDefault();
        } else if (e.ctrlKey && e.key == 's') {
            saveFile();
            e.preventDefault();
        } else if (e.altKey && e.key == 'c') {
            copyURL();
            e.preventDefault();
        } else if (e.altKey && e.key == 'f') {
            toggleFullscreen();
            e.preventDefault();
        }
    });
});
