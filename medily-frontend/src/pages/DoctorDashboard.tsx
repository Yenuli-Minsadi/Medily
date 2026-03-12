// pages/DoctorDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorDashboard.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserData {
  email: string;
  role: string;
  name: string;
  isAuthenticated: boolean;
}

type MenuItem =
  | "overview"
  | "feed"
  | "saved"
  | "appointments"
  | "patients"
  | "prescriptions"
  | "messages"
  | "analytics";

interface FeedPost {
  id: number;
  author: {
    name: string;
    specialty: string;
    avatar: string;
    verified: boolean;
  };
  time: string;
  category: string;
  categoryColor: string; // "bg|text"
  content: string;
  image?: string;
  imageHeight?: number;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: string;
  liked: boolean;
  bookmarked: boolean;
  accentColor: string;
}

// ─── Feed Static Data ─────────────────────────────────────────────────────────
const FEED_CATEGORIES = [
  "All",
  "Research",
  "Case Studies",
  "Guidelines",
  "Pharmacology",
  "Surgery",
  "Mental Health",
];

const TRENDING_TOPICS = [
  { tag: "CardiacArrest", count: "2.4k" },
  { tag: "AI_Diagnostics", count: "1.8k" },
  { tag: "NeurologyUpdate", count: "1.2k" },
  { tag: "COVID_Research", count: "987" },
  { tag: "PediatricCare", count: "743" },
];

