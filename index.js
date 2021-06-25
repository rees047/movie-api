const   express = require('express'),
        bodyParser  = require('body-parser');      
        
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let movies = [
    {
        title: 'Avengers: End Game',
        genre: ['Action', 'Sci-Fi'],
        rating: 'PG-13',
        year: 2019,
        release: 'April 26, 2019',
        runtime: '3h 2m',
        description: 'Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.',
        director: ['Joe Russo','Anthony Russo'],
        cast: ['Chris Evans', 'Robert Downey Jr', 'Chris Hemsworth', 'Scarlett Johansson', 'Mark Ruffalo'],
        gross: '$2.798 billion',
        budget: '$356 million',
        featured: 'Y'
    },
    {
        title: 'Notting Hill',
        genre: ['Romance', 'Comedy'],
        rating: 'PG-13',
        year: 1999,
        release: 'May 13, 1999',
        runtime: '2h 4m',
        description: 'William Thacker (Hugh Grant) is a London bookstore owner whose humdrum existence is thrown into romantic turmoil when famous American actress Anna Scott (Julia Roberts) appears in his shop. A chance encounter over spilled orange juice leads to a kiss that blossoms into a full-blown affair. As the average bloke and glamorous movie star draw closer and closer together, they struggle to reconcile their radically different lifestyles in the name of love.',
        director: ['Roger Michell'],
        cast: ['Hugh Grant', 'Julia Roberts'],
        gross: '$363.9 million',
        budget: '$42 million',
        featured: 'N'
    },
    {
        title: 'Coco',
        genre: ['Family', 'Adventure'],
        rating: 'PG',
        year: 2017,
        release: 'November 22, 2017',
        runtime: '1h 49m',
        description: 'Despite his family\'s generations-old ban on music, young Miguel dreams of becoming an accomplished musician like his idol Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead. After meeting a charming trickster named Héctor, the two new friends embark on an extraordinary journey to unlock the real story behind Miguel\'s family history.',
        director: ['Adrian Molina','Lee Unkrich'],
        cast: ['Anthony Gonzalez', 'Gael Garcia Bernal', 'Benjamin Bratt', 'Alanna Ubach'],
        gross: '$807.8 million',
        budget: '$225 million',
        featured: 'Y'
    },
    {
        title: 'Homeward Bound',
        genre: ['Family', 'Adventure'],
        rating: 'G',
        year: 1993,
        release: 'February 3, 1993',
        runtime: '1h 25m',
        description: 'Before the Seavers leave for a family vacation to San Francisco, they drop off their pets -- Chance (Michael J. Fox), an adventurous American bulldog; Shadow (Don Ameche), a wise golden retriever; and Sassy (Sally Field), a cautious cat -- at a friend\'s ranch. But when the animals start to worry that they\'ve been left for good, the three embark together on a treacherous and thrilling journey to find their way back home through the California wilderness.',
        director: ['Duwayne Dunham'], 
        cast: ['Anthony Gonzalez', 'Gael Garcia Bernal', 'Benjamin Bratt', 'Alanna Ubach'],
        gross: '$807.8 million',
        budget: '$225 million',
        featured: 'Y'
    },
    {
        title: 'Shrek',
        genre: ['Comedy', 'Fantasy'],
        rating: 'PG',
        year: 2001,
        release: 'April 22, 2001',
        runtime: '1h 35m',
        description: 'Once upon a time, in a far away swamp, there lived an ogre named Shrek (Mike Myers) whose precious solitude is suddenly shattered by an invasion of annoying fairy tale characters. They were all banished from their kingdom by the evil Lord Farquaad (John Lithgow). Determined to save their home -- not to mention his -- Shrek cuts a deal with Farquaad and sets out to rescue Princess Fiona (Cameron Diaz) to be Farquaad\'s bride. Rescuing the Princess may be small compared to her deep, dark secret.',
        director: ['Andrew Adamson', 'Vicky Jenson'], 
        cast: ['Mike Myers', 'Eddie Murphy', 'Cameron Diaz', 'John Lithgow'],
        gross: '$484.4 million',
        budget: '$60 million',
        featured: 'N'
    },
    {
        title: 'The Matrix',
        genre: ['Action', 'Sci-Fi'],
        rating: 'R',
        year: 1999,
        release: 'March 31, 1999',
        runtime: '2h 16m',
        description: 'Neo (Keanu Reeves) believes that Morpheus (Laurence Fishburne), an elusive figure considered to be the most dangerous man alive, can answer his question -- What is the Matrix? Neo is contacted by Trinity (Carrie-Anne Moss), a beautiful stranger who leads him into an underworld where he meets Morpheus. They fight a brutal battle for their lives against a cadre of viciously intelligent secret agents. It is a truth that could cost Neo something more precious than his life.',
        director: ['Lana Wachowski', 'Lilly Wachowskin'], 
        cast: ['Keanu Reeves', 'Carrie-Anne Moss', 'Laurence Fishburne'],
        gross: '$463.5 million',
        budget: '$63 million',
        featured: 'N'
    },
    {
        title: 'The Fifth Element',
        genre: ['Action', 'Sci-Fi'],
        rating: 'PG-13',
        year: 1997,
        release: 'May 9, 1997',
        runtime: '2h 07m',
        description: 'In the 23rd century, a New York City cabbie, Korben Dallas (Bruce Willis), finds the fate of the world in his hands when Leeloo (Milla Jovovich) falls into his cab. As the embodiment of the fifth element, Leeloo needs to combine with the other four to keep the approaching Great Evil from destroying the world. Together with Father Vito Cornelius (Ian Holm) and zany broadcaster Ruby Rhod (Chris Tucker), Dallas must race against time and the wicked industrialist Zorg (Gary Oldman) to save humanity.',
        director: ['Luc Besson'], 
        cast: ['Milla Jovovich', 'Bruce Willis', 'Chris Tucker', 'Gary Oldman'],
        gross: '$263.9 million',
        budget: '$90 million',
        featured: 'N'
    },
    {
        title: 'Titan AE',
        genre: ['Action', 'Sci-Fi'],
        rating: 'PG',
        year: 2000,
        release: 'June 16, 2000',
        runtime: '1h 34m',
        description: 'A science-fiction film that combines traditional animation with computer generated images, "Titan A.E." takes place in the distant future, after Earth has been obliterated by a mysterious alien race known as the Drej. Cale is a human teenager who has been given a mysterious map by his father, leading him on an unforgettable journey.',
        director: ['Don Bluth', 'Gary Goldman', 'Art Vitello'], 
        cast: ['Bill Pullman', 'Matt Damon', 'Drew Barrymore', 'John Leguizamo'],
        gross: '$36.8 million',
        budget: '$75 million',
        featured: 'N' 
    },
    {
        title: 'Titanic',
        genre: ['Romance', 'Drama'],
        rating: 'PG-13',
        year: 1997,
        release: 'December 19, 1997',
        runtime: '3h 30m',
        description: 'James Cameron\'s "Titanic" is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the "ship of dreams" -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.',
        director: ['James Cameron'], 
        cast: ['Leonardo DiCaprio', 'Kate Winslet'],
        gross: '$2.195 billion',
        budget: '$200 million',
        featured: 'N'  
    },
    {
        title: 'The Greatest Showman',
        genre: ['Musical', 'Drama'],
        rating: 'PG',
        year: 2017,
        release: 'March 20, 2018',
        runtime: '1h 46m',
        description: 'Growing up in the early 1800s, P.T. Barnum displays a natural talent for publicity and promotion, selling lottery tickets by age 12. After trying his hands at various jobs, P.T. turns to show business to indulge his limitless imagination, rising from nothing to create the Barnum & Bailey circus. Featuring catchy musical numbers, exotic performers and daring acrobatic feats, Barnum\'s mesmerizing spectacle soon takes the world by storm to become the greatest show on Earth.',
        director: ['Michael Gracey'], 
        cast: ['Hugh Jackman', 'Zac Efron', 'Zendaya', 'Michelle Williams', 'Keala Settle'],
        gross: '$435 million',
        budget: '$84 million',
        featured: 'Y'  
    }
];

app.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('/documentation.html', {
        root: __dirname
    });
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) =>
        { return movie.title === req.params.title }));
});

app.get('/movies/:title/genre', (req, res) => {
    let movie = movies.find((movie) => {
        return movie.title === req.params.title
    });

    if (movie){
        res.status(201).send(movie.title + ' has genre of ' + movie.genre);
    }else{
        res.status(404).send('Movie Not Found.');
    }
});

app.get('/movies/director/:director', (req, res) => {
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