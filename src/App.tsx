import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { WorkSection } from "./components/WorkSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { AboutSection } from "./components/AboutSection";
import { ArticlesSection } from "./components/ArticlesSection";
import { ContactSection } from "./components/ContactSection";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ArticleDetail } from "./pages/ArticleDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { motion } from "motion/react";
import { supabase } from "./services/supabase";
import { Navigate } from "react-router-dom";
import { ToastProvider, useToast } from "./components/Toast";

const RealtimeNotifications = () => {
  const { showToast } = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channels = [
      supabase.channel('projects-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload: any) => {
        const title = payload.new?.title || payload.old?.title || 'Project';
        if (payload.eventType === 'INSERT') showToast(`New project added: ${title}`, 'info');
        if (payload.eventType === 'UPDATE') showToast(`Project updated: ${title}`, 'info');
        if (payload.eventType === 'DELETE') showToast(`Project deleted: ${title}`, 'info');
      }).subscribe(),
      
      supabase.channel('articles-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, (payload: any) => {
        const title = payload.new?.title || payload.old?.title || 'Article';
        if (payload.eventType === 'INSERT') showToast(`New article published: ${title}`, 'info');
        if (payload.eventType === 'UPDATE') showToast(`Article updated: ${title}`, 'info');
        if (payload.eventType === 'DELETE') showToast(`Article deleted: ${title}`, 'info');
      }).subscribe(),
      
      supabase.channel('settings-changes').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload: any) => {
        showToast(`Site settings updated: ${payload.new.key}`, 'info');
      }).subscribe(),

      supabase.channel('skills-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        showToast(`Skills updated`, 'info');
      }).subscribe(),

      supabase.channel('experience-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'experience' }, () => {
        showToast(`Experience updated`, 'info');
      }).subscribe(),

      supabase.channel('socials-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'socials' }, () => {
        showToast(`Social links updated`, 'info');
      }).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [showToast]);

  return null;
};

const isSupabaseConfigured = !!(import.meta as any).env.VITE_SUPABASE_URL && !!(import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const ConfigurationWarning = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg p-6">
    <div className="max-w-md w-full bg-card border border-white/10 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Configuration Required</h2>
      <p className="text-white/60 mb-8 leading-relaxed">
        Please set <code className="text-white bg-white/10 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="text-white bg-white/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in the Secrets panel to enable the backend features.
      </p>
      <div className="text-xs font-mono text-white/20 uppercase tracking-widest">
        Check .env.example for details
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) return null;
  if (!isSupabaseConfigured || !session) return <Navigate to="/login" />;
  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <main>
    <Hero />
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <WorkSection />
      <AboutSection />
      <ProjectsSection />
      <ArticlesSection />
      <ContactSection />
    </motion.div>
  </main>
);

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || 
                     location.pathname === '/login' || 
                     location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-bg selection:bg-white selection:text-black">
      {!hideNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square bg-white/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default function App() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    // Listen for auth changes globally
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // If we just signed in (e.g. via email link or signup redirect)
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Clean up the URL hash if it contains auth tokens
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=signup'))) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <Router>
        <ConfigurationWarning />
      </Router>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <RealtimeNotifications />
        <AppContent />
      </Router>
    </ToastProvider>
  );
}
