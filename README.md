# Medily

> Medily reimagines healthcare through a unified digital patient identity, turning scattered records into a connected, traceable, and efficient experience for patients and healthcare providers alike.
<div align="center">
  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Spring_Boot-3-6DB33F?style=flat&logo=springboot" />
    <img src="https://img.shields.io/badge/Express-4-000000?style=flat&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-6-47A248?style=flat&logo=mongodb&logoColor=white" />
  </p>
</div>

---

## What is Medily?

Most healthcare experiences are fragmented. Patients carry paper prescriptions, forget medication instructions, and lose track of their medical history. Doctors juggle between systems. Pharmacies manually verify everything.

Medily connects all of it by one platform, four roles, zero friction.

---

## Who is it for?

| Role | What they get                                                                          |
|------|----------------------------------------------------------------------------------------|
| **Doctors** | Consultation timer, digital prescription writer, patient records, medical community feed |
| **Admin** | Full platform oversight - users, appointments, activity logs, system health            |
| **Pharmacists** | Incoming prescriptions, dispensing workflow, patient verification                      |
| **Patients** | Prescription history, AI medication explainer, appointment booking     |

---

## Unique Features

### For Doctors
- **Consultation Timer** - start a session with a patient ID, track duration, log notes, and seamlessly flow into writing a prescription
- **Digital Prescription Writer** - multi-medication cards with dosage, frequency, duration, and quantity
- **Medical Feed** - a masonry feed for sharing clinical insights with the medical community
- **Subscription Management** - doctor subscription and profile settings

### For Patients
- **Unified Prescription View** - all prescriptions in one place, clearly laid out
- **AI Medication Insights** - tap any medication to get a plain-language explanation of what it is, how to take it, side effects to watch for, and what to avoid
- **Prescription Requests** - patients can request prescriptions from nearest pharmacies, which pharmacies can then fulfill directly through the platform

### For Pharmacies
- **Incoming Prescription Queue** - receive, view and manage prescriptions issued by doctors and sent by patients, and fulfill them directly through the platform
- **Dispensing Workflow** - mark prescriptions as dispensed with full traceability
- **Verified Doctor Network** - pharmacies receive prescriptions that come from doctors verified through their registration number

### For Admins
- **Live Dashboard** - total users, doctors, patients, pharmacies at a glance
- **User Management** - activate/deactivate accounts, filter by role, search
- **Appointment Monitor** - all appointments across the platform with status filtering
- **Activity Log** - full audit trail of every action taken on the platform

### Platform-wide
- **Real-time Chat** - WebSocket-powered messaging between patients and doctors
- **Notifications** - in-app notification system for appointments, prescriptions, and messages
- **Collapsible Sidebar** - icon-only mode for more screen space
- **Medical Records** - structured medical history per patient
- **Posts & Feed** - community posts with audience control
- **Ratings** - patients can rate doctors after consultations
- **OAuth2 + JWT Auth** - secure authentication with rate limiting
- **Email Service** - automated emails for key events
- **Stripe Payment** - integrated payment modal for subscriptions
- **Profile & Complete Profile Flow** - onboarding flow per role after registration

## Future-Enhancements

### For Doctors
- **Doctor Availability Management** - set and manage available slots for appointments

### For Patients
- **Voice Assistance** — every AI explanation can be read aloud for patients with visual impairments
- **AI Recovery Video** *(coming soon)* — a personalized animated video explaining the diagnosis, how medications help, and a recovery roadmap — generated from the prescription using Gemini + Google TTS + Remotion

### For Pharmacies
- **Clinic Linking** - associate with registered clinics on the platform
---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Vite | Build tool |
| Axios | API calls |

### Backend
| Tool | Purpose |
|------|---------|
| Spring Boot | REST API framework |
| Spring Security + JWT | Authentication & authorization |
| OAuth2 | Social login |
| WebSocket | Real-time chat |
| Spring Data JPA | Database ORM |
| Maven | Dependency management |

---

## System Architecture

### Backend Architecture

The backend follows a clean layered architecture where each layer has a single responsibility:

```
  [ Client / Frontend ]
          │
          ▼
  [ Controllers ]          REST API endpoints — receive requests, return responses
          │
          ▼
  [ Services ]             Business logic layer — all rules and processing live here
          │
          ▼
  [ Repositories ]         Data access layer — Spring Data JPA interfaces
          │
          ▼
  [ Entities ]             Database models — mapped to database tables via JPA
```

| Layer | Responsibility |
|-------|---------------|
| `controller/` | Exposes REST endpoints, handles HTTP in/out |
| `service/` | Business logic, orchestrates operations |
| `repository/` | Data access via Spring Data JPA |
| `entity/` | JPA-mapped database models |
| `dto/` | Data transfer objects — decouples API from DB layer |
| `security/` | JWT filter, OAuth2 handler, rate limiting |
| `config/` | Security and WebSocket configuration |
| `exception/` | Global error handling |
| `util/` | Shared utility classes |

### Frontend Architecture

