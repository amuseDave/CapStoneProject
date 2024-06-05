import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
var description;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//ANIME POST GET REQUEST
app.post("/random-anime", async (req, res) => {
  try {
    const result = await axios.get(`https://api.jikan.moe/v4/random/anime`);
    const anime = result.data.data;

    const titles = anime.titles;
    const images = anime.images.jpg;
    const score = {
      score: anime.score,
      scoredBy: anime.scored_by,
    };
    const rank = { rank: anime.rank, popularity: anime.popularity };
    const trailer = anime.trailer.embed_url;
    const yearRelease = anime.year;
    const type = anime.genres;
    description = anime.synopsis;
    //Defaul, Japanese, English

    console.log(yearRelease);

    const filteredTitles = [];

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
      error: `This Feature is currently unavailable: ${error.response}`,
    });
  }
});

app.get("/anime/description", (req, res) => {
  res.render("anime-description.ejs", { description: description });
});
//ANIME POST GET REQUEST

app.listen(port, () => {
  console.log(`server is live on ${port}`);
});
