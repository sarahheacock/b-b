export const blogID = "594952df122ff83a0f190050";

const d = new Date();
const currentYear = d.getFullYear();

const temp = new Date().toString().split(' ');
export const NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();

export const initialData = {
  home: [],
  about: [],
  rooms: [],
  localGuide: []
};

export const initialUser = {
  admin: false,
  id: "",
  token: "",
  username: ""
};

export const initialCheckout = {
  selected: {
    roomID: {},
    arrive: NOW,
    depart: NOW + 24*60*60*1000,
    guests: 2,
		cost: 0
  },
  billing: {
    name: '',
    email: '',
    address: {
			"Address Line 1": '',
			"Address Line 2": '',
			city: '',
			state: '',
			zip: '',
			country: 'United States'
		}
  },
  payment: {
		name: '',
    number: '',
    month: 'Jan 01',
    "Expiration Year": currentYear.toString(),
    CVV: ''
  },
  confirmation: false
};

export const initialMessage = '';

export const initialEdit = {
	modalTitle: '',
	url: '',
	next: '',
	dataObj: {}
};
