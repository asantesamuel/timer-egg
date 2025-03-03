"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Exit early if timer isn't running
    if (!isRunning) return;

    // Create interval that decrements time every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function to clear interval when component unmounts
    // or when isRunning changes
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format seconds into minutes:seconds
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset the timer to 5 minutes
  const resetTimer = () => {
    setTimeLeft(5 * 60);
    setIsRunning(false);
  };

  const pauseTimer = () => {
    setTimeLeft(timeLeft);
    setIsRunning(false);
  };

  const startTimer = () => {
    setIsRunning(true);
  };
  console.log(formatTime());
  console.log(timeLeft);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-evenly h-[900px] bg-amber-50 w-1/2 rounded-md drop-shadow-lg">
        <div className="text-5xl font-bold text-amber-900"> Boiled Egg Timer</div>
        <div>
          <Image
            src={timeLeft === 0 ? "boiled.svg" : "beingboiled.svg"}
            alt="egg"
            width={400}
            height={400}
          />
        </div>
        <div className="text-6xl font-bold">{formatTime()}</div>
        <div className="flex items-center justify-evenly w-full">
          <div className="flex justify-center items-center">
            <button
              className="bg-amber-500 font-semibold text-white text-2xl py-4 px-10 rounded-md hover:bg-amber-600 hover:text-white hover:cursor-pointer"
              onClick={() => {
                if (timeLeft === 5 * 60) {
                  startTimer();
                } else {
                  if (isRunning) {
                    pauseTimer();
                  } else {
                    setIsRunning(true);
                  }
                }
              }}>
              {timeLeft === 5 * 60 && !isRunning
                ? "Start"
                : isRunning
                ? "Pause"
                : "Resume"}
            </button>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="bg-amber-500 font-semibold text-white px-10 py-4 text-2xl rounded-md hover:bg-amber-600 hover:text-white hover:cursor-pointer"
              onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
