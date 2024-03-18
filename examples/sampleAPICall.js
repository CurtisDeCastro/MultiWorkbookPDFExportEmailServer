var http = require('follow-redirects').http;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'localhost',
  'port': 3000,
  'path': '/Multi-Workbook-Email-Export-PDF',
  'headers': {
    'Content-Type': 'application/json'
  },
  'maxRedirects': 20
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = JSON.stringify([
  {
    "id": "44AdhgadfD7gFFghCV3",
    "export_config": {
      "format": {
        "type": "pdf",
        "layout": "portrait"
      }
    }
  },
  {
    "id": "9agdHy75asdfgR32LI3",
    "export_config": {
      "format": {
        "type": "pdf",
        "layout": "portrait"
      }
    }
  }
]);

req.write(postData);

req.end();