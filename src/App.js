import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

// Calculate average helper function
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// API Key for OMDB
const KEY = "f52e54eb";

export default function App() {
  const [query, setQuery] = useState(""); // State for the input value
  const [movies, setMovies] = useState(tempMovieData); // State variable for searched movie lists
  const [watched, setWatched] = useState(tempWatchedData); // State variable for watched movie lists
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

  // useEffect hook that fetches the movie search results after initial render
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true); // Enable loading animation
        setError(""); // Resetting the error

        // Getting the data from API
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
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
        setError(err.message);

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

    // Calling the function
    fetchMovies();

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
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// Loader component that displays the Loading message when movie list is fetching
function Loader() {
  return <p className="loader">Loading...</p>;
}

// Loader component that displays an error message if with passed text
function ErrorMessage({ error }) {
  return (
    <p className="error">
      <span>⛔</span> {error}
    </p>
  );
}

// Navbar component that displays the logo and the components that are passed as arguments
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// Logo component that displays an image and the h1
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// Search component that displays the searchbar
function Search({ query, setQuery }) {
  // Returns controlled input element
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// NumResults component that displays the number of movies found in the search
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
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

// MovieList component that lists all the found movies from the state
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// Movie component that writes down all the movie details as list item in search results area
function Movie({ movie, onSelectMovie }) {
  return (
    // Adding handler function that will update the selected movie id
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// Movie details component that lists all the info about the selected movie
function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({}); // State for the selected movie
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const [error, setError] = useState(""); // State for fetching error

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

  // useEffect that is fetching the selected movie details
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true); // Enable loading animation
        setError(""); // Resetting the error

        // Getting the movie data from API
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
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
              <StarRating maxRating={10} size={24} />
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

// Watched Summary conponent that displays the legend for the watched movie list
function WatchedSummary({ watched }) {
  // Average variables from the various data from movie state variable
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// WatchedMovieList component that lists all the watched movies from the state
function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

// Movie component that writes down all the movie details as list item in watched movies area
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
