// BY Underemployed 06-07-2024

// let app = SpreadsheetApp.openByUrl(
//   "custom_google_sheet_link_must_be_set_to_anyone_can_view");
let app = SpreadsheetApp.getActiveSpreadsheet();
// GOOGLE DRIVE FOLDER REQUIRED
let gdrivefolder = "Subscription";
// console.log(sheet.getLastRow())

function doPost(e) {
  try {
    let obj = validateInput(e);
    let fileInfo;
    if (obj.base64) {
      let dcode = Utilities.base64Decode(obj.base64);
      let folder = getDriveFolderByName(gdrivefolder);
      let newFile = createFileInFolder(folder, dcode, obj);
      fileInfo = prepareFileInfo(newFile, obj);
    } else {
      fileInfo = prepareFileInfo(null, obj);
    }
    // Extract event name from fileInfo
    let eventName = fileInfo.event;
    // Select or create sheet based on event name
    let eventSheet = selectOrCreateSheet(eventName);
    // Append fileInfo to the event-specific sheet
    appendFileInfoToSheet(fileInfo, eventSheet);
    return createSuccessResponse();
  } catch (err) {
    Logger.log(err);
    return createErrorResponse(err);
  }
}

function validateInput(e) {
  if (!e.postData.contents) throw new Error("No data provided");// no data
  let obj = JSON.parse(e.postData.contents);
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
  // Initialize fileInfo outside of if/else to ensure it's in scope for return
  let fileInfo = {
    Link: "nil", // Default value
    Time: dateTime.toLocaleTimeString(),
    Date: dateTime.toLocaleDateString()
  };

  if (newFile) {
    fileInfo.Link = newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW).getUrl();
  }

  // Adding additional properties from obj to fileInfo
  for (let key in obj) {
    fileInfo[key] = obj[key];
  }

  return fileInfo;
}

// create or return existing sheet
function selectOrCreateSheet(sheetName) {
  let existingSheet = app.getSheetByName(sheetName);
  if (existingSheet) {
    return existingSheet;
  } else {
    return app.insertSheet(sheetName);
  }
}



function appendFileInfoToSheet(fileInfo, sheet) {
  const headers = [...Object.keys(fileInfo)]; // slice and remove file upload change according to form!!! 
  //in my form these data are towards end

  let lastRow = sheet.getLastRow();
  // column titles
  if (lastRow === 0) sheet.appendRow(headers);
  // values
  sheet.appendRow(Object.values(fileInfo));
}

function createSuccessResponse() {
  return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Operation completed successfully." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(err) {
  let errorSheet = selectOrCreateSheet("Errors");

  // logs are stored in "Errors" sheet
  let dateTime = new Date();
  let errorInfo = [dateTime.toLocaleString(), err.message];
  let lastRow = errorSheet.getLastRow();
  // column titles
  if (lastRow === 0) errorSheet.appendRow(["Date", "Error Message"]);
  errorSheet.appendRow(errorInfo);


  return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// sending data from events sheet
function doGet(e) {
  let sheet = selectOrCreateSheet("Events");
  let dataRange = sheet.getDataRange();
  let data = dataRange.getValues();

  let events = data.slice(1).map(row => ({
    name: row[0],
    paid: row[1].toLowerCase() === 'yes',
    label: row[2] || ''
  }));

  let jsonResponse = JSON.stringify({ "Event Names": events });
  console.log(jsonResponse);
  return ContentService.createTextOutput(jsonResponse)
    .setMimeType(ContentService.MimeType.JSON);
}