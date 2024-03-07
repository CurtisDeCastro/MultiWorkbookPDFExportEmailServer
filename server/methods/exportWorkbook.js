const axios = require('axios');
const downloadQuery = require('./downloadQuery.js')

//export workbook
const exportWorkbook = async (exportWorkbookObj, baseURL, token) => {
  
  let data = JSON.stringify(exportWorkbookObj.export_config);
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseURL}/v2/workbooks/${exportWorkbookObj.id}/export`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${token}`
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    const queryId = response.data.queryId;
    downloadQuery(baseURL, queryId, token);
    return 1;
  })
  .catch((error) => {
    console.log(error);
    return 0;
  });
}

module.exports = exportWorkbook;
