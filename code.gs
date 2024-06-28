// BY Underemployed 28-06-2024

// let app = SpreadsheetApp.openByUrl(
//   "custom_google_sheet_link_must_be_set_to_anyone_can_view");
let app = SpreadsheetApp.getActiveSpreadsheet();
// google drive file required
let gdrivefolder = "Subscription";
let sheet = app.getSheetByName("Sheet1");
console.log(sheet.getLastRow())


function doPost(e) {
  // setting neccessary variables
  try {
    let obj = validateInput(e);
    let dcode = Utilities.base64Decode(obj.base64);
    let folder = getDriveFolderByName(gdrivefolder);
    let newFile = createFileInFolder(folder, dcode, obj);
    let fileInfo = prepareFileInfo(newFile, obj);
    appendFileInfoToSheet(fileInfo);
    return createSuccessResponse();
  } catch (err) {
    Logger.log(err);
    return createErrorResponse(err);
  }
}

function validateInput(e) {
  if (!e.postData.contents) throw new Error("No data provided");// no data
  let obj = JSON.parse(e.postData.contents);
  if (!obj.base64 || !obj.type || !obj.name) throw new Error("Missing required fields");// image not found
  return obj;
}

function getDriveFolderByName(folderName) {
  let folderIterator = DriveApp.getFoldersByName(folderName);
  if (!folderIterator.hasNext()) throw new Error("Upload folder is missing! Please Contact the owner");// no google drive folder
  return folderIterator.next();
}

function createFileInFolder(folder, decodedData, obj) {
  // creating image blob and and uploading it to gdrive 
  let blob = Utilities.newBlob(decodedData, obj.type, obj.name);
  return folder.createFile(blob);
}

function prepareFileInfo(newFile, obj) {
  let dateTime = new Date();
  let fileInfo = {
    link: newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW).getUrl(),
    date: dateTime.toLocaleDateString(),
    time: dateTime.toLocaleTimeString()
  };
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && !['base64', 'type', 'name'].includes(key)) {
      fileInfo[key] = obj[key];
    }
  }
  return fileInfo;
}

function appendFileInfoToSheet(fileInfo) {
  const headers = ["Link", "Date", "Time", ...Object.keys(fileInfo).slice(3)]; // slice and remove file upload change according to form!!! 
  //in my form these data are towards end

  let lastRow = sheet.getLastRow();
  // column titles
  if (lastRow === 0) sheet.appendRow(headers);
  // values
  sheet.appendRow(Object.values(fileInfo));
}

function createSuccessResponse() {
  return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Operation completed successfully."}))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(err) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.message}))
    .setMimeType(ContentService.MimeType.JSON);
}