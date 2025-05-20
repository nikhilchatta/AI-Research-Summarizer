import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

# Model name can be: "mistralai/Mixtral-8x7B-Instruct-v0.1", "togethercomputer/llama-2-13b-chat", etc.
MODEL_NAME = "mistralai/Mixtral-8x7B-Instruct-v0.1"

def summarize_paper(paper: dict, mode="standard") -> dict:
    title = paper.get("title", "")
    abstract = paper.get("summary", "")
    
    if not abstract:
        return {"error": "No abstract provided."}

    if mode == "eli5":
        prompt = f"Explain the following research paper like I'm 5:\n\nTitle: {title}\n\nAbstract: {abstract}"
    else:
        prompt = f"Summarize the key points of this research paper:\n\nTitle: {title}\n\nAbstract: {abstract}"

    url = "https://api.together.xyz/v1/chat/completions"
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

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        summary = response.json()["choices"][0]["message"]["content"]
        return {"title": title, "summary": summary}

    except Exception as e:
        return {"error": str(e)}
