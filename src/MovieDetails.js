import { useEffect, useState } from "react";
import {KEY, URL} from "./helper"
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import StarRating from "./StarRating";

// Movie details component that lists all the info about the selected movie
export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({}); // State for the selected movie
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const [error, setError] = useState(""); // State for fetching error
  const [userRating, setUserRating] = useState(""); // State for user rating from Star Rating component

  // Checking whether selected movie was already rated by user using filter method
  const isWatched = watchedMovies.filter(
    (movie) => movie.imdbID === selectedId
  );

  // Getting the rating from the movie rated by user
  const watchedUserRating = watchedMovies.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // Destructuring the selected movie and renaming it's properties
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Handle function of adding movie to the wathed movie list
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie); // Add the movie to the watched movie list
    onCloseMovie(); // Close the movie details
  }

  // useEffect that adds event listener for a Escape key press once the component is mounted
  useEffect(() => {
    // Creating callback function separately (so we can remove the event listener later)
    function callback(e) {
      e.code === "Escape" && onCloseMovie();
    }

    document.addEventListener("keydown", callback); // Adding the event listener on keydown effect

    // The Cleanup function
    return function () {
      document.removeEventListener("keydown", callback); // Removing the event listener
    };
  }, [onCloseMovie]);

  // useEffect that is fetching the selected movie details
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true); // Enable loading animation
        setError(""); // Resetting the error

        // Getting the movie data from API
        const res = await fetch(
          `${URL}?apikey=${KEY}&i=${selectedId}`
        );

        // Checking if we got a response, throwing error if not
        if (!res.ok)
          throw new Error(
            "Something went wrong with getting the movie details"
          );

        // Converting the received data to json
        const data = await res.json();

        // Checking whether there are movies returned, throwing error if not
        if (data.Response === "False") throw new Error("Movie not found!");

        // Setting the state of selecting movie
        setMovie(data);

        // Catching errors
      } catch (err) {
        setError(err.message);

        // Code that executes at the end of fetching with either result
      } finally {
        setIsLoading(false);
      }
    }

    // Calling the function
    getMovieDetails();

    // Passing the selectedId to the dependency array
  }, [selectedId]);

  // useEffect for changing the document title to the movie title
  useEffect(() => {
    if (!title) return; // Guard clause
    document.title = `Movie | ${title}`;

    // Cleanup function
    return function () {
      // Changing the document title to the default one
      document.title = "usePopcorn App";
    };
  }, [title]);

  // Returned JSX
  return (
    <div className="details">
      {/* If data is loading -> Display loader */}
      {isLoading && <Loader />}

      {/* If data is not loading and there's no error -> Display the movie details */}
      {!isLoading && !error && (
        <>
          <header>
            {/* Button that resets the selected movie ID */}
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* Checking if movie was already rated */}
              {isWatched.length > 0 ? (
                // If so, display the message
                <p>
                  You have rated this movie with {watchedUserRating}{" "}
                  <span>🌟</span>
                </p>
              ) : (
                // If not, display the Star Rating component
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {/* Displaying Add to the list button only if user rated the movie*/}
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to the list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}

      {/* If there's an error - Display error message */}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}