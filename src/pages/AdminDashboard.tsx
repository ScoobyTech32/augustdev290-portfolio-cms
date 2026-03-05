import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  fetchProjects, 
  fetchArticles, 
  saveProject, 
  deleteProject, 
  saveArticle, 
  deleteArticle,
  fetchSettings,
  saveSettings,
  fetchSkills,
  saveSkill,
  deleteSkill,
  fetchExperience,
  saveExperience,
  deleteExperience,
  fetchSocials,
  saveSocial,
  deleteSocial,
  createNotification
} from "../services/api";
import { Project, Article } from "../constants";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  User, 
  Phone, 
  Home,
  LogOut,
  ChevronRight,
  Settings,
  Menu,
  Terminal,
  History,
  Share2,
  ArrowLeft
} from "lucide-react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

type Tab = "hero" | "about" | "projects" | "articles" | "contact" | "skills" | "experience" | "socials";

export const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [heroSettings, setHeroSettings] = useState<any>({ title: "", subtitle: "" });
  const [aboutSettings, setAboutSettings] = useState<any>({ bio: "", skills: [], totalExperience: "" });
  const [contactSettings, setContactSettings] = useState<any>({ email: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  // --- Data Loading ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [p, a, h, ab, c, sk, ex, so] = await Promise.all([
        fetchProjects(), 
        fetchArticles(),
        fetchSettings("hero"),
        fetchSettings("about"),
        fetchSettings("contact"),
        fetchSkills(),
        fetchExperience(),
        fetchSocials()
      ]);
      setProjects(p);
      setArticles(a);
      if (h) setHeroSettings(h);
      if (ab) setAboutSettings(ab);
      if (c) setContactSettings(c);
      setSkills(sk);
      setExperience(ex);
      setSocials(so);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth Handlers ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- CRUD Handlers ---
  const handleSaveSettings = async (key: string, value: any) => {
    setLoading(true);
    try {
      await saveSettings(key, value);
      await createNotification(`${key.charAt(0).toUpperCase() + key.slice(1)} settings updated`);
      showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} settings saved!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveProject(editingItem);
      await createNotification(`Project "${editingItem.title}" saved`);
      showToast('Project saved successfully!', 'success');
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      console.error("Save Project Error:", err);
      showToast(`Failed to save project: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveArticle(editingItem);
      await createNotification(`Article "${editingItem.title}" published`);
      showToast('Article saved successfully!', 'success');
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      console.error("Save Article Error:", err);
      showToast(`Failed to save article: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveSkill(editingItem);
      await createNotification(`Skill category "${editingItem.category}" updated`);
      showToast('Skill saved successfully!', 'success');
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      showToast(`Failed to save skill: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveExperience(editingItem);
      await createNotification(`Experience at "${editingItem.company}" updated`);
      showToast('Experience saved successfully!', 'success');
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      showToast(`Failed to save experience: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveSocial(editingItem);
      await createNotification(`Social link "${editingItem.name}" updated`);
      showToast('Social link saved successfully!', 'success');
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      showToast(`Failed to save social: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteProject(id);
        showToast('Project deleted', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to delete project', 'error');
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteArticle(id);
        showToast('Article deleted', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to delete article', 'error');
      }
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteSkill(id);
        showToast('Skill deleted', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to delete skill', 'error');
      }
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteExperience(id);
        showToast('Experience deleted', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to delete experience', 'error');
      }
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteSocial(id);
        showToast('Social link deleted', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to delete social', 'error');
      }
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-bg text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-bg/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <span className="font-bold">Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`w-64 border-r border-white/10 p-6 flex flex-col fixed h-full z-[70] bg-bg lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            <div className="flex items-center gap-3 mb-12 px-2">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">Admin</h1>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Dashboard</span>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <SidebarItem id="hero" icon={Home} label="Hero Section" />
              <SidebarItem id="about" icon={User} label="About Me" />
              <SidebarItem id="skills" icon={Terminal} label="Skills" />
              <SidebarItem id="experience" icon={History} label="Experience" />
              <SidebarItem id="projects" icon={Briefcase} label="Projects" />
              <SidebarItem id="articles" icon={FileText} label="Articles" />
              <SidebarItem id="socials" icon={Share2} label="Social Links" />
              <SidebarItem id="contact" icon={Phone} label="Contact Info" />
            </nav>

            <div className="mt-auto space-y-2">
              <Link 
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft size={18} />
                Back to Website
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 pt-24 lg:pt-12">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold capitalize">{activeTab} Management</h2>
            <p className="text-white/40 mt-1">Update and manage your {activeTab} content</p>
          </div>
          {loading && <div className="text-xs font-mono text-white/20 animate-pulse">Syncing...</div>}
        </header>

        <div className="max-w-4xl">
          {activeTab === "hero" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-card border border-white/10 rounded-3xl p-8 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Hero Title</label>
                  <input 
                    type="text" 
                    value={heroSettings.title}
                    onChange={e => setHeroSettings({...heroSettings, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Hero Subtitle</label>
                  <textarea 
                    value={heroSettings.subtitle}
                    onChange={e => setHeroSettings({...heroSettings, subtitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-32"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">About Me (Bio)</label>
                  <textarea 
                    value={aboutSettings.bio}
                    onChange={e => {
                      const newBio = e.target.value;
                      setAboutSettings({...aboutSettings, bio: newBio});
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-32"
                  />
                </div>
                <button 
                  onClick={async () => {
                    await handleSaveSettings("hero", heroSettings);
                    await handleSaveSettings("about", aboutSettings);
                  }}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                  Save Hero & About Settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-card border border-white/10 rounded-3xl p-8 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Total Experience (e.g. 4 years 9 months)</label>
                  <input 
                    type="text" 
                    value={aboutSettings.totalExperience || ""}
                    onChange={e => setAboutSettings({...aboutSettings, totalExperience: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Bio / Introduction</label>
                  <textarea 
                    value={aboutSettings.bio}
                    onChange={e => setAboutSettings({...aboutSettings, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-64"
                  />
                </div>
                <button 
                  onClick={() => handleSaveSettings("about", aboutSettings)}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                  Save About Settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Project List</h3>
                <button 
                  onClick={() => setEditingItem({ id: `p-${Date.now()}`, title: "", description: "", tags: [], techStack: [] })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="p-6 bg-card border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg">{p.title}</h4>
                      <p className="text-white/40 text-sm">{p.description}</p>
                    </div>
                    <div className="flex gap-2 transition-opacity">
                      <button onClick={() => setEditingItem(p)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteProject(p.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Article List</h3>
                <button 
                  onClick={() => setEditingItem({ id: `a-${Date.now()}`, title: "", description: "", tags: [], author: "augustdev290", date: new Date().toLocaleDateString() })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus size={16} /> Add Article
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {articles.map(a => (
                  <div key={a.id} className="p-6 bg-card border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg">{a.title}</h4>
                      <p className="text-white/40 text-sm">{a.description}</p>
                    </div>
                    <div className="flex gap-2 transition-opacity">
                      <button onClick={() => setEditingItem(a)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteArticle(a.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Skill Categories</h3>
                <button 
                  onClick={() => setEditingItem({ category: "", items: [] })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus size={16} /> Add Skills
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {skills.map(s => (
                  <div key={s.id} className="p-6 bg-card border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg">{s.category}</h4>
                      <p className="text-white/40 text-sm">{s.items.join(" / ")}</p>
                    </div>
                    <div className="flex gap-2 transition-opacity">
                      <button onClick={() => setEditingItem(s)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteSkill(s.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Work Experience</h3>
                <button 
                  onClick={() => setEditingItem({ company: "", role: "", period: "", duration: "", description: "" })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {experience.map(e => (
                  <div key={e.id} className="p-6 bg-card border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg">{e.company}</h4>
                      <p className="text-white/40 text-sm">{e.role} • {e.period}</p>
                    </div>
                    <div className="flex gap-2 transition-opacity">
                      <button onClick={() => setEditingItem(e)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteExperience(e.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Social Links</h3>
                <button 
                  onClick={() => setEditingItem({ name: "", url: "", icon_name: "" })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  <Plus size={16} /> Add Social
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {socials.map(s => (
                  <div key={s.id} className="p-6 bg-card border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg">{s.name}</h4>
                      <p className="text-white/40 text-sm">{s.url}</p>
                    </div>
                    <div className="flex gap-2 transition-opacity">
                      <button onClick={() => setEditingItem(s)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteSocial(s.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-card border border-white/10 rounded-3xl p-8 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={contactSettings.email}
                    onChange={e => setContactSettings({...contactSettings, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={contactSettings.phone}
                    onChange={e => setContactSettings({...contactSettings, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={contactSettings.location}
                    onChange={e => setContactSettings({...contactSettings, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                  />
                </div>
                <button 
                  onClick={() => handleSaveSettings("contact", contactSettings)}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                  Save Contact Settings
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Edit Modal for Projects/Articles */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold capitalize">
                Edit {activeTab === "experience" ? "Experience" : activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab}
              </h2>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form 
              onSubmit={(e) => {
                if (activeTab === "projects") handleSaveProject(e);
                else if (activeTab === "articles") handleSaveArticle(e);
                else if (activeTab === "skills") handleSaveSkill(e);
                else if (activeTab === "experience") handleSaveExperience(e);
                else if (activeTab === "socials") handleSaveSocial(e);
              }} 
              className="space-y-6"
            >
              {activeTab !== "skills" && activeTab !== "experience" && activeTab !== "socials" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Title</label>
                    <input 
                      type="text" 
                      value={editingItem.title} 
                      onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Image URL</label>
                    <input 
                      type="text" 
                      value={editingItem.image || ""} 
                      onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="https://picsum.photos/seed/project/800/600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Description</label>
                    <textarea 
                      value={editingItem.description} 
                      onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-24"
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === "skills" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Category Name</label>
                    <input 
                      type="text" 
                      value={editingItem.category} 
                      onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="e.g. FRONT-END"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Skills (comma separated)</label>
                    <textarea 
                      value={editingItem.items.join(", ")} 
                      onChange={e => setEditingItem({...editingItem, items: e.target.value.split(",").map(s => s.trim())})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-32"
                      placeholder="React, Vue, TypeScript..."
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === "experience" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Company</label>
                    <input 
                      type="text" 
                      value={editingItem.company} 
                      onChange={e => setEditingItem({...editingItem, company: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Role</label>
                    <input 
                      type="text" 
                      value={editingItem.role} 
                      onChange={e => setEditingItem({...editingItem, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Period</label>
                      <input 
                        type="text" 
                        value={editingItem.period} 
                        onChange={e => setEditingItem({...editingItem, period: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                        placeholder="2022 - Present"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Duration</label>
                      <input 
                        type="text" 
                        value={editingItem.duration} 
                        onChange={e => setEditingItem({...editingItem, duration: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                        placeholder="1 year 5 months"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Description / Tech</label>
                    <input 
                      type="text" 
                      value={editingItem.description} 
                      onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="React & Vue"
                    />
                  </div>
                </>
              )}

              {activeTab === "socials" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      value={editingItem.name} 
                      onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">URL</label>
                    <input 
                      type="text" 
                      value={editingItem.url} 
                      onChange={e => setEditingItem({...editingItem, url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Icon Name (Lucide)</label>
                    <input 
                      type="text" 
                      value={editingItem.icon_name} 
                      onChange={e => setEditingItem({...editingItem, icon_name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="Github, Linkedin, etc."
                    />
                  </div>
                </>
              )}
              
              {activeTab === "projects" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Long Description / Content</label>
                    <textarea 
                      value={editingItem.longDescription || ""} 
                      onChange={e => setEditingItem({...editingItem, longDescription: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-48"
                      placeholder="Detailed project information..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Features (one per line)</label>
                    <textarea 
                      value={Array.isArray(editingItem.features) ? editingItem.features.join('\n') : (editingItem.features || "")} 
                      onChange={e => setEditingItem({...editingItem, features: e.target.value.split('\n')})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-32"
                      placeholder="Feature 1&#10;Feature 2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingItem.tags.join(", ")} 
                      onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(",").map(s => s.trim())})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Project Link</label>
                    <input 
                      type="text" 
                      value={editingItem.link || ""} 
                      onChange={e => setEditingItem({...editingItem, link: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </>
              )}

              {activeTab === "articles" && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Content (Markdown)</label>
                    <textarea 
                      value={editingItem.content || ""} 
                      onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 h-64"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingItem.tags?.join(", ") || ""} 
                      onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(",").map(s => s.trim())})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                  <Save size={18} /> Save Changes
                </button>
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