The frontend follows a feature-aware structure with clear separation between UI, state, and data:

```
  [ Pages ]                Role-based dashboard pages (Admin, Doctor, Patient, Pharmacy)
      │
      ├── [ Components ]   Reusable UI building blocks
      ├── [ Hooks ]        Custom React hooks (chat, notifications, masonry)
      ├── [ Context ]      Global auth state (AuthContext)
      ├── [ API ]          Axios instance + typed API calls
      ├── [ Types ]        TypeScript interfaces per domain
      └── [ Constants ]    Routes, roles, status enums, sidebar menus
```

| Layer | Responsibility |
|-------|---------------|
| `pages/` | Top-level route components per role |
| `components/` | Shared reusable UI components |
| `hooks/` | Encapsulated stateful logic (chat, notifications) |
| `context/` | Global auth state and session management |
| `api/` | Axios instance, interceptors, typed API calls |
| `types/` | TypeScript interfaces for all domains |
| `constants/` | Routes, roles, status values, nav menus |
| `lib/` | Auth helpers and shared utilities |
| `layouts/` | Navbar and Footer wrappers |

### Request Flow

```
User Action (React)
    │
    ▼
Axios API Call (api.ts)
    │
    ▼
Spring Boot Controller
    │
    ▼
Service Layer (business logic)
    │
    ▼
Repository (JPA query)
    │
    ▼
Database (MySQL / PostgreSQL)
    │
    ▼
DTO Response → back to React
```
 
---

## Project Structure

