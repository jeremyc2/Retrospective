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
            });
    
            recentsListElement.appendChild(button);
        });
    });

});