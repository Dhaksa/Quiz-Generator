from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from models import quiz, progress_tracker
import os
import random
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm



app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    print(f"[UPLOAD] Saved: {file_path}")
    return {"filename": file.filename}



@app.post("/quiz/")
def generate_quiz(
    filename: str = Form(...),
    topic: str = Form(...),
    num_questions: int = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    text = quiz.read_document(file_path)
    chunks = quiz.chunk_text(text)
    index, embeddings, chunk_data = quiz.build_faiss_index(chunks)
    context = quiz.query_faiss(topic, index, chunk_data, embeddings)

    quiz_blocks = quiz.generate_quiz_list_with_groq(context, num_questions=num_questions)

    parsed_questions = []
    for block in quiz_blocks:
        if "Answer:" not in block:
            continue
        question, options, correct = quiz.parse_question_block(block)
        parsed_questions.append({
            "question": question,
            "options": options,
            "correct_option": correct
        })

    return {"quiz": parsed_questions}



@app.post("/submit-score/")
def submit_score(score: int = Form(...), total: int = Form(...)):
    from datetime import date
    data = progress_tracker.load_progress()
    today = str(date.today())

    # Get today's previous score, if exists
    prev_score = data.get("daily", {}).get(today, {}).get("points", 0)
    prev_total = data.get("daily", {}).get(today, {}).get("total", 0)

    if score > prev_score:
        progress_tracker.log_score(score, total)
        progress_tracker.update_xp_streak(date.today(), score)
        return {"message": "✅ New high score submitted."}
    else:
        return {"message": "⚠️ Lower score ignored to keep the best of the day."}
@app.get("/progress/")
def get_today_progress():
    data = progress_tracker.load_progress()
    today = str(date.today())
    today_data = data.get("daily", {}).get(today, {"points": 0, "total": 0})
    return {
        "date": today,
        "score": today_data["points"],
        "total": today_data["total"],
        "xp": data.get("xp", 0),
        "streak": data.get("streak", 0),
        "max_streak": data.get("max_streak", 0)
    }


@app.get("/calendar/")
def get_calendar_data():
    raw_data = progress_tracker.load_progress()
    formatted_daily = {
        day: {
            "score": entry["points"],
            "total": entry["total"]
        }
        for day, entry in raw_data.get("daily", {}).items()
    }
    return {
        "daily_scores": formatted_daily,
        "total_points": raw_data.get("total_points", 0),
        "xp": raw_data.get("xp", 0),
        "streak": raw_data.get("streak", 0),
        "max_streak": raw_data.get("max_streak", 0)
    }


@app.post("/flashcards/")
def generate_flashcards(
    filename: str = Form(...),
    topic: str = Form(...),
    num_cards: int = Form(5)
):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    text = quiz.read_document(file_path)
    chunks = quiz.chunk_text(text)
    index, embeddings, chunk_data = quiz.build_faiss_index(chunks)
    context = quiz.query_faiss(topic, index, chunk_data, embeddings)
    cards = quiz.generate_flashcards(context, num_cards=num_cards)
    return {"flashcards": cards}


@app.post("/cloze/")
def generate_cloze(
    filename: str = Form(...),
    topic: str = Form(...),
    num_questions: int = Form(3)
):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    text = quiz.read_document(file_path)
    chunks = quiz.chunk_text(text)
    index, embeddings, chunk_data = quiz.build_faiss_index(chunks)
    context = quiz.query_faiss(topic, index, chunk_data, embeddings)
    cloze = quiz.generate_cloze_test(context, num_questions=num_questions)
    return {"cloze_questions": cloze}   