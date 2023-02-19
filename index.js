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
const Products = require('./models/products');
const Categories = require('./models/categories');
const Order_details = require('./models/order_details')

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
      const isMatch = await bcrypt.compare(password, user.password.toString());
  
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

    //POST METHODS

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


  app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    req.login(req.user, function(err) {
      if (err) { return next(err); }
      req.session.userId = req.user.id;
      return res.redirect('/'); 
    });
  });

    //GET METHODS

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


  app.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
      let userId = req.session.userId;
      let customer = await Customers.findByPk(userId)
      res.render('index.ejs', {name: customer.full_name});
    }
      else {
      res.render('index.ejs', {name: 'Customer'});
    }
  });

  app.get('/login', (req, res)=>{
    res.render('login.ejs');
  });

  app.get('/register', (req, res)=>{
    res.render('register.ejs');
  });

  app.get('/login', (req, res)=>{
    res.render('login.ejs');
  })

  app.get('/products', (req, res)=>{
    res.render('products.ejs')
  })

  app.get('/categories', (req, res)=>{
    Categories.findAll().then((categories)=>{
      res.json(categories);
    })
  })

app.listen(port, ()=>{
    console.log('Listening on port ' + port);
});

