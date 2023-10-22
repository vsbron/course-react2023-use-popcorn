import { useEffect, useState } from "react";
import {KEY, URL} from "./helper"
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";


export default function App() {
  const [query, setQuery] = useState(""); // State for the input value
  const [movies, setMovies] = useState([]); // State variable for searched movie list
  const [watched, setWatched] = useState([]); // State variable for watched movie list
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const [error, setError] = useState(""); // State for fetching error
  const [selectedId, setSelectedId] = useState(null); // State for selected movie from search results

  // Handle function that displays selected movie
  function handleSelectMovie(id) {
    // Checkes whether selected ID is the one in the state, if so, sets it to null
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // Handle function that clears selected movie
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // Handle function that adds a new movie into watched movies list
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // Handle function that deletes the movie from watched movies list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect hook that fetches the movie search results after initial render
  useEffect(() => {
    // Creating the abort controller (Browser API) to cancel the fetching
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true); // Enable loading animation
        setError(""); // Resetting the error

        // Getting the data from API, passing also the signal from the controller
        const res = await fetch(
          `${URL}?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        // Checking if we got a response, throwing error if not
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        // Converting the received data to json
        const data = await res.json();

        // Checking whether there are movies returned, throwing error if not
        if (data.Response === "False") throw new Error("Movie not found!");

        // Setting the movies state array
        setMovies(data.Search);

        // Catching errors
      } catch (err) {
        // Checking whether error is not caused by cancelling the fetch
        err.name !== "AbortError" && setError(err.message);

        // Code that executes at the end of fetching with either result
      } finally {
        setIsLoading(false); // Disable loading animation
      }
    }

    // If query is empty or has less that 3 characters, set movies and error to empty and return the function
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // Clearing the current selected movie
    handleCloseMovie();

    // Calling the function
    fetchMovies();

    // The cleanup function - cancelling the fetch
    return function () {
      controller.abort();
    };

    // Passing the query to the dependency array
  }, [query]);

  // Main component tree
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* If data is loading -> Display loader */}
          {isLoading && <Loader />}

          {/* If data is not loading and there's no error -> Display the movie list */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}

          {/* If there's an error - Display error message */}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// Main component with the main grid container
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Box component that holds a container for the main grid container
function Box({ children }) {
  // State for whether the box is expanded or collapsed
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}