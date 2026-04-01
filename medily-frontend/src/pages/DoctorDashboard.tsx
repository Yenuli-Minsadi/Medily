// pages/DoctorDashboard.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  INITIAL_POSTS,
  FEED_CATEGORIES,
  TRENDING_TOPICS,
  SUGGESTED_DOCTORS,
} from "../constants/data/mockFeed";
import {
  DOCTOR_NAV_ITEMS as NAV_ITEMS,
  DOCTOR_PAGE_TITLES as pageTitles,
} from "../constants/menu/sidebarMenu";
import { useMasonryColumns } from "../hooks/useMasonryColumns";
import type {
  DoctorMenuItem as MenuItem,
  ConsultStep,
  ConsultSession,
  UserData,
  FeedPost,
} from "../types";

// ── Consultation Modal ──────────────────────────────────────────────────────
interface ConsultModalProps {
  onClose: () => void;
  onGoToPrescriptions: (patientId: string, patientName: string) => void;
}

const ConsultationModal: React.FC<ConsultModalProps> = ({ onClose, onGoToPrescriptions }) => {
  const [step, setStep] = useState<ConsultStep>("enter_id");
  const [patientIdInput, setPatientIdInput] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState<ConsultSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [completedSessions, setCompletedSessions] = useState<ConsultSession[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === "active") {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= 7200) {
            clearInterval(timerRef.current!);
            setStep("end_prompt");
            return e;
          }
          return e + 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
        ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
        : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  // BACKEND LOGIC: Search patient in DB instead of mock PATIENT_DB
  const handleStartLookup = async () => {
    const query = patientIdInput.trim();
    if (!query) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/patients/search?name=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.data && res.data.data.length > 0) {
        const patient = res.data.data[0];
        setError("");
        setSession({
          patientId: patient.id.toString(),
          patientName: patient.name,
          startTime: Date.now(),
          elapsed: 0,
          prescriptionIssued: null
        });
        setStep("active");
      } else {
        setError("Patient not found in database.");
      }
    } catch (err) {
      setError("Connection error. Ensure backend is running.");
    }
  };

  const handleEndConsult = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep("end_prompt");
  };

  const handlePrescriptionDecision = (issued: boolean) => {
    if (!session) return;
    const finished = { ...session, elapsed, prescriptionIssued: issued };
    setCompletedSessions(s => [...s, finished]);
    if (issued) {
      setStep("prescribe");
    } else {
      setStep("done");
    }
  };

  const handleNewConsult = () => {
    setStep("enter_id");
    setPatientIdInput("");
    setElapsed(0);
    setNotes("");
    setSession(null);
    setError("");
  };

  const timerColor = elapsed < 1800 ? "text-emerald-400" : elapsed < 3600 ? "text-amber-400" : "text-red-400";

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Consultation</div>
                <div className="text-white/60 text-xs">Physical Visit</div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="p-6">
            {step === "enter_id" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Start Consultation</h3>
                    <p className="text-gray-500 text-sm mt-1">Search patient by name or ID.</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Patient Name / ID</label>
                    <input
                        value={patientIdInput}
                        onChange={e => { setPatientIdInput(e.target.value); setError(""); }}
                        onKeyDown={e => e.key === "Enter" && handleStartLookup()}
                        placeholder="e.g. Yenuli"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-sans"
                    />
                    {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
                  </div>
                  <button onClick={handleStartLookup} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
                    Start Session
                  </button>
                </div>
            )}

            {step === "active" && session && (
                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.patientName)}&background=4f46e5&color=fff`} alt="" className="w-12 h-12 rounded-xl" />
                    <div>
                      <div className="font-black text-gray-900">{session.patientName}</div>
                      <div className="text-gray-500 text-xs font-mono">ID: {session.patientId}</div>
                    </div>
                  </div>
                  <div className="text-center py-6">
                    <div className={`font-black text-6xl tabular-nums tracking-tight ${timerColor} transition-colors`}>{fmt(elapsed)}</div>
                  </div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Diagnosis Notes..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none" />
                  <button onClick={handleEndConsult} className="w-full bg-gray-900 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                    End Consultation
                  </button>
                </div>
            )}

            {step === "end_prompt" && session && (
                <div className="space-y-5">
                  <div className="text-center pt-2">
                    <h3 className="text-lg font-black text-gray-900">Consultation Complete</h3>
                    <p className="text-gray-500 text-sm mt-1">{session.patientName} · {fmt(elapsed)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handlePrescriptionDecision(true)} className="bg-indigo-600 text-white rounded-xl py-4 font-bold text-sm flex flex-col items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                      Yes — Write Rx
                    </button>
                    <button onClick={() => handlePrescriptionDecision(false)} className="bg-gray-100 text-gray-700 rounded-xl py-4 font-bold text-sm flex flex-col items-center gap-2 hover:bg-gray-200 transition-all">
                      No Prescription
                    </button>
                  </div>
                </div>
            )}

            {step === "prescribe" && session && (
                <div className="space-y-5 text-center">
                  <h3 className="text-lg font-black text-gray-900">Ready to Write Prescription</h3>
                  <div className="flex gap-3">
                    <button onClick={handleNewConsult} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors">New Consult</button>
                    <button onClick={() => { onGoToPrescriptions(session.patientId, session.patientName); onClose(); }} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-200">Open Rx Form →</button>
                  </div>
                </div>
            )}

            {step === "done" && (
                <div className="space-y-5 text-center">
                  <h3 className="text-lg font-black text-gray-900">Session Logged</h3>
                  <button onClick={handleNewConsult} className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold text-sm transition-all">New Consultation</button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

// ── Prescription Form ───────────────────────────────────────────────────────
const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ prefillPatientId, prefillPatientName }) => {
  const [patientName, setPatientName] = useState(prefillPatientName || "");
  const [patientId, setPatientId] = useState(prefillPatientId || "");
  const [appointmentId, setAppointmentId] = useState(""); // Needed for Backend
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState([{ medicineName: "", dosage: "", duration: "", instructions: "" }]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addMed = () => setMeds(m => [...m, { medicineName: "", dosage: "", duration: "", instructions: "" }]);
  const removeMed = (i: number) => setMeds(m => m.filter((_,idx) => idx !== i));
  const updateMed = (i: number, field: string, val: string) => setMeds(m => m.map((med, idx) => idx === i ? { ...med, [field]: val } : med));

  // BACKEND LOGIC: POST to API
  const handleSubmit = async () => {
    if (!appointmentId || !patientId) {
      alert("Please ensure Patient ID and Appointment ID are provided.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId: parseInt(patientId),
        appointmentId: parseInt(appointmentId),
        notes: notes,
        items: meds
      };

      await axios.post("http://localhost:8080/api/prescriptions", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (error) {
      alert("Failed to issue prescription. Verify numeric IDs in database.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-3xl">✅</div>
          <h3 className="text-xl font-black text-gray-900">Prescription Issued</h3>
          <p className="text-gray-500 text-sm">Sent to {patientName}'s medical profile.</p>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-4">Return to Overview</button>
        </div>
    );
  }

  return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Write Prescription</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create a new prescription for your patient</p>
        </div>

        {/* Patient Information - Original UI */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Patient Name</label>
              <input value={patientName} readOnly className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Patient ID (DB)</label>
              <input value={patientId} readOnly className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Appointment ID (Required)</label>
              <input value={appointmentId} onChange={e => setAppointmentId(e.target.value)} placeholder="e.g. 5" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Diagnosis</label>
              <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Primary diagnosis" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
            </div>
          </div>
        </div>

        {/* Medications - Original UI */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medications</h3>
            <button onClick={addMed} className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors underline">
              + Add Medication
            </button>
          </div>
          {meds.map((med, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Medication #{i + 1}</span>
                  {meds.length > 1 && <button onClick={() => removeMed(i)} className="text-red-400 hover:text-red-600 transition-colors">✕</button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Drug Name</label>
                    <input value={med.medicineName} onChange={e => updateMed(i,"medicineName",e.target.value)} placeholder="e.g. Amoxicillin" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Dosage</label>
                    <input value={med.dosage} onChange={e => updateMed(i,"dosage",e.target.value)} placeholder="e.g. 500mg" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Frequency</label>
                    <input value={med.instructions} onChange={e => updateMed(i,"instructions",e.target.value)} placeholder="e.g. Twice daily" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Duration</label>
                    <input value={med.duration} onChange={e => updateMed(i,"duration",e.target.value)} placeholder="e.g. 7 days" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white" />
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Notes - Original UI */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Doctor's Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Follow-up advice…" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
        </div>

        <div className="flex gap-3">
          <button className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 font-bold text-sm hover:border-gray-300 transition-colors">Save Draft</button>
          <button onClick={handleSubmit} disabled={loading || !appointmentId} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? "Processing..." : "Issue Prescription"}
          </button>
        </div>
      </div>
  );
};

const FeedSidebar: React.FC = () => {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const toggle = (name: string) => setFollowed(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  return (
      <div className="w-60 flex-shrink-0 sticky top-20 flex flex-col gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg><span className="font-bold text-sm text-gray-900">Trending</span></div>
          {TRENDING_TOPICS.map((t,i) => (
              <div key={t.tag} className={`flex justify-between items-center py-2 ${i < TRENDING_TOPICS.length-1 ? "border-b border-gray-50" : ""} cursor-pointer`}>
                <div><div className="text-xs font-bold text-indigo-600">#{t.tag}</div><div className="text-xs text-gray-400">{t.count} posts</div></div>
                <span className="text-xs font-bold text-gray-200">#{i+1}</span>
              </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="font-bold text-sm text-gray-900 mb-3">Who to Follow</div>
          {SUGGESTED_DOCTORS.map(doc => (
              <div key={doc.name} className="flex items-center gap-2.5 mb-3">
                <img src={doc.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0"><div className="text-xs font-bold text-gray-900 truncate">{doc.name}</div><div className="text-xs text-gray-500">{doc.specialty}</div></div>
                <button onClick={() => toggle(doc.name)} className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${followed.has(doc.name) ? "bg-emerald-500 border-emerald-500 text-white" : "border-indigo-400 text-indigo-600 hover:bg-indigo-50"}`}>{followed.has(doc.name) ? "✓" : "Follow"}</button>
              </div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white">
          <div className="font-bold text-sm mb-3">Your Activity</div>
          {[["Posts this month","12"],["Profile views","847"],["Connections","234"]].map(([l,v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-xs text-white/70">{l}</span>
                <span className="text-sm font-bold">{v}</span>
              </div>
          ))}
        </div>
      </div>
  );
};

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const handleLike = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes-1 : p.likes+1 } : p));
  const handleBookmark = (id: number) => setPosts(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    return matchCat && (!q || p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
  });

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-5">
          <div><h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"Georgia,serif"}}>Medical Feed</h1><p className="text-sm text-gray-500 mt-1">Discover insights from the global medical community</p></div>
          <button onClick={() => setComposing(!composing)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Post
          </button>
        </div>
        {composing && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-md">
              <div className="flex gap-3">
                <img src="https://ui-avatars.com/api/?name=Dr+Sarah+Mitchell&background=4f46e5&color=fff" alt="" className="w-10 h-10 rounded-full border-2 border-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <textarea value={newPostText} onChange={e => setNewPostText(e.target.value)} placeholder="Share a clinical insight, case study, or research finding…" className="w-full min-h-24 border border-gray-200 rounded-xl p-3 text-sm resize-none outline-none focus:border-indigo-400 bg-gray-50" style={{fontFamily:"Georgia,serif"}} />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => { setComposing(false); setNewPostText(""); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button disabled={!newPostText.trim()} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all">Publish</button>
                  </div>
                </div>
              </div>
            </div>
        )}
        <div className="flex gap-3 items-center flex-wrap mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search feed…" className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400 w-48" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FEED_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200" : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-200"}`}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"><div className="text-5xl mb-4">🔍</div><h3 className="font-bold text-gray-900">No posts found</h3><p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p></div>
            ) : (
                <MasonryGrid gap={14}>{filtered.map(post => <PinCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} />)}</MasonryGrid>
            )}
          </div>
          <FeedSidebar />
        </div>
      </div>
  );
};

