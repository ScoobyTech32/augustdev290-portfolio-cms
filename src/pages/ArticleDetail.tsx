import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { fetchArticles } from "../services/api";
import { Article } from "../constants";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

export const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles().then(data => {
      const a = data.find(item => item.id === id);
      setArticle(a || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-white/20">Loading article...</div>;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <Link to="/" className="text-white/60 hover:text-white flex items-center gap-2 justify-center">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 px-6 max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors">
        <ArrowLeft size={16} />
        Back to articles
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">{article.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 font-mono mb-8">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {article.date}
          </div>
          <div className="flex items-center gap-2">
            <User size={14} />
            {article.author}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} />
            {article.readTime}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.tags?.map((tag) => (
            <Link 
              key={tag} 
              to={`/#articles`}
              className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono uppercase tracking-wider text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="aspect-[21/9] w-full bg-card border border-white/10 rounded-3xl overflow-hidden mb-12">
        <img 
          src={`https://picsum.photos/seed/article-${article.id}/1200/600`} 
          alt={article.title}
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="text-white/60 leading-relaxed text-lg whitespace-pre-wrap">
          {article.content || article.description}
        </div>
      </div>

      <footer className="mt-20 pt-12 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 overflow-hidden">
               <img src="https://picsum.photos/seed/nikita/100/100" alt="Author" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-sm font-bold">{article.author}</p>
              <p className="text-xs text-white/40">Full-stack Developer</p>
            </div>
          </div>
          
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors">
            Share Article
          </button>
        </div>
      </footer>
    </motion.article>
  );
};
