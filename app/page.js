"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function EggTimer() {
  const FIVE_MINUTES = 5 * 60; // Define constant for better readability
  const [timeLeft, setTimeLeft] = useState(FIVE_MINUTES);
  const [isRunning, setIsRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setTimerComplete(true);
          // Could add sound notification here
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(FIVE_MINUTES);
    setIsRunning(false);
    setTimerComplete(false);
  };

  const toggleTimer = () => {
    if (timeLeft === FIVE_MINUTES) {
      // Starting fresh timer
      setIsRunning(true);
    } else {
      // Toggle between pause/resume
      setIsRunning(!isRunning);
    }
  };

  const getButtonText = () => {
    if (timeLeft === FIVE_MINUTES && !isRunning) return "Start";
    if (isRunning) return "Pause";
    return "Resume";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-amber-100">
      <div className="flex flex-col items-center justify-evenly h-[600px] bg-amber-50 w-96 rounded-xl drop-shadow-lg p-8 border border-amber-200">
        <h1 className="text-4xl font-bold text-amber-900">Boiled Egg Timer</h1>

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
      </div>
    </div>
  );
}
