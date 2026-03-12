// src/pages/DoctorProfile.tsx
import React from "react";
import {
  User,
  Calendar,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Clock,
  Star,
} from "lucide-react";
import "./DoctorProfile.css";

const DoctorProfile: React.FC = () => {
  // Mock data — in real app this comes from API / route params
  const doctor = {
    name: "Dr. Tanuja Perera",
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
    title: "Consultant Cardiologist",
    specialty: "Cardiology & Interventional Cardiology",
    experienceYears: 14,
    qualifications: [
      "MBBS – University of Colombo",
      "MD (Medicine) – Postgraduate Institute of Medicine",
      "MRCP (UK)",
      "Fellowship in Interventional Cardiology – Singapore",
    ],
    languages: ["English", "Sinhala", "Tamil"],
    hospital: "Nawaloka Hospital",
    location: "Colombo 03, Sri Lanka",
    availability: "Mon–Fri: 8:30 AM – 1:00 PM | 4:00 PM – 7:30 PM",
    rating: 4.9,
    reviewCount: 128,
    about: `Dr. Tanuja Perera is a highly regarded cardiologist with over 14 years of experience in diagnosing and treating complex cardiovascular conditions. She specializes in interventional procedures including coronary angiography, angioplasty, and stenting.

She is known for her patient-centered approach, clear communication, and dedication to preventive cardiology. Dr. Perera regularly participates in local and international cardiology conferences and has contributed to several research publications on hypertension and coronary artery disease management.`,
    achievements: [
      "Best Outgoing Student – Postgraduate MD Medicine 2015",
      "Gold Medal – Sri Lanka College of Cardiology Annual Sessions 2020",
      "Member – European Society of Cardiology",
    ],
    contact: {
      phone: "+94 11 255 6789",
      email: "dr.tanuja@medily.lk",
      website: "www.medily.lk/doctors/tanuja-perera",
    },
  };

  return (
    <div className="doctor-profile-page">
      {/* Hero / Header */}
      <div className="profile-hero">
        <div className="hero-gradient"></div>
        <div className="hero-container">
          <div className="avatar-large-container">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="avatar-large"
            />
            <div className="verified-badge">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="hero-info">
            <h1 className="doctor-name">{doctor.name}</h1>
            <p className="doctor-title">{doctor.title}</p>
            <p className="doctor-specialty">{doctor.specialty}</p>

            <div className="rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(doctor.rating) ? "#fbbf24" : "none"}
                    color="#fbbf24"
                  />
                ))}
              </div>
              <span className="rating-text">
                {doctor.rating} • {doctor.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-main-content">
        <div className="content-grid">
          {/* Left / Main column */}
          <div className="main-column">
            <section className="profile-section about-section">
              <h2>About Dr. {doctor.name.split(" ")[1]}</h2>
              <p>{doctor.about}</p>
            </section>

            <section className="profile-section">
              <h2>Qualifications & Training</h2>
              <ul className="bullet-list">
                {doctor.qualifications.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="profile-section">
              <h2>Achievements & Affiliations</h2>
              <ul className="bullet-list highlight">
                {doctor.achievements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card contact-card">
              <h3>Practice Information</h3>

              <div className="info-row">
                <MapPin size={20} />
                <div>
                  <strong>{doctor.hospital}</strong>
                  <span>{doctor.location}</span>
                </div>
              </div>

              <div className="info-row">
                <Clock size={20} />
                <span>{doctor.availability}</span>
              </div>

              <div className="info-row">
                <Phone size={20} />
                <a href={`tel:${doctor.contact.phone}`}>
                  {doctor.contact.phone}
                </a>
              </div>

              <div className="info-row">
                <Mail size={20} />
                <a href={`mailto:${doctor.contact.email}`}>
                  {doctor.contact.email}
                </a>
              </div>

              <div className="info-row">
                <Globe size={20} />
                <a
                  href={`https://${doctor.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Online Profile
                </a>
              </div>

              <button className="primary-action-btn">Book Appointment</button>
            </div>

            <div className="sidebar-card languages-card">
              <h3>Languages Spoken</h3>
              <div className="language-tags">
                {doctor.languages.map((lang) => (
                  <span key={lang} className="tag">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
