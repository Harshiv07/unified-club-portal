export const DB_URL = process.env.REACT_APP_DB_URL || "http://localhost:5000";
export const SIGNUP_URL = DB_URL + "/auth/signup";
export const SIGNIN_URL = DB_URL + "/auth/signin";
export const VERIFY_TOKEN = DB_URL + "/auth/verifyToken";

export const CLUB_LIST_URL = DB_URL + "/clubs";
export const NEW_CLUB_URL = DB_URL + "/club";
export const CLUB_ENROLL_URL = DB_URL + "/club/enroll";
export const CLUB_LEAVE_URL = DB_URL + "/club/leave";

export const USER_LIST_URL = DB_URL + "/user/userList";
export const REGISTERED_EVENT_URL = DB_URL + "/user/events-list";

export const NEW_EVENT_URL = DB_URL + "/event";
export const EVENT_LIST_URL = DB_URL + "/events/list";
export const EVENT_REGISTER_URL = DB_URL + "/event/register";

export const GET_RESOURCE_URL = DB_URL + "/resource";

export const NEW_FEEDBACK = DB_URL + "/event/feedback";

export const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

export const imageUrl = [
  {
    category: "Work",
    imgUrl: "https://www.freepik.com/blog/app/uploads/2017/10/svg-previa.jpg",
  },
  {
    category: "Fun",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMvw26w2i8FfL7_Kr4tZ3CqBOXHLVovHyJDQ&usqp=CAU",
  },
  {
    category: "Sports",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sport_balls.svg/1200px-Sport_balls.svg.png",
  },
  {
    category: "Music",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Musical_notes.svg/1280px-Musical_notes.svg.png",
  },
  {
    category: "SelfImprov",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjZfVulolQIcCtP-m2OpHUW90cHenKKY8byg&usqp=CAU",
  },
  {
    category: "Other",
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/myspace-ec3c9.appspot.com/o/64c35da8ce05400291f6eaf561d1acea.png?alt=media&token=b517a4e5-06e2-49f7-a224-801cfac3c6a7",
  },
  {
    category: "Love",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-HdyIn2FRLRBmtL9O2EYw4-2Fz4cHVYG6g&usqp=CAU",
  },
];
