require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session'); 
const helpers      = require('handlebars-helpers')()
const MongoStore   = require('connect-mongo')(session);


// Register helpers list from handlebars-helpers
hbs.registerHelper(helpers);

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// Express session set up
app.use(
  session({
    secret: 'mysecret',
    cookie: {maxAge: 1200000},  // 1200000
    rolling: true,
    store: new MongoStore ({ // store every session information in mongo
      mongooseConnection: mongoose.connection,
    // We could also add some parameters, to limit the time from the backend (time to leave, etc.).
    })
  })
)



// default value for title local
app.locals.title = 'Symbiosis';
app.locals.gmapKey = process.env.GOOGLE_MAPS_API_KEY;
// app.locals.mapId = process.env.MAP_ID;



const index = require('./routes/index');
app.use('/', index);
const signup = require('./routes/authRoute');
app.use('/', signup);
const mapRoute = require('./routes/mapRoute');
app.use('/', mapRoute);
const accountRoute = require('./routes/accountRoute');
app.use('/', accountRoute);
const blog = require('./routes/index');
app.use('/', blog);




module.exports = app;


