//Created all needed variables and packages
var spotify = require('node-spotify-api');
var twitter = require('twitter');
var keys = require('./keys.js');
var fs = require('fs');
var request = require('request');

//reading the text file and convert it to an array
var randomText = fs.readFileSync('./random.txt', 'utf8').split(',');
//getting the random command from the array
var randomCommand = randomText[0];
//getting the random query from the array
var randomQuery = randomText[1];
//getting the args from the shell
var args = process.argv.slice(2);
var command = args[0];
//getting the query from the process.argv array and convert it to a string
var apiQuery = process.argv.slice(3).join(' ');

//Checking if nothing was entered give the user some information how the app works
function displayLiriGuide(){
  if(command == null || !isNaN(command)){
    console.log('Please use the following commands:');
    console.log('To search for tweets use the command (my-tweets) and type a tweet word after.');
    console.log('To search for a song use the command (spotify-this-song) and type a song name after.');
    console.log('To search for a movie use the command (movie-this) and type type a movie name after.');
    console.log('To search for something random use the command (do-what-it-says).');
  }
}
displayLiriGuide();

//Managing which api to call depending on the user command
switch (command) {
  case "my-tweets":
  twitterApi(apiQuery);
  break;

  case "spotify-this-song":
  spotifyApi(apiQuery);
  break;

  case "movie-this":
  omdbApi(apiQuery);
  break;

  case "do-what-it-says":
  doWhatItSays(randomCommand, randomQuery);
  break;
}


function twitterApi(query){
  console.log('Loading.......');
  if(query == ''){
    query = 'San Diego weather';
  }
  var client = new twitter(keys.twitterKeys);
  client.get('search/tweets', {q: query, count: 20}, function(error, tweets, response) {
    if(error){
      console.log(error);
    }
    if(tweets.statuses.length == 0){
      console.log('Please use another word');
    }
    for (var i=0; i < tweets.statuses.length; i++){
      console.log('Tweets about ==> ',query )
      console.log('Created at:', tweets.statuses[i].created_at)
      console.log(tweets.statuses[i].text)
      console.log('------------------------------------------------------------'+"\n");
    }
    console.log('TOTAL TWEETS:', tweets.statuses.length);
  });

}

function spotifyApi(query){
  console.log('Loading.......');
  var spoti = new spotify(keys.spotifyKeys);
  if(query == ''){
    query = 'the sign Ace of Base';
  }
  spoti.search({ type: 'track', query: query, limit: 5 }, function(err, data) {
    if (data.tracks.items.length == 0){
      console.log('Plaease try another song or check your spelling');
    }
    if (err) {
      console.log(err);
    }
    for (var i=0; i < data.tracks.items.length; i++){
      console.log('Artist:',data.tracks.items[i].artists[0].name);
      console.log('Song:',data.tracks.items[i].name);
      console.log('Album:',data.tracks.items[i].album.name);
      console.log('Link to the Song:',data.tracks.items[i].external_urls.spotify);
      console.log('-------------------------------------------------------------');
    }
  });
}

function omdbApi(query){
  console.log('Loading.......');
  if(query == ''){
    query = 'Mr. Nobody';
  }
  var queryUrl = 'http://www.omdbapi.com/?apikey=40e9cece&t='+query;
  request(queryUrl, function(err, response, body){
    if(JSON.parse(response.body).Error){
      console.log('Sorry', JSON.parse(response.body).Error,'Plaease try another movie or check your spelling');
    }
    else if(err){
      console.log('Error:', err);
    }
    else if(JSON.parse(body).hasOwnProperty('Title')) {
      console.log('Title:', JSON.parse(body).Title);
      console.log('Year:',JSON.parse(body).Year);

      //Checking if the array of Ratings has the IMDB Rating Value
      if (JSON.parse(body).Ratings[0]){
        console.log('IMDB Rating:',JSON.parse(body).Ratings[0].Value);
      }
      //Checking if the array of Ratings has the Rotten Tomatoes Value
      if (JSON.parse(body).Ratings[1]){
        console.log('Rotten Tomatoes Rating:',JSON.parse(body).Ratings[1].Value);
      }

      console.log('Conutry:',JSON.parse(body).Country);
      console.log('Language:',JSON.parse(body).Language);
      console.log('Plot:',JSON.parse(body).Plot);
      console.log('Actors:',JSON.parse(body).Actors);
      console.log('Image:',JSON.parse(body).Poster);
    }
  });
}
function doWhatItSays(command, query){
  switch (command) {
    case "my-tweets":
    twitterApi(query);
    break;

    case "spotify-this-song":
    spotifyApi(query);
    break;

    case "movie-this":
    omdbApi(query);
    break;
  }
}
