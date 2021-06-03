const   express = require('express'),
        morgan  = require('morgan');        
        
const app_express = express();

let topMovies = [
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

app_express.use(morgan('common'));

app_express.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});

app_express.get('/movies', (req, res) => {
    res.json(topMovies);
});

app_express.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {
        root: __dirname
    });
});

app_express.listen(8080, () =>{
    console.log('Your app is listening on port 8080');
});

app_express.use((err, req, rest, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh. Somethings not working right!');
});