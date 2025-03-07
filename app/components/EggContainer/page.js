"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function EggTimer() {
  const [timer, setTimer] = useState(0);
  const TIME_MINUTES = timer * 60;
  const [timeLeft, setTimeLeft] = useState(TIME_MINUTES);
  const [isRunning, setIsRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const audioRef = useRef(null);
  const soundIntervalRef = useRef(null);
  const snoozeTimerRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setTimerComplete(true);
          setShowAudioControls(true);

          // Play sound when timer completes (if not muted)
          if (audioRef.current && !isMuted) {
            playSound();
            // Set up repeated sound every 10 seconds until stopped
            soundIntervalRef.current = setInterval(() => {
              if (audioRef.current && !isMuted && !isSnoozed) {
                playSound();
              }
            }, 10000); // Repeat sound every 10 seconds
          }

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isMuted, isSnoozed]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Restart the sound
      audioRef.current.play().catch((e) => {
        console.error("Audio playback failed:", e);
      });
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    stopSound();
    setTimeLeft(TIME_MINUTES);
    setIsRunning(false);
    setTimerComplete(false);
    setShowAudioControls(false);
    setIsSnoozed(false);
    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
      snoozeTimerRef.current = null;
    }
  };

  const toggleTimer = () => {
    if (timeLeft === TIME_MINUTES) {
      // Starting fresh timer
      setIsRunning(true);
    } else {
      // Toggle between pause/resume
      setIsRunning(!isRunning);
    }
  };

  const getButtonText = () => {
    if (timeLeft === TIME_MINUTES && !isRunning) return "Start";
    if (isRunning) return "Pause";
    return "Resume";
  };

  const timerButton = (e) => {
    e.preventDefault();
    setTimeLeft(TIME_MINUTES);
    setIsRunning(false);
    setTimerComplete(false);
    setShowAudioControls(false);
    setIsSnoozed(false);
    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
      snoozeTimerRef.current = null;
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
      snoozeTimerRef.current = null;
    }
    setShowAudioControls(false);
    setIsSnoozed(false);
  };

  const snoozeSound = () => {
    // Pause the sound temporarily
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }

    setIsSnoozed(true);

    // Set a timeout to play sound again after 2 minutes
    snoozeTimerRef.current = setTimeout(() => {
      setIsSnoozed(false);
      if (!isMuted) {
        playSound();
        // Restart the interval for repeated sounds
        soundIntervalRef.current = setInterval(() => {
          if (audioRef.current && !isMuted && !isSnoozed) {
            playSound();
          }
        }, 10000);
      }
    }, 120000); // 2 minutes in milliseconds
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // If turning mute on, pause any playing sounds
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    } else if (!isSnoozed) {
      // If turning mute off and not snoozed, resume sound
      playSound();
      soundIntervalRef.current = setInterval(() => {
        if (audioRef.current && !isMuted && !isSnoozed) {
          playSound();
        }
      }, 10000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-evenly h-[600px] bg-amber-50 w-96 rounded-xl drop-shadow-lg p-8 border border-amber-200 relative">
      {/* Audio element */}
      <audio ref={audioRef} src="/audio.mp3" />

      <h1 className="text-4xl font-bold text-amber-900">Boiled Egg Timer</h1>

      <div className="flex gap-4 w-full justify-center">
        <input
          type="number"
          className="border border-amber-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Enter time in minutes"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          min="0"
        />

        <button
          className="bg-amber-300 font-semibold text-amber-800 px-6 py-3 text-xl rounded-lg hover:bg-amber-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          onClick={timerButton}>
          Set Timer
        </button>
      </div>

      <div className="relative">
        <Image
          src={timeLeft === 0 ? "/boiled.svg" : "/beingboiled.svg"}
          alt={timeLeft === 0 ? "Boiled egg" : "Egg being boiled"}
          width={250}
          height={250}
          priority
        />
        {timerComplete && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white p-2 rounded-full animate-bounce">
            Done!
          </div>
        )}
      </div>

      <div className="text-6xl font-bold text-amber-800">{formatTime()}</div>

      <div className="flex gap-4 w-full justify-center">
        <button
          className="bg-amber-500 font-semibold text-white text-xl py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          onClick={toggleTimer}>
          {getButtonText()}
        </button>

        <button
          className="bg-amber-300 font-semibold text-amber-800 px-6 py-3 text-xl rounded-lg hover:bg-amber-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          onClick={resetTimer}>
          Reset
        </button>
      </div>

      {/* Audio controls popup */}
      {showAudioControls && (
        <div className="absolute left-0 right-0 mx-auto bottom-32 bg-white w-4/5 p-4 rounded-lg shadow-lg border border-amber-300 flex flex-col items-center">
          <p className="text-amber-800 font-medium mb-2">Timer completed!</p>
          <div className="flex gap-2 w-full justify-center">
            <button
              className="bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-200"
              onClick={stopSound}>
              Stop
            </button>
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 ${
                isSnoozed ? "opacity-50" : ""
              }`}
              onClick={snoozeSound}
              disabled={isSnoozed}>
              {isSnoozed ? "Snoozed" : "Snooze (2m)"}
            </button>
            <button
              className={`${
                isMuted ? "bg-gray-500" : "bg-red-500"
              } text-white py-2 px-4 rounded-lg hover:opacity-90 transition-colors duration-200`}
              onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
          {isSnoozed && (
            <p className="text-amber-600 text-sm mt-2">
              Alarm snoozed for 2 minutes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
