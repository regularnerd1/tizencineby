import { useState, useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Play, Info } from 'lucide-react';

const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    backdrop: 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzVNwv.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc91p.jpg',
    imdbId: 'tt15239678'
  },
  {
    id: 2,
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.',
    backdrop: 'https://image.tmdb.org/t/p/original/9l1eZiJHmhr5jIlthMdJN5Zpydl.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    imdbId: 'tt6263850'
  },
  {
    id: 3,
    title: 'Inside Out 2',
    description: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
    backdrop: 'https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sXLtqDteAKqE.jpg',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    imdbId: 'tt22022452'
  }
];

function Hero({ movie }) {
  const { ref, focused } = useFocusable();

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${movie.backdrop})` }}>
      <div className="hero-gradient" />
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-desc">{movie.description}</p>
        <div className="hero-actions">
          <button ref={ref} className={`tv-btn ${focused ? 'focused' : ''}`}>
            <Play size={24} /> Play Now
          </button>
          <button className="tv-btn secondary">
            <Info size={24} /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, onSelect, setHeroMovie }) {
  const { ref, focused } = useFocusable({
    onFocus: () => setHeroMovie(movie),
    onEnterPress: () => onSelect(movie)
  });

  return (
    <div
      ref={ref}
      className={`movie-card ${focused ? 'focused' : ''}`}
      onClick={() => onSelect(movie)}
    >
      <img src={movie.poster} alt={movie.title} />
    </div>
  );
}

function Player({ movie, onBack }) {
  const { ref, focused } = useFocusable({
    onEnterPress: onBack
  });

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  return (
    <div className="player-container">
      <button ref={ref} className={`back-btn ${focused ? 'focused' : ''}`} onClick={onBack}>
        ← Back
      </button>
      <iframe
        src={`https://vidsrc.me/embed/movie?imdb=${movie.imdbId}`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export default function App() {
  const [heroMovie, setHeroMovie] = useState(MOCK_MOVIES[0]);
  const [playingMovie, setPlayingMovie] = useState(null);

  // Handle global TV back button
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' || e.keyCode === 10009) {
        if (playingMovie) {
          e.preventDefault();
          setPlayingMovie(null);
        } else {
          // Exit App
          try {
            if (typeof tizen !== 'undefined') {
              tizen.application.getCurrentApplication().exit();
            }
          } catch (err) {}
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingMovie]);

  if (playingMovie) {
    return <Player movie={playingMovie} onBack={() => setPlayingMovie(null)} />;
  }

  return (
    <div className="app-container">
      <Hero movie={heroMovie} />
      
      <div className="rows-container">
        <h2 className="row-title">Trending Now</h2>
        <div className="movie-row">
          {MOCK_MOVIES.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onSelect={setPlayingMovie} 
              setHeroMovie={setHeroMovie} 
            />
          ))}
          {/* Duplicate to make the row look full */}
          {MOCK_MOVIES.map((movie) => (
            <MovieCard 
              key={`${movie.id}-dup`} 
              movie={movie} 
              onSelect={setPlayingMovie} 
              setHeroMovie={setHeroMovie} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
