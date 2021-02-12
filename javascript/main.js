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
        document.querySelector(".fullscreen img").src = "exit-fullscreen.svg";
        isFullscreen = true;
    } else {
        // Is not fullscreen
        document.querySelector("header").style.display = "flex";
        [...document.querySelectorAll(".container")].forEach(el => {
            el.style.height = "calc(100vh - 120px)";
        });
        document.querySelector(".fullscreen img").src = "fullscreen.svg";
        isFullscreen = false;
    }
});

function insertBefore(column, resolved, container, card) {
    if(column == "negative") {
        if(resolved) {
            var resolvedArray = [...container.querySelectorAll(".resolved.active")].map(x => x.parentElement);;
            if(resolvedArray.length == 0) {
                container.insertBefore(card, container.lastElementChild);
                return;
            }
            resolvedArray = resolvedArray.sort((a, b) => {
                return getCardIndex(b) - getCardIndex(a);
            });
            var el = resolvedArray.find((el) => {
                return getCardIndex(el) < getCardIndex(card);
            }) || container.lastElementChild;
            container.insertBefore(card, el);
        } else {
            var resolvedArray = [...container.querySelectorAll(".resolved:not(.active)")].map(x => x.parentElement);
            if(resolvedArray.length == 0) {
                container.insertBefore(card, container.firstElementChild);
                return;
            }
            resolvedArray = resolvedArray.sort((a, b) => {
                return getCardIndex(b) - getCardIndex(a);
            });
            var el = resolvedArray.find((el) => {
                return getCardIndex(el) < getCardIndex(card);
            }) || resolvedArray[resolvedArray.length - 1].nextElementSibling;
            container.insertBefore(card, el);
        }
    } else {
        container.insertBefore(card, container.firstElementChild)
    }

}

// Append new card that already exists in "cards" to the DOM
function appendCardToDOM(index, column, isNewCard) {

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

    card.setAttribute("data-index", index);
    content.setAttribute("contenteditable","");
    
    deleteButton.innerHTML = "remove";
    detailsButton.innerHTML = "details";

    if(isNewCard == false) {
        card.classList.add("expand");
        card.addEventListener('animationend', () => {
            card.classList.remove("expand");
        }, {once: true});
    }

    content.addEventListener("input", function() {
        updateCard(column, this.parentElement, "c", this.innerHTML);
    });

    deleteButton.addEventListener("click", function() {
        var card = this.parentNode.parentNode;
        card.classList.add("fly-left");

        card.addEventListener('animationend', () => {
            deleteCard(column, card);
        }, {once: true});
    });

    detailsButton.addEventListener("click", function() {
        showDetails(column, this.parentNode.parentNode);
    });

    container = document.querySelector(`#${column} .cards`);

    // Fill in props
    var props = cards[column][index];

    if(props.c != null) {
        content.innerHTML = props.c;
    }
    if(props.a != null && props.a.trim() != ""){
        card.classList.add("has-actions");
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
            this.style.display = "none";
            
            var element = this.parentElement;
                container = element.parentElement,
                resolved = this.classList.contains("active");

            element.style.height = element.getBoundingClientRect().height;
            element.style.overflow = "hidden";

            element.classList.add("close-out");
            element.addEventListener('animationend', () => {
                element.classList.remove("close-out");
                container.removeChild(element);
                insertBefore("negative", resolved, container, element);
                element.style.height = "";
                element.style.overflow = "";
                this.style.display = "";
            }, {once: true});

            updateCard(column, card, "r", resolved);
        });
        card.append(resolvedIcon);
    }

    cardActions.append(deleteButton, detailsButton);
    card.append(content, cardActions);

    insertBefore(column, resolved, container, card);

    if(isNewCard == false) {
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
        cards.positiveMaxIndex = card.i;
        appendCardToDOM(card.i, 'positive', true);
    });

    cards.negative.forEach(card => {
        cards.positiveMaxIndex = card.i;
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
