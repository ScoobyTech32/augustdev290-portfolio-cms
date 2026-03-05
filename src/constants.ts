import { Github, Linkedin, Facebook, Instagram, Send, Mail, ExternalLink, ArrowRight, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  image?: string;
  link?: string;
  features?: string[];
  techStack?: { category: string; items: string[] }[];
};

export type Article = {
  id: string;
  title: string;
  description: string;
  content?: string;
  date?: string;
  link?: string;
  author?: string;
  readTime?: string;
  tags?: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  description?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "gostat",
    title: "Gostat",
    description: "GOstat - a cutting-edge microservice-based application designed to handle HTTP request authentication and statistics with finesse.",
    longDescription: "GOstat is a comprehensive microservice architecture designed to provide robust authentication and detailed analytics for high-traffic applications. It leverages the speed of Go and the flexibility of TypeScript to deliver a seamless developer experience and high-performance runtime.",
    tags: ["Golang", "TypeScript", "Gin", "NextJS", "PostgreSQL", "Redis"],
    link: "#",
    features: [
      "Distributed authentication using JWT and Redis",
      "Real-time request statistics and monitoring",
      "Scalable microservice architecture with gRPC communication",
      "Beautiful dashboard built with Next.js and Tailwind CSS"
    ],
    techStack: [
      { category: "Backend", items: ["Go", "Gin", "gRPC", "Redis", "PostgreSQL"] },
      { category: "Frontend", items: ["TypeScript", "Next.js", "Tailwind CSS", "Recharts"] },
      { category: "Infrastructure", items: ["Docker", "Kubernetes", "GitHub Actions"] }
    ]
  },
  {
    id: "kana-master",
    title: "Kana Master",
    description: "Kana Master is an iOS application designed for learning Katakana and Hiragana with interactive tests and audio.",
    longDescription: "Kana Master makes learning Japanese characters intuitive and fun. By combining visual mnemonics, stroke order animations, and audio pronunciation, it provides a holistic learning environment for beginners. The app uses a spaced-repetition algorithm to ensure long-term retention.",
    tags: ["TypeScript", "ReactNative", "Redux Toolkit", "i18n", "iOS"],
    link: "#",
    features: [
      "Interactive stroke order animations",
      "Native-speaker audio pronunciations",
      "Progress tracking with spaced repetition",
      "Customizable practice sessions and quizzes"
    ],
    techStack: [
      { category: "Mobile", items: ["React Native", "TypeScript", "Expo"] },
      { category: "State Management", items: ["Redux Toolkit", "RTK Query"] },
      { category: "Localization", items: ["i18next"] }
    ]
  },
  {
    id: "anime-sentry",
    title: "Anime Sentry",
    description: "A specialized bot that tracks new anime episodes and sends automated notifications via Telegram.",
    longDescription: "Anime Sentry solves the problem of keeping track of multiple ongoing series across different platforms. It scrapes release schedules and monitors streaming sites to provide instant notifications the moment a new episode is available, including details about subtitles and dubs.",
    tags: ["Golang", "GORM", "PostgreSQL", "i18n", "goquery", "gocron"],
    link: "#",
    features: [
      "Automated web scraping with GoQuery",
      "Cron-based schedule monitoring",
      "Telegram Bot API integration",
      "Multi-language support for global users"
    ],
    techStack: [
      { category: "Backend", items: ["Go", "GORM", "PostgreSQL"] },
      { category: "Tools", items: ["GoQuery", "GoCron", "Telegram Bot SDK"] }
    ]
  }
];

export const ARTICLES: Article[] = [
  {
    id: "1",
    title: "The simplest example is kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.",
    content: `
# Introduction to Kafka and Go

Apache Kafka is a distributed event store and stream-processing platform. It is an open-source system developed by the Apache Software Foundation written in Java and Scala. The project aims to provide a unified, high-throughput, low-latency platform for handling real-time data feeds.

## Why Go?

Go (Golang) is an open-source programming language that makes it easy to build simple, reliable, and efficient software. Its concurrency model and performance make it an excellent choice for building microservices that interact with Kafka.

## Implementation Steps

1. **Setup Docker Compose**: Define your Kafka and Zookeeper services.
2. **Producer in Go**: Use a library like \`segmentio/kafka-go\` to send messages.
3. **Consumer in Go**: Implement a listener that processes incoming events.
4. **Error Handling**: Ensure your system is resilient to network partitions.

## Conclusion

By combining Kafka's robust messaging with Go's performance, you can build highly scalable and maintainable microservice architectures.
    `,
    date: "March 15, 2024",
    author: "augustdev290",
    readTime: "5 min read",
    link: "#",
    tags: ["Kafka", "Golang", "Docker", "Microservices"]
  },
  {
    id: "2",
    title: "Mastering Microservices with gRPC",
    description: "Learn how to build high-performance APIs using gRPC and Protocol Buffers in a distributed system.",
    content: `
# The Power of gRPC

gRPC is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication.

## Protocol Buffers

Protocol buffers are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data – think XML, but smaller, faster, and simpler.

## Key Benefits

- **Performance**: Binary serialization is much faster than JSON.
- **Strict Typing**: Protobuf files serve as a single source of truth.
- **Streaming**: Supports client-side, server-side, and bidirectional streaming.
    `,
    date: "February 28, 2024",
    author: "augustdev290",
    readTime: "8 min read",
    link: "#",
    tags: ["gRPC", "Microservices", "API", "Golang"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    company: "ITHUB",
    role: "Frontend developer",
    period: "2022 -",
    duration: "1 year 5 months",
    description: "React & Vue"
  },
  {
    id: "2",
    company: "VK Development Lab",
    role: "Frontend developer",
    period: "2021 - 2022",
    duration: "8 months",
    description: "React"
  },
  {
    id: "3",
    company: "SN Inc.",
    role: "Fullstack developer",
    period: "2020 - 2021",
    duration: "9 months",
    description: "JavaScript & Python"
  },
  {
    id: "4",
    company: "Business Up",
    role: "Fullstack developer",
    period: "2018 - 2020",
    duration: "1 year 11 months",
    description: "JavaScript & Python"
  }
];

export const SOCIALS = [
  { name: "Github", icon: Github, url: "#" },
  { name: "Linkedin", icon: Linkedin, url: "#" },
  { name: "Facebook", icon: Facebook, url: "#" },
  { name: "Instagram", icon: Instagram, url: "#" },
  { name: "Telegram", icon: Send, url: "#" },
  { name: "E-mail", icon: Mail, url: "#" },
];
