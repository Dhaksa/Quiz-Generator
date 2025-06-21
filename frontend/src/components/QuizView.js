import React, { useState } from "react";
import "./QuizView.css";
import axios from "axios";

const QuizView = ({ filename, username = "guest" }) => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [clozeTests, setClozeTests] = useState([]);

  const generateQuiz = async () => {
    if (!filename || !topic) {
      alert("Please upload a file and enter topic.");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const form = new FormData();
      form.append("filename", filename);
      form.append("topic", topic);
      form.append("num_questions", numQuestions);

      const res = await axios.post("http://localhost:8000/quiz/", form);
      setQuestions(res.data.quiz);
    } catch (error) {
      console.error(error);
      alert("Quiz generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    if (submitted) return;

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_option) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    const form = new FormData();
    form.append("score", correct);
    form.append("total", questions.length);
    axios.post("http://localhost:8000/submit-score/", form);
  };

  const loadFlashcards = async () => {
    const form = new FormData();
    form.append("filename", filename);
    form.append("topic", topic);
    const res = await axios.post("http://localhost:8000/flashcards/", form);
    setFlashcards(res.data.flashcards);
  };

  const loadCloze = async () => {
    const form = new FormData();
    form.append("filename", filename);
    form.append("topic", topic);
    const res = await axios.post("http://localhost:8000/cloze/", form);
    setClozeTests(res.data.cloze_questions);
  };

  return (
    <div className="quiz-layout">
      {/* Left Pane */}
      <div className="left-pane">
        <h2>Flashcards</h2>
        <button className="quiz-button" onClick={loadFlashcards}>
          Load Flashcards
        </button>
        {flashcards.length === 0 && <p>No flashcards yet.</p>}
        {flashcards.map((card, i) => (
          <div className="flashcard" key={i}>{card}</div>
        ))}

        <h2 style={{ marginTop: "30px" }}>Cloze Test</h2>
        <button className="quiz-button" onClick={loadCloze}>
          Load Cloze Tests
        </button>
        {clozeTests.length === 0 && <p>No cloze tests yet.</p>}
        {clozeTests.map((q, i) => (
          <div className="cloze-card" key={i}>{q}</div>
        ))}
      </div>

      {/* Right Pane */}
      <div className="right-pane">
        <h2>Generate Quiz</h2>

        <input
          type="text"
          className="quiz-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Eg. AI, ML, etc."
        />

        <input
          type="number"
          className="quiz-input"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          min={1}
          max={20}
        />

        <button className="quiz-button" onClick={generateQuiz}>
          Generate Quiz
        </button>

        {loading && <p>Generating quiz...</p>}
        {questions.length === 0 && !loading && <p>No questions yet.</p>}

        {questions.map((q, index) => (
          <div className="quiz-question" key={index}>
            <p><strong>{q.question}</strong></p>
            {Object.entries(q.options).map(([key, val]) => (
              <label className="quiz-option" key={key}>
                <input
                  type="radio"
                  name={`q${index}`}
                  value={key}
                  onChange={() => handleOptionChange(index, key)}
                  disabled={submitted}
                />
                {key}. {val}
              </label>
            ))}
            {submitted && (
              <p>
                {answers[index] === q.correct_option
                  ? "✅ Correct"
                  : `❌ Wrong (Correct: ${q.correct_option})`}
              </p>
            )}
          </div>
        ))}

        {!submitted && questions.length > 0 && (
          <button className="quiz-button" onClick={handleSubmit}>
            Submit Answers
          </button>
        )}

        {submitted && (
          <h3 style={{ marginTop: "20px" }}>
            🎉 Your Score: {score} / {questions.length}
          </h3>
        )}
      </div>
    </div>
  );
};

export default QuizView;
