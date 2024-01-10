require("dotenv").config();
const path = require("path");
const fs = require("fs");

const apiKey = process.env.TMDB_API_KEY;
const moviesPath = path.resolve('movies.json');
const exister = (path) => {
    let exist = true;
    try { fs.statSync(path); } 
    catch(err) { exist = false; }
    return exist;
};
const searchTypes = ["now_playing", "popular", "top_rated"];
const arg = (process.argv)[2];
let movies;

// searchTypes.includes(arg);

(async () => {
    try{
        if(exister(moviesPath)) {
            fs.readFile(moviesPath, 'utf8', (err, data) => {
                if(err) {
                    console.error(err);
                }
                else {
                    movies = JSON.parse(data);
                    console.log(movies[0].title);
                }
            });
        }
        else {
            const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
            const obj = await resp.json();
            const moviesJson = JSON.stringify(obj.results);
            fs.writeFileSync(moviesPath, moviesJson);
            console.log(obj.results[0].title);
        }
    }
    catch(err){ console.error(err); }
})()


