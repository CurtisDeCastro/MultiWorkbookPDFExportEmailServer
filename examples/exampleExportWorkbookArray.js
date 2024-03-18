// Below is a sample array of objects that can be used to export multiple workbooks as PDFs though this endpoint. The commented out lines represent optional parameters.

const exportExportWorkbookArray = [
  {
    id: "sdagert43sgagdt3er34s",
    export_config: {
      // elementId: "88889999-aaaa-bbbb-cccc-ddddeeeeffff",
      format: {
        type: "pdf",
        layout: "portrait",
      }
    //   timeout: 5,
    //   tag: "my-tag",
    //   exportAs: "myUserId",
    //   parameters: {
    //     param: "value",
    //   },
    //   filters: {
    //     filter: "value",
    //   },
    //   rowLimit: "value",
    //   offset: "value",
    },
  },
  {
    id: "sdagert43sga346523tgrgt3",
    export_config: {
      format: {
        type: "pdf",
        layout: "portrait",
      },
    },
  },
];

  module.exports = exportExportWorkbookArray;