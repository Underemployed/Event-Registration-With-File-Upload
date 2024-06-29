# Event Registration with File Upload

## Overview
This project demonstrates how to create an event registration form that allows users to upload files. The files are stored in a specified Google Drive folder, and the details are logged in a Google Sheet. The process involves setting up an AppScript to handle the file upload and logging, as well as an HTML form for the front end.
## Technologies Used

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

### Backend
- **Google Apps Script**

### External Libraries
- **jQuery**

### Cloud Services
- **Google Drive**
- **Google Sheets**
## Steps to Set Up

### 1. Clone the Repository
Clone the repository to get the source code, including HTML, JavaScript, and CSS files.

```sh
git clone https://github.com/Underemployed/Static-Website-File-Upload.git
```

### 2. Create a Google Sheet
Make a copy of the Google Sheet template provided in the link below:
[Google Sheet Template](https://docs.google.com/spreadsheets/d/1qAYa-E0PuYPqQ2Qdci_d6MltYfFDW8cNTS9w-ynq2OU/edit?gid=0#gid=0)

### 3. Set Up Google Drive Folder
Create a Google Drive folder named `Subscription` and set the sharing settings to "Anyone with the link can view".

### 4. Set Up Google Apps Script
1. In the Google Sheet, go to `Extensions -> Apps Script`.
2. Replace the default script with the provided AppScript code.
3. Deploy the script:
   - Go to `Deploy -> New Deployment`.
   - Set "Who has access" to "Anyone".
   - Copy the web app URL.

### 5. Update JavaScript with AppScript URL
In the `sendinfo.js` file of your cloned repository, replace the `APPSCRIPT_URL` with the URL you copied in the previous step.

### 6. Host the HTML Form
Host the HTML, CSS, and JavaScript files from the cloned repository on your preferred web server. Ensure that the hosted form points to the updated `sendinfo.js`.

## Important Notes
- Both the Google Drive folder and the Google Sheets must be set to "Anyone can view" for the AppScript to work properly.
- Make sure to update the `APPSCRIPT_URL` in the `sendinfo.js` file to the URL of your deployed Apps Script.
- Make sure Google Drive folder name is accurate
- 
## Summary
By following these steps, you can set up a system that allows users to register for events and upload files, with the data being stored in a Google Drive folder and logged in a Google Sheet. The provided repository contains all necessary code, and the Google Apps Script handles the backend processing.
