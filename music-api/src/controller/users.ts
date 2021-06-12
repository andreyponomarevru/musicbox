/*
import path from 'path';
import util from 'util';
import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
// REST-based user authentication model
import * as usersModel from '../models/users-superagent.mjs';

import { sessionCookieName } from '../app.mjs';

export const router = express.Router();

import DBG from 'debug';
const debug = DBG('notes:router-users');
const error = DBG('notes:error-users');

/* Note: Passport doesn't check passwords, that's something we have to implement ourselves, we did it in line 'passport.use(new LocalStrategy(...' below.

In app.mjs we will be adding "session" support so our users can log in
and log out. That relies on storing a cookie in the browser, and the
cookie name is found in sessionCookieName variable exported from app.mjs. We'll be using that cookie in a moment.

The initPassport function will be called from app.mjs, and it installs the
Passport middleware into the Express configuration. We'll discuss the
implications of this later when we get to app.mjs changes, but !!! Passport
uses sessions to detect whether this HTTP request is authenticated
or not !!!. It looks at every request coming into the application, looks
for clues about whether this browser is logged in or not (AFAIU, it does this by checking the string in a cookie), and attaches data to the request object as req.user.

Algorithm:

- I'm trying to open a page, browser send request for the page to server

- server i.e .application, sets a cookie: 
  - first, the session's file created in 'sessions' dir and its name is a unique string (we call this string a "session id", although session id contains more symbold (explained below))
  - then the server sends the response to the browser: response contains the requested page and the cookie. The cookie's "value" field contains "session id" string (but it longer then session's file name described above, i.e. it contains more symbols). 

- now I want to Log In. I input login and password and submit the form with POST request by clicking "Log In". When I click 'Log In' the browser send login+pass and as always automatically sends the same cookie

- Now, the server gets the request: the requests as always contains my cookie. This allows passport to know that I'm the same person. This cookie is sent not only on Log In, but with any type of request, so Passport always tracks me and knows that it's me, identifying my browser by cookie's value (string). 

But now, as I've mentioned, when I'm logging in, the request also contains name/pass. 

So, Passport checks a cookie - it makes sure that it's still me, and not someone else.

Then Passport checks login/password using the function implemented by myself, which compares the provided name/pass with the one in database. 

If user/pass is succesfully verified i.e. if the user is allowed to log in / or already is logged in, Passport.js will create 'user' object in 'req' (i.e. req.user) for every request in express.js, which you can check for existence in any middleware. 

https://mianlabs.com/2018/05/09/understanding-sessions-and-local-authentication-in-express-with-passport-and-mongodb/

https://stackoverflow.com/questions/18739725/how-to-know-if-user-is-logged-in-with-passport-js

https://www.freecodecamp.org/forum/t/handling-passportjs-authenticated-user-in-the-front-end/75913/6

Passport remembers that you're logged in using the aforementioned cookie.

So, server code continues it's execution (Passport already checked my pass and a cookie, so it created req.user object) > in ensureAuthenticated middleware function I check if 'req.user' is not undefined and if note, pass the execution to the next middleware which is usually the middleware returning a page which contains the stuff that only logged in person is allowed to see

- When I click Log Out, sending the requests to the server, server deletes the old cookie in browser and sets the new cookie (i.e. ne string i.e. new cookie file created in 'sessions' dir on the server with a string as a cookie's name)
So, now Passport know the user with cookie 'fdnmd54wu5yhv5zkaDAOi' is NOT logged in. *

export function initPassport(app) {
  /* Initializes Passport (initialize() setups the functions to serialize/deserialize the user data from the request). We'are required to use it before using 'passport.session()'.
  
  We then access this user data from request in ensureAuthenticated() function in line 'if (req.user) next();' *
  app.use(passport.initialize()); 
  /* passport.session() acts as a middleware to alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.

  app.use(passport.session()); is equivalent to app.use(passport.authenticate('session')); Where 'session' refers to the following strategy that is bundled with passportJS. *
  app.use(passport.session());
}

/* The ensureAuthenticated function will be used by other routing modules
and is to be inserted into any route definition that requires an
authenticated logged-in user. For example, editing or deleting a
note requires the user to be logged in, and therefore the
corresponding routes in routes/notes.mjs must use ensureAuthenticated. If
the user is not logged in, this function redirects them to /users/login
so that they can do so.

So, We need to use the ensureAuthenticated function to protect certain
routes from being used by users who are not logged in.*
export function ensureAuthenticated(req, res, next) {
  try {
    // req.user is set by Passport in the deserialize function
    if (req.user) next();
    else res.redirect('/users/login');
  } catch (err) {
    next(err);
  }
}

/* Because this router is mounted on /users, all these routes will have /user prepended. */

