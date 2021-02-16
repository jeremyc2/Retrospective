var recentFiles = [];

async function addRecent(fileHandle) {
    // If isSameEntry isn't available, we can't store the file handle
    if (!fileHandle.isSameEntry) {
        console.warn('Saving of recents is unavailable.');
        return;
    }

    // Loop through the list of recent files and make sure the file we're
    // adding isn't already there. This is gross.
    const inList = await Promise.all(recentFiles.map((f) => {
        return fileHandle.isSameEntry(f);
    }));
    if (inList.some((val) => val)) {
        return;
    }

    // Add the new file handle to the top of the list, and remove any old ones.
    recentFiles.unshift(fileHandle);
    if (recentFiles.length > 5) {
        recentFiles.pop();
    }

    // Save the list of recent files.
    set('recentFiles', recentFiles);
};

async function buildMenu() {

    var recentsButton = document.getElementById("butRecents");

    recentsButton.addEventListener("mouseenter", async function() {
        var recentFiles = await get('recentFiles') || [];

        var recentsListElement = recentsButton.querySelector("div");
        recentsListElement.innerHTML = "";

        recentFiles.forEach(file => {
            var button = document.createElement("div");
            button.innerHTML = file.name; 

            button.addEventListener("click", async function() {
                openFile(file);
                recentsListElement.innerHTML = "";
            });

            recentsListElement.appendChild(button);
        });

        var clearRecents = document.createElement("div");
        clearRecents.innerHTML = "CLEAR";
        clearRecents.id = "clear-recents";
        clearRecents.onclick = () => {
            clear();
            recentFiles = [];
            recentsListElement.innerHTML = "";
        }
        recentsListElement.appendChild(clearRecents);

    });

}

document.addEventListener("DOMContentLoaded", buildMenu);