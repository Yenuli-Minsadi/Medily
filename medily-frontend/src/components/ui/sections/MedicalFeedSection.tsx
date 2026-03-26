import React, { useState, useEffect, useRef } from "react";
import SectionBadge from "../atoms/SectionBadge";
import SectionHeading from "../atoms/SectionHeading";

const categories = ["All", "Cardiology", "Mental Health", "Case Studies", "Neurology", "Radiology"];

const feedPosts = [
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
        category: "Cardiology",
        categoryColor: "#ef4444",
        title: "PCSK9 Inhibitor Breakthrough",
        excerpt: "Patients receiving early PCSK9 inhibitor therapy showed a 43% reduction in major cardiovascular events over 24 months of follow-up.",
        tags: ["#Cardiology", "#PCSK9", "#ClinicalTrial"],
        author: { initials: "EW", name: "Dr. Emily Watson", time: "2h ago", verified: true },
        likes: 284, comments: 47, isLiked: false,
    },
    {
        type: "text",
        category: "Case Studies",
        categoryColor: "#f59e0b",
        title: "Anti-NMDA Receptor Encephalitis",
        excerpt: "34yo female presenting with acute confusion, fever, and new-onset seizures. LP showed lymphocytic pleocytosis. Anti-NMDA receptor antibodies confirmed on CSF analysis.",
        tags: ["#Neurology", "#AutoimmuneEncephalitis"],
        author: { initials: "MR", name: "Dr. Marcus Reid", time: "4h ago", verified: true },
        likes: 156, comments: 89, isLiked: true,
    },
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&q=80",
        category: "Radiology",
        categoryColor: "#10b981",
        title: "AI Lung Nodule Detection — 94.2% Sensitivity",
        excerpt: "Multi-center trial confirms AI-assisted CT nodule detection achieves 94.2% sensitivity. False positive rate dropped significantly vs prior generation models.",
        tags: ["#Radiology", "#AIinMedicine"],
        author: { initials: "SR", name: "Dr. Sofia Rivera", time: "6h ago", verified: true },
        likes: 318, comments: 72, isLiked: false,
    },
    {
        type: "text",
        category: "Mental Health",
        categoryColor: "#a78bfa",
        title: "Ketamine-Assisted Therapy RCT Results",
        excerpt: "New RCT data shows 68% response rate at 4 weeks for ketamine-assisted therapy vs 24% for standard SSRI augmentation in treatment-resistant depression.",
        tags: ["#Psychiatry", "#KetamineTherapy"],
        author: { initials: "JK", name: "Dr. James Kim", time: "8h ago", verified: true },
        likes: 203, comments: 55, isLiked: false,
    },
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
        category: "Neurology",
        categoryColor: "#3b82f6",
        title: "Lecanemab 18-Month Follow-Up Data",
        excerpt: "Updated data confirms 27% slowing of cognitive decline in early Alzheimer's patients treated with lecanemab. Amyloid clearance sustained at 18 months.",
        tags: ["#Neurology", "#Alzheimers", "#Lecanemab"],
        author: { initials: "PL", name: "Dr. Priya Lal", time: "10h ago", verified: true },
        likes: 521, comments: 98, isLiked: true,
    },
    {
        type: "text",
        category: "Cardiology",
        categoryColor: "#ef4444",
        title: "Updated WHO Antimicrobial Stewardship Guidance",
        excerpt: "New framework mandates culture-directed therapy over empirical broad-spectrum coverage. Hospitals required to implement stewardship programs by Q3 2025.",
        tags: ["#AntimicrobialStewardship", "#WHO"],
        author: { initials: "AM", name: "Dr. Aisha Mohammed", time: "12h ago", verified: true },
        likes: 412, comments: 63, isLiked: false,
    },
];

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CommentIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const VerifiedIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#3b82f6">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MedicalFeedSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>(
        Object.fromEntries(feedPosts.map((p, i) => [i, p.isLiked]))
    );
    const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
        Object.fromEntries(feedPosts.map((p, i) => [i, p.likes]))
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const filtered = activeCategory === "All"
        ? feedPosts
        : feedPosts.filter(p => p.category === activeCategory);

    const toggleLike = (i: number) => {
        setLikedPosts(prev => ({ ...prev, [i]: !prev[i] }));
        setLikeCounts(prev => ({ ...prev, [i]: prev[i] + (likedPosts[i] ? -1 : 1) }));
    };

    // Auto-scroll the feed strip
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let frame: number;
        const scroll = () => {
            if (!isPaused) {
                el.scrollLeft += 0.5;
                if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
            }
            frame = requestAnimationFrame(scroll);
        };
        frame = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(frame);
    }, [isPaused]);

    return (
        <section className="medical-feed-section" id="feed">
            <div className="section-container">
                <SectionBadge text="MEDICAL FEED" />
                <SectionHeading
                    title="Professional medical field that you can trust"
                    subtitle="Doctor-verified health tips, recovery stories, and announcements — no ads, no noise."
                />

                {/* Category filter pills */}
                <div className="feed-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`feed-filter-pill ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Auto-scrolling card strip */}
                <div
                    className="feed-scroll-strip"
                    ref={scrollRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Duplicate for infinite scroll illusion */}
                    {[...filtered, ...filtered].map((post, i) => (
                        <div className="mf-card" key={i}>
                            {post.type === "image" && post.image && (
                                <div className="mf-card-image">
                                    <img src={post.image} alt={post.title} />
                                    <div className="mf-card-image-overlay">
                    <span className="mf-category-pill" style={{ background: post.categoryColor }}>
                      {post.category}
                    </span>
                                    </div>
                                </div>
                            )}

                            {post.type === "text" && (
                                <div className="mf-card-top">
                  <span className="mf-category-pill" style={{ background: `${post.categoryColor}20`, color: post.categoryColor, border: `1px solid ${post.categoryColor}40` }}>
                    {post.category}
                  </span>
                                </div>
                            )}

                            <div className="mf-card-body">
                                <h4 className="mf-card-title">{post.title}</h4>
                                <p className="mf-card-excerpt">{post.excerpt}</p>
                                <span className="mf-read-more">Read more →</span>
                            </div>

                            <div className="mf-card-tags">
                                {post.tags.map(tag => (
                                    <span className="mf-tag" key={tag}>{tag}</span>
                                ))}
                            </div>

                            <div className="mf-card-footer">
                                <div className="mf-author">
                                    <div className="mf-avatar">{post.author.initials}</div>
                                    <div className="mf-author-info">
                    <span className="mf-author-name">
                      {post.author.name}
                        {post.author.verified && <VerifiedIcon />}
                    </span>
                                        <span className="mf-author-time">{post.author.time}</span>
                                    </div>
                                </div>
                                <div className="mf-actions">
                                    <button
                                        className={`mf-action-btn ${likedPosts[i % feedPosts.length] ? "liked" : ""}`}
                                        onClick={() => toggleLike(i % feedPosts.length)}
                                    >
                                        <HeartIcon filled={likedPosts[i % feedPosts.length]} />
                                        {likeCounts[i % feedPosts.length]}
                                    </button>
                                    <span className="mf-action-btn">
                    <CommentIcon />
                                        {post.comments}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View all CTA */}
                <div className="feed-cta-row">
                    <p className="feed-cta-text">Join thousands of healthcare professionals sharing verified insights</p>
                    <button className="feed-cta-btn">
                        Explore the Feed
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MedicalFeedSection;