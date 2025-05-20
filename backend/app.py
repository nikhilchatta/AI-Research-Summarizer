from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper.arxiv_scraper import scrape_arxiv
from summarizer.gpt_summarizer import summarize_paper
from qna.chat_agent import answer_question
from embeddings.vector_store import create_vector_store

app = Flask(__name__)
CORS(app)

# Fetch papers from arXiv
@app.route('/papers', methods=['GET'])
def get_papers():
    query = request.args.get('query', default='machine learning')
    max_results = int(request.args.get('max', 5))
    papers = scrape_arxiv(query=query, max_results=max_results)
    return jsonify(papers)

# Summarize a single paper (standard or ELI5 mode)
@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    mode = data.get("mode", "standard")  # 'standard' or 'eli5'
    summary = summarize_paper(data, mode)
    return jsonify(summary)

# Ask a question using LangChain + FAISS + Together.ai
@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    query = data.get("question", "")
    if not query:
        return jsonify({"error": "Missing question"}), 400
    result = answer_question(query)
    return jsonify(result)

# (Optional) Regenerate vector DB from posted papers
@app.route('/vectorize', methods=['POST'])
def vectorize():
    papers = request.json
    create_vector_store(papers)
    return jsonify({"message": "Vector store created successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
