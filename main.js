var searchParams = new URLSearchParams(document.location.search);

function addCard(column) {

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

    cardActions.append(deleteButton, detailsButton);
    card.append(textarea, cardActions);

    document.querySelector(`#${column} .cards`).append(card);

}

document.addEventListener("DOMContentLoaded", () => {
    console.log(state.getAll("positive"));
    console.log(state.getAll("negative"));
    
});