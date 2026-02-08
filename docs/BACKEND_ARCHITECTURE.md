# Backend Microservices Architecture

## Overview

Stateless serverless architecture for the Product Image Generator. Each service is independently deployable as an Edge Function (Vercel/Cloudflare Workers) for **$0 hosting cost**. No database or persistent storage required.

---

## Service Identification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MICROSERVICES OVERVIEW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐   ┌─────────────────────┐                        │
│   │   Prompt Service    │   │  Generation Service │                        │
│   │  (Optimize prompts) │   │  (Call AI providers)│                        │
│   └─────────────────────┘   └─────────────────────┘                        │
│                                                                              │
│   ┌─────────────────────┐                                                  │
│   │   Webhook Service   │                                                  │
│   │  (Async callbacks)  │                                                  │
│   └─────────────────────┘                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Services Detail

### 1. Prompt Service
**Responsibility**: Transform product descriptions into optimized AI prompts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prompt/generate` | POST | Generate optimized prompt |
| `/api/prompt/templates` | GET | Get prompt templates |
| `/api/prompt/preview` | POST | Preview prompt before generation |

**Prompt Engineering Logic**:
```typescript
interface PromptRequest {
  description: string;
  category: ProductCategory;
  style: ImageStyle;
  additionalContext?: string;
}

interface PromptResponse {
  optimizedPrompt: string;
  negativePrompt: string;
  suggestedSettings: {
    guidance_scale: number;
    num_inference_steps: number;
  };
}

type ImageStyle = 
  | 'studio'           // Clean studio photography
  | 'lifestyle'        // Product in use/context
  | 'white_background' // E-commerce style
  | 'minimal'          // Minimalist aesthetic
  | 'luxury'           // Premium/high-end look
  | 'flat_lay';        // Top-down view
```

**Prompt Template Example**:
```
Base: "Professional product photography of {description}"

Style Modifiers:
- studio: "studio lighting, softbox, neutral background, sharp focus"
- lifestyle: "natural lighting, lifestyle setting, in-use context"
- white_background: "pure white background, e-commerce style, centered"
- minimal: "minimalist composition, clean lines, subtle shadows"
- luxury: "dramatic lighting, premium feel, high-end aesthetic"

Quality Modifiers: "8K resolution, high detail, commercial photography"

Negative Prompt: "blurry, distorted, low quality, watermark, text, logo"
```

---

### 2. Generation Service
**Responsibility**: Interface with AI providers to generate images

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Submit generation job |
| `/api/generate/:jobId` | GET | Check job status |
| `/api/generate/:jobId/cancel` | POST | Cancel pending job |

**Request/Response Model** (Stateless):
```typescript
interface GenerationRequest {
  description: string;
  category: ProductCategory;
  style: ImageStyle;
  settings: GenerationSettings;
}

interface GenerationResponse {
  id: string;                    // Provider's job ID
  status: 'processing' | 'completed' | 'failed';
  images?: string[];             // Direct URLs from AI provider (temporary)
  error?: string;
  processingTime?: number;       // milliseconds
}

interface GenerationSettings {
  style: ImageStyle;
  num_images: 1 | 2 | 3 | 4;
  resolution: '512x512' | '768x768' | '1024x1024';
  guidance_scale: number;
  seed?: number;
}

type AIProvider = 'replicate' | 'huggingface' | 'stability';
```

**Note**: Images are returned as temporary URLs from the AI provider. Client should download immediately as URLs may expire.

**AI Provider Integration** (Free Tiers):
| Provider | Free Tier | Model |
|----------|-----------|-------|
| Replicate | ~$5 free credits | SDXL, Flux |
| HuggingFace | Free inference | Stable Diffusion |
| Stability AI | 25 free credits | SDXL |

---

### 3. Webhook Service
**Responsibility**: Handle callbacks from AI providers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhook/replicate` | POST | Replicate completion callback |
| `/api/webhook/huggingface` | POST | HuggingFace callback |
| `/api/webhook/stability` | POST | Stability AI callback |

**Webhook Flow** (Stateless):
```
1. Generation Service submits job to AI provider with webhook URL
2. AI provider processes asynchronously
3. AI provider calls webhook on completion
4. Webhook Service:
   - Validates webhook signature
   - Returns image URLs to waiting client (via polling or SSE)
   - No database updates needed
```

