document.addEventListener("DOMContentLoaded", async function() {

    var recentsButton = document.getElementById("butRecents");

    var filenames = await keys();
    filenames.forEach(filename => {
        var button = document.createElement("div");
        button.innerHTML = filename; 

        button.addEventListener("click", function() {
            openFile(await get(this.innerHTML));
        });

        recentsButton.querySelector("div").appendChild(button);
    });
});