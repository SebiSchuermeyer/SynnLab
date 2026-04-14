// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyBL01CF4uoFyNOcuvld7sUvCmkxq2PZpJY",
  authDomain: "synn-lab-website.firebaseapp.com",
  projectId: "synn-lab-website",
  storageBucket: "synn-lab-website.firebasestorage.app",
  messagingSenderId: "13702226348",
  appId: "1:13702226348:web:07e85688b017e6d301da09",
  measurementId: "G-MSYNH78VTL"
};

// ── GOOGLE CALENDAR CONFIG ──
const CALENDAR_ID = "c_11826ce2a0863e61725e61ca90ed7560418d88d94590c691bc935c0a415794d0@group.calendar.google.com";
const CALENDAR_API_KEY = "AIzaSyCetKTh3b94ojpvivdWyeM2BS0bYJXhfW8";

// ── TEACHER DATA (All 11 Teachers) ──
const TEACHERS = [
  { id: "ulland", name: "Mr. Ulland", subject: "Mathematics", initials: "U", schedule: "Traditional: Monday & Wednesday | In Lab: Tuesday, Thursday, Friday", bio: "Mr. Ulland is one of the math teachers in the lab. He teaches geometry, all the way through CCP calculus. He loves watching bald eagles by the Ohio River and is an expert at predicting snow days!", defaultLocation: "Synn Lab" },
  { id: "pletz", name: "Mr. Pletz", subject: "Mathematics", initials: "P", schedule: "Traditional: Tuesday & Thursday | In Lab: Monday, Wednesday, Friday", bio: "Mr. Pletz is a math teacher in the lab. He teaches algebra 1, geometry, and statistics. In his free time, he spends time with his many kids and many dogs.", defaultLocation: "Math Room" },
  { id: "tuertscher", name: "Mrs. Tuertscher", subject: "English", initials: "T", schedule: "Traditional: Tuesday & Thursday", bio: "Mrs. Tuertscher is an English teacher who teaches English 10, 11, and 12. She is a fitness guru, and legend has it that she finished a full triathlon during her lunch break.", defaultLocation: "English Room" },
  { id: "feist", name: "Mrs. Feist", subject: "English", initials: "F", schedule: "Traditional: Monday & Wednesday", bio: "Mrs. Feist is an English teacher in the lab who teaches English 9, CCP Comp, and AP Lang. When you don't find Mrs. Feist reading a book in the book nook, there's a good chance she is working on Tuesday Talks.", defaultLocation: "English Room" },
  { id: "langdon", name: "Mr. Langdon", subject: "Science", initials: "L", schedule: "Traditional: Tuesday & Thursday", bio: "Mr. Langdon is a science teacher in the lab who teaches Bio, AP Bio, and APES. When he is not teaching science, you can find him coaching swim.", defaultLocation: "Science Room" },
  { id: "arnold", name: "Mr. Arnold", subject: "Science", initials: "A", schedule: "Traditional: Monday & Wednesday", bio: "Mr. Arnold is a science teacher in the lab who teaches Chem. You may find him feeding fish in the fish tank or writing a question of the day.", defaultLocation: "Science Room" },
  { id: "fogelson", name: "Mr. Fogelson", subject: "History", initials: "F", schedule: "Traditional: Tuesday, Thursday, Friday | In Lab: Monday, Wednesday", bio: "Mr. Fogelson is a history teacher in the lab and teaches CCP American and AP Gov. Students describe him as the most 'studious' teacher in the lab.", defaultLocation: "Synn Lab" },
  { id: "hellwig", name: "Mr. Hellwig", subject: "History", initials: "H", schedule: "Traditional: Monday & Wednesday", bio: "Mr. Hellwig is a history teacher in the lab. He teaches world history and AP Human Geography. He is also the water polo coach.", defaultLocation: "History Room" },
  { id: "conatser", name: "Mrs. Conatser", subject: "Academic Coach", initials: "C", schedule: "In Lab daily", bio: "Mrs. Conatser is one of the academic coaches in the lab. If you need any help to set up a plan or manage time better, she is someone you can always go to.", defaultLocation: "Synn Lab" },
  { id: "underwood", name: "Mrs. Underwood", subject: "Meaningful Learning Specialist", initials: "U", schedule: "In Lab daily", bio: "Mrs. Underwood is a staff member in the lab committed to making the most out of the meaningful learning pillar. She schedules field trips.", defaultLocation: "Synn Lab" },
  { id: "burpee", name: "Mrs. Burpee", subject: "Academic Coach", initials: "B", schedule: "In Lab daily", bio: "Mrs. Burpee is an academic coach in the lab. She gives out candy every day to the students, being 'the powerhouse of the lab'.", defaultLocation: "Synn Lab" }
];

// ── STUDENT INTERVIEWS ──
const INTERVIEWS = [
  { name: "Isabel Hoeltje", grade: "10th Grade", skills: "Organization of tasks and prioritization of work.", win: "CCP class success built on previous Synn Lab knowledge.", challenge: "Collaboration and figuring out how to deal with issues that arise.", recommend: "Independent free thinkers who want to grow as learners." },
  { name: "Gaven Gunnerson", grade: "10th Grade", skills: "A bit of leadership, time management, and a lot of executive function.", win: "Creating a Future Friday workshop where I built an escape room.", challenge: "Being behind in ELA at the start of the year.", recommend: "Anyone that is proactive and wants to have a say in their learning." },
  { name: "Isaac Juran", grade: "9th Grade", skills: "Time management skills and productivity skills.", win: "The flexibility allows me to be less stressed.", challenge: "Failing my first test, but then achieving an A on the next test.", recommend: "People who would like to get ahead in classes." },
  { name: "Nathan Reed", grade: "10th Grade", skills: "Time management has gotten leaps and bounds better.", win: "My research paper at the end of my freshman year.", challenge: "Time management. The Synn Lab forces you to use your time well.", recommend: "The want to learn is what you need to succeed." }
];

const LOCATIONS = ["Math Room", "Science Room", "English Room", "History Room", "Synn Lab", "Small Science", "Other"];
const ADMIN_PASSWORD = "SynnStaff26";
