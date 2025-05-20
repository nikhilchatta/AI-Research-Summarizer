import requests
import xml.etree.ElementTree as ET

def scrape_arxiv(query="machine learning", max_results=5):
    base_url = "http://export.arxiv.org/api/query"
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }

    response = requests.get(base_url, params=params)
    if response.status_code != 200:
        return {"error": "Failed to fetch papers from arXiv."}

    root = ET.fromstring(response.text)
    ns = {"atom": "http://www.w3.org/2005/Atom"}

    papers = []
    for entry in root.findall("atom:entry", ns):
        title = entry.find("atom:title", ns).text.strip()
        summary = entry.find("atom:summary", ns).text.strip()
        link = entry.find("atom:id", ns).text.strip()
        authors = [author.find("atom:name", ns).text for author in entry.findall("atom:author", ns)]

        papers.append({
            "title": title,
            "summary": summary,
            "link": link,
            "authors": authors
        })

    return papers
