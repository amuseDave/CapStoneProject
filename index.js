import express from "express";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;
const currentFilePath = dirname(fileURLToPath(import.meta.url));

app.use(express.static(`${currentFilePath}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//ANIME POST GET REQUEST

//anime variables
var anime;
var titles;
var images;
var score;
var rank;
var trailer;
var yearRelease;
var type;
var description;
var filteredTitles;
//ANIME VARIABLES
app.get("/random-anime", (req, res) => {
  res.render("indexAnime.ejs", {
    trailer: trailer,
    images: images,
    titles: filteredTitles,
    description: description,
    type: type,
    score: score,
    rank: rank,
    year: yearRelease,
  });
  // if there's an error load main page and display the type of error
});

app.post("/random-anime", async (req, res) => {
  try {
    const result = await axios.get(`https://api.jikan.moe/v4/random/anime`);
    anime = result.data.data;

    titles = anime.titles;
    images = anime.images.jpg;
    score = {
      score: anime.score,
      scoredBy: anime.scored_by,
    };
    rank = { rank: anime.rank, popularity: anime.popularity };
    trailer = anime.trailer.embed_url;
    yearRelease = anime.year;
    type = anime.genres;
    description = anime.synopsis;

    filteredTitles = [];

    titles.forEach((title) => {
      if (
        title.type === "Default" ||
        title.type === "English" ||
        title.type === "Japanese"
      ) {
        filteredTitles.push(title);
      }
    });

    res.render("indexAnime.ejs", {
      trailer: trailer,
      images: images,
      titles: filteredTitles,
      description: description,
      type: type,
      score: score,
      rank: rank,
      year: yearRelease,
    });
    // if there's an error load main page and display the type of error
  } catch (error) {
    res.render("index.ejs", {
      error: `Generator crashed: ${error.response}`,
    });
  }
});

app.get("/anime-description", (req, res) => {
  res.render("indexAnime-description.ejs", { description: description });
});
//ANIME POST GET REQUEST

app.listen(port, () => {
  console.log(`server is live on ${port}`);
});
