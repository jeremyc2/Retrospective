var state = new State(document.location.search);

document.addEventListener("DOMContentLoaded", () => {
    console.log(state.getAll("positive"));
    console.log(state.getAll("negative"));
    
});