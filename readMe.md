
# How This Server Works

This server automates exporting multiple Sigma workbooks as PDFs and emailing them as attachments. The workflow and data structure have recently changed—please read carefully for the latest usage.

---

## 1. Server Setup

- **Built with:** Node.js and Express.
- **Endpoint:** Accepts HTTP `POST` requests at `/Multi-Workbook-Email-Export-PDF`.
- **Configuration:** Uses environment variables for Sigma API credentials, Gmail credentials, and sender email.

---

## 2. Request Handling

When a `POST` request is received at `/Multi-Workbook-Email-Export-PDF`:

- The server expects the request body to contain both email options and a list of workbooks to export, in a specific structure (see below).
- The server clears the `./PDFs` directory to remove any old exports.
- The main process (`SingleEmailMultiWorkbookExport`) is called with the parsed email options and workbook list.

**Accepted Request Body Formats:**

1. **Preferred:**  
   A JSON array with two elements:
   - The first element is an object with email options.
   - The second element is an array of workbook export objects.

   Example:
   ```json
   [
     {
       "send_to": ["user1@example.com", "user2@example.com"],
       "subject": "Sigma PDF Export",
       "text": "Here are your requested Sigma exports."
     },
     [
       {
         "elementId": "workbook_id_1",
         "export_config": {
           "format": {
             "layout": "portrait",
             "type": "pdf"
           }
         },
         "id": "export_id_1"
       },
       {
         "elementId": "workbook_id_2",
         "export_config": {
           "format": {
             "layout": "portrait",
             "type": "pdf"
           }
         },
         "id": "export_id_2"
       }
     ]
   ]
   ```

2. **Legacy:**  
   An array where the first element is the email options object, and the remaining elements are workbook export objects.

3. **Payload String:**  
   An object with a `payload` property containing a stringified JSON array as above.  
   (If using this, make sure to parse the string before sending, or the server will parse it for you.)

---

## 3. Export Process (`SingleEmailMultiWorkbookExport`)

- **Authentication:** Gets an access token from the Sigma API using credentials.
- **Exporting Workbooks:** For each workbook in the provided array:
  - Calls `exportWorkbook` to initiate the export via the Sigma API.
  - When the export is ready, downloads the PDF to the `./PDFs` directory.
- **Progress Monitoring:** Every second, checks the number of PDFs in `./PDFs`.
  - When the number matches the number of requested exports, stops polling and calls `sendEmail`.

---

## 4. Downloading PDFs

- Each exported PDF is downloaded and saved with a unique filename in `./PDFs`.
- If the export is not ready (HTTP 204), the server retries after 1 second.

---

## 5. Sending Email (`sendEmail`)

- Uses Nodemailer (Gmail) to send an email with all PDFs in `./PDFs` as attachments.
- The sender is set from the `FROM_EMAIL` environment variable.
- Recipients are set from the `send_to` array in the email options object.
- After sending, the `./PDFs` directory is cleared.

---

## 6. Directory Management (`clearDirectory`)

- Deletes all files in the `./PDFs` directory before and after each export/email cycle to prevent mixing old and new files.

---

## Summary

- **Purpose:** Accepts email options and a list of Sigma workbooks, exports each as a PDF, and emails all PDFs as attachments.
- **Flow:**  
  Receive request → Clear old PDFs → Export each workbook → Download PDFs → Email PDFs → Clean up.
- **Tech Stack:** Node.js, Express, Axios, Nodemailer, Sigma API.

---

## Testing the API with Postman

You can test the `/Multi-Workbook-Email-Export-PDF` endpoint using Postman. Here’s how:

### 1. Start Your Server

Ensure your Node.js server is running locally (default port: `3000`).

### 2. Open Postman and Create a New Request

- Click **"New"** > **"HTTP Request"**.

### 3. Set the Request Type and URL

- Set the method to `POST`.
- URL:  
  ```
  http://localhost:3000/Multi-Workbook-Email-Export-PDF
  ```

### 4. Set the Headers

- In the **Headers** tab, add:  
  | Key           | Value             |
  |---------------|-------------------|
  | Content-Type  | application/json  |

### 5. Set the Request Body

- In the **Body** tab, select **raw** and choose **JSON**.
- Enter a JSON array with two elements:  
  1. Email options object  
  2. Array of workbook export objects

  Example:
  ```json
  [
    {
      "send_to": ["your@email.com"],
      "subject": "Sigma PDF Export",
      "text": "Here are your requested Sigma exports."
    },
    [
      {
        "elementId": "workbook_id_1",
        "export_config": {
          "format": {
            "layout": "portrait",
            "type": "pdf"
          }
        },
        "id": "export_id_1"
      }
    ]
  ]
  ```
  Replace the IDs and email addresses with your actual values.

### 6. Send the Request

- Click **Send**.
- You should see a response like:
  ```
  Sigma Exports Initiated
  ```
  or an error message if something went wrong.

### 7. Check Your Email

- If everything is configured correctly (including your `.env` file and Gmail app password), you should receive an email with the exported PDFs attached once the process completes.

---

### Summary Table

| Step | What to Do         | Value/Example                                      |
|------|--------------------|----------------------------------------------------|
| 1    | Method             | POST                                               |
| 2    | URL                | http://localhost:3000/Multi-Workbook-Email-Export-PDF |
| 3    | Header             | Content-Type: application/json                     |
| 4    | Body (raw, JSON)   | See example above                                  |

---

**Tips:**  
- If you get errors, check your server logs for details.
- Make sure your `.env` file is set up with the correct Sigma and Gmail credentials.
- If you have a "payload" string from another system, parse it to a JSON array before sending, or send as `{ "payload": "<stringified array>" }`.

Need a sample `.env` or help with the request body? Let us know!