**Webhook Payload Example** (Replicate):
```typescript
interface ReplicateWebhook {
  id: string;
  status: 'succeeded' | 'failed';
  output: string[];        // Array of image URLs
  error?: string;
  metrics: {
    predict_time: number;
  };
}
```

---

## Service Communication (Stateless Flow)

```
┌──────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│  Client  │────▶│   Prompt   │────▶│ Generation │────▶│ AI Provider│
└──────────┘     │  Service   │     │  Service   │     │ (External) │
     ▲           └────────────┘     └────────────┘     └──────┬─────┘
     │                                                        │
     │              Option A: Synchronous                     │
     │◀───────────────────────────────────────────────────────┘
     │              (wait for result, ~30-60s)
     │
     │              Option B: Async with Webhook
     │                                    ┌────────────┐
     │◀───────────────────────────────────│  Webhook   │◀────┘
     │              (poll or SSE)         │  Service   │
                                          └────────────┘
```

**Key Points**:
- No database required
- No persistent storage
- Images returned as temporary URLs from AI provider
- Client responsible for downloading/saving images

---

## No Database Required

This is a **stateless architecture**. No database is needed.

**Data Flow**:
- Client sends product description → API processes → AI generates → Returns image URLs
- No data persistence between requests
- Client is responsible for saving/storing generated images locally

**Optional: Rate Limiting with Redis**

If rate limiting is needed, use Redis (Upstash free tier):
```typescript
// Simple in-memory rate limiting (for Edge Functions)
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

## API Structure (Folder Layout)

```
backend/
├── services/
│   ├── prompt/
│   │   ├── index.ts
│   │   ├── handlers/
│   │   │   ├── generate.ts
│   │   │   ├── templates.ts
│   │   │   └── preview.ts
│   │   └── templates/
│   │       ├── base.ts
│   │       ├── styles.ts
│   │       └── categories.ts
│   │
│   ├── generation/
│   │   ├── index.ts
│   │   ├── handlers/
│   │   │   └── generate.ts       # Single endpoint for generation
│   │   └── providers/
│   │       ├── replicate.ts
│   │       ├── huggingface.ts
│   │       └── stability.ts
│   │
│   └── webhook/              # Optional: for async generation
│       ├── index.ts
│       └── handlers/
│           ├── replicate.ts
│           ├── huggingface.ts
│           └── stability.ts
│
├── shared/
│   ├── types/
│   │   ├── generation.ts
│   │   ├── prompt.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── rateLimit.ts
│   │   └── response.ts
│   └── constants/
│       ├── categories.ts
│       └── styles.ts
│
├── package.json
└── tsconfig.json
```

---

## Deployment Architecture (Free Tier)

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Free Tier)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js API Routes (Stateless)          │    │
│  │        /api/generate    /api/prompt/*                │    │
│  │        /api/webhook/*   (optional async)             │    │
│  └─────────────────────────────────────────────────────┘    │
│                       │                                      │
│                       │ Edge Runtime (fast cold starts)      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
              ┌───────────────────────┐
              │    AI PROVIDERS       │
              │    (Free Tier)        │
              │                       │
              │   • Replicate         │
              │   • HuggingFace       │
              │   • Stability AI      │
              └───────────────────────┘
```

**No Database or Storage Required!**

---

## Environment Variables

```env
# AI Providers
REPLICATE_API_TOKEN=your_replicate_token
HUGGINGFACE_API_TOKEN=your_hf_token
STABILITY_API_KEY=your_stability_key

# Webhook (for async generation)
WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Cost Summary: $0/month

| Service | Usage | Cost |
|---------|-------|------|
| Vercel | Hobby plan, 100GB bandwidth | **Free** |
| Replicate | ~$5 free credits/month | **Free*** |

*Note: AI generation has limited free credits. No database or storage costs since the architecture is stateless.

---

## Next Steps

1. [ ] Create API routes in Next.js
2. [ ] Implement prompt optimization service
3. [ ] Connect to AI providers (Replicate/HuggingFace)
4. [ ] Deploy to Vercel
5. [ ] (Optional) Configure webhooks for async generation

---

*Document Version: 1.0*
*Last Updated: February 2026*
