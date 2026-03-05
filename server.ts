import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    longDescription TEXT,
    tags TEXT,
    link TEXT,
    features TEXT,
    techStack TEXT
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    date TEXT,
    author TEXT,
    readTime TEXT,
    tags TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0
  );
`);

// Seed initial data if empty
const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as any;
if (projectsCount.count === 0) {
  const initialProjects = [
    {
      id: "gostat",
      title: "Gostat",
      description: "GOstat - a cutting-edge microservice-based application designed to handle HTTP request authentication and statistics with finesse.",
      longDescription: "GOstat is a comprehensive microservice architecture designed to provide robust authentication and detailed analytics for high-traffic applications. It leverages the speed of Go and the flexibility of TypeScript to deliver a seamless developer experience and high-performance runtime.",
      tags: ["Golang", "TypeScript", "Gin", "NextJS", "PostgreSQL", "Redis"],
      link: "#",
      features: ["Distributed authentication using JWT and Redis", "Real-time request statistics and monitoring", "Scalable microservice architecture with gRPC communication", "Beautiful dashboard built with Next.js and Tailwind CSS"],
      techStack: [{ category: "Backend", items: ["Go", "Gin", "gRPC", "Redis", "PostgreSQL"] }, { category: "Frontend", items: ["TypeScript", "Next.js", "Tailwind CSS", "Recharts"] }, { category: "Infrastructure", items: ["Docker", "Kubernetes", "GitHub Actions"] }]
    },
    {
      id: "kana-master",
      title: "Kana Master",
      description: "Kana Master is an iOS application designed for learning Katakana and Hiragana with interactive tests and audio.",
      longDescription: "Kana Master makes learning Japanese characters intuitive and fun. By combining visual mnemonics, stroke order animations, and audio pronunciation, it provides a holistic learning environment for beginners. The app uses a spaced-repetition algorithm to ensure long-term retention.",
      tags: ["TypeScript", "ReactNative", "Redux Toolkit", "i18n", "iOS"],
      link: "#",
      features: ["Interactive stroke order animations", "Native-speaker audio pronunciations", "Progress tracking with spaced repetition", "Customizable practice sessions and quizzes"],
      techStack: [{ category: "Mobile", items: ["React Native", "TypeScript", "Expo"] }, { category: "State Management", items: ["Redux Toolkit", "RTK Query"] }, { category: "Localization", items: ["i18next"] }]
    },
    {
      id: "anime-sentry",
      title: "Anime Sentry",
      description: "A specialized bot that tracks new anime episodes and sends automated notifications via Telegram.",
      longDescription: "Anime Sentry solves the problem of keeping track of multiple ongoing series across different platforms. It scrapes release schedules and monitors streaming sites to provide instant notifications the moment a new episode is available, including details about subtitles and dubs.",
      tags: ["Golang", "GORM", "PostgreSQL", "i18n", "goquery", "gocron"],
      link: "#",
      features: ["Automated web scraping with GoQuery", "Cron-based schedule monitoring", "Telegram Bot API integration", "Multi-language support for global users"],
      techStack: [{ category: "Backend", items: ["Go", "GORM", "PostgreSQL"] }, { category: "Tools", items: ["GoQuery", "GoCron", "Telegram Bot SDK"] }]
    }
  ];

  const stmt = db.prepare(`INSERT INTO projects (id, title, description, longDescription, tags, link, features, techStack) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  initialProjects.forEach(p => {
    stmt.run(p.id, p.title, p.description, p.longDescription, JSON.stringify(p.tags), p.link, JSON.stringify(p.features), JSON.stringify(p.techStack));
  });
}

const articlesCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as any;
if (articlesCount.count === 0) {
  const initialArticles = [
    {
      id: "1",
      title: "The simplest example is kafka + golang",
      description: "This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.",
      content: "# Introduction to Kafka and Go...",
      date: "March 15, 2024",
      author: "augustdev290",
      readTime: "5 min read",
      tags: ["Kafka", "Golang", "Docker", "Microservices"]
    },
    {
      id: "2",
      title: "Mastering Microservices with gRPC",
      description: "Learn how to build high-performance APIs using gRPC and Protocol Buffers in a distributed system.",
      content: "# The Power of gRPC...",
      date: "February 28, 2024",
      author: "augustdev290",
      readTime: "8 min read",
      tags: ["gRPC", "Microservices", "API", "Golang"]
    }
  ];

  const stmt = db.prepare(`INSERT INTO articles (id, title, description, content, date, author, readTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  initialArticles.forEach(a => {
    stmt.run(a.id, a.title, a.description, a.content, a.date, a.author, a.readTime, JSON.stringify(a.tags));
  });
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || "[]"),
      features: JSON.parse(p.features || "[]"),
      techStack: JSON.parse(p.techStack || "[]")
    })));
  });

  app.post("/api/projects", (req, res) => {
    const { id, title, description, longDescription, tags, link, features, techStack } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO projects (id, title, description, longDescription, tags, link, features, techStack)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, description, longDescription, JSON.stringify(tags), link, JSON.stringify(features), JSON.stringify(techStack));
    
    // Notify clients
    const notification = { message: `New Project: ${title}`, type: 'project' };
    const notifStmt = db.prepare("INSERT INTO notifications (message, type) VALUES (?, ?)");
    const result = notifStmt.run(notification.message, notification.type);
    
    io.emit("notification", { ...notification, id: result.lastInsertRowid, timestamp: new Date() });
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/articles", (req, res) => {
    const articles = db.prepare("SELECT * FROM articles").all();
    res.json(articles.map(a => ({
      ...a,
      tags: JSON.parse(a.tags || "[]")
    })));
  });

  app.post("/api/articles", (req, res) => {
    const { id, title, description, content, date, author, readTime, tags } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO articles (id, title, description, content, date, author, readTime, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, description, content, date, author, readTime, JSON.stringify(tags));
    
    // Notify clients
    const notification = { message: `New Article: ${title}`, type: 'article' };
    const notifStmt = db.prepare("INSERT INTO notifications (message, type) VALUES (?, ?)");
    const result = notifStmt.run(notification.message, notification.type);
    
    io.emit("notification", { ...notification, id: result.lastInsertRowid, timestamp: new Date() });
    res.json({ success: true });
  });

  app.delete("/api/articles/:id", (req, res) => {
    db.prepare("DELETE FROM articles WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/notifications", (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications ORDER BY timestamp DESC LIMIT 20").all();
    res.json(notifications);
  });

  app.post("/api/notifications/read", (req, res) => {
    db.prepare("UPDATE notifications SET isRead = 1").run();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
