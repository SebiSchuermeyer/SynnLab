// ── FIREBASE CONFIG ──
export const firebaseConfig = {
  apiKey: "AIzaSyCux-Zu4NtHdba_xV9tHPG3EoSbxNH-iaY",
  authDomain: "synnlab.firebaseapp.com",
  projectId: "synnlab",
  storageBucket: "synnlab.firebasestorage.app",
  messagingSenderId: "646550366753",
  appId: "1:646550366753:web:955784c124fee82669d160",
  measurementId: "G-N9XWC7FVL5"
};

// ── GOOGLE CALENDAR CONFIG ──
export const CALENDAR_ID = "c_11826ce2a0863e61725e61ca90ed7560418d88d94590c691bc935c0a415794d0@group.calendar.google.com";
export const CALENDAR_API_KEY = "AIzaSyCetKTh3b94ojpvivdWyeM2BS0bYJXhfW8";
export const CALENDAR_FULL_URL = "https://calendar.google.com/calendar/u/0?cid=Y18xMTgyNmNlMmEwODYzZTYxNzI1ZTYxY2E5MGVkNzU2MDQxOGQ4OGQ5NDU5MGM2OTFiYzkzNWMwYTQxNTc5NGQwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

// ── TEACHER DATA ──
export const TEACHERS = [
  {
    id: "ulland",
    name: "Mr. Ulland",
    photo: "images/teachers/ulland.png",
    subject: "Mathematics",
    initials: "U",
    schedule: "Traditional: Monday & Wednesday | In Lab: Tuesday, Thursday, Friday",
    bio: "Mr. Ulland is one of the math teachers in the lab. He teaches geometry, all the way through CCP calculus. He loves watching bald eagles by the Ohio River and is an expert at predicting snow days!",
    defaultLocation: "Synn Lab"
  },
  {
    id: "pletz",
    name: "Mr. Pletz",
    photo: "images/teachers/pletz.png",
    subject: "Mathematics",
    initials: "P",
    schedule: "Traditional: Tuesday & Thursday | In Lab: Monday, Wednesday, Friday",
    bio: "Mr. Pletz is a math teacher in the lab. He teaches algebra 1, geometry, and statistics. In his free time, he spends time with his many kids and many dogs. His proudest moment is getting rejected by NASA. He tried out for a game show and did not advance — but on the bright side, he will get every student a lunch of their choice from a restaurant.",
    defaultLocation: "Math Room"
  },
  {
    id: "tuertscher",
    name: "Mrs. Tuertscher",
    photo: "images/teachers/tuertscher.png",
    subject: "English",
    initials: "T",
    schedule: "Traditional: Tuesday & Thursday",
    bio: "Mrs. Tuertscher is an English teacher who teaches English 10, 11, and 12. She is a fitness guru, and legend has it that she finished a full triathlon during her lunch break. Her favorite place to hang out in the lab is in the book nook, and she is always ready to help if you have a question.",
    defaultLocation: "English Room"
  },
  {
    id: "feist",
    name: "Mrs. Feist",
    photo: "images/teachers/feist.png",
    subject: "English",
    initials: "F",
    schedule: "Traditional: Monday & Wednesday",
    bio: "Mrs. Feist is an English teacher in the lab who teaches English 9, CCP Comp, and AP Lang. When you don't find Mrs. Feist reading a book in the book nook, there's a good chance she is working on scheduling Tuesday Talks or reading poetry madness poems. She is always very supportive and willing to proofread your essays.",
    defaultLocation: "English Room"
  },
  {
    id: "langdon",
    name: "Mr. Langdon",
    photo: "images/teachers/langdon.png",
    subject: "Science",
    initials: "L",
    schedule: "Traditional: Tuesday & Thursday",
    bio: "Mr. Langdon is a science teacher in the lab who teaches Bio, AP Bio, and APES. When he is not teaching science, you can find him coaching swim. He is also the go-to person for any questions in the maker space, including the use of our 3D printers and laser cutters.",
    defaultLocation: "Science Room"
  },
  {
    id: "arnold",
    name: "Mr. Arnold",
    photo: "images/teachers/arnold.png",
    subject: "Science",
    initials: "A",
    schedule: "Traditional: Monday & Wednesday",
    bio: "Mr. Arnold is a science teacher in the lab who teaches Chem. When he is not teaching chem to students (and making their brains hurt), he is probably running one of the million things he does in the lab. You may find him feeding fish in the fish tank, writing a question of the day, or being in a meeting with another teacher.",
    defaultLocation: "Science Room"
  },
  {
    id: "fogelson",
    name: "Mr. Fogelson",
    photo: "images/teachers/fogelson.png",
    subject: "History",
    initials: "F",
    schedule: "Traditional: Tuesday, Thursday, Friday | In Lab: Monday, Wednesday",
    bio: "Mr. Fogelson is a history teacher in the lab and teaches CCP American and AP Gov. While passing by his room, you may see the American flag with his face on it. He is the best team leader in the Synn Lab (not biased whatsoever). Students describe him as the most \"studious\" teacher in the lab.",
    defaultLocation: "Synn Lab"
  },
  {
    id: "hellwig",
    name: "Mr. Hellwig",
    photo: "images/teachers/hellwig.png",
    subject: "History",
    initials: "H",
    schedule: "Traditional: Monday & Wednesday",
    bio: "Mr. Hellwig is a history teacher in the lab. He teaches world history and AP Human Geography. He is also the water polo coach here at Sycamore. In the winter, you could catch him playing or watching curling. He is also the newest addition to the Synnovation Lab staff!",
    defaultLocation: "History Room"
  },
  {
    id: "conatser",
    name: "Mrs. Conatser",
    photo: "images/teachers/conatser.png",
    subject: "Academic Coach",
    initials: "C",
    schedule: "In Lab daily",
    bio: "Mrs. Conatser is one of the academic coaches in the lab. If you need any help to set up a plan or manage time better, she is someone you can always go to. She is one of the adult leaders in Fashion for the Cure, and is always willing to help.",
    defaultLocation: "Synn Lab"
  },
  {
    id: "underwood",
    name: "Mrs. Underwood",
    photo: "images/teachers/underwood.jpg",
    subject: "Meaningful Learning Specialist",
    initials: "U",
    schedule: "In Lab daily",
    bio: "Mrs. Underwood is a staff member in the lab committed to making the most out of the meaningful learning pillar of the lab. She schedules field trips to help expand the knowledge of the students in a deeper way. She also assists other teachers in a variety of ways.",
    defaultLocation: "Synn Lab"
  },
  {
    id: "burpee",
    name: "Mrs. Burpee",
    photo: "images/teachers/burpee.png",
    subject: "Academic Coach",
    initials: "B",
    schedule: "In Lab daily",
    bio: "Mrs. Burpee is an academic coach in the lab. She is another person you can go to for help if you need. She gives out candy every day to the students of the lab, being \"the powerhouse of the lab\". She is very passionate about her work, and is always excited to go out of her way to help a student in need.",
    defaultLocation: "Synn Lab"
  }
];

