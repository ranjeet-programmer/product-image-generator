# Product Image Generator - Architecture Document

## Overview

AI-powered tool that automatically generates product images from text descriptions using generative AI models.

**Deployment Strategy**: 100% Free Serverless Architecture

---

## Free Tier Services Used

| Service | Provider | Free Tier |
|---------|----------|-----------|
| Frontend + API Routes | Vercel | 100GB bandwidth, unlimited deploys |
| AI Image Generation | Replicate / HuggingFace | Free tier available |

**Note**: This is a stateless architecture - no database or persistent storage required.


---

## High-Level Architecture (Stateless Serverless)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Next.js 14 App (Vercel)                          │    │
│  │  • Server Components  • Client Components  • API Routes (Edge)       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVERLESS API LAYER (Vercel Edge Functions)             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │ /api/generate  │  │ /api/prompt    │  │ /api/webhook   │                 │
│  │ (AI Generation)│  │ (Optimize)     │  │ (Async CB)     │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │    AI Provider        │
                    │  (Replicate /         │
                    │   HuggingFace)        │
                    └───────────────────────┘
```

**Stateless Design**: No database or persistent storage. Images returned directly from AI provider as temporary URLs.

---

## Component Details

### 1. Client Layer

#### Web Application (Next.js)
- **Purpose**: Primary user interface for product image generation
- **Features**:
  - Product description input form
  - Real-time generation progress
  - Image display and download
  - Style/settings configuration

#### Mobile App (React Native)
- **Purpose**: Mobile-first experience for on-the-go generation
- **Features**: Same as web with mobile optimizations

### 2. API Gateway

- **Technology**: Kong / AWS API Gateway / Nginx
- **Responsibilities**:
  - Request rate limiting (prevent abuse)
  - Request/response transformation
  - SSL termination
  - Load balancing

### 3. Backend Services

#### Image Generation Service
```
/api/generate/
├── POST /              # Generate image (sync or async)
└── GET  /:jobId        # Check async job status (if using webhooks)
```

#### Prompt Service
```
/api/prompt/
├── POST /generate      # Optimize product description into AI prompt
├── GET  /templates     # Get available prompt templates
└── POST /preview       # Preview optimized prompt
```

#### Webhook Service (Optional - for async generation)
```
/api/webhook/
├── POST /replicate     # Replicate completion callback
├── POST /huggingface   # HuggingFace callback
└── POST /stability     # Stability AI callback
```

### 4. AI/ML Layer

#### Prompt Engine
- **Purpose**: Convert product descriptions to optimized prompts
- **Components**:
  - Description parser (NLP)
  - Category classifier
  - Prompt template engine
  - Style/mood enhancer

```python
# Example prompt generation flow
Input: "Red leather handbag with gold clasps"

Output Prompt: "Professional product photography of a luxurious 
red genuine leather handbag with elegant gold metal clasps, 
studio lighting, white background, high resolution, 8K, 
commercial photography style"
```

#### Image Generation Engine
- **Primary Models**:
  - Stable Diffusion XL (self-hosted)
  - DALL-E 3 API (fallback)
  - Flux Pro (high-quality option)
  
- **Configuration Options**:
  - Resolution: 512x512 to 2048x2048
  - Aspect ratios: 1:1, 4:3, 16:9
  - Style presets: Studio, Lifestyle, Minimal
  - Number of variations: 1-4

#### Post-Processing Pipeline
1. **Background Removal** - Remove/replace backgrounds
2. **Upscaling** - AI-powered resolution enhancement
3. **Color Correction** - Adjust for product accuracy
4. **Watermark Addition** - Optional branding

### 5. No Data Layer Required

**Stateless Architecture**: No database or persistent storage needed.

- Client sends description → API generates image → Returns temporary URLs
- No data persistence between requests
- Client responsible for downloading/saving generated images

**Optional: Rate Limiting**

If rate limiting is needed, use in-memory rate limiting or Upstash Redis (free tier):
```typescript
// Simple in-memory rate limiting for Edge Functions
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (record.count >= limit) return false;
  record.count++;
  return true;
}
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, TypeScript, TailwindCSS | Web UI |
| Backend | Node.js (Vercel Edge Functions) | API Services |
| AI/ML | Replicate, HuggingFace, Stability AI | Image generation |
| CI/CD | GitHub Actions | Automation |
| Monitoring | Vercel Analytics | Observability |

