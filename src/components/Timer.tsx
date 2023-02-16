import React, { useState, useEffect } from "react";
import Button from "./Button";
import "../styles/Timer.css";

interface TimerProps {
  startTime: number;
}

const Timer = ({ startTime }: TimerProps): JSX.Element => {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0 || paused) {
          clearInterval(timer);
          return prevTimeLeft;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    if (timeLeft === 0) {
      window.electron.ipcRenderer.sendMessage("notify", ["ping"]);
      setTimeLeft(startTime);
    }

    return () => clearInterval(timer);
  }, [paused, timeLeft, startTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <React.Fragment>
      <div role="timer">
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <div className="container">
        <Button
          onClick={() => setPaused(!paused)}
          text={paused ? "Resume" : "Pause"}
        />
        <Button
          onClick={() => {
            setTimeLeft(startTime);
            setPaused(false);
          }}
          text={"Reset"}
        />
      </div>
    </React.Fragment>
  );
};

export default Timer;
