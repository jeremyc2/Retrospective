var hasFSAccess = 'chooseFileSystemEntries' in window ||
    'showOpenFilePicker' in window;

var file = {};

/**
 * Creates an empty notepad with no details in it.
 */
var newFile = () => {
  
};


/**
 * Opens a file for reading.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
var openFile = async (fileHandle) => {
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
  readFile(file, fileHandle);
};

/**
 * Read the file from disk.
 *
 *  @param {File} file File to read from.
 *  @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
var readFile = async (file, fileHandle) => {
  try {

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