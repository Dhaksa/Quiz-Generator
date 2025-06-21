
#  AI-Powered Quiz Generator

An intelligent full-stack app that allows users to upload a PDF, automatically generates flashcards, cloze tests, and MCQ quizzes from the text, and provides instant feedback with scoring. It uses Groq Cloud API to generate high-quality questions using large language models (LLaMA/Mixtral).

---

## 📌 Features

- User name entry and session tracking
- PDF upload and content extraction
- Flashcards generation
- Cloze (fill-in-the-blank) test creation
- Multiple Choice Question (MCQ) quiz generation
- Quiz interface with real-time scoring
- Groq Cloud API integration for fast and powerful LLM response

---

## 📁 Project Structure

```

quiz-generator/
├── backend/
│   ├── main.py                  # Flask backend entry
│   ├── quiz.py                  # Quiz generation logic
│   ├── models/
│   │   └── progress\_tracker.py  # User progress tracking
│   ├── uploads/                 # Uploaded PDFs
│   ├── progress\_tracker.json    # Persistent user data
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── FileUpload.js
│       │   ├── QuizCalendar.js
│       │   ├── QuizView\.js
│       ├── App.js
│       └── App.css

````

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quiz-generator.git
cd quiz-generator
````

### 2.Backend Setup

1. **Install dependencies**
   Ensure you have FastAPI and Uvicorn installed:

   ```bash
   pip install fastapi uvicorn
   ```

2. **Run the development server**
   Use the following command to start the backend with hot reload:

   ```bash
   uvicorn main:app --reload
   ```

   * If `main.py` is inside a folder (e.g., `backend/`), adjust the path:

     ```bash
     uvicorn backend.main:app --reload
     ```

3. **Access the API**

   * Root URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   * Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   * ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

Would you like me to update the full `README.md` file with frontend instructions, project structure, and other standard sections as well?


> Backend runs at `http://localhost:5000`

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

> Frontend runs at `http://localhost:3000`

---

## 🤖 AI Integration (Groq Cloud API)

This app uses the [Groq Cloud API](https://console.groq.com/) to generate quizzes using LLaMA or Mixtral models.

### 🔑 API Key Setup

1. Sign up at [Groq Console](https://console.groq.com/).
2. Generate an API key.
3. Set the environment variable:

```bash
export GROQ_API_KEY=your-api-key-here
```

Or use a `.env` file (if using `python-dotenv`):

```
GROQ_API_KEY=your-api-key-here
```

###  Example (Python)

```python
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
```

---

## 📦 API Endpoints

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/upload`   | Upload a PDF file                   |
| POST   | `/generate` | Generate quiz content from PDF text |
| GET    | `/quiz`     | Fetch quiz data                     |
| POST   | `/submit`   | Submit answers and get score        |

---

## 🚀 Usage Guide

1. Enter your name to begin.
2. Upload a PDF document.
3. Flashcards, cloze tests, and MCQs will be generated automatically.
4. Answer the quiz questions and submit.
5. Instantly see your score and feedback.

---

## 🏗️ Architecture Overview

### Backend (Flask)

* PDF extraction using `PyMuPDF` or `pdfplumber`
* Groq LLM API for question generation
* User progress tracking with JSON storage

### Frontend (React)

* React components for upload, quiz view, and scoring
* Communication with backend via `fetch` or `axios`

---

## 🧰 Technologies Used

* **Frontend**: React, CSS
* **Backend**: Flask, Python
* **AI**: Groq Cloud API (LLaMA, Mixtral)
* **NLP**: `nltk`, `spaCy` (optional)
* **PDF Parsing**: `PyMuPDF` or `pdfplumber`

---

## 📝 Requirements

See `backend/requirements.txt`:

```
Flask
groq-cloud-api
PyMuPDF
nltk
spacy
python-dotenv
```

---

## 👨‍💻 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a pull request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📫 Contact

Have questions or suggestions?

**Email**: [dhaksananataraj@gmail.com](mailto:dhaksananataraj@gmail.com)
**GitHub**: [@Dhaksa](https://github.com/dhaksa)

```
