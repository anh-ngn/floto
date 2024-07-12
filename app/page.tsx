"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
} from "@nextui-org/react";
import { FaPlay, FaPause, FaExchangeAlt } from "react-icons/fa";
import useSound from "use-sound";

const FlowtimeAssistant = () => {
  const [isWorking, setIsWorking] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [workTime, setWorkTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  const [playEndSound] = useSound("/sounds/end.mp3");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        if (isWorking) {
          setWorkTime((prevTime) => prevTime + 1);
          setTotalWorkTime((prevTime) => prevTime + 1);
        } else {
          setBreakTime((prevTime) => prevTime - 1);
          setTotalBreakTime((prevTime) => prevTime + 1);
          if (breakTime <= 1) {
            handleStageChange();
            playEndSound();
            // Show notification
            if (Notification.permission === "granted") {
              new Notification("Break time is over!");
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, isPaused, breakTime]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStageChange = () => {
    if (isWorking) {
      const calculatedBreakTime = Math.floor(workTime / 5);
      setBreakTime(calculatedBreakTime);
      setIsWorking(false);
    } else {
      setWorkTime(0);
      setIsWorking(true);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isWorking ? "Work Time" : "Break Time"}
        </h2>
        <Button
          isIconOnly
          color="primary"
          aria-label="Pause/Resume"
          onClick={handlePauseResume}
        >
          {isPaused ? <FaPlay /> : <FaPause />}
        </Button>
      </CardHeader>
      <CardBody>
        <div className="text-center text-4xl font-bold mb-4">
          {formatTime(isWorking ? workTime : breakTime)}
        </div>
        <Progress
          value={
            isWorking
              ? (workTime % 300) / 3
              : (breakTime / (workTime / 5)) * 100
          }
          color={isWorking ? "primary" : "secondary"}
          className="mb-4"
        />
        <Button
          fullWidth
          color="secondary"
          onClick={handleStageChange}
          startContent={<FaExchangeAlt />}
        >
          Switch to {isWorking ? "Break" : "Work"}
        </Button>
        <div className="mt-4 text-sm">
          <p>Total Work Time: {formatTime(totalWorkTime)}</p>
          <p>Total Break Time: {formatTime(totalBreakTime)}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default FlowtimeAssistant;
