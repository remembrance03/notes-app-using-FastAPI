from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel #to create data models

app = FastAPI() #instantiate FastAPI

notes_db = {} #in-memory database to store notes

#endpoint
@app.get("/")
def index():
    return {"message": "Welcome to Smriti's Notes App"} 


#data model for notes
class Notes(BaseModel):
    note_id:int
    title: str
    content: str


#to create notes
@app.post("/create-notes/{note_id}")
def create_note(note_id: int, note: Notes):
    if note_id in notes_db:
        return {"message": "note_id already exists!"}
    
    notes_db[note_id] = note
    return {"message": "Note created successfully ;)", "note": note}


#to see notes
@app.get("/view-notes/{note_id}")
def get_note(note_id: int):
    if note_id not in notes_db:
        return {"message": "Note not found"}
    
    return {"message": "Note retrieved successfully :)", "note": notes_db[note_id]}


class UpdateNotes(BaseModel):
    title: Optional[str]=None
    content: Optional[str]=None


#to update notes
@app.put("/update-notes/{note_id}")
def update_note(note_id: int, updated_note: UpdateNotes):
    if note_id not in notes_db:
        return {"message": "Note not found"}

    # get existing note
    existing_note = notes_db[note_id]

    # update only provided fields
    if updated_note.title is not None:
        existing_note.title = updated_note.title
    if updated_note.content is not None:
        existing_note.content = updated_note.content

    notes_db[note_id] = existing_note
    return {"message": "Note updated successfully!!!", "note": existing_note}


#to delete notes
@app.delete("/delete-notes/{note_id}")   
def delete_note(note_id: int):
    if note_id not in notes_db:
        return {"message": "Note not found"}
    
    del notes_db[note_id]
    return {"message": "Note deleted :("}



