
# How This Server Works

This server automates the process of exporting multiple Sigma workbooks as PDFs and emailing them as attachments. Below is a step-by-step overview of how it operates:

---

## 1. Server Setup

- **Built with:** Node.js and Express.
- **Endpoint:** Listens for HTTP `POST` requests at `/Multi-Workbook-Email-Export-PDF`.
- **Configuration:** Uses environment variables for API credentials, email addresses, and other settings.

---

## 2. Request Handling

When a `POST` request is received at `/Multi-Workbook-Email-Export-PDF`:

- Logs the request body (should be an array of workbooks to export).
- Clears the `./PDFs` directory to remove any old exports.
- Calls the main process: `SingleEmailMultiWorkbookExport`.

---

## 3. Export Process (`SingleEmailMultiWorkbookExport`)

- **Authentication:** Obtains an access token from the Sigma API using client credentials.
- **Exporting Workbooks:** For each workbook in the request:
  - Calls `exportWorkbook`, which sends an export request to the Sigma API.
  - When the export is ready, triggers `downloadQuery` to download the PDF file to the `./PDFs` directory.
- **Progress Monitoring:** Every second, checks how many PDFs are in the `./PDFs` directory.
  - When the number of PDFs matches the number of requested exports, stops checking and calls `sendEmail`.

---

## 4. Downloading PDFs (`downloadQuery`)

- Downloads the exported PDF for each workbook.
- If the export isn't ready (HTTP 204), retries after 1 second.
- Saves each PDF with a unique timestamped filename in `./PDFs`.

---

## 5. Sending Email (`sendEmail`)

- Uses Nodemailer to send an email (via Gmail) with all PDFs in `./PDFs` as attachments.
- The sender and recipient are both set from the environment variable `FROM_EMAIL`.
- After sending the email, clears the `./PDFs` directory again.

---

## 6. Directory Management (`clearDirectory`)

- Deletes all files in the `./PDFs` directory to ensure no old files are mixed with new exports.

---

## Summary

- **Purpose:** Accepts a list of Sigma workbooks, exports each as a PDF, and emails all PDFs as attachments.
- **Flow:**  
  Receive request → Clear old PDFs → Export each workbook → Download PDFs → Email PDFs → Clean up.
- **Tech Stack:** Node.js, Express, Axios, Nodemailer, Sigma API.

---


## Testing the API with Postman

You can easily test the `/Multi-Workbook-Email-Export-PDF` endpoint using the Postman desktop client. Follow these steps:

### 1. Start Your Server

Make sure your Node.js server is running locally (by default, it listens on port `3000`).

### 2. Open Postman and Create a New Request

- Click **"New"** > **"HTTP Request"**.

### 3. Set the Request Type and URL

- Change the request type to `POST`.
- Set the URL to:  
  ```
  http://localhost:3000/Multi-Workbook-Email-Export-PDF
  ```

### 4. Set the Headers

- Go to the **Headers** tab.
- Add a header:  
  | Key           | Value             |
  |---------------|-------------------|
  | Content-Type  | application/json  |

### 5. Set the Request Body

- Go to the **Body** tab.
- Select **raw** and choose **JSON** from the dropdown.
- Enter a JSON array representing the workbooks you want to export.  
  Example:
  ```json
  [
    {
      "id": "workbook_id_1",
      "export_config": {
        "format": "pdf",
        "other_config_option": "value"
      }
    },
    {
      "id": "workbook_id_2",
      "export_config": {
        "format": "pdf"
      }
    }
  ]
  ```
  Replace `"workbook_id_1"`, `"workbook_id_2"`, and the config options with real values as required by your Sigma API.

### 6. Send the Request

- Click **Send**.
- You should see a response like:
  ```
  Sigma Exports Initiated
  ```
  or an error message if something went wrong.

### 7. Check Your Email

- If everything is set up correctly (including your `.env` file and Gmail app password), you should receive an email with the exported PDFs attached once the process completes.

---

### Summary Table

| Step | What to Do         | Value/Example                                      |
|------|--------------------|----------------------------------------------------|
| 1    | Method             | POST                                               |
| 2    | URL                | http://localhost:3000/Multi-Workbook-Email-Export-PDF |
| 3    | Header             | Content-Type: application/json                     |
| 4    | Body (raw, JSON)   | See example above                                  |

---

**Tip:**  
If you get errors, check your server logs for details. Make sure your `.env` file is set up with the correct Sigma and Gmail credentials.

Let us know if you need a sample `.env` or help with the request body!


