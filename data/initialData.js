import { defaultData, billingData, paymentData } from './formData';

export const blogID = "594952df122ff83a0f190050";
export const NOW = new Date().setHours(10).getTime();

let initial = {};
(Object.keys(defaultData)).forEach((k) => initial[k] = [] );
export const initialData = {...initial};

export const initialUser = {
  admin: false,
  username: "",
  token: "",
  email: ""
};

let bill = {};
(Object.keys(billingData)).forEach((k) => bill[k] = billingData[k]["default"]);

let pay = {};
(Object.keys(billingData)).forEach((k) => pay[k] = paymentData[k]["default"]);

export const initialCheckout = {
  selected: {
    roomID: {},
    arrive: NOW,
    depart: NOW + 24*60*60*1000,
    guests: 2,
		cost: 0
  },
  billing: {...bill},
  credit: {...pay},
  confirmation: false
};

export const initialMessage = '';

export const initialEdit = {
	modalTitle: '',
	url: '',
	next: '',
	dataObj: {}
};