/* The /users/login route simply shows a form requesting a username and password. 

When this form is submitted, we land in the second route declaration, with a POST on /users/login. If passport deems this a successful login attempt using LocalStrategy, then the browser is redirected to the home page. Otherwise, it is
redirected to the /users/login page *

router.get('/login', (req, res, next) => {
  try {
    res.render( 'login', { title: "Login to Notes", user: req.user } );
  } catch (err) {
    next(err);
  }
});

router.post(
  '/login', 
  passport.authenticate(
    'local', 
    {
      successRedirect: '/', // SUCCESS: Go to home page
      failureRedirect: 'login' // FAIL: Go to /user/login
    }
  )
);

/* When the user requests to log out of Notes, they are to be sent to
/users/logout. We'll be adding a button to the header template for this
purpose. The req.logout function instructs Passport to erase their
login credentials, and they are then redirected to the home page.

This function deviates from what's in the Passport documentation.
There, we are told to simply call req.logout. But calling only that
function sometimes results in the user not being logged out. It's
necessary to destroy the session object, and to clear the cookie, in
order to ensure that the user is logged out. The cookie name is
defined in app.mjs, and we imported sessionCookieName for this function *
router.get('/logout', (req, res, next) => {
  try {
    debug('/logout');
    req.session.destroy();
    req.logout();
    res.clearCookie(sessionCookieName);
    res.redirect('/');
  } catch (err) {
    error(`/logout ERROR ${err.stack}`);
    next(err);
  }
});

/* Here is where we define our implementation of LocalStrategy. In the
callback function, we call usersModel.userPasswordCheck, which makes a
REST call to the user authentication service. 

Here is where we define our implementation of LocalStrategy. In the
callback function, we call usersModel.userPasswordCheck, which makes a
REST call to the user authentication service. Remember that this
performs the password check and then returns an object indicating
whether they're logged in or not. 

A successful login is indicated when check.check is true. For this case,
we tell Passport to use an object containing the username in the session
object. Otherwise, we have two ways to tell Passport that the login
attempt was unsuccessful. In one case, we use done(null, false) to
indicate an error logging in, and pass along the error message we
were given. In the other case, we'll have captured an exception, and
pass along that exception. 

You'll notice that Passport uses a callback-style API. Passport
provides a done function, and we are to call that function when we
know what's what. While we use an async function to make a clean
asynchronous call to the backend service, Passport doesn't know
how to grok the Promise that would be returned. Therefore, we have
to throw a try/catch around the function body to catch any thrown
exception. *
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      debug(`userPasswordCheck(${username}, ${password})`);
      const check = await usersModel.userPasswordCheck(username, password);
      if (check.check) {
        debug(`userPasswordCheck shows good user ${util.inspect(check)}`);
        done(null, { id: check.user, username: check.user });
      } else {
        debug(`userPasswordCheck shows BAD user ${util.inspect(check)}`);
        done(null, false, check.message);   
      }
    } catch (err) {
      error(`userPasswordCheck shows ERROR ${err.stack}`);
      done(err);
    }
  }
));

// The preceding functions take care of encoding and decoding
//authentication data for the session. All we need to attach to the
//session is the username, as we did in serializeUser. The deserializeUser
//object is called while processing an incoming HTTP request and is
//where we look up the user profile data. Passport will attach this to
//the request object. 
passport.serializeUser((user, done) => {
  try { 
    done(null, user.username); 
  } catch (err) {
    error(`serializeUser ERROR ${e.stack}`); 
    done(err); 
  }
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await usersModel.find(username);
    done(null, user);
  } catch (err) {
    error(`deserializeUser ERROR ${e.stack}`);
    done(err);
  }
});
*/
