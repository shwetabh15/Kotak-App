const { google } = require('googleapis');
const keys = require('./keys.json');
require('dotenv').config();

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);
let sheetID = process.env.SpreadsheetId;

client.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Connected');
    gsrun(client);
  }
});

async function gsrun(cl) {
  const gsapi = google.sheets({ version: 'v4', auth: cl });
  const opt = {
    spreadsheetId: sheetID,
    range: 'A1:B20',
  };
  let data = await gsapi.spreadsheets.values.get(opt);
  let dataArray = data.data.values;
  console.log(dataArray);
  console.log(dataArray[0][1]);
  let query = 'Shwetabh';
  let i = 0;
  let flag = false;
  while (dataArray[i][0]) {
    if (dataArray[i][0] === query) {
      flag = true;
      break;
    }
    i++;
  }
  console.log(i);

  // let x = dataArray[0][1] === "Shetabh";
  // console.log(x);
  // let newdataArray = dataArray.map(function (r) {
  //   r.push(r[0] + "-" + r[1]);
  //   return r;
  // });
  // const updateOptions = {
  //   spreadsheetId: sheetID,
  //   range: "E2",
  //   valueInputOption: "USER_ENTERED",
  //   resource: { values: newdataArray },
  // };
  // let res = await gsapi.spreadsheets.values.update(updateOptions);
  // console.log(res);
  await gsapi.spreadsheets.values.append({
    spreadsheetId: sheetID,
    range: 'A:B',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [['swd', 'BTS']],
    },
  });
}
