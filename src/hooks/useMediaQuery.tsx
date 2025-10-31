import { useState, useEffect } from 'react';

/**
 * A custom hook to check for a media query match.
 * @param {string} query - The media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - True if the query matches, false otherwise.
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this runs on the client-side only
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};