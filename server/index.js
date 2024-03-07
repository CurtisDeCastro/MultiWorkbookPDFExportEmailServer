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
  try {
    clearDirectory();
    await SingleEmailMultiWorkbookExport(baseURL, client_id, client_secret, req.body);
    res.status(200).send('Main function executed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while executing the Main function');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});