var hasFSAccess = 'chooseFileSystemEntries' in window ||
    'showOpenFilePicker' in window;

if(!hasFSAccess) {
  alert("Please enable File System Access to save your work.\n" + 
    "chrome://flags/#native-file-system-api");
}

var autosaveEnabled = false;
var file = {};

function toggleAutosave() {

  var checked = document.getElementById("autosave").checked;

  if(!checked && file.fileHandle == null) {
    saveFile();
  }

  // The checkbox will not be toggled until after this function call
  autosaveEnabled = !checked;
}

function getText() {
  return JSON.stringify(cards);
}

function setFile(fileHandle) {
  if (fileHandle && fileHandle.name) {
    file.handle = fileHandle;
    file.name = fileHandle.name;
  } else {
    file.handle = null;
    file.name = fileHandle;
  }
};

/**
 * Creates an empty notepad with no details in it.
 */
var newFile = () => {
    cards.positive = [];
    cards.negative = [];

    loadCards();
    updateURL();

    file = {};

};


/**
 * Opens a file for reading.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
var openFile = async (fileHandle) => {
  console.log("Opening file...");
  if (!hasFSAccess) {
    console.error("No filesystem access in browser");
    return;
  }

  // If a fileHandle is provided, verify we have permission to read/write it,
  // otherwise, show the file open prompt and allow the user to select the file.
  if (fileHandle) {
    if (await verifyPermission(fileHandle, true) === false) {
      console.error(`User did not grant permission to '${fileHandle.name}'`);
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
    setData(await readFile(file));
    setFile(fileHandle || file.name);
  } catch (ex) {
    const msg = `An error occured reading ${fileName}`;
    console.error(msg, ex);
    alert(msg);
  }
};

/**
 * Saves a file to disk.
 */
var saveFile = async () => {
  try {
    if (!file.handle) {
      return await saveFileAs();
    }
    console.log("Saving file...");
    await writeFile(file.handle, getText());
  } catch (ex) {
    const msg = 'Unable to save file';
    console.error(msg, ex);
    alert(msg);
  }
};

/**
 * Saves a new file to disk.
 */
var saveFileAs = async () => {
  console.log("Saving file...");
  if (!hasFSAccess) {
    console.error("No filesystem access in browser");
    return;
  }
  let fileHandle;
  try {
    fileHandle = await getNewFileHandle();
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
  try {
    await writeFile(fileHandle, getText());
    setFile(fileHandle);
  } catch (ex) {
    const msg = 'Unable to save file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
};