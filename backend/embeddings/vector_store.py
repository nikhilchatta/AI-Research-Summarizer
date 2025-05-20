import os
import faiss
import pickle
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document

# Initialize embedding model (MiniLM)
def get_embedding_model():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Create FAISS index from list of paper dicts
def create_vector_store(papers, index_path="faiss_index"):
    embeddings = get_embedding_model()
    
    docs = []
    for paper in papers:
        content = f"{paper['title']}\n\n{paper['summary']}"
        metadata = {"link": paper['link'], "title": paper['title']}
        docs.append(Document(page_content=content, metadata=metadata))
    
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(index_path)
    return db

# Load FAISS index
def load_vector_store(index_path="faiss_index"):
    embeddings = get_embedding_model()
    return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

