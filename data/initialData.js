
const defaultData = require('./formData').defaultData;
const billingData = require('./formData').billingData;
const paymentData = require('./formData').paymentData;

const blogID = "594952df122ff83a0f190050";
const NOW = new Date().setHours(10, 0, 0, 0);


let initial = {};
(Object.keys(defaultData)).forEach((k) => initial[k] = [] );
const initialData = Object.assign({}, initial);

const initialUser = {
  admin: false,
  token: "",
  id: "",
  username: ""
};

let bill = {};
(Object.keys(billingData)).forEach((k) => bill[k] = billingData[k]["default"]);

let pay = {};
(Object.keys(paymentData)).forEach((k) => pay[k] = paymentData[k]["default"]);

const initialCheckout = {
  selected: {
    roomID: {},
    arrive: NOW,
    depart: NOW + 24*60*60*1000,
    guests: 2,
		cost: 0
  },
  billing: bill,
  credit: pay,
  confirmation: false
};

const initialMessage = '';

const initialEdit = {
	modalTitle: '',
	url: '',
	next: '#',
	dataObj: {}
};

module.exports = {
  initialEdit,
  initialMessage,
  initialCheckout,
  initialUser,
  initialData,
  NOW,
  blogID
};
