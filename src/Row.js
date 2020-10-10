import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";
import movieTrailer from "movie-trailer";

const baseurl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMoives] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  // A snippet of code which runs based on a specific condition
  useEffect(() => {
    // if [], run once when the low loads, and don't run again
    async function fetchData() {
      const request = await axios.get(
        "https://api.themoviedb.org/3" + fetchUrl
      );
      setMoives(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          //https://youtu.be/XtMThy8QKqU?t=10454
          //urlParams.get('') that is 10454
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {/* serveral row_posters*/}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            /*everyone get row_poster class but if it's a 
                          isLargeRow then I am gona give it an additional 
                         row_posterLarge */
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${baseurl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>

      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
