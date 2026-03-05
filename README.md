# Modern Portfolio & Admin Dashboard

A professional, high-performance portfolio website built with React, TypeScript, and Supabase. Features a real-time admin dashboard for content management, project filtering, and an integrated blog/article section.

## 🚀 Project Overview

This project is a complete solution for developers to showcase their work. It includes a beautiful, responsive frontend and a secure admin panel to manage all aspects of the portfolio without touching the code.

### ✨ Features

- **Dynamic Content**: Manage Hero, About, Skills, Experience, Projects, and Articles from the Admin Dashboard.
- **Real-time Notifications**: Get instant updates when content is modified via Supabase Realtime.
- **Project Filtering**: Filter projects by technology tags with smooth animations.
- **Pagination**: Optimized loading for Projects and Articles sections.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Secure Admin**: Protected dashboard using Supabase Authentication.
- **Contact Integration**: Managed contact information and social links.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Icons**: Lucide React
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Routing**: React Router 6

## 📦 Installation / Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Run the following SQL in your Supabase SQL Editor to create the necessary tables:
   - `projects`
   - `articles`
   - `skills`
   - `experience`
   - `socials`
   - `settings`
   - `notifications`

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🚀 Usage

- **Frontend**: Accessible at `http://localhost:3000`
- **Admin Dashboard**: Accessible at `http://localhost:3000/admin`
- **Login**: Use your Supabase Auth credentials to access the dashboard.

## 👨‍💻 Author

**Augustdev290**
- GitHub: [@Augustdev290](https://github.com/Augustdev290)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
