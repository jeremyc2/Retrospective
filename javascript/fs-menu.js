var hasFSAccess = 'chooseFileSystemEntries' in window ||
    'showOpenFilePicker' in window;

if(!hasFSAccess) {
  alert("Please enable File System Access to save your work.\n" + 
    "chrome://flags/#native-file-system-api");
}

var autosaveEnabled = false;
var file = {};

function enableAutosave() {
  autosaveEnabled = document.getElementById("autosave").checked = true;
}

function disableAutosave() {
  autosaveEnabled = document.getElementById("autosave").checked = false;
}

function toggleAutosave() {

  var checked = document.getElementById("autosave").checked;

  // Let's do the initial save
  if(!checked) {
    saveFile();
  }

  // The checkbox will not be toggled until after this function call
  autosaveEnabled = !checked;

}

function getText() {
  return JSON.stringify(cards);
}

function setFile(fileHandle, lastModified) {
  if (fileHandle && fileHandle.name) {
    file.handle = fileHandle;
    file.name = fileHandle.name;
  } else {
    file.handle = null;
    file.name = fileHandle;
  }

  document.title = file.name.substring(0, file.name.lastIndexOf(".json"));

  if(lastModified != null) {
    file.lastSave = lastModified;
  }
  updateFooter(null, file.name, false);
};

/**
 * Creates an empty notepad with no details in it.
 */
var newFile = () => {
    cards.positive = [];
    cards.negative = [];
    cards.positiveMaxIndex =  -1,
    cards.negativeMaxIndex = -1,

    loadCards();
    document.title = defaultTitle;
    updateFooter("Not Saved");

    file = {};

    if(autosaveEnabled) {
      saveFile();
    }

};


/**
 * Opens a file for reading.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
var openFile = async (fileHandle) => {

  // If a fileHandle is provided, verify we have permission to read/write it,
  // otherwise, show the file open prompt and allow the user to select the file.
  if (fileHandle) {
    if (await verifyPermission(fileHandle, true) === false) {
      console.error(`User did not grant permission to '${fileHandle.name}'`);
      alert(`Please grant read/write permission to '${fileHandle.name}'`);
      return;
    }
  } else {
    try {
      fileHandle = await getFileHandle();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      const msg = 'An error occured trying to open the file.';
      console.error(msg, ex);
      alert(msg);
    }
  }

  if (!fileHandle) {
    return;
  }
  const file = await fileHandle.getFile();
  read(file, fileHandle);
};

/**
 * Read the file from disk.
 *
 *  @param {File} file File to read from.
 *  @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
var read = async (file, fileHandle) => {
  try {
    setData(await readFile(file), false);
    setFile(fileHandle || file.name, new Date(file.lastModified));
    addRecent(fileHandle);
  } catch (ex) {
    const msg = `An error occured reading ${file.name}`;
    console.error(msg, ex);
    alert(msg);
  }
  // Autosave by default
  enableAutosave();
};

var saveList = {promise: Promise.resolve(), length: 0};
var saveFile = async () => {
  const i = saveList.length++;

  // Saving is part of a promise chain since we can't
  // save the same file more than once at the same time
  // or we get collisions. And we can't inturrupt a save.
  // If it is already saving, let it finish and then save again.
  saveList.promise = saveList.promise.then(async () => {

    // Skip this save if there is a more recent save in the queue.
    if(i < saveList.length - 1) {
      console.log("Skipping save")
      return;
    }

    return new Promise(async (resolve) => {
      await saveFileAsync();
      resolve();
    }).catch(reason => console.error(reason));

  });
}

/**
 * Saves a file to disk.
 */
var saveFileAsync = async () => {
  try {
    if (!file.handle) {
      return await saveFileAs();
    }
    updateFooter("Saving...");
    await writeFile(file.handle, getText());
  } catch (ex) {
    var msg;
    // InvalidStateError
    if(ex.code == 11) {
      msg = 'Error: Saves are ovewriting other saves.';
      console.error("Invalid State Error:", ex.message);
    } else {
      msg = 'Unable to save file.';
      console.error(msg, ex);
    }
    disableAutosave();
    if(msg != null) {
      alert(msg);
    }
    updateFooter(null, file.name, false);
  }
};

/**
 * Saves a new file to disk.
 */
var saveFileAs = async () => {
  updateFooter("Saving...");
  let fileHandle;
  try {
    fileHandle = await getNewFileHandle();
  } catch (ex) {
    if (ex.name === 'AbortError') {
      disableAutosave();
      updateFooter(null, file.name, false);
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    disableAutosave();
    alert(msg);
    updateFooter(null, file.name, false);
    return;
  }
  try {
    await writeFile(fileHandle, getText());
    setFile(fileHandle);
  } catch (ex) {
    const msg = 'Unable to save file.';
    console.error(msg, ex);
    disableAutosave();
    alert(msg);
    updateFooter(null, file.name, false);
    return;
  }
  // Autosave by default
  enableAutosave();
};