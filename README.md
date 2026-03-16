# Sotrixa — Strategic Design Agency Website

A high-performance, animation-rich agency website built for **Sotrixa** — a strategic design studio for visionary thinkers, entrepreneurs, and changemakers. Features a dual-layout experience: horizontal scrolling on desktop and vertical on mobile, powered by GSAP and Next.js.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15+ (App Router, TypeScript) |
| Styling | Tailwind CSS 4, SASS |
| Animations | GSAP 3, Framer Motion |
| Carousel | Embla Carousel |
| Email | Resend |
| Validation | Zod |
| Package Manager | npm / bun |

---

## Features

- **Desktop** — Horizontal scroll navigation across 5 animated sections with GSAP timeline
- **Mobile** — Responsive vertical layout with touch-friendly navigation
- **Contact Form** — Validated form with dual email delivery (company notification + customer auto-response) via Resend
- **Multi-language** — English and Bulgarian support with language context provider
- **SEO** — Dynamic metadata, XML sitemap, robots.txt, Open Graph, JSON-LD structured data (Organization, Service, Breadcrumb schemas)
- **Analytics** — Google Analytics 4 + Google Tag Manager integration
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, CSP configured in `next.config.ts`
- **Case Studies** — Portfolio showcase with carousel and individual detail pages
- **Service Pages** — Dedicated pages for Research, Branding, Marketing, and Website Development

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — animated hero with horizontal scroll sections |
| `/about` | Company story, mission, and approach |
| `/contact` | Contact form with email integration |
| `/case-studies` | Portfolio showcase with 3 featured case studies |
| `/created-to-matter` | Dedicated page for the strategic consulting offering |
| `/services` | Services overview |
| `/services/research` | Strategic Research & Analysis |
| `/services/branding` | Brand Strategy & Identity |
| `/services/marketing` | Marketing Strategy & Campaigns |
| `/services/website-development` | Website Development & Design |
| `/api/contact` | POST endpoint — handles contact form submissions |

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A [Resend](https://resend.com) account for email functionality

### 1. Clone the repository

```bash
git clone https://github.com/sotrixa/sotrixa-2.git
cd sotrixa-2
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your@domain.com
TO_EMAIL=recipient@domain.com

# Public base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION=your_verification_code
```

> **Note:** The contact form will not send emails without a valid `RESEND_API_KEY`.

### 4. Run the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Project Structure

```
/app
  /api/contact          # Contact form API endpoint
  /components           # Reusable UI components
    /animation          # GSAP and motion wrappers
    /layout             # Page layout components
    /navigation         # Nav menu, mobile hamburger
    /scroll             # Scroll indicators, pagination
  /sections
    /desktop            # Desktop horizontal scroll sections
    /mobile             # Mobile vertical scroll sections
  /lib                  # Utilities: SEO helpers, hooks, image optimization
  /data                 # Case studies data, translations
  /styles               # Custom CSS and SASS files
  layout.tsx            # Root layout with metadata & structured data
  page.tsx              # Homepage (splits desktop/mobile)
  sitemap.ts            # Auto-generated XML sitemap
  robots.ts             # Auto-generated robots.txt
  manifest.ts           # PWA manifest
/public
  /images               # Static images and assets
  /video                # Optimized MP4 video assets
```

---

## Deployment

The project is optimized for deployment on **Vercel**:

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

For other platforms, run `npm run build` and serve the `.next` output with `npm start`.

---

## Contact

**Sotrixa** — [sotrixa.com](https://sotrixa.com)
Strategic Design for Visionary Thinkers
