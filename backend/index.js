import express from 'express'
import cors from 'cors'
import session from 'express-session'
//Routes
import routes from './routes/routes.js'
import auth_routes from './routes/auth.routes.js'
import {createClient} from 'redis'
import {RedisStore} from 'connect-redis'
import dotenv from 'dotenv'
dotenv.config({path:"./process.env"});

const app = express()

//Session
const redisClient = createClient({
  url: 'redis://redis'
});
redisClient.on('error', (err) => console.error('Erreur Redis Client', err)); //Redirection of errors
await redisClient.connect();
const redisStore_var = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

app.use(session({
    store: redisStore_var,
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_ID,
    cookie: {
        secure: false, //PROD : TRUE
        httpOnly: true,
        maxAge: 10*60*1000 // 10 mins
    }
}));



//Middleware
app.use(express.json());
app.set('trust proxy', 1);
app.use(cors({
  origin: 'http://frontend', 
  credentials: true,
}))


app.use('/api', routes)
app.use('/api', auth_routes)

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is ready to use');
});

app.listen(8080, () => {
    console.log('Le serveur écoute sur le port 8080');
});