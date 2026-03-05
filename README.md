# Modern Portfolio & Admin Dashboard

A professional, high-performance portfolio website built with React, TypeScript, and Supabase. Features a real-time admin dashboard for content management, project filtering, and an integrated blog/article section.

<img width="1919" height="815" alt="Screenshot 2026-03-06 004729" src="https://github.com/user-attachments/assets/25d120d9-25ea-443b-a9ab-9cc2497e929e" />
<img width="1916" height="808" alt="Screenshot 2026-03-06 004709" src="https://github.com/user-attachments/assets/99386d13-8833-4210-bf65-e6a2037e5361" />
<img width="1919" height="812" alt="Screenshot 2026-03-06 004655" src="https://github.com/user-attachments/assets/8ac29957-2104-41fe-a8d7-217d1c5dca92" />
<img width="1918" height="808" alt="Screenshot 2026-03-06 004643" src="https://github.com/user-attachments/assets/402d9de7-9407-4a90-93ec-f179f3da0bf0" />
<img width="1918" height="812" alt="Screenshot 2026-03-06 004630" src="https://github.com/user-attachments/assets/c7163a8e-1f3d-4d33-b052-cf52d5a5f64b" />
<img width="1919" height="807" alt="Screenshot 2026-03-06 004614" src="https://github.com/user-attachments/assets/2b8a33b9-1491-42db-89a4-72f7d88e77bc" />
<img width="1910" height="809" alt="Screenshot 2026-03-06 004559" src="https://github.com/user-attachments/assets/4647f2e3-fa5c-4a34-8e78-3dd98694ce50" />
<img width="1911" height="816" alt="Screenshot 2026-03-06 004526" src="https://github.com/user-attachments/assets/56467009-12ab-48e0-a1d1-56dfadafc31c" />
<img width="1916" height="810" alt="Screenshot 2026-03-06 004454" src="https://github.com/user-attachments/assets/283abc9f-f022-4c16-b2f4-6cee22728660" />
<img width="1919" height="815" alt="Screenshot 2026-03-06 004743" src="https://github.com/user-attachments/assets/dfebfbfe-e7f0-4218-a1dd-ea7fe97236a6" />


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
   git clone https://github.com/augustdev290/augustdev290-portfolio-cms.git
   cd augustdev290-portfolio-cms
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
