const profile = {
  username: 'Paritosh Gohel',
  location: 'India',
  email: 'contact@educationanywhere.com',
  avatar: require('../assets/images/avatar.png'),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false,
  registeredDevices: ['Redmi Note 7 Pro', 'Samsung Galaxy S9'],
};

const reviews = [
  {
    reviewId: 1,
    reviewBy: 'Jinny Doe',
    avatar: require('../assets/images/avatar.png'),
    reviewText: 'Please visit the document seciton to go through the details'
  },
  {
    reviewId: 2,
    reviewBy: 'Jinny Doe',
    avatar: require('../assets/images/avatar.png'),
    reviewText: 'Please visit the document seciton to go through the examples'
  },
  {
    reviewId: 3,
    reviewBy: 'Jinny Doe',
    avatar: require('../assets/images/avatar.png'),
    reviewText: 'Also I have uploaded the video for advanced concepts. Please have a look guys.'
  },
];

const academicPreferences = [
  {
    id: 1,
    preferenceText: '1st Standard',
    value: '1'
  },
  {
    id: 2,
    preferenceText: '2nd Standard',
    value: '2'
  },
  {
    id: 3,
    preferenceText: '3rd Standard',
    value: '3'
  },
  {
    id: 4,
    preferenceText: '4th Standard',
    value: '4'
  },
  {
    id: 5,
    preferenceText: '5th Standard',
    value: '5'
  },
  {
    id: 6,
    preferenceText: '6th Standard',
    value: '6'
  },
  {
    id: 7,
    preferenceText: '7th Standard',
    value: '7'
  },
  {
    id: 8,
    preferenceText: '8th Standard',
    value: '8'
  },
  {
    id: 9,
    preferenceText: '9th Standard',
    value: '9'
  },
  {
    id: 10,
    preferenceText: '10th Standard',
    value: '10'
  },
  {
    id: 11,
    preferenceText: '11th Standard',
    value: '11'
  },
  {
    id: 12,
    preferenceText: '12th Standard',
    value: '12'
  },
  {
    id: 13,
    preferenceText: 'JEE / NEET',
    value: 'jee_neet'
  },
  {
    id: 14,
    preferenceText: 'GUJCET',
    value: 'gujcet'
  },
  {
    id: 15,
    preferenceText: 'Crash Courses',
    value: 'crash_courses'
  },
];

export {
  profile,
  reviews,
  academicPreferences
}