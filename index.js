const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        Models      = require('./models.js');

const app           = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

const cors  = require('cors');
app.use(cors());

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://testsite.com', 'https://cinefiles.netlify.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1){ //if a specific origin isn't found on list of allowed origins
            let message =  'the CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null,true);
    }
}));

let auth    = require('./auth')(app);
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport');

const movie_model   = Models.Movie;
const user_model    = Models.User;

function connectToDB(){
    //mongoose.connect("mongodb://localhost:27017/CineFilesDB", { //localhost db connection
	mongoose.connect(process.env.CONNECTION_URI, { //connection_uri is declared in heroku config vars: connection_uri = mongodb+srv://Admin-1:rOute125!@main-cluster.7ilmh.mongodb.net/CineFilesDB?retryWrites=true&w=majority
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify : false
    }); //i have also tried 127.0.0.1
    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function callback(){
        console.log("CONNECTED");
    });
};

connectToDB();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('/documentation.html', {
        root: __dirname + '/public'
    });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//app.get('/movies', (req, res) => {
    movie_model.find()
    .then((movies) => {       
        res.status(201).json(movies);
    })
    .catch((err) => {        
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//find movies by MovieTitle
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findOne( {title : req.params.title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/:title/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findOne( {title : req.params.title })
    .then((movie) => {
        res.json(movie.title + ' :  ' + movie.genre.description);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/genre/:genrename', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.find( { 'genre.name' : req.params.genrename })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//find movies by MovieID
/*app.get('/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {    
    movie_model.findById(req.params.movieID)
    .then((movie) => {
        res.json(movie);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/:movieID/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findById(req.params.movieID)
    .then((movie) => {
        res.json(movie.title + ' :  ' + movie.genre.description);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
}); */

app.get('/director/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.find( { 'director.name' : req.params.director })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.post('/register', 
    //validation logic here for request
    //you can either use a chain of methods like .not().isEmpty() which means "opposite of isEmpty" in plain english "is not empty"
    // or use .isLength({min: 5}) which means minimum value of 5 characters are only allowed
    [
        check('username')
            .trim().not().isEmpty().withMessage('Username must not be blank')
            .isLength({min: 5}).withMessage('Username Minimum Length is 5 Characters')
            .isAlphanumeric().withMessage('Username must be Letters and Numbers Only'),
        check('password')
            .trim().not().isEmpty().withMessage('Password must not be blank')
            .isLength({min: 5}).withMessage('Password Minimum Length is 5 Characters')
            .isAlphanumeric().withMessage('Password must be Letters and Numbers Only'),
        check('firstname')
            .trim().not().isEmpty().withMessage('First Name must not be blank')
            .isLength({min: 2}).withMessage('First Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('First Name must be Letters Only'),    
        check('lastname')
            .trim().not().isEmpty().withMessage('Last Name must not be blank')
            .isLength({min: 2}).withMessage('Last Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('Last Name must be Letters Only'),             
        check('email')
            .trim().normalizeEmail().not().isEmpty().withMessage('Email must not be blank')
            .isEmail().withMessage('Email Adddress is Invalid'),
        check('birthdate')
            .isISO8601().toDate().withMessage('Birthdate is Invalid')
    ], (req, res) => {

        //check the validation object for errors
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ serverResponse: errors.array() });
        }

        let hashedPassword = user_model.hashPassword(req.body.password);
        user_model.findOne({ username: req.body.username}) //search to see if a user with the requested username already exists
        .then((user) =>{
            if(user){ //is user is found, send a response that it already exists
            return res.status(400).send({ serverResponse : [{ msg : req.body.username + ' already exists'} ] });
            }else{
                user_model
                .create({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hashedPassword,
                    birthdate: req.body.birthdate,
                })
                .then((user) => { res.status(201).json({ serverResponse : [{ msg : req.body.username + ' has been registered successfully'} ] }) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) =>{
    user_model.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
   user_model.findOne( {username : req.params.username })
   .then((user) => {
       res.json(user);
   })
   .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:username', passport.authenticate('jwt', { session: false }),
    [
        check('firstname')
            .trim().not().isEmpty().withMessage('First Name must not be blank')
            .isLength({min: 2}).withMessage('First Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('First Name must be Letters Only'),
        check('lastname')
            .trim().not().isEmpty().withMessage('Last Name must not be blank')
            .isLength({min: 2}).withMessage('Last Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('Last Name must be Letters Only')
        //check('username', 'Username is required').not().isEmpty(),
        //check('username', 'Minimum Length is 5').isLength({min: 5}),
        //check('username', 'Username must only be alphanumeric characters').isAlphanumeric(),
        //check('password', 'Password is required').not().isEmpty(),
        //check('password', 'Minimum Length is 5').isLength({min: 5}),
        //check('email', 'Email is required').not().isEmpty(),
        //check('email', 'Email Length is 5').isLength({min: 5}),
        //check('email', 'Email is invalid').isEmail()
    ], (req, res) => {
        //console.log(req.params);
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

       // let hashedPassword = user_model.hashPassword(req.body.password);
        user_model.findOneAndUpdate(
            { username : req.params.username },
            { $set :
                    {  
                        firstname: req.query.firstname,
                        lastname: req.query.lastname,
                    }
            },
            { new: true }, //this line makes sure that the updated doc is returned
            (err, updatedUser) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error: ' + error);
                }else{
                    res.json(updatedUser);
                }
            });
});

app.post('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
        user_model.findOneAndUpdate(
        { username : req.params.username },
        { $push : 
            {
                favoredMovies : req.params.movietitle
            }
        },
        { new : true },
        (err, updatedUser) => {
            if (err){
                console.error(err);
                res.status(500).send('Error: ' + err);
            }else{
                response = {user: updatedUser, success : true};
                res.json(response);
            }
        }
    );
});

app.delete('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    user_model.findOneAndUpdate(
        { username : req.params.username },
        { $pull : 
            {
                favoredMovies : req.params.movietitle
            }
        },
        { new : true },
        (err, updatedUser) => {
            if (err){
                console.error(err);
                res.status(500).send('Error: ' + error);
            }else{
                res.json(updatedUser);
            }
        }
    );
});

app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    user_model.findOneAndRemove({ username: req.params.username })
    .then((user) =>{
        if (!user){
            res.status(400).send(req.params.username +  ' was not found');
        }else{
            res.status(200).send(req.params.username + ' was deleted');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

/*app.listen(8080, () =>{
    console.log('Your app is listening on port 8080');
});*/

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
	console.log('Listening on Port ' + port);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh. Somethings not working right!');
});