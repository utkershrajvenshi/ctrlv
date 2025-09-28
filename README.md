# CtrlV - Modern Clipboard Sharing Application

A modern, real-time clipboard sharing application built with React, TypeScript, and Supabase. CtrlV allows users to create temporary boards for sharing text clips and files with markdown support, perfect for team collaboration and cross-device content sharing.

## 🚀 Features

### Core Functionality

- **Real-time Clipboard Boards**: Create temporary boards with unique access codes

- **Markdown Support**: Rich text editing with live preview for clips

- **File Attachments**: Upload and share files up to 1MB (images, PDFs, documents)

- **Cross-device Sharing**: Access boards from any device using QR codes or shareable links

### User Management

- **Authentication**: Secure user registration and login via Supabase Auth

- **Private & Public Boards**: Create private boards (authenticated users only) or public boards

- **Permission System**: Read-only access for non-owners of private boards

### User Experience

- **Responsive Design**: Mobile-first design with adaptive layouts

- **Dark/Light Themes**: Clean UI with TailwindCSS

- **Component Library**: Built with shadcn/ui components

- **Real-time Updates**: Live synchronization using Supabase realtime subscriptions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite

- **Styling**: TailwindCSS, shadcn/ui, Radix UI primitives

- **Backend**: Supabase (Database, Auth, Storage, Realtime)

- **State Management**: TanStack Query (React Query)

- **Routing**: React Router DOM

- **Development**: Storybook for component development

- **Package Manager**: Yarn (v4.3.0)

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)

- Yarn package manager

- Supabase account and project

### Setup

1. **Clone the repository**

```bash

git clone https://github.com/utkershrajvenshi/ctrlv.git

cd ctrlv

```

2. **Install dependencies**

```bash

corepack enable

yarn install

```

3. **Environment Configuration**

Copy the example environment files:

```bash

cp .env.supabase.example .env

```

Update `.env` with your Supabase credentials:

```env

PROJECT_URL=your_supabase_project_url

PROJECT_API_KEY=your_supabase_anon_key

```

4. **Database Setup**

Create the following tables in your Supabase database:

**ctrlv-main** (Boards table):

```sql

CREATE TABLE "ctrlv-main" (

access_code TEXT PRIMARY KEY,

clipboard_name TEXT NOT NULL,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),

clips TEXT[],

owner_id UUID REFERENCES auth.users(id),

owner_email TEXT,

is_public BOOLEAN DEFAULT true

);

```

**ctrlv-clips** (Clips table):

```sql

CREATE TABLE "ctrlv-clips" (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

text_content TEXT,

title TEXT,

attachment_path TEXT,

attachment_name TEXT,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

belongs_to TEXT REFERENCES "ctrlv-main"(access_code) ON DELETE CASCADE

);

```

5. **Storage Setup**

Create a storage bucket named `public-attachments` in your Supabase dashboard with public access.

6. **Start Development Server**

```bash

yarn dev

```

The application will be available at `http://localhost:5000`

## 📖 Usage

### Creating a Board

1. Enter a board name and click "Create a Board"

2. Choose between public (accessible to anyone) or private (requires authentication)

3. Share the generated access code or QR code with collaborators

### Adding Clips

1. Click the "Add a Clip" card

2. Write content using markdown syntax

3. Optionally attach files (max 1MB)

4. Click "Create" to save

### Accessing Boards

- Enter an access code in the header input field

- Scan a QR code from the share dialog

- Use a direct shareable link

### Markdown Features

- **Bold**: `**text**`

- **Italic**: `*text*`

- **Code**: `` `code` ``

- **Links**: `[text](url)`

- **Headers**: `# Header 1`, `## Header 2`

- **Code blocks**: ``` ```code``` ```

## 🧩 Project Structure

```

src/

├── components/

│ ├── library/ # Custom components

│ │ ├── Auth/ # Authentication components

│ │ ├── ClipCard/ # Clip display and management

│ │ ├── MarkdownEditor/ # Rich text editor

│ │ └── ...

│ └── ui/ # shadcn/ui components

├── pages/

│ ├── Home/ # Landing page

│ └── Overview/ # Board management page

├── lib/ # Utility functions

├── stories/ # Storybook stories

└── context.ts # Supabase configuration

```

## 🔧 Available Scripts

- `yarn dev` - Start development server

- `yarn dev:expose` - Start development server with network exposure

- `yarn build` - Build for production

- `yarn preview` - Preview production build

- `yarn lint` - Run ESLint

- `yarn storybook` - Start Storybook development server

- `yarn build-storybook` - Build Storybook

## 🌟 Key Features Explained

### Real-time Synchronization

CtrlV uses Supabase's real-time subscriptions to automatically sync changes across all connected clients when clips are added, modified, or deleted.

### Privacy Controls

- **Public Boards**: Accessible by anyone with the access code

- **Private Boards**: Only visible to the authenticated owner

- **Read-only Access**: Non-owners can view but cannot edit private boards

### File Management

- Supports images, PDFs, and documents up to 1MB

- Files are stored in Supabase Storage with organized paths

- Automatic cleanup when clips or boards are deleted

### Responsive Design

- Mobile-first approach with breakpoint-specific layouts

- Resizable panels on desktop for optimal space usage

- Touch-friendly interfaces on mobile devices

## 🚀 Deployment

### Environment Setup

For production deployment, ensure these environment variables are set:

- `PROJECT_URL`: Your Supabase project URL

- `PROJECT_API_KEY`: Your Supabase anonymous key

### Build Process

```bash

yarn build

```

The build output will be in the `dist` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository

2. Create a feature branch: `git checkout -b feature/amazing-feature`

3. Commit your changes: `git commit -m 'Add amazing feature'`

4. Push to the branch: `git push origin feature/amazing-feature`

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Utkersh Rajvenshi**

- GitHub: [@utkershrajvenshi](https://github.com/utkershrajvenshi)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development

- UI components from [shadcn/ui](https://ui.shadcn.com/)

- Backend services by [Supabase](https://supabase.com/)

- Styled with [TailwindCSS](https://tailwindcss.com/)

---

**CtrlV** - Making clipboard sharing simple, secure, and collaborative! 🚀