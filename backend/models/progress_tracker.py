import json
import os
from datetime import date, datetime, timedelta
from typing import Dict

PROGRESS_FILE = "progress.json"

def load_progress() -> Dict:
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r") as f:
            return json.load(f)
    else:
        return {}

def save_progress(data: Dict):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def log_score(points_earned: int, username: str, total_possible: int = 5):
    data = load_progress()
    today = str(date.today())

    # Initialize user data if not exists
    if username not in data:
        data[username] = {
            "total_points": 0,
            "daily": {},
            "xp": 0,
            "last_played": "",
            "streak": 0,
            "max_streak": 0
        }

    user_data = data[username]

    if today not in user_data["daily"]:
        user_data["daily"][today] = {"points": 0, "total": 0}

    user_data["daily"][today]["points"] += points_earned
    user_data["daily"][today]["total"] += total_possible
    user_data["total_points"] += points_earned

    save_progress(data)
    print(f"✅ Logged {points_earned}/{total_possible} for {username} on {today}.")

def update_xp_streak(today: date, score: int, username: str):
    data = load_progress()
    xp_gained = score * 10

    if username not in data:
        data[username] = {
            "total_points": 0,
            "daily": {},
            "xp": 0,
            "last_played": "",
            "streak": 0,
            "max_streak": 0
        }

    user_data = data[username]
    last_date_str = user_data.get("last_played", "")
    current_str = str(today)

    if last_date_str == current_str:
        pass  # already updated today
    else:
        if last_date_str:
            last_played = datetime.strptime(last_date_str, "%Y-%m-%d").date()
            if today == last_played + timedelta(days=1):
                user_data["streak"] += 1
            else:
                user_data["streak"] = 1
        else:
            user_data["streak"] = 1

        user_data["last_played"] = current_str

    # Update max streak if needed
    if user_data["streak"] > user_data.get("max_streak", 0):
        user_data["max_streak"] = user_data["streak"]

    user_data["xp"] += xp_gained

    save_progress(data)
    print(f"⭐ {username} gained {xp_gained} XP. Streak: {user_data['streak']} days.")

def print_progress_summary(username: str):
    data = load_progress()
    if username not in data:
        print(f"No progress found for {username}.")
        return

    user_data = data[username]
    print(f"\n📊 Progress Summary for {username}")
    print(f"Total Points: {user_data['total_points']}")
    print(f"XP: {user_data['xp']}")
    print(f"Current Streak: {user_data['streak']} days")
    print(f"Max Streak: {user_data['max_streak']} days")
    print("\nDaily Records:")
    for day in sorted(user_data["daily"]):
        earned = user_data["daily"][day]["points"]
        total = user_data["daily"][day].get("total", 5)
        percentage = (earned / total * 100) if total else 0
        print(f"{day}: {earned}/{total} correct ({percentage:.0f}%)")

if __name__ == "__main__":
    user = input("Enter username to view progress: ")
    print_progress_summary(user)
