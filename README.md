<div align="center">

# ⚡ GROWIXA AI MARKETING PLATFORM
### *The Autonomous AI Engine for Email, Social, SMS & GEO Marketing*

![Version](https://img.shields.io/badge/version-2.4.0-10B981?style=for-the-badge)
![Status](https://img.shields.io/badge/Release_Matrix-v2.4_Active-6366F1?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Vite_%7C_React_18_%7C_Lucide-8B5CF6?style=for-the-badge)
![Security](https://img.shields.io/badge/Auth-Argon2id_%7C_JWT_%7C_6_RBAC-06B6D4?style=for-the-badge)

</div>

---

## 📌 Executive Overview

**Growixa** is an enterprise-grade **AI-Powered Growth and Marketing Automation SaaS Platform**. Built according to the official product catalog specification (`DOC-PROD-CATALOG-PDF`, Version 2.4 Roadmap), Growixa delivers high-deliverability email marketing pipelines, dynamic rule-based audience CRM segmentation, multi-channel social media automation, bulk SMS/WhatsApp campaigns, and Answer Engine Optimization (**AEO & GEO**).

The system scales seamlessly from a single-tenant MVP into a self-service multi-tenant SaaS platform with strict data isolation boundaries, Stripe subscription lifecycle management, and real-time infrastructure telemetry.

---

## 🌟 Key Features & 6 Core Engine Modules

```
                        ┌──────────────────────────────────────────────┐
                        │   GROWIXA AI AUTONOMOUS GROWTH PLATFORM      │
                        └──────────────────────┬───────────────────────┘
                                               │
    ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
    │                   │                      │                      │                   │
┌───▼──────────────┐┌───▼──────────────┐┌──────▼─────────────┐┌───────▼────────────┐┌───▼──────────────┐
│ 1. Auth & Admin  ││ 2. Contact CRM   ││ 3. Email Engine    ││ 4. Social & AI    ││ 5. Omnichannel   │
│ Security         ││ & Audiences      ││ (Postmark/SMTP)    ││ Content Assistant ││ SMS & WhatsApp   │
│ (Argon2id/RBAC)  ││ (Dynamic Rules)  ││ (Fernet Encrypted) ││ (Brand Safety)    ││ (Twilio & Meta)  │
└──────────────────┘└──────────────────┘└────────────────────┘└───────────────────┘└──────────────────┘
```

### 1. 🛡️ Auth, Security & Platform Administration (`GRX-FEAT-001..028`)
- **Argon2id Password Hashing**: JWT refresh rotation, IP rate limiting, and secure password reset workflows.
- **6-Role RBAC Engine**: Centralized server-side route permission checking.
- **Brand Voice Profile**: Organization-wide brand tone definitions, compliance claim filtering, and forced brand rules.
- **Audit Logs**: Insert-only security trail tracking logins, role changes, and data modifications.
- **Admin Health Panel**: Real-time infrastructure monitoring for Postgres, Redis, and RabbitMQ.

### 2. 👥 Contact & Audience Management Engine (`GRX-FEAT-006..010`)
- **Centralized CRM**: Automatic email deduplication and custom attribute mapping.
- **Smart CSV Import**: Auto-detection of CSV columns and historical import logs.
- **Segmentation Builder**: Rule-based **Dynamic** (live-evaluated) and **Saved** (frozen) audience target segments.
- **GDPR & TCPA Consent**: Automated suppression list enforcement for email and phone numbers.

### 3. 📧 Multi-Provider Email Marketing Engine (`GRX-FEAT-011..016`)
- **Postmark & Custom SMTP**: Fernet encrypted credential storage and connection testing.
- **Template Builder**: HTML iframe preview, formatting tools, versioning, and duplication.
- **Campaign Scheduler**: Background worker claims, automatic retries, and Dead Letter Queue (DLQ) error handling.
- **Delivery Webhooks & Analytics**: Real-time open, click, bounce, complaint rates, and 1-click unsubscribe links.

### 4. 📲 Social Media Automation & AI Assistant (`GRX-FEAT-017..023`)
- **OAuth 2.0 Integration**: Accounts connection management for LinkedIn and Twitter/X.
- **AI Content Assistant**: Instant generation of email subject lines, email copy, social captions, CTAs, and tone rewrites.
- **AI Brand Safety Engine**: Forced human manager approval workflows for AI-generated posts.
- **Token Telemetry**: Token consumption tracker, prompt versioning, and provider cost estimation.

### 5. 💳 Customer Account SaaS Platform (`GRX-SAAS-001..005`)
- **Strict Data Isolation**: DB `account_id` isolation guaranteeing multi-tenant data boundaries.
- **Stripe Subscription Lifecycle**: Tiered subscription plans (Starter, Pro, Enterprise) with payment webhooks.
- **Self-Service Registration**: Token-verified public signup flow.

### 6. 🚀 SMS, WhatsApp & GEO/AEO Growth Specialists (`Release 1.2 – V3`)
- **Bulk SMS Marketing**: Twilio setup, E.164 phone validation, GSM-7 segment calculator, TCPA opt-out webhooks.
- **WhatsApp Marketing**: Meta Cloud API & Twilio WhatsApp approved business message templates.
- **Generative Engine Optimization (GEO & AEO)**: Answer Engine Optimization, Search Console crawler, and Multi-Agent growth loop.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 18 (Hooks, Context, Functional Components) |
| **Build Tool** | Vite 5 |
| **Icons** | Lucide React |
| **Styling** | Custom Glassmorphism CSS Design System with CSS Variables |
| **Typography** | Plus Jakarta Sans, Inter, JetBrains Mono (Google Fonts) |
| **Deployment & Host** | Node.js, Static SPA Server |

---

## 📁 Repository Structure

```
growixa_website/
├── index.html              # HTML5 root template & Google Fonts preloads
├── package.json            # Scripts & dependencies (React 18, Vite 5, Lucide)
├── vite.config.js          # Vite build & local dev server setup
├── .gitignore              # Ignored build & node_modules directories
├── README.md               # Project documentation & feature catalog
└── src/
    ├── main.jsx            # Application entrypoint
    ├── App.jsx             # Root layout, theme context & modal controllers
    ├── index.css           # Global design tokens, glassmorphism & dark/light themes
    └── components/
        ├── Navbar.jsx          # Glassmorphism header, theme toggle & status badge
        ├── Hero.jsx            # Headline, live stats telemetry dashboard mockup
        ├── EngineShowcase.jsx  # Interactive tabbed 6-pillar feature catalog
        ├── AISimulator.jsx     # Live AI Content & Brand Safety sandbox widget
        ├── GrowthCalculator.jsx# Interactive ROI revenue projection sliders
        ├── RoadmapMatrix.jsx   # Section 8 Master Release Matrix timeline
        ├── PricingSection.jsx  # Sprint 5 SaaS billing plans with annual discount
        ├── Testimonials.jsx   # Verified client proof & partner badges
        ├── BookingModal.jsx    # Self-service account registration popup modal
        └── Footer.jsx          # Document ID metadata & live infrastructure status
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed.

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Itssushmasharma/demo_growixa.git
   cd demo_growixa
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

---

## 📊 Master Release Roadmap Matrix (PDF Spec Section 8)

| Release Stage | Core Scope & Focus Area | Target Timeline / Status |
| :--- | :--- | :--- |
| **MVP (Slices 1–6)** | Email Marketing Foundation, Contact CRM, Social Automation, AI Assistant | **DONE / Active** |
| **Sprint 5** | Customer Account Platform (`account_id` isolation, signup, Stripe billing, Admin) | **Scheduled Next (DEC-GRX-017)** |
| **Release 1.1** | Marketing Depth: Advanced segmentation, approval workflows, calendar polish | **Staged Post-Sprint 5** |
| **Release 1.2** | Marketing Breadth: Bulk SMS Marketing (Twilio), multi-social, A/B testing | **Staged (GRX-FEAT-SMS-001)** |
| **Release 1.2+** | WhatsApp Marketing (Meta/Twilio API), push notification channels | **Staged Channel Expansion** |
| **V1.5 – V3** | SEO Crawler, WordPress/GitHub auto-PRs, AEO/GEO Specialists, Multi-Agent Engine | **Long-Term Vision** |

---

## 📄 License & Specification Document

- **Document ID**: `DOC-PROD-CATALOG-PDF`
- **Classification**: Executive Product Specification
- **Author/System**: Product Architecture Team
- **Version**: 2.4 Complete Roadmap

---

<div align="center">
  <sub>Built with ❤️ for <strong>Growixa AI Platform Inc.</strong></sub>
</div>
