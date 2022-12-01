const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express();

const conn = require('./db/conn')

const Tought = require('./models/Tought')
const User = require('./models/User')
const UserLike = require('./models/UserLike')

const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes')
const userLikeRoutes = require('./routes/userLikeRoutes')


const ToughtController = require('./controllers/ToughtsController');


app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', "hbs")

app.use(express.urlencoded({extended: true}))

app.use(express.json())

// session middleware

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require("path").join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false, 
            maxAge: 86400000,
            expires: new Date(Date.now() + 86400000),
            httpOnly: true
        }
    })
)

// flash messages
    app.use(flash())

// public path
    app.use(express.static('public'))

// set session to res
    app.use((req, res, next) => {

        if(req.session.userid) {
            res.locals.session = req.session
        }
        next()
    })

// Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.use('/', userLikeRoutes)

app.get('/',ToughtController.showToughts)

conn.sequelize.sync().then(() => {
    app.listen(3000)
}).catch((err) => console.log(err))