```
medily/
├── medily-backend/                            # Spring Boot REST API
│   └── src/main/java/com/medily/backend/
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── WebSocketConfig.java
│       │
│       ├── controller/
│       │   ├── ActivityLogController.java
│       │   ├── AdminController.java
│       │   ├── AppointmentController.java
│       │   ├── AuthController.java
│       │   ├── ChatController.java
│       │   ├── ClinicController.java
│       │   ├── DoctorController.java
│       │   ├── MedicalRecordController.java
│       │   ├── NotificationController.java
│       │   ├── PatientController.java
│       │   ├── PaymentController.java
│       │   ├── PharmacyController.java
│       │   ├── PostController.java
│       │   ├── PrescriptionController.java
│       │   ├── PrescriptionRequestController.java
│       │   ├── ProfileController.java
│       │   ├── RatingController.java
│       │   └── UserController.java
│       │
│       ├── dto/
│       │   ├── activitylog/    # ActivityLogResponseDTO
│       │   ├── appointment/    # AppointmentRequestDTO, AppointmentResponseDTO
│       │   ├── auth/           # AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO
│       │   ├── chat/           # ChatMessageDTO, ChatRoomDTO, CreateChatRoomRequest, SendMessageRequest
│       │   ├── clinic/         # ClinicRequestDTO, ClinicResponseDTO
│       │   ├── common/         # ApiResponse
│       │   ├── doctor/         # DoctorAvailabilityRequestDTO, DoctorAvailabilityResponseDTO,
│       │   │                   # DoctorRequestDTO, DoctorResponseDTO, DoctorSummaryDTO
│       │   ├── medical/        # MedicalRecordRequestDTO, MedicalRecordResponseDTO
│       │   ├── notification/   # NotificationResponseDTO
│       │   ├── patient/        # PatientRequestDTO, PatientResponseDTO
│       │   ├── pharmacy/       # PharmacyRequestDTO, PharmacyResponseDTO
│       │   ├── post/           # PostCreateRequestDTO, PostResponseDTO
│       │   ├── prescription/   # PrescriptionCreateRequestDTO, PrescriptionItemRequestDTO,
│       │   │                   # PrescriptionItemResponseDTO, PrescriptionResponseDTO
│       │   ├── prescriptionrequest/ # PrescriptionRequestCreateDTO, PrescriptionRequestResponseDTO
│       │   └── user/           # UserResponseDTO
│       │
│       ├── entity/
│       │   ├── ActivityLog.java
│       │   ├── Appointment.java
│       │   ├── ChatMessage.java
│       │   ├── ChatRoom.java
│       │   ├── Clinic.java
│       │   ├── Doctor.java
│       │   ├── DoctorAvailability.java
│       │   ├── MedicalRecord.java
│       │   ├── Notification.java
│       │   ├── Patient.java
│       │   ├── Pharmacy.java
│       │   ├── Post.java
│       │   ├── PostAudience.java
│       │   ├── Prescription.java
│       │   ├── PrescriptionItem.java
│       │   ├── PrescriptionRequest.java
│       │   └── User.java
│       │
│       ├── exception/
│       │   ├── CustomException.java
│       │   └── GlobalExceptionHandler.java
│       │
│       ├── repository/
│       │   ├── ActivityLogRepository.java
│       │   ├── AppointmentRepository.java
│       │   ├── ChatMessageRepository.java
│       │   ├── ChatRoomRepository.java
│       │   ├── ClinicRepository.java
│       │   ├── DoctorAvailabilityRepository.java
│       │   ├── DoctorRepository.java
│       │   ├── MedicalRecordRepository.java
│       │   ├── NotificationRepository.java
│       │   ├── PatientRepository.java
│       │   ├── PharmacyRepository.java
│       │   ├── PostAudienceRepository.java
│       │   ├── PostRepository.java
│       │   ├── PrescriptionItemRepository.java
│       │   ├── PrescriptionRepository.java
│       │   ├── PrescriptionRequestRepository.java
│       │   └── UserRepository.java
│       │
│       ├── security/
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── JwtService.java
│       │   ├── OAuth2SuccessHandler.java
│       │   ├── RateLimitingFilter.java
│       │   └── UserDetailsServiceImpl.java
│       │
│       ├── service/
│       │   ├── custom/impl/
│       │   │   ├── ActivityLogServiceImpl.java
│       │   │   ├── AppointmentServiceImpl.java
│       │   │   ├── AuthServiceImpl.java
│       │   │   ├── ChatService.java
│       │   │   ├── ClinicServiceImpl.java
│       │   │   ├── DoctorServiceImpl.java
│       │   │   ├── EmailServiceImpl.java
│       │   │   ├── MedicalRecordServiceImpl.java
│       │   │   ├── NotificationServiceImpl.java
│       │   │   ├── PatientServiceImpl.java
│       │   │   ├── PharmacyServiceImpl.java
│       │   │   ├── PostServiceImpl.java
│       │   │   ├── PrescriptionRequestServiceImpl.java
│       │   │   ├── PrescriptionServiceImpl.java
│       │   │   └── UserServiceImpl.java
│       │   ├── ActivityLogService.java
│       │   ├── AppointmentService.java
│       │   ├── AuthService.java
│       │   ├── ClinicService.java
│       │   ├── DoctorService.java
│       │   ├── EmailService.java
│       │   ├── MedicalRecordService.java
│       │   ├── NotificationService.java
│       │   ├── PatientService.java
│       │   ├── PharmacyService.java
│       │   ├── PostService.java
│       │   ├── PrescriptionRequestService.java
│       │   ├── PrescriptionService.java
│       │   └── UserService.java
│       │
│       └── util/
│           ├── APIResponse.java
│           └── BackendApplication.java
│
└── medily-frontend/                           # React + TypeScript SPA
    └── src/
        ├── api/
        │   ├── api.ts                         # Axios instance + interceptors
        │   └── authApi.ts                     # Auth API calls
        │
        ├── assets/                            # Static images and icons
        │
        ├── components/                        # Shared reusable UI components
        │
        ├── constants/
        │   ├── menu/
        │   │   └── sidebarMenu.tsx            # Nav items per role
        │   ├── roles/
        │   │   └── roles.ts                   # Role constants
        │   ├── routes/
        │   │   └── appRoutes.ts               # Route definitions
        │   └── status/
        │       └── status.ts                  # Status enums
        │
        ├── context/
        │   └── AuthContext.tsx                # Auth state + logout
        │
        ├── features/                          # Feature-based modules
        │
        ├── hooks/
        │   ├── useChat.ts                     # WebSocket chat hook
        │   ├── useMasonryColumns.ts           # Responsive masonry layout hook
        │   └── useNotifications.ts            # Real-time notifications hook
        │
        ├── layouts/
        │   ├── Footer.tsx
        │   └── Navbar.tsx
        │
        ├── lib/
        │   └── auth.ts                        # Auth helper utilities
        │
        ├── pages/
        │   ├── AdminDashboard.tsx
        │   ├── CompleteProfile.tsx            # Post-registration profile setup
        │   ├── DoctorDashboard.tsx
        │   ├── DoctorMedicalFeedPage.tsx
        │   ├── DoctorProfile.tsx
        │   ├── DoctorSubscription.tsx
        │   ├── LandingPage.tsx
        │   ├── LoginPage.tsx
        │   ├── MessagePage.tsx
        │   ├── OAuth2RedirectHandler.tsx      # Handles OAuth2 callback
        │   ├── PatientDashboard.tsx
        │   ├── PendingVerification.tsx
        │   ├── PharmacyDashboard.tsx
        │   ├── ProfileSettings.tsx
        │   ├── SignUp.tsx
        │   └── StripePaymentModal.tsx
        │
        ├── types/
        │   ├── Appointment.ts
        │   ├── Auth.ts
        │   ├── Doctor.ts
        │   ├── Feed.ts
        │   ├── index.ts
        │   ├── Patient.ts
        │   ├── Pharmacy.ts
        │   ├── Prescription.ts
        │   └── Ui.ts
        │
        ├── utils/
        │   └── utils.ts                       # Shared helper functions
        │
        ├── App.tsx
        ├── App.css
        ├── main.tsx
        └── index.css
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL or PostgreSQL

### Backend Setup

```bash
cd medily-backend

# Configure your database in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/medily
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Run
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd medily-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Yen

---

<div align="center">
  <p>Built with ❤️ for better healthcare experiences</p>
</div>
