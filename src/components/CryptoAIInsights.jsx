import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FIRMS = {
  "a16z crypto": { tier: "top", type: "crypto-native", color: "#E8553A", url: "https://a16zcrypto.com/research", logo: "a16z" },
  "Paradigm": { tier: "top", type: "crypto-native", color: "#6366F1", url: "https://www.paradigm.xyz/writing", logo: "PAR" },
  "Delphi Digital": { tier: "top", type: "crypto-native", color: "#22D3EE", url: "https://members.delphidigital.io/reports", logo: "DEL" },
  "Messari": { tier: "top", type: "crypto-native", color: "#10B981", url: "https://messari.io/research", logo: "MES" },
  "Galaxy Digital": { tier: "top", type: "crypto-native", color: "#A78BFA", url: "https://www.galaxy.com/insights/research", logo: "GAL" },
  "Coinbase Institutional": { tier: "top", type: "hybrid", color: "#3B82F6", url: "https://www.coinbase.com/institutional/research-insights", logo: "CB" },
  "Pantera Capital": { tier: "top", type: "crypto-native", color: "#F59E0B", url: "https://panteracapital.com/blockchain-letter", logo: "PAN" },
  "Multicoin Capital": { tier: "mid", type: "crypto-native", color: "#EC4899", url: "https://multicoin.capital/blog", logo: "MUL" },
  "The Block Research": { tier: "mid", type: "crypto-native", color: "#8B5CF6", url: "https://www.theblock.co/research", logo: "BLK" },
  "Sequoia Capital": { tier: "top", type: "tradfi", color: "#DC2626", url: "https://www.sequoiacap.com/articles", logo: "SEQ" },
  "Goldman Sachs Digital": { tier: "top", type: "tradfi", color: "#0EA5E9", url: "https://www.goldmansachs.com/insights", logo: "GS" },
  "JPMorgan Digital": { tier: "top", type: "tradfi", color: "#2563EB", url: "https://www.jpmorgan.com/insights", logo: "JPM" },
  "Morgan Stanley Digital": { tier: "mid", type: "tradfi", color: "#7C3AED", url: "https://www.morganstanley.com/ideas", logo: "MS" },
  "Bernstein Research": { tier: "mid", type: "tradfi", color: "#059669", url: "https://www.bernsteinresearch.com", logo: "BER" },
  "Polychain Capital": { tier: "mid", type: "crypto-native", color: "#F97316", url: "https://polychain.capital", logo: "POL" },
  "Electric Capital": { tier: "mid", type: "crypto-native", color: "#FBBF24", url: "https://www.electriccapital.com", logo: "ELC" },
  "Variant Fund": { tier: "mid", type: "crypto-native", color: "#34D399", url: "https://variant.fund/writing", logo: "VAR" },
  "Placeholder VC": { tier: "mid", type: "crypto-native", color: "#FB923C", url: "https://www.placeholder.vc/blog", logo: "PH" },
  "Dragonfly": { tier: "mid", type: "crypto-native", color: "#E879F9", url: "https://dragonfly.xyz/blog", logo: "DRG" },
  "Framework Ventures": { tier: "mid", type: "crypto-native", color: "#38BDF8", url: "https://framework.ventures", logo: "FRM" },
};

const SECTORS = ["DeFi", "Infrastructure", "L1/L2", "AI x Crypto", "RWA", "DePIN", "Gaming", "Security", "Regulation", "Stablecoins", "MEV", "ZK", "Data", "NFT/Culture", "DAO Governance"];
const ASSETS = ["BTC", "ETH", "SOL", "AVAX", "MATIC", "ARB", "OP", "LINK", "AAVE", "UNI", "MKR", "SNX", "RNDR", "FIL", "NEAR", "ATOM", "DOT", "ADA"];
const CONTENT_TYPES = ["Deep Dive", "Market Analysis", "Technical Report", "Investment Thesis", "Ecosystem Overview", "Regulatory Analysis", "Data Report", "Opinion", "Weekly Digest"];
const TAGS_POOL = ["alpha", "macro", "on-chain", "governance", "tokenomics", "protocol", "yield", "risk", "institutional", "retail", "narrative", "thesis", "contrarian", "bullish", "bearish", "neutral"];