// ── STUDENT INTERVIEWS ──
export const INTERVIEWS = [
  {
    name: "Isabel Hoeltje",
    grade: "10th Grade",
    skills: "Organization of tasks and prioritization of work.",
    win: "CCP class success built on previous Synn Lab knowledge.",
    challenge: "Collaboration and figuring out how to deal with issues that arise. Improved by simply doing it more often — learning what works and what doesn't.",
    recommend: "People who don't love the routine of 'the teacher tells you what to do and you do it.' Independent free thinkers who want to be independent but still have access to support, and who want to grow as learners and are able to take feedback well."
  },
  {
    name: "Gaven Gunnerson",
    grade: "10th Grade",
    skills: "A bit of leadership, a bit of time management, and a lot of executive function. A sense of responsibility over my work.",
    win: "Creating a Future Friday workshop where I built an escape room to challenge people's problem-solving skills. Those that escaped got brownies.",
    challenge: "Being behind in ELA at the start of the year. Used support from teachers like Mrs. Conatser. The teachers are always willing to help as long as you seek out support.",
    recommend: "Anyone that is proactive, willing to take accountability, and wants to have a say in what they are learning."
  },
  {
    name: "Isaac Juran",
    grade: "9th Grade",
    skills: "Time management skills and productivity skills.",
    win: "The flexibility allows me to be less stressed.",
    challenge: "Failing my first test, but after engaging in the formative process I achieved an A on the next test.",
    recommend: "People who would like to get ahead in classes and feel limited by the pace of a class, or those who sometimes struggle to catch up."
  },
  {
    name: "Nathan Reed",
    grade: "10th Grade",
    skills: "Time management has gotten leaps and bounds better. Work ethic has also improved because success is up to you, even though you have support from teachers.",
    win: "My research paper at the end of my freshman year. I had the ability to choose the topic and it led me to be passionate about the work I made — I am still proud of it.",
    challenge: "Time management. The Synn Lab forces you to use your time well, and right now I am ahead in all my classes because I have managed my time well.",
    recommend: "The want to learn is what you need to succeed."
  }
];

// ── LOCATIONS ──
export const LOCATIONS = [
  "Math Room",
  "Science Room",
  "English Room",
  "History Room",
  "Synn Lab",
  "Small Science",
  "Other"
];

export const ADMIN_PASSWORD = "SynnStaff26";

// Make variables globally available for inline onclick handlers
window.CALENDAR_FULL_URL = CALENDAR_FULL_URL;
