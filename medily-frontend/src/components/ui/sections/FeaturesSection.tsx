import React from "react";
import SectionBadge from "../atoms/SectionBadge";
import SectionHeading from "../atoms/SectionHeading";

const feedCards = [
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
        excerpt: "Exciting breakthrough: patients receiving early PCSK9 inhibitor therapy showed a 43% reduction in major cardiovascular events over 24 months...",
        tags: ["#Cardiology", "#PCSK9", "#ClinicalTrial"],
        author: { initials: "EW", name: "Dr. Emily Watson", time: "2h ago", verified: true },
        likes: 284,
        comments: 47,
    },
    {
        type: "text",
        category: "Case Studies",
        categoryColor: "#f59e0b",
        excerpt: "34yo female presenting with acute confusion, fever, and new-onset seizures. LP showed lymphocytic pleocytosis. Anti-NMDA receptor antibodies...",
        tags: ["#Neurology", "#AutoimmuneEncephalitis"],
        author: { initials: "MR", name: "Dr. Marcus Reid", time: "4h ago", verified: true },
        likes: 156,
        comments: 89,
    },
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
        excerpt: "Updated WHO antimicrobial stewardship guidance is out. New framework mandates culture-directed therapy over empirical broad-spectrum coverag...",
        tags: ["#AntimicrobialStewardship", "#WHO"],
        author: { initials: "AM", name: "Dr. Aisha Mohammed", time: "6h ago", verified: true },
        likes: 412,
        comments: 63,
    },
    {
        type: "text",
        category: "Mental Health",
        categoryColor: "#a78bfa",
        excerpt: "New RCT data on ketamine-assisted therapy for treatment-resistant depression: 68% response rate at 4 weeks vs 24% for standard SSRI augmenta...",
        tags: ["#Psychiatry", "#KetamineTherapy"],
        author: { initials: "JK", name: "Dr. James Kim", time: "8h ago", verified: true },
        likes: 203,
        comments: 55,
    },
    {
        type: "text",
        category: "Radiology",
        categoryColor: "#34d399",
        excerpt: "AI-assisted CT lung nodule detection now shows 94.2% sensitivity in multi-center trial. False positive rate dropped significantly vs prior gen models...",
        tags: ["#Radiology", "#AIinMedicine"],
        author: { initials: "SR", name: "Dr. Sofia Rivera", time: "10h ago", verified: true },
        likes: 318,
        comments: 72,
    },
    {
        type: "image",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
        excerpt: "Surgical robotics team achieved sub-2mm precision in laparoscopic bowel resection using new haptic feedback system. Recovery times cut by 40%...",
        tags: ["#Surgery", "#Robotics", "#Innovation"],
        author: { initials: "BT", name: "Dr. Ben Torres", time: "12h ago", verified: true },
        likes: 521,
        comments: 98,
    },
];

const HeartIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CommentIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const VerifiedIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FeaturesSection: React.FC = () => {
    return (
        <section className="features-section" id="features">
            <div className="section-container">
                <SectionBadge text="FEATURES" />
                <SectionHeading
                    title={<>Everything you need for modern<br />healthcare</>}
                    subtitle={<>A comprehensive platform designed to simplify every aspect of<br />your medical journey.</>}
                />

                <div className="features-feed-grid">
                    {feedCards.map((card, i) => (
                        <div className="feed-preview-card" key={i}>
                            {card.type === "image" && card.image && (
                                <div className="feed-card-image">
                                    <img src={card.image} alt="" />
                                </div>
                            )}

                            {card.type === "text" && card.category && (
                                <div className="feed-card-category" style={{ backgroundColor: `${card.categoryColor}18`, color: card.categoryColor }}>
                                    {card.category}
                                </div>
                            )}

                            <p className="feed-card-excerpt">{card.excerpt}</p>

                            <span className="feed-card-readmore">Read more</span>

                            <div className="feed-card-tags">
                                {card.tags.map((tag) => (
                                    <span className="feed-tag" key={tag}>{tag}</span>
                                ))}
                            </div>

                            <div className="feed-card-footer">
                                <div className="feed-card-author">
                                    <div className="author-avatar">{card.author.initials}</div>
                                    <div className="author-info">
                    <span className="author-name">
                      {card.author.name}
                        {card.author.verified && <VerifiedIcon />}
                    </span>
                                        <span className="author-time">{card.author.time}</span>
                                    </div>
                                </div>
                                <div className="feed-card-stats">
                                    <span><HeartIcon /> {card.likes}</span>
                                    <span><CommentIcon /> {card.comments}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;