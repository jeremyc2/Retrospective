document.addEventListener("DOMContentLoaded", async function() {

    var recentsButton = document.getElementById("butRecents");

    var filenames = await keys();
    filenames.forEach(filename => {
        var button = document.createElement("div");
        button.innerHTML = filename; 

        button.addEventListener("click", async function() {
            var handle = await get(this.innerHTML);
            openFile(handle);
        });

        recentsButton.querySelector("div").appendChild(button);
    });
});