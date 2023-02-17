const express = require('express');
const passport = require('passport')
const Sequalize = require('sequelize');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const Orders = require('./models/orders');
const Customers = require('./models/customers');



const port  = 3000;
const app = express();





app.set('view-engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email', // Specify the field used as username
    passwordField: 'password', // Specify the field used as password
  }, async (email, password, done) => {
    try {
      const user = await Customers.findOne({ where: { email } });
  
      // If user does not exist
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
  
      // Compare password hash
      const isMatch = await bcrypt.compare(password, user.password);
  
      // If password does not match
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
  
      // If everything is correct, return the user object
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Customers.findByPk(id);
  
      if (!user) {
        return done(null, false, { message: 'Incorrect user ID.' });
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  app.post('/register', async (req, res) => {
    const { email, full_name, address, password } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Save the new user to the database
      
      const id = uuidv4();

      const user = await Customers.create({
        id,
        email,
        full_name,
        address,
        password: hashedPassword,
      });
  
      // Return the new user object
      // res.json(user);
      res.render('login.ejs')

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error registering new user.' });
    }
  });


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Find the user in the database
    const user = await Customers.findOne({ where: { email } });
  
    // If user doesn't exist, send an error response
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
  
    // If the password is incorrect, send an error response
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Create a session for the user
    req.session.user = user;
  
    // Send a success response
    res.json({ message: 'Login successful' });
  });

app.get('/api/orders', function ( req, res){
    Orders.findAll().then((orders)=>{
        res.json(orders);
    })
});

app.get('/api/orders/:id', function ( req, res){
    let id = req.params.id;
    Orders.findByPk(id).then((order)=>{
        if(order){
            res.json(order);
        }else{
            res.status(404).send();
        }
        
    })
});

app.get('/dashboard', passport.authenticate('local', { session: false }), (req, res) => {
    res.json({ message: 'You are authenticated.' });
  });


  app.get('/', (req, res)=>{
    res.render('index.ejs', {name: 'Mark'});
  });

  app.get('/login', (req, res)=>{
    res.render('login.ejs', {name: 'Mark'});
  });

  app.get('/register', (req, res)=>{
    res.render('register.ejs', {name: 'Mark'});
  });

  app.get('/login', (req, res)=>{
    res.render('login.ejs');
  })
app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});