const SUMMARIES_BY_TYPE = {
  "Deep Dive": [
    "A comprehensive examination of the underlying mechanics, token economics, and competitive positioning within the broader ecosystem. The report evaluates technical architecture, governance structures, and potential catalysts that could drive adoption over the next 12\u201318 months.",
    "This deep dive analyzes on-chain data, developer activity metrics, and capital flows to construct a holistic view of ecosystem health. Key findings suggest structural shifts in market dynamics that have been underappreciated by consensus.",
    "An exhaustive analysis covering protocol-level innovations, security considerations, and the competitive landscape. The authors present a framework for evaluating long-term viability alongside near-term trading opportunities.",
  ],
  "Market Analysis": [
    "The report examines current market structure, liquidity conditions, and macro catalysts shaping price action. Key metrics including funding rates, open interest, and exchange flows are analyzed alongside broader macro variables.",
    "A data-driven assessment of recent market dynamics, identifying divergences between price action and fundamental indicators. The analysis highlights areas of potential mispricing and structural positioning opportunities.",
    "This market analysis synthesizes cross-asset correlations, volatility regime indicators, and sentiment data to assess the current environment. The authors identify key inflection points and risk scenarios to monitor.",
  ],
  "Technical Report": [
    "A technical evaluation of protocol architecture, smart contract design patterns, and security considerations. The report includes benchmarking data, stress test results, and recommendations for infrastructure improvements.",
    "This technical report covers recent protocol upgrades, performance optimizations, and their implications for scalability and user experience. Comparative benchmarks against competing solutions are provided.",
    "A detailed technical assessment focusing on consensus mechanisms, network throughput, and decentralization metrics. The report evaluates trade-offs in current design choices and proposes areas for future research.",
  ],
  "Investment Thesis": [
    "The thesis presents a conviction-weighted framework for portfolio positioning, identifying asymmetric opportunities based on fundamental analysis, competitive dynamics, and macro tailwinds. Risk-reward scenarios are modeled across multiple timeframes.",
    "This investment thesis outlines the structural case for allocation, drawing on historical precedents, addressable market analysis, and catalysts on the horizon. The authors detail entry criteria, position sizing, and key risks to monitor.",
    "A first-principles investment case building from market sizing, competitive moats, and token value accrual mechanisms. The thesis includes scenario analysis with probability-weighted expected returns.",
  ],
  "Ecosystem Overview": [
    "A comprehensive mapping of the ecosystem covering key protocols, infrastructure providers, and emerging projects. The overview analyzes TVL distribution, user growth trajectories, and developer mindshare across the landscape.",
    "This ecosystem overview catalogs the most significant developments, partnership announcements, and capital deployments over the past quarter. Cross-chain dynamics and emerging competitive threats are assessed.",
    "An expansive survey of ecosystem participants, their interconnections, and relative positioning. The report highlights areas of innovation, consolidation trends, and potential white space opportunities for builders.",
  ],
  "Regulatory Analysis": [
    "An analysis of the evolving regulatory landscape across major jurisdictions, with implications for protocol design, compliance requirements, and institutional adoption. Key legislative proposals and enforcement actions are examined.",
    "This regulatory analysis tracks recent enforcement actions, legislative proposals, and guidance documents from global regulators. The report assesses the impact on market structure and institutional participation.",
    "A jurisdictional comparison of regulatory frameworks, examining divergent approaches to classification, taxation, and compliance requirements. The analysis identifies regulatory arbitrage opportunities and convergence trends.",
  ],
  "Data Report": [
    "A quantitative analysis leveraging on-chain metrics, network statistics, and market data to identify emerging trends. Key indicators including active addresses, transaction volumes, and fee revenue are tracked and contextualized.",
    "This data report presents a comprehensive dashboard of ecosystem health metrics, including developer activity, capital flows, and usage patterns. Statistical analysis reveals divergences from historical baselines.",
    "A data-intensive examination of market microstructure, including order book depth, trade execution quality, and liquidity provisioning dynamics. The findings have implications for both traders and protocol designers.",
  ],
  "Opinion": [
    "A thought-provoking perspective challenging prevailing market narratives, supported by original analysis and historical parallels. The author presents a contrarian framework for evaluating opportunities in the current environment.",
    "This opinion piece argues for a fundamental reassessment of consensus positioning, drawing on underappreciated data points and emerging macro dynamics. A provocative but well-reasoned case for portfolio recalibration.",
    "A forward-looking perspective on where the industry is headed, combining macro analysis with granular ecosystem observations. The author identifies blind spots in current market thinking and proposes alternative frameworks.",
  ],
  "Weekly Digest": [
    "This week's digest covers the most significant developments across markets, protocol updates, and regulatory actions. Key data points and emerging narratives are synthesized into actionable takeaways.",
    "A curated summary of the week's most important events, including major protocol launches, governance proposals, and market-moving developments. Each item is contextualized with relevant data and analysis.",
    "The weekly roundup highlights pivotal moments in markets, technology, and regulation. Cross-references to previous coverage provide continuity, while forward-looking insights help readers position for the week ahead.",
  ],
};

