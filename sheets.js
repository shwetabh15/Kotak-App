//write all functions to interact with Google Sheet here.

//Sheets boilerplate code
require('dotenv').config();
const { google } = require('googleapis');
const keys = require('./keys.json');
let sheetID = process.env.SpreadsheetId;
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
	'https://www.googleapis.com/auth/spreadsheets',
]);

//a universal function to post whatever data to whatever sheet. just reuse it across all post requests except login.
const postDataToSheet = (data, sheet) => {
	return new Promise((resolve, reject) => {
		client.authorize(function (err, tokens) {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log('Connected');
				const gsapi = google.sheets({ version: 'v4', auth: client });

				gsapi.spreadsheets.values
					.append({
						spreadsheetId: sheetID,
						range: sheet,
						valueInputOption: 'USER_ENTERED',
						resource: {
							values: [data],
						},
					})
					.then((details) => {
						resolve(details);
					})
					.catch((err) => {
						console.error(err);
						reject(err);
					});
			}
		});
	});
};

const getDataFromSheet = (sheet) => {
	return new Promise((resolve, reject) => {
		client.authorize(function (err, tokens) {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log('Connected');
				const gsapi = google.sheets({
					version: 'v4',
					auth: client,
				});
				const opt = {
					spreadsheetId: sheetID,
					range: sheet,
				};
				gsapi.spreadsheets.values
					.get(opt)
					.then((data) => {
						const dataArray = data.data.values;
						resolve(dataArray);
					})
					.catch((e) => {
						console.error(e);
						reject(e);
					});
			}
		});
	});
};

//function to verify the validity of an email+phone pair.
const authorize = (email, phone) => {
	return new Promise((resolve, reject) => {
		//do all the sheets userdata logic here, if valid email phone then resolve(), if any sort of error, reject().
		if (email && phone && phone.length === 10) {
			getDataFromSheet('Approved Users').then((dataArray) => {
				dataArray.forEach((row) => {
					if (row[0] === email) {
						if (row[1].includes(phone)) resolve(); //used includes here because people could have entered +91 etc in their phone number while registering.
						return;
					}
				});

				reject();
			});
		} else reject();
	});
};

const registerNewVolunteer = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the New Volunteers Sheet.
		//when done, resolve(). if any issue, reject()
		postDataToSheet(stringsArray, 'New Volunteers Registration Sheet')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const registerNewBeneficiary = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the New Beneficiaries Sheet.
		//when done, resolve(). if any issue, reject()
		postDataToSheet(stringsArray, 'New Beneficiaries Registration Sheet')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const postNewLog = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the Logsheet.
		//when done, resolve(). if any issue, reject()

		postDataToSheet(stringsArray, 'Volunteers Daily log sheet')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const postNewVolunteerFeedback = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the Volunteer Feedback Sheet.
		//when done, resolve(). if any issue, reject()

		postDataToSheet(stringsArray, 'Volunteers Feedback')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const postNewBeneficiaryFeedback = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the Beneficiary Feedback Sheet.
		//when done, resolve(). if any issue, reject()

		postDataToSheet(stringsArray, 'Beneficiary Feedback')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const postNewInterventionFeedback = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the Intervention Feedback Sheet.
		//when done, resolve(). if any issue, reject()

		postDataToSheet(stringsArray, 'Intervention Feedback')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const postNewEvent = (stringsArray) => {
	return new Promise((resolve, reject) => {
		//Use that stringsArray to post data into the Events Feedback Sheet.
		//when done, execute resolve(). If any error, reject().

		postDataToSheet(stringsArray, 'Events List')
			.then(() => resolve())
			.catch(() => reject());
	});
};

const getAllEvents = () => {
	return new Promise((resolve, reject) => {
		//just get all the events from the google sheet. when received, do a resolve(values), and if any issue with accessing the google sheet, then do a reject()
		//make sure "values" is an array of objects, with each object having a key-value pair for each column, and each object represents an entire row.

		const values = [
			{
				row_id: 2,
				activity_name: 'English',
				session: '3',
				date: '2021-06-22',
				time: '5:00 PM',
				duration: '1 hr',
				volunteer_teacher: "ABC ma'am",
				kef_member_incharge: 'Bruce Wayne',
				volunteer_phone_no: '9837846384',
				kef_team_phone_no: '1234567890',
				details: 'details about the activity go here.',
				milliseconds: '1624361400000',
			},
			{
				row_id: 3,
				activity_name: 'Hindi',
				session: '5',
				date: '2021-06-24',
				time: '6:00 PM',
				duration: '3hr',
				volunteer_teacher: 'DEF sir',
				kef_member_incharge: 'Hulk',
				volunteer_phone_no: '698364986',
				kef_team_phone_no: '1234567890',
				details: 'details about the activity go here.',
				milliseconds: '1624537800000',
			},
		];
		getDataFromSheet('Events List')
			.then((dataArray) => {
				const newArray = [];
				const titles = dataArray[0];
				for (let rowID = 1; rowID < dataArray.length; rowID++) {
					const obj = {};
					titles.forEach((title, index) => {
						obj[title] = dataArray[rowID][index];
					});
					obj.row_id = rowID + 1;

					newArray.push(obj);
				}

				resolve(newArray);
			})
			.catch(() => reject());
	});
};

module.exports = {
	authorize,
	registerNewVolunteer,
	registerNewBeneficiary,
	postNewLog,
	postNewVolunteerFeedback,
	postNewBeneficiaryFeedback,
	postNewInterventionFeedback,
	postNewEvent,
	getAllEvents,
};
