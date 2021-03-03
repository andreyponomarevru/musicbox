import restify from 'restify';
import util from 'util';

import DBG from 'debug';
const log = DBG('users:serivce');
const error = DBG('users:error');

import * as usersModel from './users-postgresql.mjs';
// alternatively, instead of postgresql, you can use sequalize:
// import * as usersModel from './users-sequelize.mjs';

/* The createServer method can take a long list of configuration options.
These two may be useful for identifying information */
const server = restify.createServer({
  name: "User-Auth-Service",
  version: "0.0.1"
});

/* As with Express applications, the server.use calls initialize what
Express would call middleware functions, but which Restify calls
handler functions. These are callback functions whose API is function
(req, res, next). As with Express, these are the request and response
objects, and next is a function which, when called, carries execution
to the next handler function 

The handler functions listed here (functions inside each 
'server.use( here )') do two things: authorize requests
and handle parsing parameters from both the URL and the post
request body
*/

// looks for HTTP basic auth headers:
server.use(restify.plugins.authorizationParser());
// emulates the idea of an API token to control access:
server.use(check);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));

/* As for Express, the server.VERB functions let us define the handlers for
specific HTTP actions. This route handles a POST on /create-user,
and, as the name implies, this will create a user by calling the
usersModel.create function. 

As a POST request, the parameters arrive in the body of the request
rather than as URL parameters. Because of the mapParams flag on the
bodyParams handler, the arguments passed in the HTTP body are
added to req.params. 

We simply call usersModel.create with the parameters sent to us. When
completed, the result object should be a user object, which we send
back to the requestor using res.send: */
server.post('/create-user', async (req, res, next) => {
  try {
    const result = await usersModel.create(
      req.params.username,
      req.params.password,
      req.params.provider,
      req.params.familyName, 
      req.params.givenName,
      req.params.middleName,
      req.params.emails,
      req.params.photos
    );

    res.send(result);
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
});

/* The /update-user route is handled in a similar way. However, we have
put the username parameter on the URL. Like Express, Restify lets you
put named parameters in the URL like as follows. Such named
parameters are also added to req.params. 

We simply call usersModel.update with the parameters sent to us. That,
too, returns an object we send back to the caller with res.send:
*/
server.post('/update-user/:username', async (req, res, next) => {
  try {
    const result = await usersModel.update(
      req.params.username,
      req.params.password,
      req.params.provider,
      req.params.familyName,
      req.params.givenName,
      req.params.middleName,
      req.params.emails,
      req.params.photos
    );

    res.send(usersModel.sanitizedUser(result));
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
});

/* This handles our findOrCreate operation. We simply delegate this to
the model code, as done previously. 

As the name implies, we'll look to see whether the named user
already exists and, if so, simply return that user, otherwise it will be
created: */
// Find a user, if not found create one given profile information
server.post('/find-or-create', async (req, res, next) => {
  log(`find-or-create ${util.inspect(req.params)}`);
  try {
    const result = await usersModel.findOrCreate({
      id: req.params.username,
      username: req.params.username,
      password: req.params.password,
      provider: req.params.provider,
      familyName: req.params.familyName,
      givenName: req.params.givenName,
      middleName: req.params.givenName,
      emails: req.params.emails,
      photos: req.params.photos
    });
    
    res.send(result);
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
});

/* Here, we support looking up the user object for the provided username.

If the user was not found, then we return a 404 status code because
it indicates a resource that does not exist. Otherwise, we send the
object that was retrieved: */
// Find the user data (does not return password)
server.get('/find/:username', async (req, res, next) => {
  try {
    const user = await usersModel.find(req.params.username);
    if (!user) {
      res.send(404, new Error(`Did not find ${req.params.username}`))
    } else {
      res.contentType = 'json';
      res.send(user);
    }
    next(false);
  } catch(err) {
    res.send(500, err);
    error(`/find/${req.params.username} ${err.stack}`);
    next(false);
  }
});

/* This is how we delete a user from the Notes application. The
DEL HTTP verb is meant to be used to delete things on a server,
making it the natural choice for this functionality: */
// // Delete/destroy a user record
server.del('/destroy/:username', async (req, res, next) => {
  try {
    await usersModel.destroy(req.params.username);
    res.send({});
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
} );

/* This is another aspect of keeping the password solely within this
server. The password check is performed by this server, rather than
in the Notes application. We simply call the usersModel.userPasswordCheck
function shown earlier and send back the object it returns:*/
// check password
server.post('/passwordCheck', async (req, res, next) => {
  console.log('pass check \;)');
  try {
    const checked = await usersModel.userPasswordCheck(
      req.params.username, req.params.password
    );
    res.send(checked);
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
});

/* Then, finally, if required, we send a list of Notes application users
back to the requestor. In case no list of users is available, we at least
send an empty array: */
// list users
server.get('/list', async (req, res, next) => {
  try {
    let userlist = await usersModel.listUsers();
    if (!userlist) userlist = [];
    res.send(userlist);
    next(false);
  } catch(err) {
    res.send(500, err);
    next(false);
  }
});

// don't forget we use Restify, not Express, so the args to server.listen are a bit different
server.listen(process.env.PORT, 'localhost', function() {
  log(`${server.name} listening at ${server.url}`);
});

//
//  Mimic API Key authentication
//

const apiKeys = [{
  user: 'them',
  key: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF'
}];

/* This last function, check, implements authentication for the REST
API itself. This is the handler function we added earlier in the code. 

It requires the caller to provide credentials on the HTTP request
using the basic auth headers. The authorizationParser handler looks for
this and gives it to us on the req.authorization.basic object. The check
function simply verifies that the named user and password
combination exists in the local array.

This is meant to mimic assigning an API key to an application.
There are several ways of doing so; this is just one.

This approach is not limited to just authenticating using HTTP
basic auth. The Restify API lets us look at any header in the HTTP
request, meaning we could implement any kind of security
mechanism we like. The 'check' function could implement some other
security method, with the right code.

Because we added check with the initial set of server.use handlers, it is
called on every request. Therefore, every request to this server must
provide the HTTP basic auth credentials required by this check.
*/
function check(req, res, next) {
  if (req.authorization) { // get the Authorization headers from HTTP request
    let found = false;
    for (let auth of apiKeys) {
      if (auth.key === req.authorization.basic.password && auth.user === req.authorization.basic.username) {
        found = true;
        break;
      }
    }

    if (found) next();
    else {
      res.send(401, new Error('Not authenticated'));
      next(false);
    }
  } else {
    res.send(500, new Error('Now Authorization Key'));
    next(false);
  }
}