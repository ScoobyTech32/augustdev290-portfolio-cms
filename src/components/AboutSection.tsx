import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchSettings, fetchSkills } from "../services/api";

export const AboutSection = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ 
    bio: "Hello! I'm augustdev290, I'm a full-stack developer. More than 5 years experience." 
  });

  useEffect(() => {
    fetchSettings("about").then(data => {
      if (data) setSettings(data);
    });
    fetchSkills().then(data => {
      if (data) setSkills(data);
    });
  }, []);

  const filteredSkills = filter 
    ? skills.filter(s => s.category === filter)
    : skills;

  return (
    <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="section-line">... /About me ...</div>
      
      <div className="flex flex-col md:flex-row gap-16 items-start">
        <div className="flex-1">
          <p className="text-2xl leading-relaxed mb-8">
            {settings.bio}
          </p>

          <div className="mb-12">
            <a 
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-colors"
            >
              View Projects
              <div className="bg-black text-white rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button 
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${!filter ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
            >
              All
            </button>
            {skills.map(s => (
              <button 
                key={s.category}
                onClick={() => setFilter(s.category)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${filter === s.category ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
              >
                {s.category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div 
                  key={skill.id || skill.category}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-8 bg-card border border-white/10 rounded-3xl"
                >
                   <h4 className="text-white/40 font-mono text-xs uppercase mb-4">{skill.category}</h4>
                   <p className="text-sm text-white/60 leading-relaxed font-mono">
                     {Array.isArray(skill.items) ? skill.items.join(" / ") : skill.items}
                   </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-[320px] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
        >
          <img 
            src="https://picsum.photos/seed/nikita/600/800" 
            alt="Nikita" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
};
