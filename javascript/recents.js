var recentFiles;

async function addRecent(fileHandle) {
    // If isSameEntry isn't available, we can't store the file handle
    if (!fileHandle.isSameEntry) {
        console.warn('Saving of recents is unavailable.');
        return;
    }

    recentFiles = await Promise.all(recentFiles.map((f) => {
        return fileHandle.isSameEntry(f).then((same) => !same? f: false);
    }));
    recentFiles = recentFiles.filter(handle => handle);

    // Add the new file handle to the top of the list, and remove any old ones.
    recentFiles.unshift(fileHandle);

    if (recentFiles.length > 6) {
        recentFiles.pop();
    }

    // Save the list of recent files.
    set('recentFiles', recentFiles);
};

async function buildMenu() {

    var recentsButton = document.getElementById("butRecents");
    recentFiles = await get('recentFiles') || [];

    recentsButton.addEventListener("mouseenter", async function() {

        var recentsListElement = recentsButton.querySelector("div");
        recentsListElement.innerHTML = "";

        recentFiles.slice(1, recentFiles.length).forEach(handle => {
            var button = document.createElement("div");
            button.innerHTML = handle.name; 

            button.addEventListener("click", async function() {
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
            recentFiles = file == {} || recentFiles[0] != null? [recentFiles[0]]: [];
            set('recentFiles', recentFiles);
            recentsListElement.innerHTML = "";
        }
        recentsListElement.appendChild(clearRecents);

    });

}

document.addEventListener("DOMContentLoaded", buildMenu);