import os
import requests
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.llms.base import LLM
from langchain_community.vectorstores import FAISS
from embeddings.vector_store import load_vector_store
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
MODEL_NAME = "mistralai/Mixtral-8x7B-Instruct-v0.1"

class TogetherLLM(LLM):
    def _call(self, prompt, stop=None):
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": MODEL_NAME,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
            "max_tokens": 300
        }
        response = requests.post("https://api.together.xyz/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    @property
    def _identifying_params(self):
        return {}

    @property
    def _llm_type(self):
        return "together_custom"

# Q&A function
def answer_question(query):
    db = load_vector_store()
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})

    llm = TogetherLLM()
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

    result = qa_chain.run(query)
    return {"answer": result}