const SUGGESTED_DOCTORS = [
  {
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Chen&background=3b82f6&color=fff",
    verified: true,
  },
  {
    name: "Dr. James Okafor",
    specialty: "Neurologist",
    avatar:
      "https://ui-avatars.com/api/?name=James+Okafor&background=7c3aed&color=fff",
    verified: true,
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Oncologist",
    avatar:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=059669&color=fff",
    verified: false,
  },
];

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 1,
    author: {
      name: "Dr. Emily Watson",
      specialty: "Cardiology · UCSF",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Watson&background=ef4444&color=fff",
      verified: true,
    },
    time: "2h ago",
    category: "Research",
    categoryColor: "#dbeafe|#1d4ed8",
    content:
      "Exciting breakthrough: patients receiving early PCSK9 inhibitor therapy showed a 43% reduction in major cardiovascular events over 24 months. LDL-C reduced from 142 mg/dL to 58 mg/dL within 12 weeks. Zero serious adverse events.",
    image:
      "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&q=80",
    imageHeight: 200,
    tags: ["Cardiology", "PCSK9", "ClinicalTrial"],
    likes: 284,
    comments: 47,
    shares: 93,
    views: "4.2k",
    liked: false,
    bookmarked: false,
    accentColor: "#fef2f2",
  },
  {
    id: 2,
    author: {
      name: "Dr. Marcus Reid",
      specialty: "Emergency · Hopkins",
      avatar:
        "https://ui-avatars.com/api/?name=Marcus+Reid&background=f59e0b&color=fff",
      verified: true,
    },
    time: "4h ago",
    category: "Case Studies",
    categoryColor: "#fef3c7|#d97706",
    content:
      "34yo female presenting with acute confusion, fever, and new-onset seizures. LP showed lymphocytic pleocytosis. Anti-NMDA receptor antibodies strongly positive.\n\nAutoimmune encephalitis is still underdiagnosed. Prompt immunotherapy can be life-saving. Anyone else seeing more of these lately?",
    tags: ["Neurology", "AutoimmuneEncephalitis"],
    likes: 156,
    comments: 89,
    shares: 42,
    views: "2.8k",
    liked: true,
    bookmarked: true,
    accentColor: "#fffbeb",
  },
  {
    id: 3,
    author: {
      name: "Dr. Aisha Mohammed",
      specialty: "Infectious Disease · WHO",
      avatar:
        "https://ui-avatars.com/api/?name=Aisha+Mohammed&background=10b981&color=fff",
      verified: true,
    },
    time: "6h ago",
    category: "Guidelines",
    categoryColor: "#dcfce7|#15803d",
    content:
      "Updated WHO antimicrobial stewardship guidance is out. New framework mandates culture-directed therapy over empirical broad-spectrum coverage and de-escalation reviews at 72h. This is a significant protocol shift.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    imageHeight: 160,
    tags: ["AntimicrobialStewardship", "WHO"],
    likes: 412,
    comments: 63,
    shares: 187,
    views: "8.9k",
    liked: false,
    bookmarked: false,
    accentColor: "#f0fdf4",
  },
  {
    id: 4,
    author: {
      name: "Dr. Kevin Park",
      specialty: "Radiology · Mayo Clinic",
      avatar:
        "https://ui-avatars.com/api/?name=Kevin+Park&background=6366f1&color=fff",
      verified: false,
    },
    time: "9h ago",
    category: "Research",
    categoryColor: "#dbeafe|#1d4ed8",
    content:
      "AI-assisted mammography hit a milestone — 31% improvement in early-stage detection with 18% fewer false positives. Hybrid human-AI workflow, not full automation. The radiologist still makes the final call.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80",
    imageHeight: 240,
    tags: ["AI", "Radiology", "MachineLearning"],
    likes: 521,
    comments: 74,
    shares: 203,
    views: "11.3k",
    liked: false,
    bookmarked: false,
    accentColor: "#eef2ff",
  },
  {
    id: 5,
    author: {
      name: "Dr. Lena Fischer",
      specialty: "Psychiatry · Berlin Charité",
      avatar:
        "https://ui-avatars.com/api/?name=Lena+Fischer&background=ec4899&color=fff",
      verified: true,
    },
    time: "12h ago",
    category: "Mental Health",
    categoryColor: "#fce7f3|#be185d",
    content:
      "New RCT data on ketamine-assisted therapy for treatment-resistant depression: 68% response rate at 4 weeks vs 24% for standard SSRI augmentation. Side effect profile manageable with structured monitoring protocols.",
    tags: ["Depression", "Ketamine", "Psychiatry", "RCT"],
    likes: 339,
    comments: 112,
    shares: 88,
    views: "6.1k",
    liked: false,
    bookmarked: false,
    accentColor: "#fdf4ff",
  },
  {
    id: 6,
    author: {
      name: "Dr. Raj Patel",
      specialty: "Surgery · Cleveland Clinic",
      avatar:
        "https://ui-avatars.com/api/?name=Raj+Patel&background=0ea5e9&color=fff",
      verified: true,
    },
    time: "1d ago",
    category: "Surgery",
    categoryColor: "#ffedd5|#c2410c",
    content:
      "Robotic-assisted sleeve gastrectomy vs laparoscopic: our 500-patient series shows comparable outcomes but significantly reduced port-site complications (0.4% vs 3.1%). Learning curve is real but worth it.",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=80",
    imageHeight: 175,
    tags: ["BariatricSurgery", "Robotic", "MinimallyInvasive"],
    likes: 198,
    comments: 44,
    shares: 61,
    views: "3.4k",
    liked: false,
    bookmarked: true,
    accentColor: "#fff7ed",
  },
  {
    id: 7,
    author: {
      name: "Dr. Yuki Tanaka",
      specialty: "Pharmacology · Tokyo Medical",
      avatar:
        "https://ui-avatars.com/api/?name=Yuki+Tanaka&background=8b5cf6&color=fff",
      verified: false,
    },
    time: "1d ago",
    category: "Pharmacology",
    categoryColor: "#ede9fe|#6d28d9",
    content:
      "GLP-1 agonists beyond diabetes: cardiorenal protection, NASH improvement, and now potential neuroprotective effects in early trials. Are we looking at the next era of preventive medicine?",
    tags: ["GLP1", "Pharmacology", "Semaglutide"],
    likes: 607,
    comments: 134,
    shares: 241,
    views: "14.2k",
    liked: true,
    bookmarked: false,
    accentColor: "#f5f3ff",
  },
  {
    id: 8,
    author: {
      name: "Dr. Amara Osei",
      specialty: "Pediatrics · Great Ormond St",
      avatar:
        "https://ui-avatars.com/api/?name=Amara+Osei&background=f97316&color=fff",
      verified: true,
    },
    time: "2d ago",
    category: "Case Studies",
    categoryColor: "#fef3c7|#d97706",
    content:
      "Kawasaki disease presenting atypically in a 7-month-old — no classic fever duration, incomplete criteria met. Echo showed LAD aneurysm z-score +4.2. Early IVIG + aspirin critical. Atypical presentations remain a diagnostic challenge.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
    imageHeight: 150,
    tags: ["Pediatrics", "Kawasaki", "CaseStudy"],
    likes: 274,
    comments: 91,
    shares: 73,
    views: "5.7k",
    liked: false,
    bookmarked: false,
    accentColor: "#fff7ed",
  },
];

