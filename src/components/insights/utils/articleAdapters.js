export const LOCAL_CACHE_KEY = "crypto-ai-insights-research-cache-v1";

export function normalizeArticle(article, index = 0) {
  return {
    ...article,
    id: article.id ?? `${article.firm || "firm"}-${index}-${article.sourceUrl || "source"}`,
    date: article.date instanceof Date ? article.date : new Date(article.date),
    bookmarked: Boolean(article.bookmarked),
    tags: Array.isArray(article.tags) ? article.tags : [],
    author: article.author || "Research Team",
    takeaways: Array.isArray(article.takeaways) ? article.takeaways : [],
    readTime: Number.isFinite(article.readTime) ? article.readTime : 8,
    contentType: article.contentType || "Research Note",
    summary: article.summary || "New publication from this research source.",
  };
}

export function normalizeArticles(articles = []) {
  return articles
    .map((article, index) => normalizeArticle(article, index))
    .filter(
      (article) =>
        article.date instanceof Date && !Number.isNaN(article.date.getTime())
    )
    .sort((a, b) => b.date - a.date);
}
