import type { FeedPost } from "../../types/Feed";
// DoctorDashboard
export const INITIAL_POSTS: FeedPost[] = [
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
      "Exciting breakthrough: patients receiving early PCSK9 inhibitor therapy showed a 43% reduction in major cardiovascular events over 24 months. LDL-C reduced from 142 mg/dL to 58 mg/dL within 12 weeks.",
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
      "34yo female presenting with acute confusion, fever, and new-onset seizures. LP showed lymphocytic pleocytosis. Anti-NMDA receptor antibodies strongly positive.\n\nAutoimmune encephalitis is still underdiagnosed.",
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
      "Updated WHO antimicrobial stewardship guidance is out. New framework mandates culture-directed therapy over empirical broad-spectrum coverage and de-escalation reviews at 72h.",
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
      "AI-assisted mammography hit a milestone — 31% improvement in early-stage detection with 18% fewer false positives. Hybrid human-AI workflow, not full automation.",
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
      "New RCT data on ketamine-assisted therapy for treatment-resistant depression: 68% response rate at 4 weeks vs 24% for standard SSRI augmentation.",
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
];

// ─── Feed Data ────────────────────────────────────────────────────────────────
export const FEED_CATEGORIES = [
  "All",
  "Research",
  "Case Studies",
  "Guidelines",
  "Pharmacology",
  "Surgery",
  "Mental Health",
];
export const TRENDING_TOPICS = [
  { tag: "CardiacArrest", count: "2.4k" },
  { tag: "AI_Diagnostics", count: "1.8k" },
  { tag: "NeurologyUpdate", count: "1.2k" },
  { tag: "COVID_Research", count: "987" },
  { tag: "PediatricCare", count: "743" },
];

export const SUGGESTED_DOCTORS = [
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

// Patient Dashboard
// export const FEED_POSTS: FeedPost[] = [
//   {
//     id: 1,
//     author: "Dr. Emily Watson",
//     specialty: "Cardiology • UCSF",
//     avatar:
//       "https://ui-avatars.com/api/?name=Emily+Watson&background=ef4444&color=fff",
//     time: "2h ago",
//     category: "Heart Health",
//     content:
//       "New study shows that just 30 minutes of brisk walking daily can reduce cardiovascular risk by up to 35%. Small changes in lifestyle create the biggest long-term differences for heart health.",
//     image:
//       "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&q=80",
//     tags: ["HeartHealth", "Prevention", "Exercise"],
//     likes: 284,
//     comments: 47,
//     liked: false,
//     bookmarked: false,
//   },
//   {
//     id: 2,
//     author: "Dr. Aisha Mohammed",
//     specialty: "Nutrition • WHO",
//     avatar:
//       "https://ui-avatars.com/api/?name=Aisha+Mohammed&background=10b981&color=fff",
//     time: "5h ago",
//     category: "Nutrition",
//     content:
//       "The Mediterranean diet continues to show exceptional results for patients with hypertension. Focus on olive oil, whole grains, legumes, and plenty of vegetables. Patients who followed this for 6 months saw an average 12 mmHg reduction in systolic BP.",
//     tags: ["Nutrition", "Hypertension", "Diet"],
//     likes: 412,
//     comments: 63,
//     liked: true,
//     bookmarked: true,
//   },
//   {
//     id: 3,
//     author: "Dr. Kevin Park",
//     specialty: "Neurology • Mayo",
//     avatar:
//       "https://ui-avatars.com/api/?name=Kevin+Park&background=6366f1&color=fff",
//     time: "1d ago",
//     category: "Mental Health",
//     content:
//       "Sleep quality directly impacts migraine frequency. Patients maintaining 7–9 hours of consistent sleep schedules reported 40% fewer migraine episodes in our 6-month observational study.",
//     image:
//       "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80",
//     tags: ["Sleep", "Migraine", "Neurology"],
//     likes: 321,
//     comments: 55,
//     liked: false,
//     bookmarked: false,
//   },
// ];
