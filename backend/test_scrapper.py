from scraper.arxiv_scraper import scrape_arxiv

# Test the scraper with a sample query and limit
papers = scrape_arxiv("AI research", 3)

# Print the results
for i, paper in enumerate(papers, 1):
    print(f"Paper {i}: {paper['title']}")
    print(f"Authors: {', '.join(paper['authors'])}")
    print(f"Summary: {paper['summary'][:300]}...")
    print(f"Link: {paper['link']}")
    print("-" * 80)
