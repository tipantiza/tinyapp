//checks if user exists if so return id otherwise return false;
const getsIdByEmail = (email, database) => {
  for (const userId in database) {
    if (email === database[userId].email) {
      return userId;
    }
  }
  return false;
};

//returns in an object all urls that the user created
const urlsForUser = (id, database) => {
  const tempDatabase = {

  };
  for (const url in database) {
    if (database[url].userID === id) {
      tempDatabase[url] = database[url];
    }
  }
  return tempDatabase;
};

const generateRandomString = () => {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result;
};

module.exports = {
  getsIdByEmail,
  urlsForUser,
  generateRandomString
}