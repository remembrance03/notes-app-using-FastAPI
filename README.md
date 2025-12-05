### notes-app-using-FastAPI

A simple and lightweight Notes CRUD API built using FastAPI.
This app uses an in-memory dictionary to store notes and demonstrates the fundamentals of REST API development.

---
## Features
✔ Create Notes<br>
✔ View Notes<br>
✔ Update Notes<br>
✔ Delete Notes<br>

---

## How to Run the Project

1. Install dependencies
```bash
pip install fastapi uvicorn pydantic
```

2. Start the FastAPI server
```bash
uvicorn notesAPP:app --reload
```

3. Open your browser
```bash
http://127.0.0.1:8000/docs
```
4. write, view, update, delete notes ;)
