import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for managing sound playback with fallbacks
 * @param {Array} sources - Array of sound URLs to try
 * @param {Object} options - Configuration options
 * @returns {Object} Sound control methods and state
 */
const useSound = (sources = [], options = {}) => {
  const [isEnabled, setIsEnabled] = useState(options.enabled !== false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Base64 encoded fallback sound (short beep)
  const fallbackSound =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWcGpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";

  // Initialize audio on mount
  useEffect(() => {
    // Create audio element
    const audio = new Audio();

    // Add all sources including fallback
    const allSources = [...sources, fallbackSound];

    // Try to load the first source that works
    const loadSource = (index) => {
      if (index >= allSources.length) {
        setError(new Error("Failed to load any audio sources"));
        return;
      }

      const handleCanPlayThrough = () => {
        setIsLoaded(true);
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };

      const handleError = () => {
        console.warn(`Failed to load audio source: ${allSources[index]}`);
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        audio.removeEventListener("error", handleError);
        loadSource(index + 1);
      };

      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      audio.addEventListener("error", handleError);

      audio.src = allSources[index];
      audio.load();
    };

    // Start loading the first source
    loadSource(0);

    // Set preload attribute
    audio.preload = "auto";

    // Store audio element in ref
    audioRef.current = audio;

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [sources]);

  // Toggle sound on/off
  const toggle = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  // Play sound with error handling
  const play = useCallback(
    (volume = 0.7) => {
      if (!isEnabled || !audioRef.current)
        return Promise.reject(new Error("Sound is disabled or not loaded"));

      try {
        // Reset to beginning
        audioRef.current.currentTime = 0;

        // Set volume
        audioRef.current.volume = volume;

        // Play with promise handling
        return audioRef.current.play();
      } catch (error) {
        console.warn("Error playing sound:", error);
        return Promise.reject(error);
      }
    },
    [isEnabled]
  );

  // Create a clone of the audio for overlapping sounds
  const playOverlap = useCallback(
    (volume = 0.3) => {
      if (!isEnabled || !audioRef.current)
        return Promise.reject(new Error("Sound is disabled or not loaded"));

      try {
        const clone = audioRef.current.cloneNode();
        clone.volume = volume;
        return clone.play();
      } catch (error) {
        console.warn("Error playing overlapping sound:", error);
        return Promise.reject(error);
      }
    },
    [isEnabled]
  );

  return {
    isEnabled,
    isLoaded,
    error,
    toggle,
    play,
    playOverlap,
  };
};

export default useSound;
