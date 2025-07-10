# 🧾 TripSplit – Travel Expense Tracker

**TripSplit** (قطتنا) is a simple and friendly web app that helps you and your friends keep track of shared travel expenses — so no more guessing who paid what!
It’s designed with love by Eng. Fahad ❤️ for small travel groups who want a clear view of “al-gatta” 🧠💸

---

## ✨ Features

- Create a trip and get a unique code
- Add expenses with category, amount, and who paid
- Auto-calculate the remaining amount
- Invite friends to view & add expenses using the code
- Clean UI with TailwindCSS
- Expense chart and delete/edit features

---

## 🧱 Tech Stack

- Create a new trip and get a unique access code
- Add expenses with category, amount, and who paid
- Auto-calculate remaining budget and total spent
- Invite friends to access the same trip using the code
- Clean and responsive UI built with TailwindCSS
- Interactive chart to visualize spending by category
- Update or delete any expense anytime
- Trip data is stored securely in a Django backend (no lost data)
- Fully mobile-friendly for travel use on the go
- No login required — just share the trip code

---

## 🚀 How to Run Locally

### Backend (Django)

```bash
cd travel_budget_tracker
python -m venv env
source env/bin/activate # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver