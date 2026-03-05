import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { fetchSettings, fetchSocials } from "../services/api";
import * as LucideIcons from "lucide-react";

export const Hero = () => {
  const [socials, setSocials] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ 
    title: "Full-stack Developer", 
    subtitle: "My goal is to write maintainable, clean and understandable code to process development was enjoyable." 
  });

  useEffect(() => {
    fetchSettings("hero").then(data => {
      if (data) setSettings(data);
    });
    fetchSocials().then(data => {
      if (data) setSocials(data);
    });
  }, []);

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Share2;
    return <Icon size={16} className="group-hover:scale-110 transition-transform" />;
  };

  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-8"
          >
            {settings.title.split(' ').map((word: string, i: number) => (
              <React.Fragment key={i}>
                {i === 1 ? <><br /><span className="text-white/40 italic font-serif">{word}</span></> : word + ' '}
              </React.Fragment>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-md mb-10 leading-relaxed"
          >
            {settings.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-12"
          >
            <a href="#projects" className="bg-white text-black px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
              Projects
              <div className="bg-black text-white rounded-full p-1">
                <ArrowRight size={16} />
              </div>
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {socials.slice(0, 5).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
              >
                {getIcon(social.icon_name)}
                {social.name}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-[400px] aspect-square relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
          <div className="relative h-full w-full bg-card border border-white/10 rounded-3xl overflow-hidden">
             <img 
               src="https://picsum.photos/seed/tech/800/800" 
               alt="Featured" 
               className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
               referrerPolicy="no-referrer"
             />
             <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-xl font-bold mb-2">The simplest example is kafka + golang</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.</p>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white/20 transition-colors">
                  Read more
                  <ArrowRight size={14} />
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
