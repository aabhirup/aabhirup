/**
 * Aabhirup AI - Conversational Knowledge & Reasoning Engine
 * Simulates an Apple-grade AI persona answering visitor questions about Aabhirup's
 * AI/ML learning journey, projects, skills, and background.
 */

class AabhirupChatEngine {
  constructor() {
    this.name = "Aabhirup";
    this.role = "AI/ML Explorer, Creative Technologist & Systems Architect";
  }

  /**
   * Evaluates visitor prompt and generates conversational response
   */
  async getResponse(prompt) {
    const p = prompt.toLowerCase().trim();

    // 1. Greetings
    if (this.matches(p, ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'sup', 'yo'])) {
      return {
        text: `Hello! I'm **${this.name}'s AI assistant**. 

I'm here to give you an inside look into Aabhirup's work, what he's actively learning in **Machine Learning and Artificial Intelligence**, his flagship engineering projects, or how to get in touch.

What would you like to explore first?`,
        actions: [
          { label: "🧠 AI/ML Journey", prompt: "What is Aabhirup learning in AI and ML?" },
          { label: "🚀 Top Projects", prompt: "Tell me about his key projects" },
          { label: "🛠️ Tech Stack", prompt: "What technologies does he use?" },
          { label: "📬 Contact Info", prompt: "How can I contact Aabhirup?" }
        ]
      };
    }

    // 2. Who is Aabhirup / About / Bio
    if (this.matches(p, ['who is', 'about', 'bio', 'introduce', 'tell me about', 'background', 'identity', 'who are you'])) {
      return {
        text: `### Meet Aabhirup

**Aabhirup** is a developer and creative technologist who is deeply fascinated by the convergence of **Artificial Intelligence, machine learning foundations, and modern interactive systems**.

He approaches engineering with a builder's mindset—combining rigorous computer science fundamentals with intuitive, human-centric design:

* **Currently Focused On**: Deep Learning architectures, PyTorch, transformer self-attention mechanisms, and building multi-agent AI tools.
* **Engineering Philosophy**: Code shouldn't just be functional—it should be performant, resilient, and visually captivating.
* **Core Strengths**: Fast learner, strong foundation in full-stack architecture, and an obsession with exploring the cutting edge of AI models.`,
        actions: [
          { label: "Explore His AI Journey", prompt: "What is Aabhirup learning in AI and ML?" },
          { label: "Inspect His Projects", prompt: "What projects has Aabhirup built?" },
          { label: "View His Skills", prompt: "What is his tech stack?" }
        ]
      };
    }

    // 3. AI / Machine Learning Learning Path (The Core User Focus!)
    if (this.matches(p, ['ai', 'ml', 'machine learning', 'deep learning', 'neural', 'pytorch', 'learning', 'studying', 'models', 'llm', 'transformers'])) {
      return {
        text: `### Aabhirup's AI & Machine Learning Journey 🧠

Aabhirup is actively expanding his expertise across both theoretical and applied Machine Learning:

#### 1. Core Deep Learning & Foundations
* **Frameworks**: Building neural networks and training pipelines using **PyTorch** and **NumPy**.
* **Mathematical Intuition**: Grounded in linear algebra, multivariable calculus, gradient descent optimization, and loss function landscapes.

#### 2. Natural Language Processing & Transformers
* **Architectures**: Exploring the internal mechanics of the **Transformer** (scaled dot-product attention, multi-head attention, positional encodings, and KV-caching).
* **LLM Engineering**: Experimenting with prompt engineering, local model quantization (via llama.cpp/Ollama), and fine-tuning strategies.

#### 3. Applied AI & Agentic Systems
* **RAG Pipelines**: Developing Retrieval-Augmented Generation systems using semantic vector embeddings and vector stores.
* **Multi-Agent Systems**: Constructing autonomous agent loops with tool-calling and memory persistence.

> *"The most exciting part of modern AI is not just consuming APIs, but understanding the mathematical intuition underneath and building systems that amplify human potential."*`,
        actions: [
          { label: "Check Synapse-X AI Project", prompt: "Tell me about Synapse-X" },
          { label: "See Full Tech Stack", prompt: "What is his tech stack?" },
          { label: "Collaborate on AI", prompt: "How can I collaborate with Aabhirup?" }
        ]
      };
    }

