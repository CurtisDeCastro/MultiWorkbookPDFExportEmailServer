const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const clearDirectory = require("./methods/clearDirectory.js");
const SingleEmailMultiWorkbookExport = require("./processes/SingleEmailMultiWorkbookExport.js");

require('dotenv').config();
app.use(bodyParser.json());

const client_id = process.env.SIGMA_CLIENT_ID;
const client_secret = process.env.SIGMA_CLIENT_SECRET;
const baseURL = process.env.SIGMA_URL;

app.post('/Multi-Workbook-Email-Export-PDF', async (req, res) => {
  let emailOptions, exportWorkbooksArr;

  // Accepts: 
  // [emailOptionsObject, [workbook1, workbook2, ...]]
  if (Array.isArray(req.body) && req.body.length === 2 && typeof req.body[0] === 'object' && Array.isArray(req.body[1])) {
    emailOptions = req.body[0];
    exportWorkbooksArr = req.body[1];
  } else if (Array.isArray(req.body) && req.body.length > 2) {
    // fallback: legacy array, first is emailOptions, rest are workbooks
    emailOptions = req.body[0];
    exportWorkbooksArr = req.body.slice(1);
  } else if (req.body && typeof req.body === 'object' && req.body.payload) {
    // Accepts: { payload: '[emailOptions, [workbook1, workbook2, ...]]' }
    try {
      const payloadArr = JSON.parse(req.body.payload);
      if (Array.isArray(payloadArr) && payloadArr.length === 2 && typeof payloadArr[0] === 'object' && Array.isArray(payloadArr[1])) {
        emailOptions = payloadArr[0];
        exportWorkbooksArr = payloadArr[1];
      } else {
        return res.status(400).send('Invalid payload structure');
      }
    } catch (parseErr) {
      console.error('Failed to parse payload:', parseErr);
      return res.status(400).send('Invalid payload format');
    }
  } else {
    return res.status(400).send('Invalid request body format');
  }

  try {
    clearDirectory();
    await SingleEmailMultiWorkbookExport(baseURL, client_id, client_secret, exportWorkbooksArr, emailOptions);
    res.status(200).send('Sigma Exports Initiated');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while initiating the exports');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});