// ── Main Dashboard ──────────────────────────────────────────────────────────
const DoctorDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConsult, setShowConsult] = useState(false);
  const [rxPrefill, setRxPrefill] = useState<{ patientId: string; patientName: string } | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ── FIXED: Read from correct localStorage keys ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role === "DOCTOR") {
      setUser({
        name: name ?? "Doctor",
        role: role,
        email: "",
        isAuthenticated: true,
      });
    } else {
      navigate("/login");
    }
  }, []);

  const handleMenuClick = (id: MenuItem) => setActiveMenu(id);

  const handleGoToPrescriptions = (patientId: string, patientName: string) => {
    setRxPrefill({ patientId, patientName });
    setActiveMenu("prescriptions");
  };

  const doctorPageTitles: Record<MenuItem, { title: string; subtitle: string }> = {
    overview: { title: user?.name ?? "Doctor", subtitle: "Cardiologist" },
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
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Doctor")}&background=ffffff&color=4f46e5&size=80`} alt="" className="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">Doctor</div>
                    <h2 className="text-2xl font-black mt-0.5">{user?.name ?? "Doctor"}</h2>
                    <div className="text-white/70 text-sm mt-1">Medical ID: <span className="font-mono text-white">DOC-2024-8472</span></div>
                  </div>
                  <div className="flex gap-6 sm:gap-8">
                    {[["12","Today"],["284","Total Patients"],["4.9","Rating ⭐"]].map(([v,l]) => (
                        <div key={l} className="text-center"><div className="text-3xl font-black">{v}</div><div className="text-white/70 text-xs mt-0.5">{l}</div></div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => setShowConsult(true)} className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl p-4 text-left hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-indigo-200">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <span className="font-bold text-sm">Start Consultation</span>
                  </button>
                  {[
                    { label:"Write Prescription", icon:"📝", nav:"prescriptions" as MenuItem, color:"from-blue-50 to-indigo-50 border-indigo-100", text:"text-indigo-600" },
                    { label:"Patient Records", icon:"👥", nav:"patients" as MenuItem, color:"from-violet-50 to-purple-50 border-violet-100", text:"text-violet-600" },
                    { label:"Medical Feed", icon:"📰", nav:"feed" as MenuItem, color:"from-emerald-50 to-teal-50 border-emerald-100", text:"text-emerald-600" },
                  ].map(a => (
                      <button key={a.nav} onClick={() => handleMenuClick(a.nav)} className={`bg-gradient-to-br ${a.color} border rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95`}>
                        <div className="text-2xl mb-3">{a.icon}</div>
                        <span className={`font-bold text-sm ${a.text}`}>{a.label}</span>
                      </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-sm">Today's Summary</h3>
                      <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">Mon, Feb 15</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label:"12 Appointments", sub:"4 completed • 8 upcoming", progress:33, color:"bg-blue-500", iconBg:"bg-blue-100", icon:"📅" },
                        { label:"8 Consultations", sub:"+33% from yesterday", progress:null, color:"bg-emerald-500", iconBg:"bg-emerald-100", icon:"✅" },
                        { label:"15 Prescriptions", sub:"Written today", progress:null, color:"bg-violet-500", iconBg:"bg-violet-100", icon:"📋" },
                      ].map(s => (
                          <div key={s.label} className="flex items-start gap-3">
                            <div className={`${s.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>{s.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-sm">{s.label}</div>
                              <div className="text-gray-500 text-xs">{s.sub}</div>
                              {s.progress && <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2"><div className={`${s.color} h-1.5 rounded-full`} style={{ width:`${s.progress}%` }} /></div>}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                      <h3 className="font-bold text-gray-900 text-sm">Next Appointments</h3>
                      <button onClick={() => handleMenuClick("appointments")} className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">View All →</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { time:"09:00 AM", name:"John Anderson", type:"🩺 Emergency", reason:"Severe chest pain", urgent:true },
                        { time:"10:30 AM", name:"Sarah Williams", type:"🔄 Follow-up", reason:"Post-surgery checkup", urgent:false },
                        { time:"02:00 PM", name:"Michael Chen", type:"📋 Routine", reason:"Annual physical", urgent:false },
                      ].map(apt => (
                          <div key={apt.name} className={`flex items-center gap-4 px-5 py-3.5 ${apt.urgent ? "bg-red-50/50" : ""}`}>
                            <div className="text-center flex-shrink-0">
                              <div className="font-black text-gray-900 text-sm">{apt.time.split(" ")[0]}</div>
                              <div className="text-gray-400 text-xs">{apt.time.split(" ")[1]}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">{apt.name}</span>
                                {apt.urgent && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Urgent</span>}
                              </div>
                              <div className="text-gray-500 text-xs">{apt.type} · {apt.reason}</div>
                            </div>
                            <button onClick={() => setShowConsult(true)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${apt.urgent ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{apt.urgent ? "Start" : "View"}</button>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                      <h3 className="font-bold text-gray-900 text-sm">Messages</h3>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">5</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { name:"Emma Johnson", msg:"Thank you for the prescription, Doctor!", time:"2m ago", avatar:"https://ui-avatars.com/api/?name=Emma+Johnson&background=3b82f6&color=fff", online:true, unread:true },
                        { name:"David Brown", msg:"Can I reschedule tomorrow's appointment?", time:"15m ago", avatar:"https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff", online:false, unread:true },
                        { name:"Lisa Garcia", msg:"Feeling much better now, thanks!", time:"1h ago", avatar:"https://ui-avatars.com/api/?name=Lisa+Garcia&background=10b981&color=fff", online:false, unread:false },
                      ].map(m => (
                          <div key={m.name} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${m.unread ? "bg-indigo-50/30" : ""}`}>
                            <div className="relative flex-shrink-0">
                              <img src={m.avatar} alt="" className="w-9 h-9 rounded-xl" />
                              {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold ${m.unread ? "text-gray-900" : "text-gray-600"}`}>{m.name}</span>
                                <span className="text-xs text-gray-400">{m.time}</span>
                              </div>
                              <div className="text-xs text-gray-500 truncate">{m.msg}</div>
                            </div>
                          </div>
                      ))}
                    </div>
                    <button onClick={() => handleMenuClick("messages")} className="w-full text-center py-3 text-indigo-600 text-xs font-bold hover:bg-indigo-50 transition-colors border-t border-gray-50">View All Messages →</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-4">Updates</h3>
                    <div className="space-y-3">
                      {[
                        { icon:"✅", color:"bg-blue-100", text:"Lab results ready for John Anderson", time:"10 minutes ago" },
                        { icon:"📅", color:"bg-emerald-100", text:"New appointment booked for tomorrow", time:"1 hour ago" },
                        { icon:"📋", color:"bg-violet-100", text:"Prescription signed successfully", time:"2 hours ago" },
                      ].map(n => (
                          <div key={n.text} className="flex items-start gap-3">
                            <div className={`${n.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm`}>{n.icon}</div>
                            <div><p className="text-sm text-gray-700">{n.text}</p><span className="text-xs text-gray-400">{n.time}</span></div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );

      case "feed":
        return <FeedPage />;

      case "prescriptions":
        return <PrescriptionForm prefillPatientId={rxPrefill?.patientId} prefillPatientName={rxPrefill?.patientName} />;

      default:
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">
                {activeMenu === "saved" ? "🔖" : activeMenu === "appointments" ? "📅" : activeMenu === "patients" ? "👥" : activeMenu === "messages" ? "💬" : "📊"}
              </div>
              <h3 className="text-xl font-black text-gray-900">{doctorPageTitles[activeMenu].title}</h3>
              <p className="text-gray-500 text-sm mt-2">{doctorPageTitles[activeMenu].subtitle}</p>
              <div className="mt-8 text-xs text-gray-300 font-medium uppercase tracking-widest">Coming soon</div>
            </div>
        );
    }
  };

  if (!user)
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

  return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {showConsult && <ConsultationModal onClose={() => setShowConsult(false)} onGoToPrescriptions={handleGoToPrescriptions} />}

        <aside className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${sidebarExpanded ? "w-60" : "w-16"} sticky top-0 h-screen overflow-hidden shadow-sm`}>
          <div className={`flex items-center border-b border-gray-50 flex-shrink-0 h-16 ${sidebarExpanded ? "px-5 justify-between" : "px-0 justify-center"}`}>
            {sidebarExpanded && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200">M</div>
                  <span className="font-black text-gray-900 text-base tracking-tight">Medily</span>
                </div>
            )}
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className={`w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex-shrink-0 ${!sidebarExpanded ? "mx-auto" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {sidebarExpanded ? <><polyline points="15 18 9 12 15 6"/><line x1="20" y1="12" x2="9" y2="12"/></> : <><polyline points="9 18 15 12 9 6"/><line x1="4" y1="12" x2="15" y2="12"/></>}
              </svg>
            </button>
          </div>

          {sidebarExpanded && (
              <div className="mx-3 my-3 bg-indigo-50 rounded-2xl p-3 flex items-center gap-2.5 flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Doctor")}&background=4f46e5&color=fff`} alt="" className="w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-xs truncate">{user?.name ?? "Doctor"}</div>
                  <div className="text-indigo-500 text-xs">Doctor</div>
                </div>
              </div>
          )}

          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
            {NAV_ITEMS.map(item => {
              const isActive = activeMenu === item.id;
              return (
                  <button key={item.id} onClick={() => handleMenuClick(item.id)} title={!sidebarExpanded ? item.label : undefined}
                          className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"} ${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarExpanded && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>{item.badge}</span>}
                        </>
                    )}
                  </button>
              );
            })}
          </nav>

          <div className="px-2 py-3 border-t border-gray-50 flex-shrink-0 space-y-0.5">
            <button onClick={() => setShowConsult(true)} title={!sidebarExpanded ? "Start Consultation" : undefined}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-all ${sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {sidebarExpanded && <span>Start Consult</span>}
            </button>

            {/* FIXED: logout now calls the function correctly */}
            <button onClick={logout} title={!sidebarExpanded ? "Logout" : undefined}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all ${sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {sidebarExpanded && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center gap-4 sticky top-0 z-20 shadow-sm flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-gray-900 text-base leading-tight truncate">{doctorPageTitles[activeMenu].title}</h2>
              <p className="text-gray-400 text-xs">{doctorPageTitles[activeMenu].subtitle}</p>
            </div>
            <div className="relative hidden md:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search patients, appointments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-300 focus:bg-white transition-all w-56" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleMenuClick("messages")} className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center leading-none">5</span>
              </button>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center leading-none">3</span>
              </button>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Doctor")}&background=4f46e5&color=fff`} alt="" className="w-9 h-9 rounded-xl border-2 border-indigo-100 cursor-pointer hover:border-indigo-400 transition-colors" />
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
  );
};

export default DoctorDashboard;