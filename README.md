# Product Image Generator API

Express.js backend that generates product images from text descriptions using AI.

## Features

- **Prompt Optimization**: Automatically enhances product descriptions into AI-optimized prompts
- **AI Image Generation**: Uses Replicate's SDXL model for high-quality image generation
- **Local Storage**: Generated images are stored locally and served via static files
- **Multiple Styles**: Support for various image styles (studio, lifestyle, minimal, etc.)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Replicate API token:
- Get your token from: https://replicate.com/account

### 3. Run the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will run at `http://localhost:3000`

## API Endpoint

### POST /api/generate

Generate product images from a description.

**Request Body:**

```json
{
  "description": "Red leather handbag with gold clasps",
  "category": "accessories",
  "style": "studio",
  "settings": {
    "numImages": 2,
    "resolution": "1024x1024"
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | Product description |
| `category` | string | No | Product category (see below) |
| `style` | string | No | Image style (see below) |
| `settings.numImages` | number | No | Number of images (1-4, default: 1) |
| `settings.resolution` | string | No | Image resolution (default: 1024x1024) |

**Categories:**
- `shoes`, `clothing`, `electronics`, `accessories`, `furniture`, `food`, `beauty`, `sports`, `other`

**Styles:**
- `studio` - Clean studio photography
- `lifestyle` - Product in use/context
- `white_background` - E-commerce style
- `minimal` - Minimalist aesthetic
- `luxury` - Premium/high-end look
- `flat_lay` - Top-down view

**Response:**

```json
{
  "success": true,
  "images": [
    {
      "url": "/generated/img_1707408000000_abc123_0.png",
      "filename": "img_1707408000000_abc123_0.png"
    }
  ],
  "prompt": "Professional product photography of red leather handbag...",
  "negativePrompt": "blurry, distorted, low quality...",
  "processingTime": 45000
}
```

## Example Usage

```bash
# Generate a single image
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Blue running shoes with white soles"}'

# Generate multiple images with settings
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Vintage leather wallet",
    "category": "accessories",
    "style": "luxury",
    "settings": {
      "numImages": 4,
      "resolution": "1024x1024"
    }
  }'
```

## Project Structure

```
product-image-generator/
├── src/
│   ├── server.ts              # Express server entry point
│   ├── types.ts               # TypeScript type definitions
│   ├── routes/
│   │   └── generate.ts        # Generation API route
│   └── lib/
│       ├── prompt-optimizer.ts # Prompt optimization logic
│       ├── ai-provider.ts      # Replicate API integration
│       └── image-storage.ts    # Local image storage
├── public/
│   └── generated/             # Generated images stored here
├── package.json
├── tsconfig.json
└── .env.example
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Provider**: Replicate (SDXL model)

## License

MIT