// ─── Masonry Hook ─────────────────────────────────────────────────────────────
function useMasonryColumns(
  containerRef: React.RefObject<HTMLDivElement>,
  colWidth = 260,
  gap = 14,
): number {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCols(Math.max(1, Math.floor((w + gap) / (colWidth + gap))));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, colWidth, gap]);
  return cols;
}

// ─── Masonry Grid ─────────────────────────────────────────────────────────────
const MasonryGrid: React.FC<{ children: React.ReactNode[]; gap?: number }> = ({
  children,
  gap = 14,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cols = useMasonryColumns(containerRef, 260, gap);
  const columns: React.ReactNode[][] = Array.from({ length: cols }, () => []);
  children.forEach((child, i) => columns[i % cols].push(child));

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", gap, alignItems: "flex-start" }}
    >
      {columns.map((col, ci) => (
        <div
          key={ci}
          style={{ flex: 1, display: "flex", flexDirection: "column", gap }}
        >
          {col}
        </div>
      ))}
    </div>
  );
};

// ─── Pinterest Pin Card ───────────────────────────────────────────────────────
interface PinCardProps {
  post: FeedPost;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
}

const PinCard: React.FC<PinCardProps> = ({ post, onLike, onBookmark }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [catBg, catText] = post.categoryColor.split("|");
  const needsTruncate = post.content.length > 140;
  const displayContent =
    needsTruncate && !expanded
      ? post.content.slice(0, 140) + "…"
      : post.content;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #e8eaf0",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.07)"
          : "0 2px 8px rgba(0,0,0,0.055)",
        transform: hovered
          ? "translateY(-4px) scale(1.012)"
          : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* ── Image ── */}
      {post.image && (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: post.imageHeight ?? 180,
          }}
        >
          <img
            src={post.image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
          {/* Gradient overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.03) 55%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          />
          {/* Floating bookmark btn */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(post.id);
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: post.bookmarked
                ? "#f59e0b"
                : "rgba(255,255,255,0.93)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered || post.bookmarked ? 1 : 0,
              transform:
                hovered || post.bookmarked ? "scale(1)" : "scale(0.75)",
              transition: "all 0.22s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={post.bookmarked ? "white" : "none"}
              stroke={post.bookmarked ? "white" : "#374151"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
          {/* Category pill over image (on hover) */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 12,
              padding: "0.22rem 0.6rem",
              background: "rgba(255,255,255,0.93)",
              borderRadius: 20,
              fontSize: "0.7rem",
              fontWeight: 700,
              color: catText,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(5px)",
              transition: "all 0.22s ease",
            }}
          >
            {post.category}
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div
        style={{
          padding: "0.95rem 1rem 0.75rem",
          background: post.accentColor,
        }}
      >
        {/* Category pill (text-only cards) */}
        {!post.image && (
          <span
            style={{
              display: "inline-block",
              marginBottom: "0.55rem",
              padding: "0.2rem 0.6rem",
              background: catBg,
              color: catText,
              borderRadius: 20,
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            {post.category}
          </span>
        )}

        <p
          style={{
            fontSize: "0.865rem",
            color: "#1e293b",
            lineHeight: 1.68,
            whiteSpace: "pre-line",
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {displayContent}
        </p>
        {needsTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.76rem",
              padding: "0.3rem 0 0",
              display: "block",
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.32rem",
            marginTop: "0.7rem",
          }}
        >
          {post.tags.map((t) => (
            <span
              key={t}
              style={{
                padding: "0.17rem 0.52rem",
                background: "rgba(79,70,229,0.08)",
                color: "#4f46e5",
                fontSize: "0.7rem",
                borderRadius: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "0.6rem 0.9rem 0.7rem",
          background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.055)",
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={post.author.avatar}
            alt=""
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              border: "2px solid #e2e8f0",
            }}
          />
          {post.author.verified && (
            <div
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 12,
                height: 12,
                background: "#4f46e5",
                borderRadius: "50%",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="6"
                height="6"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Name + time */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#0f172a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.author.name}
          </div>
          <div style={{ fontSize: "0.67rem", color: "#94a3b8" }}>
            {post.time}
          </div>
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(post.id);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.28rem",
            border: "none",
            background: "transparent",
            color: post.liked ? "#ef4444" : "#94a3b8",
            fontWeight: 700,
            fontSize: "0.75rem",
            cursor: "pointer",
            padding: "0.28rem 0.45rem",
            borderRadius: 8,
            transition: "all 0.15s",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={post.liked ? "#ef4444" : "none"}
            stroke={post.liked ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {post.likes}
        </button>

        {/* Comments */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.28rem",
            color: "#94a3b8",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {post.comments}
        </div>
      </div>
    </div>
  );
};

// ─── Feed Right Sidebar ───────────────────────────────────────────────────────
const FeedSidebar: React.FC = () => {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const toggleFollow = (name: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div
      style={{
        width: 252,
        flexShrink: 0,
        position: "sticky",
        top: 88,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Trending */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: "1.1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: "0.85rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#ef4444"
            stroke="#ef4444"
            strokeWidth="1.5"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
          </svg>
          <span
            style={{ fontWeight: 800, fontSize: "0.875rem", color: "#0f172a" }}
          >
            Trending
          </span>
        </div>
        {TRENDING_TOPICS.map((t, i) => (
          <div
            key={t.tag}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.42rem 0",
              borderBottom:
                i < TRENDING_TOPICS.length - 1 ? "1px solid #f8fafc" : "none",
              cursor: "pointer",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#4f46e5",
                }}
              >
                #{t.tag}
              </div>
              <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                {t.count} posts
              </div>
            </div>
            <span
              style={{ fontSize: "0.72rem", fontWeight: 800, color: "#e2e8f0" }}
            >
              #{i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Who to Follow */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: "1.1rem",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "0.875rem",
            color: "#0f172a",
            marginBottom: "0.85rem",
          }}
        >
          Who to Follow
        </div>
        {SUGGESTED_DOCTORS.map((doc) => (
          <div
            key={doc.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              marginBottom: "0.85rem",
            }}
          >
            <img
              src={doc.avatar}
              alt=""
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid #e2e8f0",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {doc.name}
              </div>
              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                {doc.specialty}
              </div>
            </div>
            <button
              onClick={() => toggleFollow(doc.name)}
              style={{
                padding: "0.28rem 0.6rem",
                border: `1.5px solid ${followed.has(doc.name) ? "#10b981" : "#4f46e5"}`,
                borderRadius: 20,
                background: followed.has(doc.name) ? "#10b981" : "transparent",
                color: followed.has(doc.name) ? "white" : "#4f46e5",
                fontWeight: 700,
                fontSize: "0.7rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {followed.has(doc.name) ? "✓ Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div
        style={{
          background: "linear-gradient(145deg,#4f46e5 0%,#7c3aed 100%)",
          borderRadius: 18,
          padding: "1.1rem",
          color: "white",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "0.875rem",
            marginBottom: "0.85rem",
            opacity: 0.95,
          }}
        >
          Your Activity
        </div>
        {[
          ["Posts this month", "12"],
          ["Profile views", "847"],
          ["Connections", "234"],
        ].map(([label, val]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.38rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.13)",
            }}
          >
            <span style={{ fontSize: "0.76rem", opacity: 0.83 }}>{label}</span>
            <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Feed Page ────────────────────────────────────────────────────────────────
const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [newPostText, setNewPostText] = useState("");

  const handleLike = (id: number) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );

  const handleBookmark = (id: number) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.content.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.65rem",
              fontWeight: 900,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.5px",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Medical Feed
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 4 }}>
            Discover insights from the global medical community
          </p>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.65rem 1.2rem",
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "white",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.875rem",
            boxShadow: "0 4px 14px rgba(79,70,229,0.36)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </button>
      </div>

      {/* ── Compose Box ── */}
      {composing && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: "1.1rem",
            marginBottom: "1.2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", gap: "0.875rem" }}>
            <img
              src="https://ui-avatars.com/api/?name=Dr+Sarah+Mitchell&background=4f46e5&color=fff&size=80"
              alt=""
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2px solid #e2e8f0",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share a clinical insight, case study, or research finding…"
                style={{
                  width: "100%",
                  minHeight: 100,
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  fontFamily: "Georgia, serif",
                  color: "#0f172a",
                  outline: "none",
                  background: "#fafafa",
                  lineHeight: 1.65,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.6rem",
                }}
              >
                <button
                  onClick={() => {
                    setComposing(false);
                    setNewPostText("");
                  }}
                  style={{
                    padding: "0.55rem 1.1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!newPostText.trim()}
                  style={{
                    padding: "0.55rem 1.1rem",
                    background: newPostText.trim()
                      ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                      : "#e2e8f0",
                    border: "none",
                    borderRadius: 10,
                    color: newPostText.trim() ? "white" : "#94a3b8",
                    fontWeight: 700,
                    cursor: newPostText.trim() ? "pointer" : "not-allowed",
                    fontSize: "0.85rem",
                  }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search + Category Pills ── */}
      <div
        style={{
          marginBottom: "1.1rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "0 0 210px" }}>
          <svg
            style={{
              position: "absolute",
              left: "0.8rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed…"
            style={{
              width: "100%",
              padding: "0.58rem 1rem 0.58rem 2.15rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              fontSize: "0.83rem",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap" }}>
          {FEED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.4rem 0.88rem",
                border: activeCategory === cat ? "none" : "1.5px solid #e2e8f0",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: "0.76rem",
                whiteSpace: "nowrap",
                cursor: "pointer",
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                    : "#fff",
                color: activeCategory === cat ? "white" : "#64748b",
                boxShadow:
                  activeCategory === cat
                    ? "0 2px 10px rgba(79,70,229,0.28)"
                    : "none",
                transition: "all 0.18s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-pane layout ── */}
      <div style={{ display: "flex", gap: "1.4rem", alignItems: "flex-start" }}>
        {/* Masonry feed */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                borderRadius: 20,
                border: "2px dashed #e2e8f0",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ color: "#0f172a", fontWeight: 700 }}>
                No posts found
              </h3>
              <p style={{ color: "#64748b" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <MasonryGrid gap={14}>
              {filtered.map((post) => (
                <PinCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </MasonryGrid>
          )}

          {filtered.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <button
                style={{
                  padding: "0.78rem 2.4rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#475569",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#4f46e5";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#fff";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#475569";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#e2e8f0";
                }}
              >
                Load more
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <FeedSidebar />
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DoctorDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar");
      const hamburger = document.querySelector(".hamburger-btn");
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !hamburger?.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const handleMenuClick = (menuId: MenuItem) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
  };

  const goToProfile = () => navigate("/doctor/profile");

  const menuItems: {
    id: MenuItem;
    label: string;
    icon: JSX.Element;
    badge?: number;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "feed",
      label: "Medical Feed",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
          <path d="M2 10h12" />
          <path d="M2 14h8" />
          <path d="M2 18h4" />
          <path d="M2 6h4" />
        </svg>
      ),
    },
    {
      id: "saved",
      label: "Saved",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      id: "appointments",
      label: "Appointments",
      badge: 3,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: "patients",
      label: "Patients",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      badge: 5,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      ),
    },
  ];

  const pageTitles: Record<MenuItem, { title: string; subtitle: string }> = {
    overview: { title: "Dr. Yen", subtitle: "Cardiologist" },
    feed: { title: "Medical Feed", subtitle: "Community Updates" },
    saved: { title: "Saved", subtitle: "Your bookmarked posts" },
    appointments: { title: "Appointments", subtitle: "Manage your schedule" },
    patients: { title: "Patients", subtitle: "Patient records" },
    prescriptions: { title: "Prescriptions", subtitle: "Manage prescriptions" },
    messages: { title: "Messages", subtitle: "Patient communications" },
    analytics: { title: "Analytics", subtitle: "Practice insights" },
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return (
          <div className="dashboard-content">
            <div className="doctor-id-card">
              <div className="id-card-left">
                <div className="doctor-avatar-large">
                  <img
                    src="https://ui-avatars.com/api/?name=Dr+Sarah+Mitchell&background=4f46e5&color=fff&size=80"
                    alt="Doctor"
                  />
                  <div className="status-indicator online" />
                </div>
                <div className="doctor-info">
                  <h2>Dr. Sarah Mitchell</h2>
                  <p className="doctor-specialty">Cardiologist • MD, FACC</p>
                  <p className="doctor-id">
                    Medical ID: <span>DOC-2024-8472</span>
                  </p>
                </div>
              </div>
              <div className="id-card-right">
                <div className="id-stat">
                  <span className="id-stat-value">12</span>
                  <span className="id-stat-label">Today</span>
                </div>
                <div className="id-stat">
                  <span className="id-stat-value">284</span>
                  <span className="id-stat-label">Total Patients</span>
                </div>
                <div className="id-stat">
                  <span className="id-stat-value">4.9</span>
                  <span className="id-stat-label">Rating ⭐</span>
                </div>
              </div>
            </div>

            <div className="quick-actions-section">
              <h3 className="section-title">Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-card primary">
                  <div className="qa-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span>Start Consultation</span>
                </button>
                <button
                  className="quick-action-card"
                  onClick={() => handleMenuClick("prescriptions")}
                >
                  <div className="qa-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span>Write Prescription</span>
                </button>
                <button
                  className="quick-action-card"
                  onClick={() => handleMenuClick("patients")}
                >
                  <div className="qa-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <span>Patient Records</span>
                </button>
                <button
                  className="quick-action-card"
                  onClick={() => handleMenuClick("feed")}
                >
                  <div className="qa-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
                      <path d="M2 10h12M2 14h8M2 6h4" />
                    </svg>
                  </div>
                  <span>Medical Feed</span>
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-left">
                <div className="summary-card">
                  <div className="card-header">
                    <h3>Today's Summary</h3>
                    <span className="date-badge">Monday, Feb 15</span>
                  </div>
                  <div className="summary-stats">
                    <div className="summary-item">
                      <div className="summary-icon blue">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                        </svg>
                      </div>
                      <div className="summary-details">
                        <h4>12 Appointments</h4>
                        <p>4 completed • 8 upcoming</p>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: "33%" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon green">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div className="summary-details">
                        <h4>8 Consultations</h4>
                        <p>+33% from yesterday</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon purple">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="summary-details">
                        <h4>15 Prescriptions</h4>
                        <p>Written today</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="appointments-card">
                  <div className="card-header">
                    <h3>Next Appointments</h3>
                    <button
                      className="link-btn"
                      onClick={() => handleMenuClick("appointments")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="appointments-list">
                    <div className="appointment-item urgent">
                      <div className="appointment-time">
                        <span className="time">09:00</span>
                        <span className="period">AM</span>
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">
                          <h4>John Anderson</h4>
                          <span className="urgent-badge">Urgent</span>
                        </div>
                        <p className="appointment-type">
                          🩺 Emergency Consultation
                        </p>
                        <p className="appointment-reason">Severe chest pain</p>
                      </div>
                      <button className="btn-start">Start</button>
                    </div>
                    <div className="appointment-item">
                      <div className="appointment-time">
                        <span className="time">10:30</span>
                        <span className="period">AM</span>
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">
                          <h4>Sarah Williams</h4>
                        </div>
                        <p className="appointment-type">🔄 Follow-up</p>
                        <p className="appointment-reason">
                          Post-surgery checkup
                        </p>
                      </div>
                      <button className="btn-view">View</button>
                    </div>
                    <div className="appointment-item">
                      <div className="appointment-time">
                        <span className="time">02:00</span>
                        <span className="period">PM</span>
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">
                          <h4>Michael Chen</h4>
                        </div>
                        <p className="appointment-type">📋 Routine Checkup</p>
                        <p className="appointment-reason">Annual physical</p>
                      </div>
                      <button className="btn-view">View</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-right">
                <div className="messages-card">
                  <div className="card-header">
                    <h3>Messages</h3>
                    <span className="badge-count">5</span>
                  </div>
                  <div className="messages-list">
                    <div className="message-item unread">
                      <div className="message-avatar">
                        <img
                          src="https://ui-avatars.com/api/?name=Emma+Johnson&background=3b82f6&color=fff"
                          alt="Patient"
                        />
                        <div className="online-dot" />
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>Emma Johnson</h4>
                          <span className="message-time">2m ago</span>
                        </div>
                        <p className="message-text">
                          Thank you for the prescription, Doctor!
                        </p>
                      </div>
                    </div>
                    <div className="message-item unread">
                      <div className="message-avatar">
                        <img
                          src="https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff"
                          alt="Patient"
                        />
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>David Brown</h4>
                          <span className="message-time">15m ago</span>
                        </div>
                        <p className="message-text">
                          Can I reschedule tomorrow's appointment?
                        </p>
                      </div>
                    </div>
                    <div className="message-item">
                      <div className="message-avatar">
                        <img
                          src="https://ui-avatars.com/api/?name=Lisa+Garcia&background=10b981&color=fff"
                          alt="Patient"
                        />
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>Lisa Garcia</h4>
                          <span className="message-time">1h ago</span>
                        </div>
                        <p className="message-text">
                          Feeling much better now, thanks!
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="view-all-messages"
                    onClick={() => handleMenuClick("messages")}
                  >
                    View All Messages →
                  </button>
                </div>

                <div className="notifications-card">
                  <div className="card-header">
                    <h3>Updates</h3>
                    <button className="icon-btn">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                      </svg>
                    </button>
                  </div>
                  <div className="notifications-list">
                    <div className="notification-item">
                      <div className="notif-icon blue">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div className="notif-content">
                        <p>
                          <strong>Lab results</strong> ready for John Anderson
                        </p>
                        <span className="notif-time">10 minutes ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notif-icon green">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                        </svg>
                      </div>
                      <div className="notif-content">
                        <p>New appointment booked for tomorrow</p>
                        <span className="notif-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notif-icon purple">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        </svg>
                      </div>
                      <div className="notif-content">
                        <p>Prescription signed successfully</p>
                        <span className="notif-time">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "feed":
        return <FeedPage />;

      case "saved":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Saved Posts</h1>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">🔖</div>
              <h3>Your Saved Posts</h3>
              <p>Bookmarked articles from the Medical Feed</p>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Appointments</h1>
              <button className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Appointment
              </button>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">📅</div>
              <h3>Appointments Management</h3>
              <p>View and manage all your patient appointments</p>
            </div>
          </div>
        );

      case "patients":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Patient Records</h1>
              <button className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Patient
              </button>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">👥</div>
              <h3>Patient Database</h3>
              <p>Access and manage all patient medical records</p>
            </div>
          </div>
        );

      case "prescriptions":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Prescriptions</h1>
              <button className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Write Prescription
              </button>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">📝</div>
              <h3>Prescription Management</h3>
              <p>Create, view, and manage patient prescriptions</p>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Messages</h1>
              <div className="badge-count">5 Unread</div>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">💬</div>
              <h3>Patient Messages</h3>
              <p>Communicate securely with your patients</p>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="page-content">
            <div className="page-header-section">
              <h1>Analytics & Reports</h1>
              <button className="btn-secondary">Export Report</button>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">📊</div>
              <h3>Performance Analytics</h3>
              <p>Track your practice metrics and patient outcomes</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">M</div>
            <span className="logo-text">Medily</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item" onClick={handleLogout}>
            <span className="sidebar-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span />
              <span />
              <span />
            </button>
            <div className="header-title">
              <h2>{pageTitles[activeMenu].title}</h2>
              <p className="header-subtitle">
                {pageTitles[activeMenu].subtitle}
              </p>
            </div>
          </div>

          <div className="header-center">
            <div className="search-bar">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search patients, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <button
              className="header-icon-btn"
              onClick={() => handleMenuClick("messages")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span className="notification-dot">5</span>
            </button>
            <button className="header-icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="notification-dot">3</span>
            </button>
            <div className="user-profile-menu" onClick={goToProfile}>
              <img
                src="https://ui-avatars.com/api/?name=Dr+Yen&background=4f46e5&color=fff&size=80"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
