require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const {
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
} = require('./apiRouteHandlers.js');

//initializing express app
const app = express();
app.use(express.json()); //middleware to be able to read json

//handling all the types of requests

//for login, takes email and phone in body and returns a JWT
app.post('/api/login', login);

//for registering as a volunteer
app.post('/api/register/volunteer', registerVolunteer);

//for registering as a beneficiary
app.post('/api/register/beneficiary', registerBeneficiary);

//for posting a new log in the logsheet
app.post('/api/logsheet', authenticate, postLog);

//for posting a new volunteer feedback
app.post('/api/feedback/volunteer', authenticate, postVolunteerFeedback);

//for posting a new beneficiary feedback
app.post('/api/feedback/beneficiary', authenticate, postBeneficiaryFeedback);

//for posting a new intervention feedback
app.post('/api/feedback/intervention', authenticate, postInterventionFeedback);

//for creating a new event
app.post('/api/events', authenticate, postEvent);

//for getting all events scheduled
app.get('/api/events', authenticate, getEvents);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));
