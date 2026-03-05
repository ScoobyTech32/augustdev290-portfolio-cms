import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { fetchProjects } from "../services/api";
import { Project } from "../constants";
import { ArrowLeft, ExternalLink, CheckCircle2, Share2, Check } from "lucide-react";

export const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProjects().then(data => {
      const p = data.find(item => item.id === id);
      setProject(p || null);
      setLoading(false);
    });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-white/20">Loading project...</div>;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link to="/" className="text-white/60 hover:text-white flex items-center gap-2 justify-center">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 px-6 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to projects
        </Link>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <Link 
              key={tag} 
              to={`/#projects`}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="aspect-video w-full bg-card border border-white/10 rounded-3xl overflow-hidden mb-12">
        <img 
          src={`https://picsum.photos/seed/${project.id}/1200/800`} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              {project.longDescription || project.description}
            </p>
          </section>

          {project.features && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <div className="space-y-4">
                {project.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-white/60">
                    <CheckCircle2 size={20} className="text-white mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.techStack && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.techStack.map((stack, i) => (
                  <div key={i} className="p-6 bg-card border border-white/10 rounded-2xl">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">{stack.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {stack.items.map((item) => (
                        <span key={item} className="text-sm text-white/80">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <a 
            href={project.link}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors"
          >
            Launch Project
            <ExternalLink size={18} />
          </a>

          <div className="p-6 bg-card border border-white/10 rounded-2xl">
            <h3 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-4">Project Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Role</span>
                <span>Lead Developer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Year</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
