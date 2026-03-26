import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionBadge from "../atoms/SectionBadge";
import SectionHeading from "../atoms/SectionHeading";

const tools = [
    {
        title: "Digital Prescriptions",
        description: "Issue, sign, and send prescriptions electronically. Patients receive them instantly on their Medily app.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        stat: "2.4k",
        statLabel: "prescriptions today",
        accent: "#3b82f6",
        bg: "#eff6ff",
        preview: (
            <div className="tool-preview rx-preview">
                <div className="rx-header">
                    <span className="rx-badge">Rx</span>
                    <span className="rx-date">Today, 10:32 AM</span>
                </div>
                <div className="rx-drug">Amoxicillin 500mg</div>
                <div className="rx-instructions">1 capsule · 3× daily · 7 days</div>
                <div className="rx-footer">
                    <span className="rx-sent">✓ Sent to patient</span>
                </div>
            </div>
        ),
    },
    {
        title: "Consent-Based Access",
        description: "Patients share records via PIN. You get exactly what you need — nothing more, fully audited.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
        ),
        stat: "100%",
        statLabel: "patient-controlled",
        accent: "#10b981",
        bg: "#ecfdf5",
        preview: (
            <div className="tool-preview pin-preview">
                <div className="pin-label">Patient shared access</div>
                <div className="pin-dots">
                    {[1,2,3,4].map(i => <div key={i} className="pin-dot filled" />)}
                </div>
                <div className="pin-record">
                    <span className="pin-icon">📋</span>
                    <span>Blood Panel — Mar 2025</span>
                </div>
                <div className="pin-expires">Access expires in 24h</div>
            </div>
        ),
    },
    {
        title: "Appointment Management",
        description: "Smart scheduling with no-show alerts, automated reminders, and calendar sync across your team.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="8" cy="15" r="1" fill="currentColor" />
                <circle cx="12" cy="15" r="1" fill="currentColor" />
                <circle cx="16" cy="15" r="1" fill="currentColor" />
            </svg>
        ),
        stat: "38%",
        statLabel: "fewer no-shows",
        accent: "#f59e0b",
        bg: "#fffbeb",
        preview: (
            <div className="tool-preview cal-preview">
                {[
                    { time: "9:00", name: "Sarah M.", type: "Follow-up", status: "confirmed" },
                    { time: "10:30", name: "James K.", type: "Consultation", status: "confirmed" },
                    { time: "11:00", name: "Priya L.", type: "Check-up", status: "pending" },
                ].map((apt) => (
                    <div className="cal-row" key={apt.time}>
                        <span className="cal-time">{apt.time}</span>
                        <div className="cal-info">
                            <span className="cal-name">{apt.name}</span>
                            <span className="cal-type">{apt.type}</span>
                        </div>
                        <span className={`cal-status ${apt.status}`}>{apt.status}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Quality Insights",
        description: "Track outcomes, monitor patient adherence, and benchmark your practice with anonymised peer data.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <line x1="2" y1="20" x2="22" y2="20" />
            </svg>
        ),
        stat: "92%",
        statLabel: "adherence rate",
        accent: "#8b5cf6",
        bg: "#f5f3ff",
        preview: (
            <div className="tool-preview chart-preview">
                <div className="chart-label">Patient outcomes — last 30 days</div>
                <div className="chart-bars">
                    {[65, 72, 68, 80, 75, 88, 92].map((h, i) => (
                        <div key={i} className="chart-bar-wrap">
                            <div className="chart-bar" style={{ height: `${h}%`, background: "#8b5cf6" }} />
                        </div>
                    ))}
                </div>
                <div className="chart-trend">↑ 12% vs last month</div>
            </div>
        ),
    },
];

const LiveStat = ({ value, label }: { value: string; label: string }) => {
    const [displayed, setDisplayed] = useState("0");

    useEffect(() => {
        const num = parseInt(value.replace(/\D/g, ""));
        if (isNaN(num)) { setDisplayed(value); return; }
        let start = 0;
        const duration = 1200;
        const step = duration / num;
        const timer = setInterval(() => {
            start += Math.ceil(num / 40);
            if (start >= num) { setDisplayed(value); clearInterval(timer); }
            else setDisplayed(value.includes("%") ? `${start}%` : value.includes("k") ? `${(start / 1000).toFixed(1)}k` : `${start}`);
        }, step);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="tool-stat">
            <span className="tool-stat-value">{displayed}</span>
            <span className="tool-stat-label">{label}</span>
        </div>
    );
};

const ForDoctorsSection: React.FC = () => {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState(0);

    return (
        <section className="healthcare-professionals-section" id="doctors">
            <div className="section-container">
                <SectionBadge text="FOR HEALTHCARE PROFESSIONALS" />
                <SectionHeading
                    title="Tools built for how you work"
                    subtitle={
                        <>
                            Streamline your practice with digital prescriptions, consent-based record access,
                            <br />
                            and smart scheduling — all in one distraction-free interface.
                        </>
                    }
                />

                <div className="professionals-content">
                    {/* Left: tool selector cards */}
                    <div className="professionals-left">
                        {tools.map((tool, i) => (
                            <div
                                key={tool.title}
                                className={`pro-tool-card ${activeCard === i ? "active" : ""}`}
                                style={{ "--accent": tool.accent, "--bg": tool.bg } as React.CSSProperties}
                                onClick={() => setActiveCard(i)}
                            >
                                <div className="pro-tool-icon" style={{ background: tool.bg, color: tool.accent }}>
                                    {tool.icon}
                                </div>
                                <div className="pro-tool-text">
                                    <span className="pro-tool-title">{tool.title}</span>
                                    <span className="pro-tool-desc">{tool.description}</span>
                                </div>
                                {activeCard === i && (
                                    <svg className="pro-tool-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                )}
                            </div>
                        ))}

                        <button className="btn-professional" onClick={() => navigate("/signup")}>
                            Join as a Healthcare Professional
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Right: live preview panel */}
                    <div className="professionals-right">
                        <div className="pro-preview-panel" style={{ "--accent": tools[activeCard].accent, "--bg": tools[activeCard].bg } as React.CSSProperties}>
                            <div className="pro-preview-header">
                                <div className="pro-preview-icon" style={{ background: tools[activeCard].bg, color: tools[activeCard].accent }}>
                                    {tools[activeCard].icon}
                                </div>
                                <div>
                                    <div className="pro-preview-title">{tools[activeCard].title}</div>
                                    <div className="pro-preview-subtitle">{tools[activeCard].description}</div>
                                </div>
                            </div>

                            <div className="pro-preview-content">
                                {tools[activeCard].preview}
                            </div>

                            <div className="pro-preview-stat">
                                <LiveStat value={tools[activeCard].stat} label={tools[activeCard].statLabel} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForDoctorsSection;