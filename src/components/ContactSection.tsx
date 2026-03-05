import React, { useState, useEffect } from "react";
import { fetchSettings, fetchSocials } from "../services/api";
import * as LucideIcons from "lucide-react";

export const ContactSection = () => {
  const [socials, setSocials] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ 
    email: "augustdev290@example.com", 
    phone: "+1 234 567 890", 
    location: "Global" 
  });

  useEffect(() => {
    fetchSettings("contact").then(data => {
      if (data) setSettings(data);
    });
    fetchSocials().then(data => {
      if (data) setSocials(data);
    });
  }, []);

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Share2;
    return <Icon size={18} className="text-white/40 group-hover:text-white transition-colors" />;
  };

  return (
    <footer id="contact" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="section-line">... /Contacts ...</div>
      
      <div className="flex flex-col md:flex-row justify-between gap-16 mb-20">
        <div className="space-y-8">
          <div className="flex gap-8 text-xs font-mono uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-white transition-colors">Main</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#articles" className="hover:text-white transition-colors">Articles</a>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold">Contact Details</h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Email: {settings.email} <br />
              Phone: {settings.phone} <br />
              Location: {settings.location}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-6xl md:text-8xl font-bold mb-4">august</h2>
          <h2 className="text-6xl md:text-8xl font-bold text-white/20 italic font-serif">dev290</h2>
          <p className="text-white/40 font-mono text-sm mt-4">Full-stack developer</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              {getIcon(social.icon_name)}
              <span className="text-sm font-medium">{social.name}</span>
            </div>
          </a>
        ))}
      </div>
    </footer>
  );
};