    // 4. Projects Showcase
    if (this.matches(p, ['project', 'built', 'portfolio', 'work', 'synapse', 'chrono', 'aegis', 'nexus', 'showcase'])) {
      return {
        text: `Here are several flagship projects that highlight Aabhirup's range from **AI systems** to **3D WebGL graphics** and **distributed infrastructure**:`,
        cards: [
          {
            title: "SYNAPSE-X // Neural Copilot",
            badge: "AI ORCHESTRATION",
            desc: "An autonomous multi-agent neural assistant that orchestrates distributed LLMs, vector memory caching, and live execution graphs with sub-18ms token latency.",
            tags: ["Python", "PyTorch", "Next.js", "Vector DB", "Rust"],
            link: "https://github.com/aabhirup"
          },
          {
            title: "CHRONO-SPHERE // 3D Celestial Engine",
            badge: "3D WEBGL GRAPHICS",
            desc: "Real-time 3D celestial visualizer computing N-body gravitational fields and quantum particle simulations natively in browser shaders at a locked 60 FPS.",
            tags: ["Three.js", "WebGL", "GLSL Shaders", "Web Workers"],
            link: "https://github.com/aabhirup"
          },
          {
            title: "AEGIS-DEFENSE // Zero-Trust Telemetry",
            badge: "CYBERSECURITY & SYSTEMS",
            desc: "High-throughput surveillance telemetry grid featuring autonomous anomaly mitigation and real-time network packet flow visualization.",
            tags: ["Go", "Kafka", "eBPF", "React Flow"],
            link: "https://github.com/aabhirup"
          },
          {
            title: "NEXUS-FLEET // Autonomous Drone Mesh",
            badge: "IOT & PROTOCOLS",
            desc: "Decentralized peer-to-peer telemetry mesh for coordinating autonomous robotic swarms with sub-millisecond obstacle negotiation.",
            tags: ["C++", "WASM", "WebRTC", "Mapbox GL"],
            link: "https://github.com/aabhirup"
          }
        ],
        actions: [
          { label: "Ask about Synapse-X", prompt: "How does Synapse-X work?" },
          { label: "Get in touch", prompt: "How can I contact Aabhirup?" }
        ]
      };
    }

    // 5. Tech Stack & Skills
    if (this.matches(p, ['skill', 'stack', 'tech', 'languages', 'tools', 'frameworks', 'code', 'technologies', 'python', 'react'])) {
      return {
        text: `### Aabhirup's Technical Repertoire

Aabhirup pairs modern AI techniques with robust full-stack and systems engineering:

* **Artificial Intelligence & ML**: Python, PyTorch, Hugging Face, Transformers, Vector Embeddings (FAISS, ChromaDB), LangChain, Agentic Tool Use.
* **Frontend & Spatial Computing**: TypeScript, React, Next.js, Three.js, WebGL, custom GLSL fragment shaders, Web Audio API.
* **Backend & Distributed Systems**: Go (Golang), Node.js, Rust, Kafka, Redis, gRPC, RESTful APIs, PostgreSQL.
* **DevOps & Infrastructure**: Docker, Kubernetes, Linux/Unix environments, Git, CI/CD automated pipelines.`,
        actions: [
          { label: "View His Projects", prompt: "What projects has Aabhirup built?" },
          { label: "Contact Aabhirup", prompt: "How can I contact Aabhirup?" }
        ]
      };
    }

