# 🤖 Autonomix

Autonomix is a powerful full-stack platform designed for building, managing, and executing autonomous AI agents. The platform features a responsive Next.js frontend and a robust Node.js/Express backend, integrated with Google's Generative AI, Chroma vector database for long-term memory, and robust asset management.

---

## ✨ Features

- **Agent Builder Interface**  
  A dedicated workspace to create, configure, and manage autonomous AI agents.

- **Advanced AI Capabilities**  
  Powered by Google Generative AI (Gemini) via Langchain integration.

- **Vector Memory**  
  Utilizes Chroma DB for agent memory, enabling context-aware operations and RAG (Retrieval-Augmented Generation).

- **Web Research**  
  Integrated with Tavily for autonomous web searching and fact-finding.

- **Asset Management**  
  Automatic media handling and storage via Cloudinary.

- **Secure Authentication**  
  User authentication flow seamlessly handled by Next-Auth and Google OAuth.

- **Document Processing**  
  PDF generation and file processing capabilities using PDFKit.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)  
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React  
- **State Management**: Zustand, React Query  
- **Authentication**: Next-Auth  

### Backend
- **Framework**: Node.js with Express  
- **Database ORM**: Prisma (PostgreSQL)  
- **AI & LLM**: `@langchain/google-genai`, `@langchain/core`  
- **Vector Database**: Chroma DB  

### Utilities
- Nodemailer (Email)  
- PDFKit (Document generation)  
- Cloudinary (Images/Assets)  

---

## 🚀 Getting Started

### 📌 Prerequisites

Before running the project locally, ensure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- API Keys for:
  - Google Gemini
  - Google OAuth
  - Cloudinary
  - Tavily
  - Chroma DB

---

## ⚙️ Backend Setup

```bash
cd backend
npm install

Create .env file in backend:

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/Autonomix?schema=public"

# AI integration
GOOGLE_API_KEY="your_google_api_key_here"
TAVILY_API_KEY="your_tavily_api_key_here"

# Vector Memory
CHROMA_API_KEY="your_chroma_api_key_here"
CHROMA_TENANT="your_chroma_tenant_id"
CHROMA_DB_NAME="Autonomix"

# Asset Management
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Email Service
MAIL_HOST="smtp.gmail.com"
MAIL_USER="your_email@gmail.com"
MAIL_PASS="your_app_password"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:4000/auth/google/callback"
GOOGLE_REFRESH_TOKEN="your_google_refresh_token"


Run Backend

npx prisma db push
npm run dev

🎨 Frontend Setup

cd frontend
npm install

Create .env file in frontend:

NEXT_PUBLIC_BASE_URL="http://localhost:4000/api"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_key"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

Run Frontend

npm run dev

---`
Open 👉 http://localhost:3000

📄 License

This project is licensed under:

Backend: ISC License
Frontend: Private


---

If you want, I can also:
- 🔥 Add **GitHub badges (stars, forks, tech stack icons)**
- 📸 Add **screenshots section**
- 🚀 Make it **top 1% README (very attractive for recruiters)**