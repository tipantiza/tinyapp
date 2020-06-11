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
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
  if(req.cookies["user_id"] && users[req.cookies["user_id"]]){
    const templateVars = {
      user: users[req.cookies.user_id]
    };
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login")
});

app.get('/urls', (req, res) => {
  console.log(urlDatabase);
  const filteredDatabase = urlsForUser(req.cookies['user_id'])
  let templateVars = {
    urls: filteredDatabase,
    user: users[req.cookies.user_id]
  };
  console.log(filteredDatabase);
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

  if(req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID){
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.cookies.user_id]
    };
    return res.render("urls_show", templateVars);
  }
   res.redirect('/urls')
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
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
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies['user_id']};
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  if(req.cookies['user_id'] === urlDatabase[req.params.id].userID){
    urlDatabase[req.params.id].longURL = req.body.longURL
    console.log(urlDatabase);
    return res.redirect("/urls");
  }
  res.redirect('/urls')
});
 
app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID){
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
  }
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

const urlsForUser = (id) => {
  const tempDatabase = {

  }
  for (const url in urlDatabase){
    if(urlDatabase[url].userID === id){
      tempDatabase[url] = urlDatabase[url];
    }
  }
  return tempDatabase;
}