const KEY_TAKEAWAYS = [
  "Structural demand exceeds current supply dynamics, creating persistent upward pressure",
  "Developer activity metrics have diverged significantly from price action, suggesting undervaluation",
  "Regulatory clarity in key jurisdictions is acting as a tailwind for institutional adoption",
  "On-chain data reveals accumulation patterns consistent with prior cycle bottoms",
  "Cross-chain interoperability improvements are reducing fragmentation and improving capital efficiency",
  "Tokenomics redesigns are shifting value accrual toward protocol-level sustainability",
  "Market microstructure has matured considerably, with improved depth and reduced spreads",
  "Governance participation rates suggest growing community alignment on strategic priorities",
  "The macro environment favors assets with programmable yield and transparent collateralization",
  "Network effects are compounding faster than consensus models suggest",
  "Fee revenue growth is outpacing token inflation for the first time in this ecosystem",
  "Institutional-grade infrastructure is removing key barriers to large-scale allocation",
];

const AUTHORS = [
  "Research Team", "Senior Analyst", "Chief Strategist", "Head of Research", "Portfolio Manager",
  "Principal Investigator", "Crypto Economist", "Lead Analyst", "Director of Research", "Quantitative Strategist",
];

function generateArticles(count) {
  const firmNames = Object.keys(FIRMS);
  const titles = [
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

  const seededRand = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const articles = [];
  for (let i = 0; i < count; i++) {
    const firm = firmNames[Math.floor(seededRand(i * 17 + 3) * firmNames.length)];
    const sector = SECTORS[Math.floor(seededRand(i * 31 + 7) * SECTORS.length)];
    const asset = ASSETS[Math.floor(seededRand(i * 13 + 11) * ASSETS.length)];
    const titleTemplate = titles[Math.floor(seededRand(i * 23 + 5) * titles.length)];
    const title = titleTemplate.replace("{sector}", sector).replace("{asset}", asset);
    const contentType = CONTENT_TYPES[Math.floor(seededRand(i * 41 + 2) * CONTENT_TYPES.length)];
    const daysAgo = Math.floor(seededRand(i * 7 + 1) * 30);
    const hoursAgo = Math.floor(seededRand(i * 11 + 9) * 24);
    const date = new Date(Date.now() - daysAgo * 86400000 - hoursAgo * 3600000);
    const readTime = Math.floor(seededRand(i * 19 + 4) * 25) + 5;
    const numTags = Math.floor(seededRand(i * 29 + 6) * 3) + 1;
    const tags = [];
    const shuffled = [...TAGS_POOL].sort((a, b) => seededRand(i * 37 + TAGS_POOL.indexOf(a)) - 0.5);
    for (let t = 0; t < numTags; t++) tags.push(shuffled[t]);

    const summaries = SUMMARIES_BY_TYPE[contentType] || SUMMARIES_BY_TYPE["Deep Dive"];
    const summary = summaries[Math.floor(seededRand(i * 43 + 8) * summaries.length)];
    const author = AUTHORS[Math.floor(seededRand(i * 53 + 12) * AUTHORS.length)];

    const numTakeaways = Math.floor(seededRand(i * 61 + 14) * 3) + 2;
    const takeaways = [];
    const shuffledTakeaways = [...KEY_TAKEAWAYS].sort((a, b) => seededRand(i * 67 + KEY_TAKEAWAYS.indexOf(a)) - 0.5);
    for (let t = 0; t < numTakeaways; t++) takeaways.push(shuffledTakeaways[t]);

    const firmData = FIRMS[firm];

    articles.push({
      id: i, title, firm, sector, asset, contentType, date, readTime, tags,
      bookmarked: false,
      signal: seededRand(i * 71 + 16) > 0.6,
      summary, author, takeaways,
      sourceUrl: firmData.url,
    });
  }
  return articles.sort((a, b) => b.date - a.date);
}

const ALL_ARTICLES = generateArticles(120);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatFullDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = ({ type, size = 16 }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const svgProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

  const paths = {
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
    bookmarkFill: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevron: <polyline points="6 9 12 15 18 9"/>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  };

  return <span style={s}><svg {...svgProps}>{paths[type]}</svg></span>;
};

// ─── Small Components ────────────────────────────────────────────────────────

const Pill = ({ children, active, onClick, color, small }) => (
  <button onClick={onClick} style={{
    padding: small ? "3px 10px" : "5px 14px", borderRadius: "100px",
    border: active ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
    background: active ? (color || "rgba(255,255,255,0.12)") : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.5)",
    fontSize: small ? "11px" : "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.02em", whiteSpace: "nowrap",
  }}>{children}</button>
);

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", flex: 1, minWidth: 160 }}>
    <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: "28px", fontFamily: "'Fira Code', monospace", color: accent || "#fff", fontWeight: 600, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{sub}</div>}
  </div>
);

