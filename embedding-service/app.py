from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load model once at startup
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

class EmbedRequest(BaseModel):
    texts: list[str]

class EmbedResponse(BaseModel):
    vectors: list[list[float]]

@app.post("/embed", response_model=EmbedResponse)
def generate_embeddings(req: EmbedRequest):
    embeddings = model.encode(req.texts, convert_to_numpy=True).tolist()
    return {"vectors": embeddings}
