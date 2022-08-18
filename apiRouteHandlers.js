require('dotenv').config();
const jwt = require('jsonwebtoken');

const {
	authorize,

	registerNewVolunteer,
	registerNewBeneficiary,

	postNewLog,

	postNewVolunteerFeedback,
	postNewBeneficiaryFeedback,
	postNewInterventionFeedback,

	postNewEvent,
	getAllEvents,
} = require('./sheets.js');

//middleware
const authenticate = (req, res, next) => {
	const token = req.headers.token;

	try {
		req.user = jwt.verify(token, process.env.JWT_KEY);
		next();
	} catch (e) {
		console.error(e);
		return res.status(401).send({ info: 'Invalid token.' });
	}
};

const login = (req, res) => {
	const email = req.body.email;
	const phone = req.body.phone;

	//promise that always resolves.
	authorize(email, phone)
		.then(() => {
			//generate jwt here and send
			const token = jwt.sign(
				{ email: email, phone: phone },
				process.env.JWT_KEY,
			);
			res.status(200).send({
				value: true,
				token: token,
				info: 'Successfully logged in.',
			});
		})
		.catch(() => {
			res.status(401).send({
				value: false,
				token: '',
				info: 'Invalid email and phone.',
			});
		});
};

const registerVolunteer = (req, res) => {
	//here, we are receiving an array in the body.
	//that array contains one element.
	//that element itself is an array, which consists of a bunch of strings that need to be appended into the Volunteers Google Sheet using the Sheets API.

	const values = req.body[0];
	//validation of the body-
	if (!values?.length) {
		//to check if the values are actually an array, and that their length isnt zero.
		return res.status(406).send({ info: 'Invalid body.' });
	}

	registerNewVolunteer(values)
		.then(() => {
			res.status(200).send({ info: 'New Volunteer Registered!' });
		})
		.catch(() => {
			res.status(503).send({ info: 'Error: Could not register.' });
		});
};

const registerBeneficiary = (req, res) => {
	//here, we are receiving an array in the body.
	//that array contains one element.
	//that element itself is an array, which consists of a bunch of strings that need to be appended into the Beneficiaries Google Sheet using the Sheets API.

	const values = req.body[0];
	//validation of the body-
	if (!values?.length) {
		//to check if the values are actually an array, and that their length isnt zero.
		return res.status(406).send({ info: 'Invalid body.' });
	}

	registerNewBeneficiary(values)
		.then(() => {
			res.status(200).send({ info: 'New Beneficiary Registered!' });
		})
		.catch(() => {
			res.status(503).send({ info: 'Error: Could not register.' });
		});
};

const postLog = (req, res) => {
	if (req.user) {
		const values = req.body[0];
		//validation of the body-
		if (!values?.length) {
			//to check if the values are actually an array, and that their length isnt zero.
			return res.status(406).send({ info: 'Invalid body.' });
		}

		postNewLog(values)
			.then(() => {
				res.status(200).send({ info: 'New log posted!' });
			})
			.catch(() => {
				res.status(503).send({
					info: 'Error: Could not post the log.',
				});
			});
	}
};

const postVolunteerFeedback = (req, res) => {
	if (req.user) {
		const values = req.body[0];
		//validation of the body -
		if (!values?.length) {
			//to check if the values are actually an array, and that their length isn't zero.
			return res.status(406).send({ info: 'Invalid body' });
		}

		postNewVolunteerFeedback(values)
			.then(() => {
				res.status(200).send({
					info: 'New Volunteer Feedback posted!',
				});
			})
			.catch(() => {
				res.status(503).send({
					info: 'Error: could not post the volunteer feedback.',
				});
			});
	}
};

const postBeneficiaryFeedback = (req, res) => {
	if (req.user) {
		const values = req.body[0];
		//validation of the body -
		if (!values?.length) {
			//to check if the values are actually an array, and that their length isn't zero.
			return res.status(406).send({ info: 'Invalid body' });
		}

		postNewBeneficiaryFeedback(values)
			.then(() => {
				res.status(200).send({
					info: 'New Beneficiary Feedback posted!',
				});
			})
			.catch(() => {
				res.status(503).send({
					info: 'Error: could not post the beneficiary feedback.',
				});
			});
	}
};

const postInterventionFeedback = (req, res) => {
	if (req.user) {
		const values = req.body[0];
		//validation of the body -
		if (!values?.length) {
			//to check if the values are actually an array, and that their length isn't zero.
			return res.status(406).send({ info: 'Invalid body' });
		}

		postNewInterventionFeedback(values)
			.then(() => {
				res.status(200).send({
					info: 'New Intervention POC Feedback posted!',
				});
			})
			.catch(() => {
				res.status(503).send({
					info: 'Error: could not post the intervention POC feedback.',
				});
			});
	}
};

const postEvent = (req, res) => {
	if (req.user) {
		const values = req.body[0];
		//validation of the body -
		if (!values?.length) {
			//to check if the values are actually an array, and that their length isn't zero.
			return res.status(406).send({ info: 'Invalid body' });
		}

		postNewEvent(values)
			.then(() => {
				res.status(200).send({
					info: 'Scheduled the new event!',
				});
			})
			.catch(() => {
				res.status(503).send({
					info: 'Error: could not schedule the event.',
				});
			});
	}
};

const getEvents = (req, res) => {
	if (req.user) {
		getAllEvents()
			.then((values) => {
				res.status(200).send({
					info: 'All events obtained and sent.',
					data: values,
				});
			})
			.catch(() => {
				res.status(503).send({
					info: 'Events could not be obtained.',
					data: [],
				});
			});
	}
};

module.exports = {
	authenticate,
	login,
	registerVolunteer,
	registerBeneficiary,
	postLog,
	postVolunteerFeedback,
	postBeneficiaryFeedback,
	postInterventionFeedback,
	postEvent,
	getEvents,
};