const FirmBadge = ({ firm, clickable }) => {
  const info = FIRMS[firm] || { color: "#888", url: "#" };
  const Tag = clickable ? "a" : "span";
  const extra = clickable ? { href: info.url, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag {...extra} onClick={e => e.stopPropagation()} style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: "12px",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: info.color, textDecoration: "none", cursor: clickable ? "pointer" : "default",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, boxShadow: `0 0 8px ${info.color}40` }}/>
      {firm}
      {clickable && <Icon type="external" size={10}/>}
    </Tag>
  );
};

// ─── Article Detail Panel ────────────────────────────────────────────────────

const ArticleDetail = ({ article, onClose, onBookmark }) => {
  const firmInfo = FIRMS[article.firm] || { color: "#888", url: "#", logo: "?" };
  const panelRef = useRef(null);

  useEffect(() => { if (panelRef.current) panelRef.current.scrollTop = 0; }, [article.id]);
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}/>
      <div ref={panelRef} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(600px, 90vw)", zIndex: 201,
        background: "#111116", borderLeft: "1px solid rgba(255,255,255,0.08)", overflowY: "auto", animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ position: "sticky", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${firmInfo.color}, ${firmInfo.color}40, transparent)`, zIndex: 10 }}/>

        <div style={{ position: "sticky", top: 3, zIndex: 10, background: "linear-gradient(180deg, #111116 80%, transparent)", padding: "16px 28px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.6)", padding: "6px 12px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
            <Icon type="arrowLeft" size={14}/> Back
          </button>
          <button onClick={() => onBookmark(article.id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: article.bookmarked ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${article.bookmarked ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "8px", color: article.bookmarked ? "#FBBF24" : "rgba(255,255,255,0.6)",
            padding: "6px 12px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>
            <Icon type={article.bookmarked ? "bookmarkFill" : "bookmark"} size={14}/>
            {article.bookmarked ? "Saved" : "Save"}
          </button>
        </div>

        <div style={{ padding: "0 28px 40px" }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", padding: "3px 10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{article.contentType}</span>
            <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)" }}>{article.readTime} min read</span>
            {article.signal && (
              <span style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "#FBBF24", padding: "3px 10px", background: "rgba(251,191,36,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", gap: 4 }}><Icon type="zap" size={10}/> High Signal</span>
            )}
          </div>

          {/* Title */}
          <h2 style={{ fontSize: "28px", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, color: "#fff", lineHeight: 1.3, margin: "0 0 20px 0" }}>{article.title}</h2>

          {/* Firm & Author */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${firmInfo.color}18`, border: `1px solid ${firmInfo.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: "'Fira Code', monospace", fontWeight: 600, color: firmInfo.color }}>{firmInfo.logo}</div>
              <div>
                <FirmBadge firm={article.firm} clickable/>
                <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{article.author}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)" }}>{formatFullDate(article.date)}</div>
              <div style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{timeAgo(article.date)}</div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: "6px", background: `${firmInfo.color}15`, border: `1px solid ${firmInfo.color}25`, fontSize: "11px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: firmInfo.color }}>{article.sector}</span>
            <span style={{ padding: "4px 12px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontFamily: "'Fira Code', monospace", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{article.asset}</span>
            {article.tags.map(t => (
              <span key={t} style={{ padding: "4px 12px", borderRadius: "6px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>#{t}</span>
            ))}
          </div>

          {/* Summary */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Summary</div>
            <p style={{ fontSize: "15px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>{article.summary}</p>
          </div>

          {/* Key Takeaways */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Key Takeaways</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {article.takeaways.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: firmInfo.color, fontSize: "11px", fontFamily: "'Fira Code', monospace", fontWeight: 600, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 24px",
            background: `linear-gradient(135deg, ${firmInfo.color}20, ${firmInfo.color}08)`,
            border: `1px solid ${firmInfo.color}40`, borderRadius: "12px", color: "#fff",
            fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textDecoration: "none",
            transition: "all 0.2s", cursor: "pointer", marginBottom: 16,
          }}>
            Read Full Report on {article.firm} <Icon type="external" size={16}/>
          </a>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)" }}>
            <Icon type="external" size={10}/> {article.sourceUrl}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Article Card ────────────────────────────────────────────────────────────

const ArticleCard = ({ article, onBookmark, onSelect, viewMode }) => {
  const [hovered, setHovered] = useState(false);
  const firmInfo = FIRMS[article.firm] || { color: "#888" };

  if (viewMode === "list") {
    return (
      <div onClick={() => onSelect(article)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
        display: "grid", gridTemplateColumns: "1fr 180px 120px 100px 80px 40px", alignItems: "center", gap: 16,
        padding: "16px 24px", background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "all 0.2s",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {article.signal && <span style={{ color: "#FBBF24", fontSize: 12 }}><Icon type="zap" size={12}/></span>}
            <span style={{ fontSize: "14px", fontFamily: "'Instrument Serif', Georgia, serif", color: "#fff", lineHeight: 1.3, fontWeight: 400 }}>{article.title}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {article.tags.map(t => (
              <span key={t} style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>#{t}</span>
            ))}
          </div>
        </div>
        <FirmBadge firm={article.firm}/>
        <span style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)" }}>{article.contentType}</span>
        <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)" }}>{timeAgo(article.date)}</span>
        <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)" }}>{article.readTime}m</span>
        <button onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: article.bookmarked ? "#FBBF24" : "rgba(255,255,255,0.15)", padding: 4, transition: "color 0.2s" }}>
          <Icon type={article.bookmarked ? "bookmarkFill" : "bookmark"} size={14}/>
        </button>
      </div>
    );
  }

  return (
    <div onClick={() => onSelect(article)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
      border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
      borderRadius: "14px", padding: "24px", cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: hovered ? "translateY(-2px)" : "none", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${firmInfo.color}, transparent)`, opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s" }}/>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{article.contentType}</span>
          {article.signal && (
            <span style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "#FBBF24", padding: "2px 8px", background: "rgba(251,191,36,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", gap: 4 }}><Icon type="zap" size={10}/> signal</span>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: article.bookmarked ? "#FBBF24" : "rgba(255,255,255,0.15)", padding: 4, transition: "color 0.2s" }}>
          <Icon type={article.bookmarked ? "bookmarkFill" : "bookmark"} size={16}/>
        </button>
      </div>

      <h3 style={{ fontSize: "18px", fontFamily: "'Instrument Serif', Georgia, serif", color: "#fff", fontWeight: 400, lineHeight: 1.35, margin: "0 0 14px 0" }}>{article.title}</h3>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <FirmBadge firm={article.firm}/>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {article.tags.map(t => (
              <span key={t} style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>#{t}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.25)" }}>{timeAgo(article.date)}</div>
          <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{article.readTime} min read</div>
        </div>
      </div>
    </div>
  );
};

// ─── Dropdown ────────────────────────────────────────────────────────────────

const Dropdown = ({ label, options, selected, onSelect, multi }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const count = multi ? selected.length : (selected ? 1 : 0);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
        background: count > 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${count > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "8px", color: count > 0 ? "#fff" : "rgba(255,255,255,0.5)",
        fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
      }}>
        {label}{count > 0 && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "1px 7px", fontSize: "10px", fontFamily: "'Fira Code', monospace" }}>{count}</span>}
        <Icon type="chevron" size={12}/>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100, background: "#1a1a1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "6px", minWidth: 200, maxHeight: 280, overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
          {multi && selected.length > 0 && (
            <button onClick={() => onSelect([])} style={{ width: "100%", padding: "6px 10px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>Clear all</button>
          )}
          {options.map(opt => {
            const isSelected = multi ? selected.includes(opt) : selected === opt;
            return (
              <button key={opt} onClick={() => {
                if (multi) { onSelect(isSelected ? selected.filter(s => s !== opt) : [...selected, opt]); }
                else { onSelect(isSelected ? null : opt); setOpen(false); }
              }} style={{
                width: "100%", padding: "7px 10px", background: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
                border: "none", borderRadius: "6px", color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8,
              }}>
                {multi && (
                  <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.2)"}`, background: isSelected ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#0a0a0f", flexShrink: 0 }}>{isSelected && "\u2713"}</span>
                )}
                {opt}
                {FIRMS[opt] && <span style={{ width: 6, height: 6, borderRadius: "50%", background: FIRMS[opt].color, marginLeft: "auto" }}/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────

export default function CryptoAIInsights() {
  const [articles, setArticles] = useState(ALL_ARTICLES);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("latest");
  const [filterFirms, setFilterFirms] = useState([]);
  const [filterSectors, setFilterSectors] = useState([]);
  const [filterAssets, setFilterAssets] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterFirmType, setFilterFirmType] = useState(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showSignalOnly, setShowSignalOnly] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = selectedArticle ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedArticle]);

  const toggleBookmark = useCallback((id) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
    setSelectedArticle(prev => prev && prev.id === id ? { ...prev, bookmarked: !prev.bookmarked } : prev);
  }, []);

  const filtered = articles.filter(a => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.firm.toLowerCase().includes(q) && !a.sector.toLowerCase().includes(q) && !a.asset.toLowerCase().includes(q)) return false;
    }
    if (filterFirms.length && !filterFirms.includes(a.firm)) return false;
    if (filterSectors.length && !filterSectors.includes(a.sector)) return false;
    if (filterAssets.length && !filterAssets.includes(a.asset)) return false;
    if (filterTypes.length && !filterTypes.includes(a.contentType)) return false;
    if (filterFirmType) {
      const info = FIRMS[a.firm];
      if (filterFirmType === "crypto" && info?.type !== "crypto-native") return false;
      if (filterFirmType === "tradfi" && info?.type !== "tradfi") return false;
    }
    if (showBookmarked && !a.bookmarked) return false;
    if (showSignalOnly && !a.signal) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "latest") return b.date - a.date;
    if (sortBy === "oldest") return a.date - b.date;
    if (sortBy === "readTime") return a.readTime - b.readTime;
    return 0;
  });

  const activeFilters = filterFirms.length + filterSectors.length + filterAssets.length + filterTypes.length + (filterFirmType ? 1 : 0) + (showSignalOnly ? 1 : 0);
  const clearAll = () => { setFilterFirms([]); setFilterSectors([]); setFilterAssets([]); setFilterTypes([]); setFilterFirmType(null); setShowBookmarked(false); setShowSignalOnly(false); setSearch(""); };

  const bookmarkedCount = articles.filter(a => a.bookmarked).length;
  const signalCount = articles.filter(a => a.signal).length;
  const uniqueFirms = new Set(articles.map(a => a.firm)).size;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes grain { 0%, 100% { transform: translate(0,0); } 10% { transform: translate(-5%,-10%); } 50% { transform: translate(12%,9%); } 90% { transform: translate(-1%,7%); } }
        select option { background: #1a1a1f; color: #fff; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, animation: "grain 8s steps(10) infinite" }}/>
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,85,58,0.04) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}/>

      {selectedArticle && <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} onBookmark={toggleBookmark}/>}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <header style={{ padding: "28px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", animation: mounted ? "fadeIn 0.6s ease" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <h1 style={{ fontSize: "26px", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, margin: 0, letterSpacing: "-0.01em", lineHeight: 1 }}>
                <span style={{ color: "#fff" }}>Crypto</span>
                <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 6px", fontWeight: 300 }}>AI</span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Insights</span>
              </h1>
              <span style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Research Aggregator</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, animation: "pulse 3s ease infinite" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }}/>
                <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.3)" }}>LIVE</span>
              </div>
              <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)" }}>{formatDate(new Date())}</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, padding: "24px 0", animation: mounted ? "fadeUp 0.6s ease 0.1s both" : "none", flexWrap: "wrap" }}>
          <StatCard label="Total Research" value={articles.length} sub={`From ${uniqueFirms} firms`} accent="#fff"/>
          <StatCard label="Signal-rated" value={signalCount} sub="High-conviction pieces" accent="#FBBF24"/>
          <StatCard label="This Week" value={articles.filter(a => (Date.now() - a.date) < 7 * 86400000).length} sub="New publications" accent="#22D3EE"/>
          <StatCard label="Bookmarked" value={bookmarkedCount} sub="Your reading list" accent="#A78BFA"/>
        </div>

        {/* Search & Filters */}
        <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.04)", animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 16px", marginBottom: 16 }}>
            <Icon type="search" size={16}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search research by title, firm, sector, or asset..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}/>
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 2 }}><Icon type="x" size={14}/></button>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Dropdown label="Firm" options={Object.keys(FIRMS)} selected={filterFirms} onSelect={setFilterFirms} multi/>
            <Dropdown label="Sector" options={SECTORS} selected={filterSectors} onSelect={setFilterSectors} multi/>
            <Dropdown label="Asset" options={ASSETS} selected={filterAssets} onSelect={setFilterAssets} multi/>
            <Dropdown label="Type" options={CONTENT_TYPES} selected={filterTypes} onSelect={setFilterTypes} multi/>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", margin: "0 4px" }}/>
            <Pill active={filterFirmType === "crypto"} onClick={() => setFilterFirmType(filterFirmType === "crypto" ? null : "crypto")} small>Crypto-Native</Pill>
            <Pill active={filterFirmType === "tradfi"} onClick={() => setFilterFirmType(filterFirmType === "tradfi" ? null : "tradfi")} small>TradFi</Pill>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", margin: "0 4px" }}/>
            <Pill active={showSignalOnly} onClick={() => setShowSignalOnly(!showSignalOnly)} color="rgba(251,191,36,0.2)" small><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon type="zap" size={11}/> Signal Only</span></Pill>
            <Pill active={showBookmarked} onClick={() => setShowBookmarked(!showBookmarked)} color="rgba(167,139,250,0.2)" small><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon type="bookmarkFill" size={11}/> Bookmarked</span></Pill>
            {activeFilters > 0 && <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", padding: "4px 8px", marginLeft: 4 }}>Clear all ({activeFilters})</button>}

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", padding: "6px 10px", cursor: "pointer", outline: "none" }}>
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="readTime">Quick reads</option>
              </select>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
                <button onClick={() => setViewMode("grid")} style={{ background: viewMode === "grid" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: viewMode === "grid" ? "#fff" : "rgba(255,255,255,0.3)", padding: "6px 10px", cursor: "pointer" }}><Icon type="grid" size={14}/></button>
                <button onClick={() => setViewMode("list")} style={{ background: viewMode === "list" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: viewMode === "list" ? "#fff" : "rgba(255,255,255,0.3)", padding: "6px 10px", cursor: "pointer" }}><Icon type="list" size={14}/></button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 16px", animation: mounted ? "fadeUp 0.6s ease 0.3s both" : "none" }}>
          <span style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)" }}>
            Showing <span style={{ color: "#fff", fontFamily: "'Fira Code', monospace", fontWeight: 500 }}>{sorted.length}</span> of {articles.length} research pieces
          </span>
          {activeFilters > 0 && <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)", padding: "2px 8px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }}>{activeFilters} filter{activeFilters > 1 ? "s" : ""} active</span>}
        </div>

        {/* Content */}
        <div style={{ animation: mounted ? "fadeUp 0.6s ease 0.35s both" : "none", paddingBottom: 80 }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{ fontSize: "48px", marginBottom: 16, opacity: 0.3 }}>{"\u2205"}</div>
              <div style={{ fontSize: "16px", marginBottom: 8 }}>No research matches your filters</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.15)" }}>Try adjusting your search criteria or clearing filters</div>
            </div>
          ) : viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {sorted.map((article, i) => (
                <div key={article.id} style={{ animation: `fadeUp 0.4s ease ${Math.min(i * 0.03, 0.3)}s both` }}>
                  <ArticleCard article={article} onBookmark={toggleBookmark} onSelect={setSelectedArticle} viewMode={viewMode}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 120px 100px 80px 40px", gap: 16, padding: "10px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                {["Title", "Firm", "Type", "Published", "Read", ""].map(h => (
                  <span key={h} style={{ fontSize: "10px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</span>
                ))}
              </div>
              {sorted.map((article, i) => (
                <div key={article.id} style={{ animation: `slideIn 0.3s ease ${Math.min(i * 0.02, 0.3)}s both` }}>
                  <ArticleCard article={article} onBookmark={toggleBookmark} onSelect={setSelectedArticle} viewMode={viewMode}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 0 32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.15)" }}>Crypto AI Insights — Curated crypto & AI research</span>
          <span style={{ fontSize: "11px", fontFamily: "'Fira Code', monospace", color: "rgba(255,255,255,0.1)" }}>v0.2.0</span>
        </div>
      </div>
    </div>
  );
}
