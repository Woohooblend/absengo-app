export const subjects = [
  {
    name: "Algorithm and Programming",
    lecturer: "Prof. Anderson"
  },
  {
    name: "Data Structures",
    lecturer: "Dr. Smith"
  },
  {
    name: "Web Development",
    lecturer: "Prof. Johnson"
  },
  {
    name: "Database Systems",
    lecturer: "Dr. Williams"
  },
  {
    name: "Software Engineering",
    lecturer: "Prof. Brown"
  }
];

export const getRandomSubject = () => {
  const randomIndex = Math.floor(Math.random() * subjects.length);
  return subjects[randomIndex];
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${now.getDate()} ${months[now.getMonth()]}, ${days[now.getDay()]}, ${now.getHours()}:00 - ${now.getHours() + 2}:00`;
};