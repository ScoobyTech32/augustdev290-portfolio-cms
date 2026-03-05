import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchProjects } from "../services/api";
import { Project } from "../constants";
import { ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  useEffect(() => {
    fetchProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter(p => p.tags.includes(selectedTag));
  }, [selectedTag, projects]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = useMemo(() => {
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    return filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [filteredProjects, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  if (loading) return <div className="py-20 text-center font-mono text-white/20">Loading projects...</div>;

  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="section-line">... /Projects ...</div>
      
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-white/40 mr-2 uppercase tracking-widest">Filter by:</span>
          <button 
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${!selectedTag ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${selectedTag === tag ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button 
              onClick={() => setSelectedTag(null)}
              className="p-1 text-white/40 hover:text-white transition-colors"
              title="Clear filter"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-32">
        <AnimatePresence mode="popLayout">
          {currentProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
            >
              <div className="flex-1 w-full">
                <Link to={`/project/${project.id}`} className="block relative aspect-video bg-card border border-white/10 rounded-3xl overflow-hidden group">
                  <img 
                    src={project.image || `https://picsum.photos/seed/${project.id}/1200/800`} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-6 right-6 p-3 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={20} />
                  </div>
                </Link>
              </div>

              <div className="flex-1">
                <Link to={`/project/${project.id}`} className="inline-block group">
                  <h3 className="text-3xl font-bold mb-6 group-hover:text-white/80 transition-colors">{project.title}</h3>
                </Link>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-3 py-1 border rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${selectedTag === tag ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <p className="text-white/60 leading-relaxed mb-8">
                  {project.description}
                </p>

                <div className="flex items-center gap-4">
                   <Link to={`/project/${project.id}`} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                      <ExternalLink size={18} />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-20 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              onClick={() => {
                setCurrentPage(page);
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${currentPage === page ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
