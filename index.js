if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const { Console } = require('console');
const mongoose = require('mongoose');
const Product = require('./model/product');
const User = require('./model/users')
const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const console = require('console');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('express-flash');
const menuRoutes = require('./Routes/menu');
const userRoutes = require('./Routes/users');
const carritoRoutes = require('./Routes/carrito');
const axios = require('axios').create({baseUrl: "http://localhost:8080/"});;
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/el_medicinal'
//const dbUrl = process.env.DB_URL

//'mongodb://localhost:27017/el_medicinal'
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'secretsecret';

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com"
    
];
const connectSrcUrls = [
    "https://res.cloudinary.com/dqyan0vhy/"

   
];
const fontSrcUrls = ["https://fonts.googleapis.com"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqyan0vhy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ]
            
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Guarda y quita de la sesion

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.get("/async", async (req, res) => {
	try {
		const response = await axios({
			url: "https://swapi.dev/api/people/1/",
			method: "get",
		});
		res.status(200).json(response.data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

app.use('/', userRoutes);
app.use('/carrito',carritoRoutes)
app.use('/menu', menuRoutes);
app.get('/Sobre', (req, res) => {
    res.render('SobreElCann.ejs')
});

app.use((err, req, res, next) => {

    const { statuscode = 500 } = err;
    if (!err.message) {
        err.message = 'Oh no Something Went Wrong'
    }
    res.status(statuscode).render('error',{err})
    

})

const port= process.env.PORT || 8080

app.listen(port, () => {
    console.log(`On port ${port}`)
})


