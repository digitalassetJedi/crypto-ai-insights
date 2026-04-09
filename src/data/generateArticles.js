import { FIRMS, SECTORS, ASSETS, CONTENT_TYPES, TAGS_POOL } from "./firms";
import { SUMMARIES_BY_TYPE, KEY_TAKEAWAYS, AUTHORS } from "./content";

const TITLES = [
  "The State of {sector} in 2026: A Comprehensive Analysis",
  "Why {asset} Could Redefine {sector} This Cycle",
  "{sector}: Separating Signal from Noise",
  "Institutional Flows into {asset}: What the Data Tells Us",
  "The {sector} Stack: An Investor's Framework",
  "{asset} Valuation Model: A First Principles Approach",
  "The Coming Convergence of {sector} and Traditional Finance",
  "Deconstructing {sector}: Risks, Rewards, and the Road Ahead",
  "On-Chain Intelligence: {asset} Holder Behavior Deep Dive",
  "{sector} Market Structure: Who's Building, Who's Leaving",
  "The Bull Case for {asset} in the Current Macro Environment",
  "Critical Infrastructure: The {sector} Thesis",
  "Navigating {sector}: A Risk Framework for Allocators",
  "Token Economics of {asset}: Sustainable or Speculative?",
  "{sector} Regulation: Global Landscape and Implications",
  "The {sector} Opportunity: Why Now Matters",
  "Portfolio Construction: Optimal {asset} Allocation Strategies",
  "From Zero to One: {sector} Innovation Frontiers",
  "Market Microstructure: {asset} Liquidity Analysis",
  "{sector} Developer Activity: Quarterly Report Q1 2026",
];

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateArticles(count = 120) {
  const firmNames = Object.keys(FIRMS);
  const articles = [];

  for (let i = 0; i < count; i++) {
    const firm = firmNames[Math.floor(seededRand(i * 17 + 3) * firmNames.length)];
    const sector = SECTORS[Math.floor(seededRand(i * 31 + 7) * SECTORS.length)];
    const asset = ASSETS[Math.floor(seededRand(i * 13 + 11) * ASSETS.length)];
    const titleTemplate = TITLES[Math.floor(seededRand(i * 23 + 5) * TITLES.length)];
    const title = titleTemplate.replace("{sector}", sector).replace("{asset}", asset);
    const contentType =
      CONTENT_TYPES[Math.floor(seededRand(i * 41 + 2) * CONTENT_TYPES.length)];
    const daysAgo = Math.floor(seededRand(i * 7 + 1) * 30);
    const hoursAgo = Math.floor(seededRand(i * 11 + 9) * 24);
    const date = new Date(Date.now() - daysAgo * 86400000 - hoursAgo * 3600000);
    const readTime = Math.floor(seededRand(i * 19 + 4) * 25) + 5;

    const numTags = Math.floor(seededRand(i * 29 + 6) * 3) + 1;
    const tags = [];
    const shuffled = [...TAGS_POOL].sort(
      (a, b) => seededRand(i * 37 + TAGS_POOL.indexOf(a)) - 0.5
    );
    for (let t = 0; t < numTags; t++) tags.push(shuffled[t]);

    const summaries = SUMMARIES_BY_TYPE[contentType] || SUMMARIES_BY_TYPE["Deep Dive"];
    const summary = summaries[Math.floor(seededRand(i * 43 + 8) * summaries.length)];
    const author = AUTHORS[Math.floor(seededRand(i * 53 + 12) * AUTHORS.length)];

    const numTakeaways = Math.floor(seededRand(i * 61 + 14) * 3) + 2;
    const takeaways = [];
    const shuffledTakeaways = [...KEY_TAKEAWAYS].sort(
      (a, b) => seededRand(i * 67 + KEY_TAKEAWAYS.indexOf(a)) - 0.5
    );
    for (let t = 0; t < numTakeaways; t++) takeaways.push(shuffledTakeaways[t]);

    const firmData = FIRMS[firm];

    articles.push({
      id: i,
      title,
      firm,
      sector,
      asset,
      contentType,
      date,
      readTime,
      tags,
      bookmarked: false,
      signal: seededRand(i * 71 + 16) > 0.6,
      summary,
      author,
      takeaways,
      sourceUrl: firmData.url,
    });
  }

  return articles.sort((a, b) => b.date - a.date);
}
