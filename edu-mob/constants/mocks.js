const categories = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    count: 147,
    image: require('../assets/icons/maths.png')
  },
  {
    id: 'history',
    name: 'History',
    count: 16,
    image: require('../assets/icons/history.png')
  },
  {
    id: 'english',
    name: 'English',
    count: 68,
    image: require('../assets/icons/english.png')
  },
  {
    id: 'hindi',
    name: 'Hindi',
    count: 17,
    image: require('../assets/icons/language.png')
  },
  {
    id: 'geography',
    name: 'Geography',
    count: 47,
    image: require('../assets/icons/geography.png')
  },
  {
    id: 'science',
    name: 'Science',
    count: 47,
    image: require('../assets/icons/science.png')
  },
];

//   const products = [
//     {
//       id: 1, 
//       name: '16 Best Plants That Thrive In Your Bedroom',
//       description: 'Bedrooms deserve to be decorated with lush greenery just like every other room in the house – but it can be tricky to find a plant that thrives here. Low light, high humidity and warm temperatures mean only certain houseplants will flourish.',
//       tags: ['Interior', '27 m²', 'Ideas'],
//       images: [
//         require('../assets/images/plants_1.png'),
//         require('../assets/images/plants_2.png'),
//         require('../assets/images/plants_3.png'),
//         // showing only 3 images, show +6 for the rest
//         require('../assets/images/plants_1.png'),
//         require('../assets/images/plants_2.png'),
//         require('../assets/images/plants_3.png'),
//         require('../assets/images/plants_1.png'),
//         require('../assets/images/plants_2.png'),
//         require('../assets/images/plants_3.png'),
//       ]
//     }
//   ];

//   const explore = [
//     // images
//     require('../assets/images/explore_1.png'),
//     require('../assets/images/explore_2.png'),
//     require('../assets/images/explore_3.png'),
//     require('../assets/images/explore_4.png'),
//     require('../assets/images/explore_5.png'),
//     require('../assets/images/explore_6.png'),
//   ];

const mycourses = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    count: 12,
    image: require('../assets/icons/maths.png')
  },
  {
    id: 'history',
    name: 'History',
    count: 13,
    image: require('../assets/icons/history.png')
  },
  {
    id: 'english',
    name: 'English',
    count: 6,
    image: require('../assets/icons/english.png')
  },
];

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

const coursesList = [
  {
    courseId: 1,
    standard: "6",
    courseName: "Concepts of Borrowing and Lending",
    courseDesc: "Chapter 1",
    courseThumbnail: require('../assets/images/borrow.png'),
  },
  {
    courseId: 2,
    standard: "6",
    courseName: "Profit and Loss",
    courseDesc: "Chapter 2",
    courseThumbnail: require('../assets/images/maths.png'),
  },
  {
    courseId: 3,
    standard: "6",
    courseName: "Simple Interest",
    courseDesc: "Chapter 3",
    courseThumbnail: require('../assets/images/percentage.png'),
  },
  {
    courseId: 4,
    standard: "6",
    courseName: "Compound Interest",
    courseDesc: "Chapter 4",
    courseThumbnail: require('../assets/images/compound.png'),
  },
  {
    courseId: 5,
    standard: "6",
    courseName: "Basics of Addition",
    courseDesc: "Chapter 5",
    courseThumbnail: require('../assets/images/addition1.png'),
  },
  {
    courseId: 6,
    standard: "6",
    courseName: "Basics of Substraction",
    courseDesc: "Chapter 6",
    courseThumbnail: require('../assets/images/minus.png'),
  },
  {
    courseId: 7,
    standard: "6",
    courseName: "Basics of Multiplication",
    courseDesc: "Chapter 7",
    courseThumbnail: require('../assets/images/multiply.png'),
  },
  {
    courseId: 8,
    standard: "6",
    courseName: "Basics of Division",
    courseDesc: "Chapter 8",
    courseThumbnail: require('../assets/images/division.png'),
  },
  {
    courseId: 9,
    standard: "6",
    courseName: "Advanced Concepts of Addition",
    courseDesc: "Chapter 9",
    courseThumbnail: require('../assets/images/addition1.png'),
  },
  {
    courseId: 10,
    standard: "6",
    courseName: "Advanced Concepts of Substraction",
    courseDesc: "Chapter 10",
    courseThumbnail: require('../assets/images/minus.png'),
  },
  {
    courseId: 11,
    standard: "6",
    courseName: "Advanced Concepts of Multipliaction",
    courseDesc: "Chapter 11",
    courseThumbnail: require('../assets/images/multiply.png'),
  },
  {
    courseId: 12,
    standard: "6",
    courseName: "Advanced Concepts of Division",
    courseDesc: "Chapter 12",
    courseThumbnail: require('../assets/images/division.png'),
  },
];

const videos = [
  {
    videoId: 1,
    thumbnailUrl: 'http://www.abmintl.in/Images/pl.png',
    videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    videoTitle: 'Profit and Loss - Part 1',
    videoDesc: 'This video is intended to educate you on the basics of profit and loss. You would learn the fundamentals about what is profit and loss and the calculations behind it. By the end of the course you would be able to solve complex problems related to profit and loss on your own.',
    availableOffline: false,
    offlineUrl: '',
  },
  {
    videoId: 2,
    thumbnailUrl: 'https://kredcor.co.za/wp-content/uploads/2014/11/creditRiskProfitLoss.png',
    videoUrl: 'http://mirrors.standaloneinstaller.com/video-sample/grb_2.mp4',
    videoTitle: 'Profit and Loss - Part 2',
    videoDesc: 'This video is intended to educate you on the basics of profit and loss. You would learn the fundamentals about what is profit and loss and the calculations behind it. By the end of the course you would be able to solve complex problems related to profit and loss on your own.',
    availableOffline: false,
    offlineUrl: '',
  },
];

const documents = [
  {
    documentId: 1,
    documentTitle: 'Profit and Loss Basics',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    doucmentType: 'pdf',
  },
  {
    documentId: 2,
    documentTitle:'Profit and Loss Advanced',
    documentUrl: 'http://www.sedl.org/afterschool/toolkits/science/pdf/ast_sci_data_tables_sample.pdf',
    doucmentType: 'pdf',
  },
  {
    documentId: 3,
    documentTitle:'Profit and Loss Advanced Continued',
    documentUrl: 'https://www.entnet.org/sites/default/files/uploads/PracticeManagement/Resources/_files/instructions-for-adding-your-logo.pdf',
    doucmentType: 'pdf',
  },
];

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
  categories,
  mycourses,
  coursesList,
  profile,
  videos,
  documents,
  reviews,
  academicPreferences
}