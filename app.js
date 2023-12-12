import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { authenticateAdmin, authenticatePlayer } from './middleware/auth.js';

const port = 3000;
const debug = true;

/*
TODO:
- Build out routes
*/

app.use(express.json());
app.use(express.urlencoded({extened: true}));

app.use(session({
    name: "AuthState",
    secret: "Goodminton",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 },
}));

if(debug){
    app.use("/", (req, res, next) => {
        console.log(
          `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
            req.session.user ? "User is authenticated as" : "User not authenticated"
          } ${req.session.user ? req.session.user.role : ""})`
        );
    });
}

const adminRoutes = [];
adminRoutes.forEach(route => app.use(route, authenticateAdmin));

const playerRoutes = [];
playerRoutes.forEach(route => app.use(route, authenticatePlayer));


configRoutes(app);

app.listen(port, () => {
    console.log(`Goodminton server running on http://localhost:${port}`);
});