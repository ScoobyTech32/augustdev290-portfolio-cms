import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchExperience, fetchSettings } from "../services/api";

export const WorkSection = () => {
  const [experience, setExperience] = useState<any[]>([]);
  const [totalExp, setTotalExp] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [exp, about] = await Promise.all([
        fetchExperience(),
        fetchSettings("about")
      ]);
      setExperience(exp);
      if (about?.totalExperience) setTotalExp(about.totalExperience);
    };
    loadData();
  }, []);

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-4xl font-bold mb-4">Work</h2>
          <div className="text-white/40 font-mono text-sm">
            Work experience <br />
            <span className="text-white">{totalExp || "4 years 9 months"}</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-8">
          {experience.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-8 group"
            >
              <div className="w-32 flex-shrink-0">
                <div className="text-white/40 font-mono text-xs mb-1">{exp.period}</div>
                <div className="text-white/20 text-[10px] uppercase tracking-tighter">{exp.duration}</div>
              </div>
              <div className="flex-1 pb-8 border-b border-white/5 group-last:border-0">
                <h3 className="text-lg font-bold mb-1">{exp.company}</h3>
                <p className="text-white/60 text-sm mb-2">{exp.role}</p>
                {exp.description && (
                  <div className="text-white/40 text-xs font-mono">{exp.description}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
