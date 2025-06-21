import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizCalendar.css";

const QuizCalendar = () => {
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/calendar/")
      .then((res) => {
        setCalendarData(res.data.daily_scores || {});
      });
  }, []);

  const today = new Date();
  const dates = [];

  for (let i = 34; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const score = calendarData[key]?.score ?? 0;
    dates.push({ key, score });
  }

  const calculateStreak = (dates) => {
    let streak = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i].score > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak(dates);
  localStorage.setItem("quizStreak", streak);

  return (
    <div className="quiz-calendar-widget">
      <h3>Your Quiz Streak</h3>
      <div className="calendar-grid">
        {dates.map(({ key, score }) => (
          <div
            key={key}
            className={`day-box ${score > 0 ? "active" : ""}`}
            title={`${key} — ${score} pts`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default QuizCalendar;

