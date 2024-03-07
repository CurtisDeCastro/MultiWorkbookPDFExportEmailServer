const fs = require('fs');
const getToken = require("../methods/getToken.js");
const exportWorkbook = require("../methods/exportWorkbook.js");
const sendEmail = require("../methods/sendEmail.js");

async function SingleEmailMultiWorkbookExport(baseURL, client_id, client_secret, exportWorkbooksArr) {
    let token = await getToken(baseURL, client_id, client_secret);
    let exportCount = exportWorkbooksArr.length;
    
    const interval = setInterval(() => {
      let completed = fs.readdirSync('./PDFs').length;
      console.log(`${completed} of ${exportCount} exports complete`);
      if (completed !== exportCount) {
        console.log('processing');
      }
      if (completed === exportCount) {
        clearInterval(interval);
        sendEmail();
      }
    }, 1000);
  
    if (exportWorkbooksArr) {
      exportWorkbooksArr.forEach((workbook) => {
        exportWorkbook(workbook, baseURL, token)
      });
    }
  
  }

  module.exports = SingleEmailMultiWorkbookExport;