---

## Data Flow

### Image Generation Flow (Stateless)

```
1. User submits product description + settings
         │
         ▼
2. API validates request
         │
         ▼
3. Prompt Engine optimizes description
         │
         ▼
4. Call AI Provider (Replicate/HuggingFace)
         │
         ▼
5. AI processes and generates image (~30-60s)
         │
         ▼
6. Return temporary image URLs to client
         │
         ▼
7. Client downloads and saves images locally
```

**Note**: Image URLs from AI providers are temporary (usually 1 hour). Client must download immediately.

---

## API Design

### Generate Image Endpoint

**Request:**
```http
POST /api/generate
Content-Type: application/json

{
  "productName": "Premium Leather Wallet",
  "description": "Brown genuine leather bifold wallet with RFID protection",
  "category": "accessories",
  "settings": {
    "style": "studio",
    "background": "white",
    "resolution": "1024x1024",
    "variations": 4
  }
}
```

**Response:**
```json
{
  "status": "completed",
  "images": [
    "https://replicate.delivery/temp/image1.png",
    "https://replicate.delivery/temp/image2.png"
  ],
  "processingTime": 45000
}
```

**Note**: Image URLs are temporary. Download immediately.

---

## Folder Structure

```
product-image-generator/
├── app/                        # Next.js 14 App Router
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Root layout
│   └── api/                    # API Routes (Serverless)
│       ├── generate/
│       │   └── route.ts        # Image generation endpoint
│       ├── prompt/
│       │   ├── generate/
│       │   │   └── route.ts    # Prompt optimization
│       │   └── templates/
│       │       └── route.ts    # Get templates
│       └── webhook/            # Optional async handlers
│           ├── replicate/
│           │   └── route.ts
│           └── huggingface/
│               └── route.ts
│
├── components/                 # React components
│   ├── ui/                     # Shared UI components
│   ├── GeneratorForm.tsx       # Main input form
│   ├── ImageDisplay.tsx        # Generated image display
│   └── StyleSelector.tsx       # Style/settings picker
│
├── lib/                        # Utilities and helpers
│   ├── providers/              # AI provider integrations
│   │   ├── replicate.ts
│   │   ├── huggingface.ts
│   │   └── stability.ts
│   ├── prompts/                # Prompt templates
│   │   ├── templates.ts
│   │   └── optimizer.ts
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Helper functions
│
├── public/                     # Static assets
├── docs/                       # Documentation
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL (Free Tier)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌───────────────────────────────────┐    │
│  │  Next.js Frontend  │  │   Edge Functions (Stateless)        │    │
│  │  (Static + SSR)    │  │   /api/generate, /api/prompt/*      │    │
│  └────────────────────┘  └───────────────────────────────────┘    │
│                                       │                              │
└───────────────────────────────────────┬─────────────────────────┘
                                        │
                                        ▼
                           ┌───────────────────────┐
                           │    AI PROVIDERS       │
                           │  (Replicate /         │
                           │   HuggingFace)        │
                           └───────────────────────┘
```

**No infrastructure to manage!** Everything runs on Vercel's free tier.

---

## Scalability Considerations

1. **Automatic Scaling**: Vercel Edge Functions scale automatically
2. **No Cold Starts**: Edge runtime provides instant response
3. **CDN Caching**: Static assets cached at edge locations globally
4. **Rate Limiting**: Prevent abuse with IP-based limits

---

## Security Measures

- Rate limiting per IP
- Input sanitization and validation
- CORS configuration
- Encrypted storage for sensitive data
- API key authentication for external services
- Regular security audits

---

## Monitoring & Observability

- **Analytics**: Vercel Analytics (built-in)
- **Logging**: Vercel Logs
- **Errors**: Vercel Error tracking or Sentry (free tier)
- **Uptime**: UptimeRobot (free tier)

---

## Cost Optimization

**Total Cost: $0/month**

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free |
| AI Provider | Free tier credits |

- No database costs
- No storage costs
- No infrastructure to maintain
- Pay only for AI generation beyond free tier

---

## Future Enhancements

- [ ] Add persistent storage option (Supabase/R2) for image history
- [ ] User authentication for personalized experience
- [ ] Custom model fine-tuning
- [ ] Batch processing API
- [ ] Image editing capabilities
- [ ] E-commerce platform integrations

---

*Document Version: 1.0*  
*Last Updated: February 2026*
