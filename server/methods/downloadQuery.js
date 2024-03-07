var https = require('follow-redirects').https;
const axios = require('axios');
var fs = require('fs');

var qs = require('querystring');

async function downloadQuery(baseURL, queryId, token) {
    var options = {
    'hostname': `${baseURL}/v2/query/${queryId}/download`,
    'url': `${baseURL}/v2/query/${queryId}/download`,
    'path': `/v2/query/${queryId}/download`,
    'headers': {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    'maxRedirects': 2000,
    'responseType': 'stream',
    };
    
    try {
        const response = await axios(options).then((res) => {

            if (res.status === 204) {
                setTimeout(() => {
                    downloadQuery(baseURL, queryId, token);
                }, 1000);
            } else if (res.status === 200) {
                const timestamp = Date.now().toString();
                const fileStream = fs.createWriteStream(`./PDFs/export_${timestamp}.pdf`);
                res.data.pipe(fileStream);
            }
        });
    } catch (error) {
        console.error(error);
    }
    
    
    var postData = qs.stringify({
    
    });

}

module.exports = downloadQuery;
