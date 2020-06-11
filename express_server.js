const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('_login', templateVars);
})
app.get('/about', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('about_page', templateVars);
})

app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('regestrationForm', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World<b><body><html>\n");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/register',(req, res) => {
  if(!req.body.email){
    return res.status(400).send('must provide a valid email and or password');
  } else if(!req.body.password){
    return res.status(400).send('must provide a valid email and or password');
  }
  const emailStatus = checkIfEmailExists(req.body.email);
  if(emailStatus){
    return res.status(400).send('email already exists');
  }
  const userID = generateRandomString();
  const newUser = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  users[newUser.id] = newUser;
  res.cookie("user_id", newUser.id);
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = checkIfEmailExists(email);
  
  if(!userID){
    return res.status(403).send('must provide a valid email and or password');
  }

  if(users[userID].password !== password){
    return res.status(403).send('must provide a valid email and or password');
  }
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

app.post('/logout',(req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


app.listen(port, () => {
  console.log(`Example app listening on port: ${port}!`);
  
});


const generateRandomString = () => {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result;
};


const checkIfEmailExists = (email) => {
  for(const userId in users){
    if(email === users[userId].email){
      return userId
    }
  }
  return false;
}