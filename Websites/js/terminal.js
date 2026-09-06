/**
 * Full Futuristic Linux Terminal Engine
 * Virtual File System (VFS), Command Parser, Tab-Completion, and OS Simulation.
 */

class LinuxTerminal {
  constructor() {
    this.screen = document.getElementById('terminal-screen');
    this.input = document.getElementById('terminal-input');
    this.inputDisplay = document.getElementById('input-display');
    this.promptUser = 'aabhirup';
    this.promptHost = 'arch-quantum';
    this.currentPath = ['home', 'aabhirup'];

    this.history = [];
    this.historyIdx = -1;

    // Virtual File System
    this.vfs = {
      home: {
        type: 'dir',
        children: {
          aabhirup: {
            type: 'dir',
            children: {
              'bio.txt': {
                type: 'file',
                content: `===================================================================
IDENTITY: AABHIRUP
ROLE: Creative Technologist, Systems Architect & Full-Stack Engineer
LOCATION: Global / Remote
MISSION:
Building at the bleeding edge where mathematics, 3D WebGL graphics,
and distributed AI systems merge into seamless user experiences.
===================================================================`
              },
              'contact.json': {
                type: 'file',
                content: `{
  "developer": "Aabhirup",
  "email": "aabhirup@quantum-arch.dev",
  "github": "https://github.com/aabhirup",
  "linkedin": "https://linkedin.com/in/aabhirup",
  "x_twitter": "https://x.com/aabhirup_dev",
  "matrix": "@aabhirup:arch-quantum.org",
  "status": "Available for High-Impact Roles & Advisory"
}`
              },
              'experience.log': {
                type: 'file',
                content: `[2024 - PRESENT] Principal Systems Architect @ Quantum Dynamics Labs
  * Architected real-time WebSocket mesh supporting 450,000+ concurrent connections.
  * Implemented WebGPU rendering pipelines reducing latency by 62%.

[2022 - 2024] Lead Full-Stack Engineer @ CyberNet Systems
  * Led migration of mission-critical services to high-concurrency Go microservices.
  * Reduced cloud compute overhead by 45% while achieving 99.999% uptime.

[2020 - 2022] 3D Web Technologist @ Nexus Interactive Studio
  * Crafted award-winning 3D WebGL experiential platforms and custom GLSL shaders.`
              },
              'skills': {
                type: 'dir',
                children: {
                  'frontend.md': {
                    type: 'file',
                    content: `# Spatial & Modern Frontend
- Three.js / WebGL / GLSL Shaders [96%]
- TypeScript & Modern JavaScript [98%]
- React / Next.js Framework [94%]
- Web Audio API / DSP [90%]
- CSS3 Quantum Grid & Fluid Layouts [96%]`
                  },
                  'backend.md': {
                    type: 'file',
                    content: `# Distributed Backend & Concurrency
- Go (Golang) Microservices [92%]
- Node.js / Bun Runtime [95%]
- Rust / WebAssembly (WASM) [86%]
- Redis / Kafka / gRPC Streaming [89%]
- PostgreSQL / Vector Databases [93%]`
                  },
                  'ai_neural.md': {
                    type: 'file',
                    content: `# Neural AI & Systems
- Autonomous Multi-Agent Frameworks [95%]
- Vector Embeddings & RAG Architectures [93%]
- Local LLM Deployment & Inference Pipelines [91%]
- Python / PyTorch / Agentic Workflows [88%]`
                  }
                }
              },
              'projects': {
                type: 'dir',
                children: {
                  'synapse_x.sh': {
                    type: 'exec',
                    content: `PROJECT: SYNAPSE-X // AUTONOMOUS NEURAL ENGINE
TAGS: [Rust, WebGPU, Next.js, Vector DB]
METRICS: Sub-18ms latency | 12,500 req/sec | 99.4% accuracy
OVERVIEW: Autonomous multi-agent neural copilot that orchestrates distributed LLMs,
vector memories, and live real-time execution graphs.
URL: https://github.com/aabhirup/synapse-x`
                  },
                  'chrono_3d.sh': {
                    type: 'exec',
                    content: `PROJECT: CHRONO-SPHERE // 3D CELESTIAL VISUALIZER
TAGS: [Three.js, GLSL, Web Workers, Web Audio]
METRICS: 60 FPS locked | 250,000 active nodes | Web Workers physics
OVERVIEW: Interactive real-time celestial visualizer computing N-body gravitational fields
and quantum particle simulations natively in the browser.
URL: https://github.com/aabhirup/chrono-sphere`
                  },
                  'aegis_sec.sh': {
                    type: 'exec',
                    content: `PROJECT: AEGIS-DEFENSE // THREAT TELEMETRY GRID
TAGS: [Go, Kafka, eBPF, React Flow]
METRICS: 1.4M packets/sec | 2.4ms detection speed | 99.999% uptime
OVERVIEW: Zero-trust surveillance grid with autonomous anomaly mitigation
and real-time packet flow visualization.
URL: https://github.com/aabhirup/aegis-defense`
                  },
                  'nexus_swarm.sh': {
                    type: 'exec',
                    content: `PROJECT: NEXUS-FLEET // ROBOTIC SWARM PROTOCOL
TAGS: [C++, WASM, WebRTC, Mapbox GL]
METRICS: 1,200 active nodes | 4ms sync delay | Triple-homed failover
OVERVIEW: Decentralized peer-to-peer telemetry mesh for coordinating autonomous drone
swarms with sub-millisecond obstacle negotiation.
URL: https://github.com/aabhirup/nexus-fleet`
                  }
                }
              }
            }
          }
        }
      }
    };

    this.commands = {
      name: () => this.cmdName(),
      whoami: () => this.cmdWhoami(),
      bio: () => this.cmdBio(),
      neofetch: () => this.cmdNeofetch(),
      fastfetch: () => this.cmdNeofetch(),
      help: () => this.cmdHelp(),
      man: () => this.cmdHelp(),
      ls: (args) => this.cmdLs(args),
      dir: (args) => this.cmdLs(args),
      cd: (args) => this.cmdCd(args),
      pwd: () => this.cmdPwd(),
      cat: (args) => this.cmdCat(args),
      tree: () => this.cmdTree(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      contact: () => this.cmdContact(),
      email: () => this.cmdContact(),
      theme: (args) => this.cmdTheme(args),
      matrix: () => this.cmdMatrix(),
      sound: () => this.cmdSound(),
      audio: () => this.cmdSound(),
      clear: () => this.cmdClear(),
      date: () => this.cmdDate(),
      uptime: () => this.cmdUptime(),
      history: () => this.cmdHistory(),
      echo: (args) => this.cmdEcho(args),
      sudo: (args) => this.cmdSudo(args),
      reboot: () => this.boot()
    };

    this.init();
  }

  init() {
    if (!this.input) return;

    // Focus input when clicking anywhere inside the terminal window
    document.querySelector('.terminal-window').addEventListener('click', () => {
      this.input.focus();
    });

    // Real-time input synchronization and audio
    this.input.addEventListener('input', () => {
      this.inputDisplay.textContent = this.input.value;
      if (window.termAudio) window.termAudio.playKeyClick();
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.input.value.trim();
        this.input.value = '';
        this.inputDisplay.textContent = '';
        if (window.termAudio) window.termAudio.playEnter();
        this.execute(cmd);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIdx > 0) {
          this.historyIdx--;
          this.input.value = this.history[this.historyIdx];
          this.inputDisplay.textContent = this.input.value;
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          this.input.value = this.history[this.historyIdx];
          this.inputDisplay.textContent = this.input.value;
        } else {
          this.historyIdx = this.history.length;
          this.input.value = '';
          this.inputDisplay.textContent = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });

    // Quick Dock Chips execution
    document.querySelectorAll('.dock-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          if (window.termAudio) window.termAudio.playKeyClick();
          this.execute(cmd);
          this.input.focus();
        }
      });
    });

    // Run Boot Sequence on start
    this.boot();
  }

  getPromptPath() {
    const full = '/' + this.currentPath.join('/');
    const home = '/home/aabhirup';
    if (full === home) return '~';
    if (full.startsWith(home)) return '~' + full.slice(home.length);
    return full;
  }

  getPromptHTML() {
    return `<span class="prompt-prefix"><span class="prompt-user">${this.promptUser}</span><span class="prompt-at">@</span><span class="prompt-host">${this.promptHost}</span>:<span class="prompt-path">${this.getPromptPath()}</span>$</span>`;
  }

  updateActivePrompt() {
    const activePrefix = document.getElementById('active-prompt-prefix');
    if (activePrefix) {
      activePrefix.innerHTML = this.getPromptHTML();
    }
  }

  append(html) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    this.screen.appendChild(line);
    this.screen.scrollTop = this.screen.scrollHeight;
  }

  execute(cmdStr) {
    // Print current line with prompt
    this.append(`${this.getPromptHTML()} <span class="term-cmd-text">${this.escapeHTML(cmdStr)}</span>`);

    if (!cmdStr) return;

    this.history.push(cmdStr);
    this.historyIdx = this.history.length;

    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmd]) {
      this.commands[cmd](args);
    } else {
      this.append(`<span class="color-error">bash: command not found: ${this.escapeHTML(cmd)}. Type <span class="color-accent">help</span> to view directives.</span>`);
      if (window.termAudio) window.termAudio.playBell();
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // --- VFS Navigation Helpers ---
  getCurrentDirectoryNode() {
    let node = this.vfs;
    for (const seg of this.currentPath) {
      if (node[seg] && node[seg].type === 'dir') {
        node = node[seg].children;
      } else if (node.children && node.children[seg] && node.children[seg].type === 'dir') {
        node = node.children[seg].children;
      }
    }
    return node;
  }

  resolvePath(pathStr) {
    if (!pathStr || pathStr === '.') return [...this.currentPath];
    if (pathStr === '~') return ['home', 'aabhirup'];

    let parts = pathStr.split('/').filter(Boolean);
    let target = pathStr.startsWith('/') ? [] : [...this.currentPath];

    if (pathStr.startsWith('~')) {
      target = ['home', 'aabhirup'];
      parts = pathStr.slice(1).split('/').filter(Boolean);
    }

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (target.length > 0) target.pop();
      } else {
        target.push(part);
      }
    }
    return target;
  }

  getNodeAtPath(pathArr) {
    let curr = this.vfs;
    for (let i = 0; i < pathArr.length; i++) {
      const seg = pathArr[i];
      if (i === 0) {
        if (!curr[seg]) return null;
        curr = curr[seg];
      } else {
        if (!curr.children || !curr.children[seg]) return null;
        curr = curr.children[seg];
      }
    }
    return curr;
  }

  autocomplete() {
    const raw = this.input.value;
    const parts = raw.split(' ');

    if (parts.length === 1) {
      // Autocomplete command
      const term = parts[0].toLowerCase();
      const matches = Object.keys(this.commands).filter(c => c.startsWith(term));
      if (matches.length === 1) {
        this.input.value = matches[0] + ' ';
        this.inputDisplay.textContent = this.input.value;
      } else if (matches.length > 1) {
        this.append(`<span class="color-secondary">${matches.join('  ')}</span>`);
      }
    } else {
      // Autocomplete file or directory in current directory
      const last = parts[parts.length - 1];
      const dirNode = this.getCurrentDirectoryNode();
      const files = Object.keys(dirNode || {});
      const matches = files.filter(f => f.startsWith(last));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0] + (dirNode[matches[0]].type === 'dir' ? '/' : ' ');
        this.input.value = parts.join(' ');
        this.inputDisplay.textContent = this.input.value;
      } else if (matches.length > 1) {
        this.append(`<span class="color-secondary">${matches.join('  ')}</span>`);
      }
    }
  }

  // --- COMMAND IMPLEMENTATIONS ---

  cmdName() {
    this.append(`
      <div style="margin: 6px 0;">
        <div><span class="color-accent" style="font-size: 1.15rem; letter-spacing: 1px;">AABHIRUP</span> // CREATIVE TECHNOLOGIST</div>
        <div class="color-secondary" style="margin-top: 4px;">
          Architecting high-performance digital environments, real-time 3D WebGL worlds,
          and distributed neural AI pipelines.
        </div>
        <div style="margin-top: 6px; color: var(--term-exec);">
          * Type <span class="color-accent">whoami</span>, <span class="color-accent">skills</span>, or <span class="color-accent">projects</span> to explore telemetry.
        </div>
      </div>
    `);
  }

  cmdWhoami() {
    this.append(`
      <div style="margin: 6px 0; line-height: 1.6;">
        <div>[USER]: <span class="color-accent">aabhirup</span> (uid=1000 gid=1000 [wheel, docker, kvm])</div>
        <div>[ROLE]: <span class="color-green">Systems Architect & Creative Technologist</span></div>
        <div>[CLEARANCE]: <span class="color-magenta">LEVEL 5 // QUANTUM-ROOT</span></div>
        <div>[HOST]: <span class="color-accent">arch-quantum (Linux 6.12.4-zen)</span></div>
        <div class="color-secondary" style="margin-top: 6px;">
          Passionate about building fast, responsive, and aesthetically stunning systems.
          From low-level concurrency engines to GPU shaders and autonomous AI swarms.
        </div>
      </div>
    `);
  }

  cmdBio() {
    this.execute('cat bio.txt');
  }

  cmdNeofetch() {
    this.append(`
      <div class="neofetch-container">
        <pre class="neofetch-ascii">
           /\\
          /  \\
         /\\   \\
        /      \\
       /   ,,   \\
      /   |  |  -\\
     /_-''    ''-_\\
        </pre>
        <div class="neofetch-info">
          <div class="neofetch-title">aabhirup@arch-quantum</div>
          <div class="neofetch-row"><span class="neofetch-label">OS</span><span>Arch Quantum Linux x86_64</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Host</span><span>Neural Rig Model 9000</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Kernel</span><span>6.12.4-zen-quantum</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Uptime</span><span>99.98% Coherent</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Shell</span><span>zsh 5.9 (quantum-theme)</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Resolution</span><span>3840x2160 @ 144Hz</span></div>
          <div class="neofetch-row"><span class="neofetch-label">WM</span><span>Hyprland (Wayland)</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Terminal</span><span>aabhirup-tty1</span></div>
          <div class="neofetch-row"><span class="neofetch-label">CPU</span><span>Quantum Core 16-Core @ 5.2GHz</span></div>
          <div class="neofetch-row"><span class="neofetch-label">Memory</span><span>64.0 GiB DDR5</span></div>
          <div class="color-blocks">
            <span class="c-block" style="background:#00f0ff;"></span>
            <span class="c-block" style="background:#f000ff;"></span>
            <span class="c-block" style="background:#00ff9d;"></span>
            <span class="c-block" style="background:#ffb800;"></span>
            <span class="c-block" style="background:#ff5f56;"></span>
            <span class="c-block" style="background:#ffffff;"></span>
          </div>
        </div>
      </div>
    `);
  }

  cmdHelp() {
    this.append(`
      <div style="margin: 8px 0; line-height: 1.6;">
        <div class="color-accent" style="font-weight: 700;">AABHIRUP-OS // COMMAND MANUAL</div>
        <div style="margin: 8px 0; border-left: 2px solid var(--term-accent); padding-left: 10px;">
          <div><span class="color-accent">name</span>         - Print Aabhirup's core identity & role</div>
          <div><span class="color-accent">whoami</span>       - Display system user credentials & clearance</div>
          <div><span class="color-accent">neofetch</span>     - Show system specs & ASCII logo banner</div>
          <div><span class="color-accent">skills</span>       - Inspect animated tech stack & proficiencies</div>
          <div><span class="color-accent">projects</span>     - Review flagship engineering artifacts</div>
          <div><span class="color-accent">contact</span>      - Transmit messages or view social links</div>
          <div><span class="color-accent">ls [-la]</span>     - List contents of current directory</div>
          <div><span class="color-accent">cd &lt;dir&gt;</span>     - Change virtual directory (e.g. <span class="color-green">cd projects</span>)</div>
          <div><span class="color-accent">cat &lt;file&gt;</span>    - Read virtual file (e.g. <span class="color-green">cat bio.txt</span>)</div>
          <div><span class="color-accent">tree</span>         - Display full directory tree hierarchy</div>
          <div><span class="color-accent">theme &lt;name&gt;</span> - Switch theme: <span class="color-secondary">cyber, matrix, synthwave, amber, dracula</span></div>
          <div><span class="color-accent">matrix</span>       - Toggle falling digital rain background</div>
          <div><span class="color-accent">sound</span>        - Toggle mechanical keyboard clicks & beeps</div>
          <div><span class="color-accent">clear</span>        - Clear terminal screen buffer</div>
          <div><span class="color-accent">sudo &lt;cmd&gt;</span>   - Execute directive with root privileges</div>
        </div>
        <div class="color-muted" style="font-size: 0.78rem;">TIP: Press Tab for autocomplete. Use Up/Down arrows for command history.</div>
      </div>
    `);
  }

  cmdLs(args = []) {
    const dirNode = this.getCurrentDirectoryNode();
    if (!dirNode) {
      this.append(`<span class="color-error">ls: cannot access current directory</span>`);
      return;
    }

    const items = Object.keys(dirNode);
    if (items.length === 0) {
      this.append(`<span class="color-muted">(directory is empty)</span>`);
      return;
    }

    const output = items.map(name => {
      const item = dirNode[name];
      if (item.type === 'dir') return `<span class="color-dir">${name}/</span>`;
      if (item.type === 'exec') return `<span class="color-green">${name}*</span>`;
      return `<span class="color-file">${name}</span>`;
    }).join('   ');

    this.append(output);
  }

  cmdCd(args = []) {
    if (!args[0] || args[0] === '~') {
      this.currentPath = ['home', 'aabhirup'];
      this.updateActivePrompt();
      return;
    }

    const targetArr = this.resolvePath(args[0]);
    const node = this.getNodeAtPath(targetArr);

    if (!node || node.type !== 'dir') {
      this.append(`<span class="color-error">bash: cd: ${args[0]}: No such directory</span>`);
      if (window.termAudio) window.termAudio.playBell();
      return;
    }

    this.currentPath = targetArr;
    this.updateActivePrompt();
  }

  cmdPwd() {
    this.append(`/${this.currentPath.join('/')}`);
  }

  cmdCat(args = []) {
    if (!args[0]) {
      this.append(`<span class="color-error">cat: missing file operand</span>`);
      return;
    }

    const targetArr = this.resolvePath(args[0]);
    const node = this.getNodeAtPath(targetArr);

    if (!node) {
      this.append(`<span class="color-error">cat: ${args[0]}: No such file or directory</span>`);
      if (window.termAudio) window.termAudio.playBell();
      return;
    }

    if (node.type === 'dir') {
      this.append(`<span class="color-error">cat: ${args[0]}: Is a directory</span>`);
      return;
    }

    this.append(`<div style="color: var(--term-fg); white-space: pre-wrap;">${this.escapeHTML(node.content)}</div>`);
  }

  cmdTree() {
    this.append(`
      <div style="font-family: monospace; line-height: 1.4;">
        <span class="color-dir">/home/aabhirup</span><br>
        ├── <span class="color-file">bio.txt</span><br>
        ├── <span class="color-file">contact.json</span><br>
        ├── <span class="color-file">experience.log</span><br>
        ├── <span class="color-dir">skills/</span><br>
        │   ├── <span class="color-file">frontend.md</span><br>
        │   ├── <span class="color-file">backend.md</span><br>
        │   └── <span class="color-file">ai_neural.md</span><br>
        └── <span class="color-dir">projects/</span><br>
            ├── <span class="color-green">synapse_x.sh</span><br>
            ├── <span class="color-green">chrono_3d.sh</span><br>
            ├── <span class="color-green">aegis_sec.sh</span><br>
            └── <span class="color-green">nexus_swarm.sh</span>
      </div>
    `);
  }

  cmdSkills() {
    this.append(`
      <div style="margin: 10px 0;">
        <div class="color-accent" style="font-weight: 700; margin-bottom: 8px;">// NEURAL TECH STACK TELEMETRY</div>

        <div style="margin-bottom: 12px;">
          <div class="color-green" style="font-size: 0.85rem; margin-bottom: 4px;">[1.0 SPATIAL & FRONTEND ENGINEERING]</div>
          <div class="term-skill-row"><span class="term-skill-name">Three.js / WebGL</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 96%;"></div></div><span class="term-skill-num">96%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">TypeScript / ES6+</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 98%;"></div></div><span class="term-skill-num">98%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">React / Next.js</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 94%;"></div></div><span class="term-skill-num">94%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">GLSL Shaders</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 92%;"></div></div><span class="term-skill-num">92%</span></div>
        </div>

        <div style="margin-bottom: 12px;">
          <div class="color-magenta" style="font-size: 0.85rem; margin-bottom: 4px;">[2.0 DISTRIBUTED BACKEND & CLOUD]</div>
          <div class="term-skill-row"><span class="term-skill-name">Go (Golang)</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 92%;"></div></div><span class="term-skill-num">92%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">Node.js / Bun</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 95%;"></div></div><span class="term-skill-num">95%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">Rust / WASM</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 86%;"></div></div><span class="term-skill-num">86%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">Kafka / Redis / gRPC</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 89%;"></div></div><span class="term-skill-num">89%</span></div>
        </div>

        <div>
          <div class="color-accent" style="font-size: 0.85rem; margin-bottom: 4px;">[3.0 AI & NEURAL SYSTEMS]</div>
          <div class="term-skill-row"><span class="term-skill-name">Multi-Agent Systems</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 95%;"></div></div><span class="term-skill-num">95%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">Vector DBs & RAG</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 93%;"></div></div><span class="term-skill-num">93%</span></div>
          <div class="term-skill-row"><span class="term-skill-name">Local LLM Pipelines</span><div class="term-skill-bar"><div class="term-skill-fill" style="width: 90%;"></div></div><span class="term-skill-num">90%</span></div>
        </div>
      </div>
    `);
  }

  cmdProjects() {
    this.append(`
      <div style="margin: 8px 0;">
        <div class="color-accent" style="font-weight: 700; margin-bottom: 8px;">// HOLOCRON ARTIFACTS (FLAGSHIP PROJECTS)</div>

        <div class="term-project-box">
          <div class="term-project-header">
            <span class="term-project-title">01. SYNAPSE-X // AUTONOMOUS NEURAL ENGINE</span>
            <span class="term-project-badge">SUB-18MS LATENCY</span>
          </div>
          <div class="color-secondary">Multi-agent orchestrator managing distributed LLMs, vector memory caching, and live execution graphs.</div>
          <div style="margin-top: 4px; font-size: 0.8rem;"><span class="color-muted">STACK:</span> Rust, WebGPU, Next.js, Redis Vector</div>
          <div style="margin-top: 6px;"><a href="https://github.com/aabhirup" target="_blank" class="term-link">[VIEW REPOSITORY // SCHEMATICS]</a></div>
        </div>

        <div class="term-project-box">
          <div class="term-project-header">
            <span class="term-project-title">02. CHRONO-SPHERE // 3D QUANTUM VISUALIZER</span>
            <span class="term-project-badge">60 FPS LOCKED</span>
          </div>
          <div class="color-secondary">Interactive real-time celestial visualizer computing N-body gravitational fields and quantum particle simulations.</div>
          <div style="margin-top: 4px; font-size: 0.8rem;"><span class="color-muted">STACK:</span> Three.js, GLSL, Web Workers, Web Audio API</div>
          <div style="margin-top: 6px;"><a href="https://github.com/aabhirup" target="_blank" class="term-link">[LAUNCH SIMULATION]</a></div>
        </div>

        <div class="term-project-box">
          <div class="term-project-header">
            <span class="term-project-title">03. AEGIS-DEFENSE // ZERO-TRUST TELEMETRY</span>
            <span class="term-project-badge">1.4M PPS</span>
          </div>
          <div class="color-secondary">Zero-trust security surveillance grid featuring autonomous anomaly mitigation and network packet telemetry.</div>
          <div style="margin-top: 4px; font-size: 0.8rem;"><span class="color-muted">STACK:</span> Go, Kafka, eBPF, React Flow</div>
          <div style="margin-top: 6px;"><a href="https://github.com/aabhirup" target="_blank" class="term-link">[INSPECT SYSTEM ARCHITECTURE]</a></div>
        </div>

        <div class="term-project-box">
          <div class="term-project-header">
            <span class="term-project-title">04. NEXUS-FLEET // ROBOTIC SWARM PROTOCOL</span>
            <span class="term-project-badge">1,200 NODES</span>
          </div>
          <div class="color-secondary">Decentralized P2P telemetry mesh for coordinating autonomous drone swarms with obstacle negotiation.</div>
          <div style="margin-top: 4px; font-size: 0.8rem;"><span class="color-muted">STACK:</span> C++, WASM, WebRTC, Mapbox GL</div>
          <div style="margin-top: 6px;"><a href="https://github.com/aabhirup" target="_blank" class="term-link">[ACCESS SWARM TELEMETRY]</a></div>
        </div>
      </div>
    `);
  }

  cmdContact() {
    this.append(`
      <div style="margin: 8px 0; line-height: 1.6;">
        <div class="color-accent" style="font-weight: 700;">// TRANSMISSION FREQUENCIES (CONNECT WITH AABHIRUP)</div>
        <div style="margin-top: 6px;">
          <div>[EMAIL]    : <a href="mailto:aabhirup@quantum-arch.dev" class="term-link">aabhirup@quantum-arch.dev</a></div>
          <div>[GITHUB]   : <a href="https://github.com/aabhirup" target="_blank" class="term-link">github.com/aabhirup</a></div>
          <div>[LINKEDIN] : <a href="https://linkedin.com/in/aabhirup" target="_blank" class="term-link">linkedin.com/in/aabhirup</a></div>
          <div>[TWITTER/X]: <a href="https://x.com/aabhirup_dev" target="_blank" class="term-link">@aabhirup_dev</a></div>
          <div>[DISCORD]  : <span class="color-green">aabhirup#0001</span></div>
        </div>
        <div class="color-secondary" style="margin-top: 8px;">
          Direct curl command:
          <div style="background: rgba(0,0,0,0.5); padding: 6px 10px; border-left: 2px solid var(--term-accent); margin-top: 4px;">
            curl -X POST https://aabhirup.dev/api/hire -d '{"sender":"your-name","message":"hello"}'
          </div>
        </div>
      </div>
    `);
  }

  cmdTheme(args = []) {
    const themeName = args[0] ? args[0].toLowerCase() : '';
    const availableThemes = ['cyber', 'matrix', 'synthwave', 'amber', 'dracula'];

    if (!themeName || !availableThemes.includes(themeName)) {
      this.append(`
        <div>Available themes: <span class="color-accent">${availableThemes.join(', ')}</span></div>
        <div class="color-muted">Usage: theme &lt;name&gt; (e.g. <span class="color-green">theme matrix</span> or <span class="color-green">theme synthwave</span>)</div>
      `);
      return;
    }

    const themeMap = {
      cyber: 'cyber',
      matrix: 'matrix',
      synthwave: 'synthwave',
      amber: 'amber',
      dracula: 'dracula'
    };

    const targetTheme = themeMap[themeName];
    if (targetTheme === 'cyber') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', targetTheme);
    }

    localStorage.setItem('term_theme', targetTheme);
    this.append(`Theme updated to: <span class="color-accent">[${themeName.toUpperCase()}]</span>`);
  }

  cmdMatrix() {
    if (window.matrixRain) {
      const active = window.matrixRain.toggle();
      const btn = document.getElementById('matrix-btn');
      if (btn) btn.classList.toggle('active', active);
      this.append(`Matrix Digital Rain: <span class="${active ? 'color-green' : 'color-warn'}">${active ? 'ENABLED [STREAMING]' : 'DISABLED'}</span>`);
    }
  }

  cmdSound() {
    if (window.termAudio) {
      const active = window.termAudio.toggle();
      const btn = document.getElementById('sound-btn');
      if (btn) btn.classList.toggle('active', active);
      this.append(`Mechanical Audio Synthesizer: <span class="${active ? 'color-green' : 'color-warn'}">${active ? 'ONLINE' : 'MUTED'}</span>`);
    }
  }

  cmdClear() {
    this.screen.innerHTML = '';
  }

  cmdDate() {
    this.append(`<div>GALACTIC UTC TIMESTAMP: <span class="color-accent">${new Date().toUTCString()}</span></div>`);
  }

  cmdUptime() {
    this.append(`<div>02:45:00 up 42 days, 13:37, 1 user, load average: 0.12, 0.08, 0.04</div>`);
  }

  cmdHistory() {
    if (this.history.length === 0) {
      this.append(`<span class="color-muted">No commands in buffer.</span>`);
      return;
    }
    const lines = this.history.map((c, i) => `${(i + 1).toString().padStart(4, ' ')}  ${c}`).join('<br>');
    this.append(`<div style="font-family: monospace;">${lines}</div>`);
  }

  cmdEcho(args = []) {
    this.append(this.escapeHTML(args.join(' ')));
  }

  cmdSudo(args = []) {
    const full = args.join(' ');
    if (full.includes('rm') && (full.includes('-rf') || full.includes('/'))) {
      this.append(`
        <div class="color-error" style="font-weight: 700;">
          [CRITICAL DEFENSE OVERRIDE]: Nice try! Self-destruct sequence aborted.
          Target /home/aabhirup is cryptographically hardened.
        </div>
      `);
      if (window.termAudio) window.termAudio.playBell();
    } else {
      this.append(`
        <div><span class="color-green">[ROOT GRANTED]</span> Executing directive with omni privileges...</div>
        <div class="color-secondary">Directive dispatched successfully.</div>
      `);
    }
  }

  // --- Boot Sequence Simulation ---
  boot() {
    this.cmdClear();

    const bootLines = [
      '[  OK  ] Initializing Quantum Core BIOS v4.19...',
      '[  OK  ] Loading Linux Kernel 6.12.4-zen-quantum...',
      '[  OK  ] Checking RAM integrity: 64.0 GiB OK',
      '[  OK  ] Mounted Virtual File System (/home/aabhirup)...',
      '[  OK  ] Neural Audio DSP Driver: Online',
      '[  OK  ] Started Host: aabhirup@arch-quantum (tty1)'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        this.append(`<span class="color-green">${bootLines[i]}</span>`);
        i++;
      } else {
        clearInterval(interval);
        this.finishBoot();
      }
    }, 90);
  }

  finishBoot() {
    this.append(`
      <div class="ascii-banner">
   ___    ___   ___   __  __ _____ ____   __  __ ____  
  / _ \\  / _ \\ / _ ) / / / //  _ // __ \\ / / / // __ \\ 
 / // / / // // _  |/ _  / _/ /  / /_/ // // // /_/ / 
/_/ /_/ /_/ /_/____//_//_//___/  /_/ /_/ \\___//_//_/   
      </div>
      <div style="margin: 4px 0 12px 0;">
        <span class="color-accent" style="font-weight: 700;">AABHIRUP-OS v4.19</span> // Type <span class="color-green">help</span> for directives or click quick commands below.
      </div>
    `);

    // Auto-run name command for welcoming greeting!
    this.cmdName();
    this.updateActivePrompt();
    this.input.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.linuxTerminal = new LinuxTerminal();
});
