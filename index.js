require("dotenv").config();
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const exister = require("./exister.js");

const apiKey = process.env.TMDB_API_KEY;
const moviesPath = path.resolve("movies.json");
const lastSearchPath = path.resolve("lastSearch.txt");
const searchTypes = ["now_playing", "popular", "top_rated"];
const arg = (process.argv)[2];
let movies;

const getAndWrite = async (arg, types, key) => {
    if(types.includes(arg)) {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${arg}?api_key=${key}`);
        const obj = await resp.json();
        const json = JSON.stringify(obj.results);
        fs.writeFileSync(path.resolve("movies.json"), json);
        fs.writeFileSync(path.resolve("lastSearch.txt"), arg);
    }
    else {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}`);
        const obj = await resp.json();
        const json = JSON.stringify(obj.results);
        fs.writeFileSync(path.resolve("movies.json"), json);
        fs.writeFileSync(path.resolve("lastSearch.txt"), "popular");
    }
    console.log("File saved");
};

(async () => {
    try{
        if(!exister(moviesPath)) {
            await getAndWrite(arg, searchTypes, apiKey);
        }
        else {
            const lastSearch = fs.readFileSync(lastSearchPath, "utf-8");
            const fileBirth = dayjs(fs.statSync(moviesPath).ctime);
            const now = dayjs();
            const timeElapsed = now.diff(fileBirth, "seconds");

            if(lastSearch === arg || (!searchTypes.includes(arg) && lastSearch === "popular")) {
                if(timeElapsed > 10) {
                    await getAndWrite(arg, searchTypes, apiKey);
                }
            }
            else {
                await getAndWrite(arg, searchTypes, apiKey);
            }
        }
        movies = JSON.parse(fs.readFileSync(moviesPath, "utf8")); 
        const titles = movies.map(m => m.title);
        console.log(titles[0]);  
    }
    catch(err){console.error(err)};
})()


