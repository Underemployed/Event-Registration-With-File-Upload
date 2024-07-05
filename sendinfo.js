// BY Underemployed 05-07-2024

// let app = SpreadsheetApp.openByUrl("custom_google_sheet_link_must_be_set_to_anyone_can_view");
let app = SpreadsheetApp.getActiveSpreadsheet();
// GOOGLE DRIVE FOLDER REQUIRED
let gdrivefolder = "Subscription";
let sheet = app.getSheetByName("Sheet1");
// console.log(sheet.getLastRow())

function doPost(e) {
  try {
    let obj = validateInput(e);
    let dcode = Utilities.base64Decode(obj.base64);
    let folder = getDriveFolderByName(gdrivefolder);
    let newFile = createFileInFolder(folder, dcode, obj);
    let fileInfo = prepareFileInfo(newFile, obj);
    // Extract event name from fileInfo
    let eventName = fileInfo.event; // Assuming 'event' is the key for event name
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


function doPost(e) {
  // setting neccessary variables
  try {
    let obj = validateInput(e);
    let dcode = Utilities.base64Decode(obj.base64);
    let folder = getDriveFolderByName(gdrivefolder);
    let newFile = createFileInFolder(folder, dcode, obj);
    let fileInfo = prepareFileInfo(newFile, obj);
    // GETTING EVENT NAME AND CREATING SHEET IF NECCESSARY
    let eventName = fileInfo.event;
    let eventSheet = selectOrCreateSheet(eventName);
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
    Link: newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW).getUrl(),
    Time: dateTime.toLocaleTimeString(),
    Date: dateTime.toLocaleDateString()

  };
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
  


function appendFileInfoToSheet(fileInfo,sheet) {
  const headers = [...Object.keys(fileInfo)]; // slice and remove file upload change according to form!!! 
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
  let errorSheet = app.getSheetByName("Errors");

  // logs are stored in sheet2
  let dateTime = new Date();
  let errorInfo = [dateTime.toLocaleString(), err.message];
  let lastRow = errorSheet.getLastRow();
  // column titles
  if (lastRow === 0) errorSheet.appendRow(["Date","Error Message"]);
  errorSheet.appendRow(errorInfo);


  return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.message}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  let eventsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = eventsheet.getSheetByName("Events");
  let dataRange = sheet.getDataRange();
  let data = dataRange.getValues();
  
  let events = data.slice(1).map(row => row[0]); 

  // Create a JSON response
  let jsonResponse = JSON.stringify({ "Event Names": events });
  console.log(jsonResponse);
  // Return the JSON response
  return ContentService.createTextOutput(jsonResponse)
    .setMimeType(ContentService.MimeType.JSON);
}