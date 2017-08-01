//===============info on user message form=========================================
const defaultImage = 'Tile-Dark-Grey-Smaller-White-97_pxf5ux'

export const defaultData = {
  home: {
    summary: '',
    carousel: [defaultImage],
  },
  authors: {
    name: '',
    education: '',
    summary: '',
    image: defaultImage,
  },
  publications: {
    title: '',
    description: '',
    authors: [''],
    date: '',
    link: '',
  },
  news: {
    title: '',
    description: '',
    image: defaultImage,
  }
}

export const formData = {
  summary: {
    type: 'text',
    placeholder: 'Summary',
    componentClass: 'textarea'
  },
  education: {
    type: 'text',
    placeholder: 'Education (Bold Text)',
    componentClass: 'input'
  },
  name: {
    type: 'text',
    placeholder: 'Full Name',
    componentClass: 'input'
  },
  title: {
    type: 'text',
    placeholder: 'Section Title',
    componentClass: 'input'
  },
  description: {
    type: 'text',
    placeholder: 'Summary',
    componentClass: 'textarea'
  },
  authors: {
    type: 'text',
    placeholder: 'Published Author',
    componentClass: 'input'
  },
  link: {
    type: 'text',
    placeholder: 'Link to Article',
    componentClass: 'input'
  },
  date: {
    type: 'text',
    placeholder: 'Date Published',
    componentClass: 'input'
  }
}

export const loginData = {
  username: {
    type: 'text',
    placeholder: 'Admin Username',
    componentClass: 'input'
  },
  password: {
    type: 'password',
    placeholder: 'Password',
    componentClass: 'input'
  },
}

export const messageData = {
  name: {
    type: 'text',
    placeholder: 'Your Name',
    componentClass: 'input'
  },
  email: {
    type: 'email',
    placeholder: 'Email Address',
    componentClass: 'input'
  },
  phone: {
    type: 'text',
    placeholder: 'Phone Number',
    componentClass: 'input'
  },
  message: {
    type: 'text',
    placeholder: 'Message',
    componentClass: 'textarea'
  }
};
