const contactData = {
  name: {
    type: 'text',
    placeholder: 'Full Name',
    componentClass: 'input',
    default: ''
  },
  email: {
    type: 'text',
    placeholder: 'Email',
    componentClass: 'input',
    default: ''
  },
  phone: {
    type: 'text',
    placeholder: 'Phone Number',
    componentClass: 'input',
    default: ''
  },
  "Contact Me": {
    type: 'other',
    default: 'text'
  }
};

const addressData = {
  "Address Line 1": {
    type: 'text',
    placeholder: 'Street Address',
    componentClass: 'input',
    default: ''
  },
  "Address Line 2": {
    type: 'text',
    placeholder: 'Street Address',
    componentClass: 'input',
    default: ''
  },
  city: {
    type: 'text',
    placeholder: 'City',
    componentClass: 'input',
    default: ''
  },
  state: {
    type: 'text',
    placeholder: 'State',
    componentClass: 'input',
    default: ''
  },
  zip: {
    type: 'text',
    placeholder: 'Zip Code',
    componentClass: 'input',
    default: ''
  },
  country: {
    type: 'other',
    componentClass: 'select',
    default: 'United States'
  }
};

//===============info on user message form=========================================

const notRequired = ["bold", "image", "carousel", "link", "Address Line 2", "Contact Me"];

//the keys help reorder the form
//and provide default values if adding
const defaultImage = 'Tile-Dark-Grey-Smaller-White-97_pxf5ux'
const defaultData = {
  home: {
    bold: {
      type: 'text',
      placeholder: 'Summary',
      componentClass: 'input',
      default: ''
    },
    summary: {
      type: 'text',
      placeholder: 'Summary',
      componentClass: 'textarea',
      default: ''
    },
    carousel: {
      type: 'other',
      default: [defaultImage],
    }
  },
  about: {
    title: {
      type: 'text',
      placeholder: 'Title',
      componentClass: 'input',
      default: ''
    },
    bold: {
      type: 'text',
      placeholder: 'Summary',
      componentClass: 'input',
      default: ''
    },
    summary: {
      type: 'text',
      placeholder: 'Summary',
      componentClass: 'textarea',
      default: ''
    },
    image: {
      type: 'other',
      default: defaultImage,
    }
  },
  rooms: {
    title: {
      type: 'text',
      placeholder: 'Room Title',
      componentClass: 'input',
      default: ''
    },
    cost: {
      type: 'text',
      placeholder: 'Cost of Room',
      componentClass: 'input',
      default: ''
    },
    maximumOccupancy: {
      type: 'text',
      placeholder: 'Cost of Room',
      componentClass: 'input',
      default: ''
    },
    available: {
      type: 'text',
      placeholder: 'Number of Rooms Available',
      componentClass: 'input',
      default: ''
    },
    bold: {
      type: 'text',
      placeholder: 'Bold Text',
      componentClass: 'input',
      default: ''
    },
    summary: {
      type: 'text',
      placeholder: 'Summary',
      componentClass: 'textarea',
      default: ''
    },
    carousel: {
      type: 'other',
      default: [defaultImage],
    }
  },
  localGuide: {
    title: {
      type: 'text',
      placeholder: 'Name of Place',
      componentClass: 'input',
      default: ''
    },
    category: {
      type: 'text',
      placeholder: 'Category',
      componentClass: 'input',
      default: ''
    },
    address: {
      type: 'text',
      placeholder: 'Street Address',
      componentClass: 'input',
      default: ''
    },
    link: {
      type: 'text',
      placeholder: 'Link to Web Site',
      componentClass: 'input',
      default: ''
    },
    description: {
      type: 'text',
      placeholder: 'Description of Place',
      componentClass: 'textarea',
      default: ''
    },
    image: {
      type: 'other',
      default: defaultImage,
    }
  }
}


const loginData = {
  username: {
    type: 'text',
    placeholder: 'Email or Username',
    componentClass: 'input',
    default: ''
  },
  password: {
    type: 'password',
    placeholder: 'Password',
    componentClass: 'input',
    default: ''
  },
  admin: {
    type: 'other',
    default: true
  }
}


const signUpData = Object.assign({}, contactData, {
  password: {
    type: 'password',
    placeholder: 'Password',
    componentClass: 'input',
    default: ''
  },
  "Verify Password": {
    type: 'password',
    placeholder: 'Verify Password',
    componentClass: 'input',
    default: ''
  }
});

const billingData = Object.assign({}, contactData, addressData );


const currentYear = new Date().getFullYear().toString();
const paymentData = {
	name: {
    type: 'text',
    placeholder: 'Name on Card',
    componentClass: 'input',
    default: ''
  },
  number: {
    type: 'text',
    placeholder: 'Number on Card',
    componentClass: 'input',
    default: ''
  },
  "Expiration Month": {
    type: 'other',
    componentClass: 'select',
    default: 'Jan 01'
  },
  "Expiration Year": {
    type: 'other',
    componentClass: 'select',
    default: currentYear,
  },
  "CVV": {
    type: 'text',
    placeholder: 'CVV',
    componentClass: 'input',
    default: ''
  }
}

const messageData = Object.assign({},
  contactData,
  {
    message: {
      type: 'text',
      placeholder: 'Message',
      componentClass: 'textarea',
      default: ''
    }
  });

module.exports = {
  addressData,
  notRequired,
  defaultData,
  loginData,
  signUpData,
  billingData,
  paymentData,
  messageData
}
