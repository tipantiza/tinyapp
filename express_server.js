const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {getsIdByEmail, urlsForUser, generateRandomString} = require('./helpers')
const app = express();
const port = 8080;
const saltRounds = 10;
// app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: [
    "someRandomreallylongstringidontreallyknowwhatimdoingbutthisseemrightforsomereasonilljustkeepmakingitlongerforawhileandmaybeillstopnow",
    "nextrandomstuffsupposidlythisiswhatimsupposedtodo?whoknowbutletskeepitgoingandillfigureitoutlater"
  ]
}));

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
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('_login', templateVars);
});

app.get('/about', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('about_page', templateVars);
});

app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('regestrationForm', templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.session["user_id"] && users[req.session["user_id"]]) {
    const templateVars = {
      user: users[req.session.user_id]
    };
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

app.get('/urls', (req, res) => {
  const filteredDatabase = urlsForUser(req.session.user_id, urlDatabase);
  let templateVars = {
    urls: filteredDatabase,
    user: users[req.session.user_id]
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

  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };
    return res.render("urls_show", templateVars);
  }
  res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post('/register',(req, res) => {
  //making sure given email isnt an empy value
  if (!req.body.email) {
    return res.status(400).send('must provide a valid email and or password');
  } else if (!req.body.password) {
    return res.status(400).send('must provide a valid email and or password');
  }
  //checks to make sure we arent making a dublicate user profile
  const emailStatus = getsIdByEmail(req.body.email, users);
  if (emailStatus) {
    return res.status(400).send('email already exists');
  }
  //hash password to hopefully prevent hackers
  bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
    const userID = generateRandomString();
    const newUser = {
      id: userID,
      email: req.body.email,
      password: hashedPassword
    };
    users[newUser.id] = newUser;
    req.session.user_id = userID;
    res.redirect("/urls");
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getsIdByEmail(email, users);
  
  if (!userID) {
    return res.status(403).send('must provide a valid email and or password');
  }
  bcrypt.compare(password, users[userID].password, function(err, result) {
    if (result) {
      req.session.user_id = userID;
      res.redirect("/urls");
    } else {
      res.status(403).send('must provide a valid email and or password');
    }
  });
});

app.post('/logout',(req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    return res.redirect("/urls");
  }
  res.redirect('/urls');
});
 
app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}!`);
  
});



