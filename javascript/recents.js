document.addEventListener("DOMContentLoaded", async function() {

    var recentsButton = document.getElementById("butRecents");

    recentsButton.addEventListener("mouseenter", async function() {
        var filenames = await keys();

        var recentsListElement = recentsButton.querySelector("div");
        recentsListElement.innerHTML = "";
    
        filenames.reverse().forEach(filename => {
            var button = document.createElement("div");
            button.innerHTML = filename; 
    
            button.addEventListener("click", async function() {
                var handle = await get(this.innerHTML);
                openFile(handle);
                recentsListElement.innerHTML = "";
            });
    
            recentsListElement.appendChild(button);
        });

        var clearRecents = document.createElement("div");
        clearRecents.innerHTML = "CLEAR";
        clearRecents.id = "clear-recents";
        clearRecents.onclick = () => {
            clear();
            recentsListElement.innerHTML = "";
        }
        recentsListElement.appendChild(clearRecents);

    });

});