    // 6. Contact & Hiring
    if (this.matches(p, ['contact', 'email', 'hire', 'reach', 'message', 'touch', 'collaborate', 'linkedin', 'github', 'twitter', 'x'])) {
      return {
        text: `### Connect with Aabhirup

Aabhirup is always open to discussing **AI/ML research, engineering roles, open-source initiatives, or innovative collaborations**.

Here is how you can reach him directly:

* 📧 **Email**: [aabhirup@quantum-arch.dev](mailto:aabhirup@quantum-arch.dev)
* 💻 **GitHub**: [github.com/aabhirup](https://github.com/aabhirup)
* 💼 **LinkedIn**: [linkedin.com/in/aabhirup](https://linkedin.com/in/aabhirup)
* 🐦 **X (Twitter)**: [@aabhirup_dev](https://x.com/aabhirup_dev)
* 💬 **Discord**: \`aabhirup#0001\`

Feel free to send a note introducing yourself and what you're working on!`,
        actions: [
          { label: "Email Directly", prompt: "Tell me about his email" },
          { label: "Explore His Projects", prompt: "Show me his projects" }
        ]
      };
    }

    // 7. Resume / Experience
    if (this.matches(p, ['resume', 'cv', 'experience', 'career', 'job', 'work history', 'qualification'])) {
      return {
        text: `### Career & Experience Summary

* **Systems Architect & AI Explorer** (2024 – Present)
  Focused on building high-concurrency event-driven systems and autonomous AI copilot architectures.
* **Full-Stack & Systems Engineer** (2022 – 2024)
  Led backend microservices refactoring in Go and built low-latency WebSocket communication pipelines.
* **Interactive 3D Web Technologist** (2020 – 2022)
  Engineered experiential 3D WebGL sites, interactive product simulations, and shader animations.

You can reach out directly to request an official PDF resume!`,
        actions: [
          { label: "Contact for Resume", prompt: "How can I contact Aabhirup?" },
          { label: "See Top Projects", prompt: "What projects has Aabhirup built?" }
        ]
      };
    }

    // 8. Why Hire Aabhirup
    if (this.matches(p, ['why hire', 'why should i hire', 'hire him', 'recommend', 'stand out'])) {
      return {
        text: `### Why Work with Aabhirup?

1. **High Adaptability & Curiosity**: He rapidly masters new paradigms—from moving into deep learning and neural architectures to writing custom 3D shaders.
2. **End-to-End Ownership**: Comfortable working anywhere from low-level data pipelines and model inference to high-polish frontends.
3. **Commitment to Quality**: Strongly values clean architecture, elegant UX, and code maintainability.
4. **Relentless Work Ethic**: Passionate about continuous improvement and building things that matter.`,
        actions: [
          { label: "Schedule a Conversation", prompt: "How can I contact Aabhirup?" },
          { label: "Review His Code", prompt: "Show me his projects" }
        ]
      };
    }

    // 9. Easter Eggs & Casual Queries
    if (this.matches(p, ['joke', 'funny'])) {
      return {
        text: `Here's an AI/ML joke for you:

> **Why did the neural network go to therapy?**  
> Because it had too many unresolved loss functions and kept overfitting to the past! 😄

Want to hear about Aabhirup's actual machine learning projects?`,
        actions: [
          { label: "Show AI Projects", prompt: "What projects has Aabhirup built?" },
          { label: "Tell me about his skills", prompt: "What is his tech stack?" }
        ]
      };
    }

    // Fallback default response
    return {
      text: `That's an interesting question! While I am trained primarily on **Aabhirup's technical portfolio, AI/ML learning journey, and projects**, I'd be happy to guide you to the right place.

Here are a few popular topics you can ask me about:`,
      actions: [
        { label: "What is he learning in AI/ML?", prompt: "What is Aabhirup learning in AI and ML?" },
        { label: "What projects has he built?", prompt: "Tell me about his key projects" },
        { label: "What is his technical stack?", prompt: "What is his tech stack?" },
        { label: "How can I contact him?", prompt: "How can I contact Aabhirup?" }
      ]
    };
  }

  matches(prompt, keywords) {
    return keywords.some(k => prompt.includes(k));
  }
}

window.aabhirupChatEngine = new AabhirupChatEngine();
