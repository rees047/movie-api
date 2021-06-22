const   express = require('express'),
        bodyParser  = require('body-parser');      
        morgan  = require('morgan');        
        
const app = express();

let movies = [
    {
        title: 'Avengers: End Game',
        genre: 'Adventure', //fantasy
    },
    {
        title: 'Notting Hill',
        genre: 'Rom Com',
    },
    {
        title: 'Coco',
        genre: 'Kids', 
    },
    {
        title: 'Homeward Bound',
        genre: 'Family', 
    },
    {
        title: 'Shrek',
        genre: 'Kids', 
    },
    {
        title: 'The Matrix',
        genre: 'Sci-Fi', 
    },
    {
        title: 'The Fifth Element',
        genre: 'Sci-Fi', 
    },
    {
        title: 'Titan AE',
        genre: 'Sci-Fi', 
    },
    {
        title: 'Titanic',
        genre: 'Romance', 
    },
    {
        title: 'The Greatest Showman',
        genre: 'Musical', 
    }
];

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {
        root: __dirname
    });
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

app.get('/movies/:title/genre', (req, res) => {
    res.send('Return data about genre');
});

app.get('/movies/:director', (req, res) => {
    res.json(movies.find((director) => {
        return movies.director === req.params.director
    }));
});

app.post('/users/register', (req, res) => {
    res.send('Accept data about user registration');
});

app.put('/users/register/:username', (req, res) => {
    res.json(users.find((username) => {
        return users.username === req.params.username
    }));
});

app.put('/users/:username/favorites/add/:movie', (req, res) => {
    res.json(users.find((username) => {
        return users.username === req.params.username
    }));
    res.send('Movie Added!');
});

app.delete('/users/:username/favorites/remove/:movie', (req, res) => {
    res.json(users.find((username) => {
        return users.username === req.params.username
    }));
    res.send('Movie Deleted!');
});

app.delete('/users/deregister/:username', (req, res) => {
    res.json(users.find((username) => {
        return users.username === req.params.username
    }));
    res.send('User Profile Deleted!');
});


app.listen(8080, () =>{
    console.log('Your app is listening on port 8080');
});

app.use((err, req, rest, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh. Somethings not working right!');
});