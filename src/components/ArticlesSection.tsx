import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchArticles } from "../services/api";
import { Article } from "../constants";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

export const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    fetchArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => a.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter(a => a.tags?.includes(selectedTag));
  }, [selectedTag, articles]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = useMemo(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  }, [filteredArticles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  if (loading) return <div className="py-20 text-center font-mono text-white/20">Loading articles...</div>;

  return (
    <section id="articles" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="section-line">Articles</div>
      
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {currentArticles.map((article, index) => (
            <motion.div 
              key={article.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-card border border-white/10 rounded-3xl card-hover flex flex-col"
            >
              <Link to={`/article/${article.id}`} className="block flex-1">
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{article.title}</h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </Link>

              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags?.map(tag => (
                  <button 
                    key={tag}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedTag(tag);
                      document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${selectedTag === tag ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Link to={`/article/${article.id}`} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs flex items-center gap-2 hover:bg-white/10 transition-colors">
                  Read more
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              onClick={() => {
                setCurrentPage(page);
                document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
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
