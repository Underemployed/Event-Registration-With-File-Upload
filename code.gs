let app = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1qAYa-E0PuYPqQ2Qdci_d6MltYfFDW8cNTS9w-ynq2OU/edit?usp=sharing"
);

let sheet = app.getSheetByName("Sheet1");

function doPost(e) {
  try {
    let obj = JSON.parse(e.postData.contents);

    // Check if required fields are present
    if (!obj.base64 || !obj.type || !obj.name) {
      throw new Error("Missing required fields");
    }

    // Decode the base64-encoded image
    let dcode = Utilities.base64Decode(obj.base64);

    // Get the folder by name
    let folderIterator = DriveApp.getFoldersByName("Subscription");
    if (!folderIterator.hasNext()) {
      throw new Error("Folder not found");
    }
    let folder = folderIterator.next();

    // Create a file in the specified folder
    let blob = Utilities.newBlob(dcode, obj.type, obj.name);
    let newFile = folder.createFile(blob);
    let dateTime = new Date();
    let date = dateTime.toLocaleDateString();
    let time = dateTime.toLocaleTimeString();

    // Set sharing permissions for the file
    let link = newFile
      .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      .getUrl();

    let l = { link, date, time };
    var a = ["Link", "Date", "Time"];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        Logger.log(key + ": " + obj[key]);
        l[key] = obj[key];
        a.push(key);
      }
    }

    let lr = sheet.getLastRow();
    sheet.appendRow(a);
    sheet.appendRow(Object.values(l));

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "HAPPY" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log(err);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: err.message,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  Logger.log(e);
  return ContentService.createTextOutput("Received GET request");
}
