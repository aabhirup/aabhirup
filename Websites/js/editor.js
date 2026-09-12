/**
 * Bento Grid Visual Editor & Code Generator Engine
 * Allows arranging, formatting, resizing, adding/deleting cards,
 * and copying clean production-ready HTML code to clipboard.
 */

(function () {
  'use strict';

  // Preset Card Templates
  const CARD_TEMPLATES = {
    standard: {
      type: 'standard',
      colSpan: 6,
      tag: 'Core Focus // 01',
      status: 'Active Study',
      title: 'AI & Deep Learning Foundations',
      desc: 'Actively building and experimenting with neural network architectures. Understanding loss landscapes and attention mechanisms.',
      pills: ['PyTorch', 'Transformers', 'Embeddings'],
      note: 'Focusing on computation, optimization, and scalable inference.',
      link: { text: '', url: '' }
    },
    project: {
      type: 'project',
      colSpan: 6,
      tag: 'Flagship System',
      status: 'Sub-18ms Latency',
      title: 'SYNAPSE-X // Neural Copilot',
      desc: 'Autonomous multi-agent neural assistant orchestrating distributed LLMs, vector memory caching, and live execution graphs.',
      pills: ['Rust', 'WebGPU', 'Next.js', 'Vector DB'],
      note: '',
      link: { text: 'View project schematics', url: 'https://github.com/aabhirup' }
    },
    stack: {
      type: 'stack',
      colSpan: 6,
      tag: 'Capabilities',
      status: '',
      title: 'Technical Arsenal',
      desc: 'Tools, frameworks, and languages honed across AI experimentation and modern web infrastructure.',
      pills: ['Python', 'PyTorch', 'TypeScript', 'Rust', 'Docker'],
      note: '',
      link: { text: '', url: '' }
    },
    timeline: {
      type: 'timeline',
      colSpan: 6,
      tag: 'Career Milestones',
      status: '',
      title: 'Experience & Roles',
      desc: 'Highlights from engineering leadership and technical development.',
      pills: [],
      note: '',
      link: { text: '', url: '' },
      timelineItems: [
        { role: 'Principal Systems Architect', org: 'Quantum Dynamics Labs', time: '2024 — Present' },
        { role: 'Lead Full-Stack Engineer', org: 'CyberNet Systems', time: '2022 — 2024' },
        { role: '3D Web Technologist', org: 'Nexus Interactive Studio', time: '2020 — 2022' }
      ]
    },
    stat: {
      type: 'stat',
      colSpan: 4,
      tag: 'Performance Metric',
      status: 'Verified',
      title: '99.98% Accuracy',
      desc: 'Evaluated across 1.2M validation inference vectors with zero drift.',
      pills: ['Latency: 12ms', 'TPU v4'],
      note: 'Benchmarked on custom neural cluster.',
      link: { text: '', url: '' }
    }
  };

  // Initial Default Cards (The portfolio's current curated items)
  const DEFAULT_CARDS = [
    {
      id: 'card-ai-foundations',
      type: 'standard',
      colSpan: 7,
      tag: 'Core Focus // 01',
      status: 'Active Study',
      title: 'AI & Deep Learning Foundations',
      desc: 'Actively building and experimenting with neural network architectures. Understanding the mathematical intuition behind backpropagation, loss landscapes, and attention mechanisms to create intelligent systems that amplify human thinking.',
      pills: ['PyTorch', 'Transformers', 'Self-Attention', 'Vector Embeddings', 'Multi-Agent Loops', 'RAG Pipelines'],
      note: '"Focusing on the first principles of computation, optimization, and scalable inference."',
      link: { text: '', url: '' }
    },
    {
      id: 'card-synapse-x',
      type: 'project',
      colSpan: 5,
      tag: 'Flagship System',
      status: 'Sub-18ms Latency',
      title: 'SYNAPSE-X // Neural Copilot',
      desc: 'Autonomous multi-agent neural assistant that orchestrates distributed LLMs, vector memory caching, and live execution graphs with low-latency delivery.',
      pills: ['Rust', 'WebGPU', 'Next.js', 'Vector DB'],
      note: '',
      link: { text: 'View project schematics', url: 'https://github.com/aabhirup' }
    },
    {
      id: 'card-chrono-sphere',
      type: 'project',
      colSpan: 6,
      tag: '3D WebGL Graphics',
      status: '60 FPS Locked',
      title: 'CHRONO-SPHERE // 3D Celestial Engine',
      desc: 'Real-time 3D celestial visualizer computing N-body gravitational fields and quantum particle simulations natively in browser GLSL fragment shaders.',
      pills: ['Three.js', 'GLSL Shaders', 'Web Workers', 'Web Audio'],
      note: '',
      link: { text: 'Launch visualizer simulation', url: 'https://github.com/aabhirup' }
    },
    {
      id: 'card-technical-arsenal',
      type: 'stack',
      colSpan: 6,
      tag: 'Capabilities',
      status: '',
      title: 'Technical Arsenal',
      desc: 'Tools, frameworks, and languages honed across AI experimentation and modern web infrastructure.',
      pills: ['Python', 'PyTorch', 'Hugging Face', 'TypeScript', 'Next.js', 'WebGL', 'Go (Golang)', 'Rust', 'Docker'],
      note: '',
      link: { text: '', url: '' }
    },
    {
      id: 'card-milestones',
      type: 'timeline',
      colSpan: 12,
      tag: 'Career Milestones',
      status: '',
      title: 'Experience & Roles',
      desc: 'Highlights from engineering leadership and technical development.',
      pills: [],
      note: '',
      link: { text: '', url: '' },
      timelineItems: [
        { role: 'Principal Systems Architect', org: 'Quantum Dynamics Labs', time: '2024 — Present' },
        { role: 'Lead Full-Stack Engineer', org: 'CyberNet Systems', time: '2022 — 2024' },
        { role: '3D Web Technologist', org: 'Nexus Interactive Studio', time: '2020 — 2022' }
      ]
    }
  ];

  // State
  let cards = [];
  let isEditMode = true;
  let activeCardId = null;
  let draggedCardIndex = null;

  // Initialize
  function init() {
    loadCards();
    renderGrid();
    initToolbarEvents();
    initInspectorEvents();
    initCodeModalEvents();
  }

  function loadCards() {
    try {
      const saved = localStorage.getItem('bento_editor_cards_v1');
      if (saved) {
        cards = JSON.parse(saved);
      } else {
        cards = JSON.parse(JSON.stringify(DEFAULT_CARDS));
      }
    } catch (e) {
      console.error('Error reading saved cards:', e);
      cards = JSON.parse(JSON.stringify(DEFAULT_CARDS));
    }
  }

  function saveCardsToStorage() {
    try {
      localStorage.setItem('bento_editor_cards_v1', JSON.stringify(cards));
    } catch (e) {
      console.error('Error saving cards:', e);
    }
  }

  // Render Grid
  function renderGrid() {
    const grid = document.getElementById('bento-grid-canvas');
    if (!grid) return;

    grid.innerHTML = '';
    grid.className = `bento-grid ${isEditMode ? 'is-editing' : 'is-previewing'}`;

    cards.forEach((card, index) => {
      const cardEl = createCardElement(card, index);
      grid.appendChild(cardEl);
    });

    // Reattach spotlight listeners
    if (window.initSpotlightEffect) {
      window.initSpotlightEffect();
    }
  }

  // Create single card DOM
  function createCardElement(card, index) {
    const el = document.createElement('article');
    el.id = card.id || `card-${index}`;
    el.className = `bento-card col-${card.colSpan} ${activeCardId === card.id ? 'is-selected' : ''}`;
    el.dataset.index = index;
    el.dataset.id = card.id;

    if (isEditMode) {
      el.draggable = true;
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragover', handleDragOver);
      el.addEventListener('dragleave', handleDragLeave);
      el.addEventListener('drop', handleDrop);
      el.addEventListener('dragend', handleDragEnd);
    }

    // Editor Floating Action Overlay (Size & Actions)
    let editChromeHtml = '';
    if (isEditMode) {
      editChromeHtml = `
        <div class="card-edit-overlay" onclick="event.stopPropagation();">
          <div class="card-size-selector">
            <span class="size-label">Span:</span>
            <div class="size-pills">
              ${[4, 5, 6, 7, 8, 12].map(span => `
                <button type="button" class="size-btn ${card.colSpan === span ? 'active' : ''}" 
                  data-action="resize" data-span="${span}" title="Span ${span} Columns">
                  ${span}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card-quick-actions">
            <button type="button" class="action-btn" data-action="move-up" title="Move Left / Up" ${index === 0 ? 'disabled' : ''}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
            <button type="button" class="action-btn" data-action="move-down" title="Move Right / Down" ${index === cards.length - 1 ? 'disabled' : ''}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button type="button" class="action-btn edit-btn" data-action="edit" title="Format Content & Styling">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Edit</span>
            </button>
            <button type="button" class="action-btn" data-action="duplicate" title="Duplicate Box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button type="button" class="action-btn delete-btn" data-action="delete" title="Delete Box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }

    // Card Inner Content
    let contentHtml = '';

    // Header Tag & Status
    const headerHtml = `
      <div class="card-header">
        <span class="card-tag">${escapeHtml(card.tag || 'CARD // ' + (index + 1))}</span>
        ${card.status ? `<span class="card-status-badge">${escapeHtml(card.status)}</span>` : ''}
      </div>
    `;

    // Title & Description
    const titleHtml = `<h2 class="card-title">${escapeHtml(card.title || 'Card Title')}</h2>`;
    const descHtml = card.desc ? `<p class="card-desc">${escapeHtml(card.desc)}</p>` : '';

    // Tech Pills
    let pillsHtml = '';
    if (card.pills && card.pills.length > 0) {
      pillsHtml = `
        <div class="project-meta-pills">
          ${card.pills.map(p => `<span class="pill">${escapeHtml(p)}</span>`).join('')}
        </div>
      `;
    }

    // Note / Quote footer
    let noteHtml = '';
    if (card.note) {
      noteHtml = `
        <div class="card-footer-note">
          ${escapeHtml(card.note)}
        </div>
      `;
    }

    // Link
    let linkHtml = '';
    if (card.link && card.link.text) {
      linkHtml = `
        <a href="${escapeHtml(card.link.url || '#')}" target="_blank" rel="noopener noreferrer" class="project-link">
          <span>${escapeHtml(card.link.text)}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      `;
    }

    // Timeline items (if timeline card)
    let timelineHtml = '';
    if (card.type === 'timeline' && card.timelineItems && card.timelineItems.length > 0) {
      timelineHtml = `
        <div class="timeline-list">
          ${card.timelineItems.map(item => `
            <div class="timeline-row">
              <div>
                <div class="timeline-role">${escapeHtml(item.role)}</div>
                <div class="timeline-org">${escapeHtml(item.org)}</div>
              </div>
              <div class="timeline-time">${escapeHtml(item.time)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Assemble card content depending on type
    if (card.type === 'project') {
      contentHtml = `
        ${editChromeHtml}
        <div class="project-item">
          <div>
            ${headerHtml}
            ${titleHtml}
            ${descHtml}
            ${pillsHtml}
          </div>
          ${linkHtml}
        </div>
      `;
    } else if (card.type === 'timeline') {
      contentHtml = `
        ${editChromeHtml}
        ${headerHtml}
        ${titleHtml}
        ${descHtml}
        ${timelineHtml}
      `;
    } else {
      contentHtml = `
        ${editChromeHtml}
        ${headerHtml}
        ${titleHtml}
        ${descHtml}
        ${pillsHtml}
        ${noteHtml}
        ${linkHtml}
      `;
    }

    el.innerHTML = contentHtml;

    // Attach card event listeners
    if (isEditMode) {
      el.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('button[data-action]');
        if (targetBtn) {
          const action = targetBtn.dataset.action;
          if (action === 'resize') {
            const span = parseInt(targetBtn.dataset.span, 10);
            updateCardSpan(index, span);
          } else if (action === 'move-up') {
            moveCard(index, -1);
          } else if (action === 'move-down') {
            moveCard(index, 1);
          } else if (action === 'edit') {
            openInspector(card.id);
          } else if (action === 'duplicate') {
            duplicateCard(index);
          } else if (action === 'delete') {
            deleteCard(index);
          }
          return;
        }

        // Clicking anywhere on the card selects it and opens inspector
        openInspector(card.id);
      });
    }

    return el;
  }

  // Sizing update
  function updateCardSpan(index, span) {
    if (cards[index]) {
      cards[index].colSpan = span;
      saveCardsToStorage();
      renderGrid();
      triggerTactileSound();
      showToast(`Resized box to ${span} columns`);
    }
  }

  // Move Card (Rearrange)
  function moveCard(fromIndex, delta) {
    const toIndex = fromIndex + delta;
    if (toIndex < 0 || toIndex >= cards.length) return;

    const item = cards.splice(fromIndex, 1)[0];
    cards.splice(toIndex, 0, item);
    saveCardsToStorage();
    renderGrid();
    triggerTactileSound();
    showToast(`Moved box to position ${toIndex + 1}`);
  }

  // Drag and Drop
  function handleDragStart(e) {
    draggedCardIndex = parseInt(this.dataset.index, 10);
    this.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCardIndex);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-hover');
  }

  function handleDragLeave() {
    this.classList.remove('drag-hover');
  }

  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-hover');
    const targetIndex = parseInt(this.dataset.index, 10);

    if (draggedCardIndex !== null && draggedCardIndex !== targetIndex) {
      const item = cards.splice(draggedCardIndex, 1)[0];
      cards.splice(targetIndex, 0, item);
      saveCardsToStorage();
      renderGrid();
      triggerTactileSound();
      showToast(`Rearranged box`);
    }
  }

  function handleDragEnd() {
    this.classList.remove('is-dragging');
    document.querySelectorAll('.bento-card').forEach(c => c.classList.remove('drag-hover'));
    draggedCardIndex = null;
  }

  // Duplicate Card
  function duplicateCard(index) {
    const original = cards[index];
    const copy = JSON.parse(JSON.stringify(original));
    copy.id = `card-${Date.now()}`;
    copy.title = `${copy.title} (Copy)`;
    cards.splice(index + 1, 0, copy);
    saveCardsToStorage();
    renderGrid();
    triggerTactileSound();
    showToast('Box duplicated');
  }

  // Delete Card
  function deleteCard(index) {
    if (cards.length <= 1) {
      showToast('You must have at least one box in the grid!');
      return;
    }
    cards.splice(index, 1);
    saveCardsToStorage();
    renderGrid();
    triggerTactileSound();
    showToast('Box deleted');
    closeInspector();
  }

  // Add Card
  function addCard(templateKey = 'standard') {
    const template = CARD_TEMPLATES[templateKey] || CARD_TEMPLATES.standard;
    const newCard = JSON.parse(JSON.stringify(template));
    newCard.id = `card-${Date.now()}`;
    newCard.tag = `Custom Box // 0${cards.length + 1}`;
    cards.push(newCard);
    saveCardsToStorage();
    renderGrid();
    triggerTactileSound();
    showToast(`Added new ${templateKey} box`);

    // Scroll to new card and open inspector
    setTimeout(() => {
      const newEl = document.getElementById(newCard.id);
      if (newEl) {
        newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        openInspector(newCard.id);
      }
    }, 100);
  }

  // Layout Presets
  function applyPresetLayout(presetName) {
    if (presetName === 'balanced-2col') {
      cards.forEach(c => c.colSpan = 6);
      showToast('Applied 2-Column Balanced Layout (col-6)');
    } else if (presetName === 'hero-asymmetric') {
      cards.forEach((c, idx) => {
        if (idx % 2 === 0) c.colSpan = 7;
        else c.colSpan = 5;
      });
      showToast('Applied Hero Asymmetric Layout (7 + 5 cols)');
    } else if (presetName === 'trio-3col') {
      cards.forEach(c => c.colSpan = 4);
      showToast('Applied 3-Column Grid Layout (col-4)');
    } else if (presetName === 'full-showcase') {
      cards.forEach(c => c.colSpan = 12);
      showToast('Applied Full Width Layout (col-12)');
    }
    saveCardsToStorage();
    renderGrid();
    triggerTactileSound();
  }

  // Inspector Panel (Card Formatting Tools)
  function openInspector(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    activeCardId = cardId;
    renderGrid(); // update is-selected class

    const inspector = document.getElementById('bento-inspector-drawer');
    if (!inspector) return;

    // Populate fields
    document.getElementById('insp-card-id').value = card.id;
    document.getElementById('insp-tag').value = card.tag || '';
    document.getElementById('insp-status').value = card.status || '';
    document.getElementById('insp-title').value = card.title || '';
    document.getElementById('insp-desc').value = card.desc || '';
    document.getElementById('insp-span-select').value = card.colSpan;
    document.getElementById('insp-type-select').value = card.type || 'standard';
    document.getElementById('insp-note').value = card.note || '';
    document.getElementById('insp-link-text').value = card.link?.text || '';
    document.getElementById('insp-link-url').value = card.link?.url || '';

    // Pills
    renderInspectorPills(card.pills || []);

    inspector.classList.add('open');
  }

  function closeInspector() {
    activeCardId = null;
    const inspector = document.getElementById('bento-inspector-drawer');
    if (inspector) inspector.classList.remove('open');
    document.querySelectorAll('.bento-card').forEach(c => c.classList.remove('is-selected'));
  }

  function renderInspectorPills(pills) {
    const pillsList = document.getElementById('insp-pills-list');
    if (!pillsList) return;

    pillsList.innerHTML = pills.map((pill, idx) => `
      <span class="insp-pill-tag">
        ${escapeHtml(pill)}
        <button type="button" class="remove-pill-btn" data-pill-index="${idx}">×</button>
      </span>
    `).join('');
  }

  // Inspector Events
  function initInspectorEvents() {
    const inspector = document.getElementById('bento-inspector-drawer');
    if (!inspector) return;

    document.getElementById('close-inspector-btn')?.addEventListener('click', closeInspector);

    // Live sync input listeners
    const inputs = ['insp-tag', 'insp-status', 'insp-title', 'insp-desc', 'insp-note', 'insp-link-text', 'insp-link-url'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          syncInspectorToCard();
        });
      }
    });

    document.getElementById('insp-span-select')?.addEventListener('change', (e) => {
      const card = cards.find(c => c.id === activeCardId);
      if (card) {
        card.colSpan = parseInt(e.target.value, 10);
        saveCardsToStorage();
        renderGrid();
      }
    });

    document.getElementById('insp-type-select')?.addEventListener('change', (e) => {
      const card = cards.find(c => c.id === activeCardId);
      if (card) {
        card.type = e.target.value;
        saveCardsToStorage();
        renderGrid();
      }
    });

    // Add Pill
    const addPillBtn = document.getElementById('add-pill-btn');
    const pillInput = document.getElementById('new-pill-input');

    const handleAddPill = () => {
      const val = pillInput.value.trim();
      if (!val) return;
      const card = cards.find(c => c.id === activeCardId);
      if (card) {
        if (!card.pills) card.pills = [];
        card.pills.push(val);
        pillInput.value = '';
        renderInspectorPills(card.pills);
        saveCardsToStorage();
        renderGrid();
        triggerTactileSound();
      }
    };

    addPillBtn?.addEventListener('click', handleAddPill);
    pillInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddPill();
      }
    });

    // Remove pill
    document.getElementById('insp-pills-list')?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.remove-pill-btn');
      if (removeBtn) {
        const idx = parseInt(removeBtn.dataset.pillIndex, 10);
        const card = cards.find(c => c.id === activeCardId);
        if (card && card.pills) {
          card.pills.splice(idx, 1);
          renderInspectorPills(card.pills);
          saveCardsToStorage();
          renderGrid();
          triggerTactileSound();
        }
      }
    });
  }

  function syncInspectorToCard() {
    const card = cards.find(c => c.id === activeCardId);
    if (!card) return;

    card.tag = document.getElementById('insp-tag').value;
    card.status = document.getElementById('insp-status').value;
    card.title = document.getElementById('insp-title').value;
    card.desc = document.getElementById('insp-desc').value;
    card.note = document.getElementById('insp-note').value;
    
    if (!card.link) card.link = { text: '', url: '' };
    card.link.text = document.getElementById('insp-link-text').value;
    card.link.url = document.getElementById('insp-link-url').value;

    saveCardsToStorage();
    renderGrid();
  }

  // Code Generation & Copy
  function generateGridHtml() {
    let html = '<!-- ====================================================================\n';
    html += '     BENTO GRID (GENERATED BY BENTO EDITOR)\n';
    html += '     ==================================================================== -->\n';
    html += '<main class="bento-grid">\n\n';

    cards.forEach((card, idx) => {
      const cardNum = idx + 1;
      html += `  <!-- Card ${cardNum}: ${escapeHtml(card.title || 'Custom Card')} (col-${card.colSpan}) -->\n`;
      html += `  <article class="bento-card col-${card.colSpan}">\n`;

      if (card.type === 'project') {
        html += `    <div class="project-item">\n`;
        html += `      <div>\n`;
        html += `        <div class="card-header">\n`;
        html += `          <span class="card-tag">${escapeHtml(card.tag || 'FLAGSHIP // ' + cardNum)}</span>\n`;
        if (card.status) {
          html += `          <span class="card-tag">${escapeHtml(card.status)}</span>\n`;
        }
        html += `        </div>\n`;
        html += `        <h3 class="card-title">${escapeHtml(card.title)}</h3>\n`;
        if (card.desc) {
          html += `        <p class="card-desc">${escapeHtml(card.desc)}</p>\n`;
        }
        if (card.pills && card.pills.length) {
          html += `        <div class="project-meta-pills">\n`;
          card.pills.forEach(p => {
            html += `          <span class="pill">${escapeHtml(p)}</span>\n`;
          });
          html += `        </div>\n`;
        }
        html += `      </div>\n\n`;
        if (card.link && card.link.text) {
          html += `      <a href="${escapeHtml(card.link.url || '#')}" target="_blank" rel="noopener noreferrer" class="project-link">\n`;
          html += `        <span>${escapeHtml(card.link.text)}</span>\n`;
          html += `        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n`;
          html += `          <line x1="7" y1="17" x2="17" y2="7"></line>\n`;
          html += `          <polyline points="7 7 17 7 17 17"></polyline>\n`;
          html += `        </svg>\n`;
          html += `      </a>\n`;
        }
        html += `    </div>\n`;
      } else if (card.type === 'timeline') {
        html += `    <div class="card-header">\n`;
        html += `      <span class="card-tag">${escapeHtml(card.tag || 'MILESTONES')}</span>\n`;
        html += `    </div>\n`;
        html += `    <h3 class="card-title">${escapeHtml(card.title)}</h3>\n`;
        if (card.desc) {
          html += `    <p class="card-desc">${escapeHtml(card.desc)}</p>\n`;
        }
        if (card.timelineItems && card.timelineItems.length) {
          html += `    <div class="timeline-list">\n`;
          card.timelineItems.forEach(item => {
            html += `      <div class="timeline-row">\n`;
            html += `        <div>\n`;
            html += `          <div class="timeline-role">${escapeHtml(item.role)}</div>\n`;
            html += `          <div class="timeline-org">${escapeHtml(item.org)}</div>\n`;
            html += `        </div>\n`;
            html += `        <div class="timeline-time">${escapeHtml(item.time)}</div>\n`;
            html += `      </div>\n`;
          });
          html += `    </div>\n`;
        }
      } else {
        html += `    <div class="card-header">\n`;
        html += `      <span class="card-tag">${escapeHtml(card.tag || 'CARD // ' + cardNum)}</span>\n`;
        if (card.status) {
          html += `      <span style="font-size: 0.8rem; color: var(--accent-dot);">${escapeHtml(card.status)}</span>\n`;
        }
        html += `    </div>\n\n`;
        html += `    <h2 class="card-title">${escapeHtml(card.title)}</h2>\n`;
        if (card.desc) {
          html += `    <p class="card-desc">\n      ${escapeHtml(card.desc)}\n    </p>\n`;
        }
        if (card.pills && card.pills.length) {
          html += `\n    <div class="project-meta-pills">\n`;
          card.pills.forEach(p => {
            html += `      <span class="pill">${escapeHtml(p)}</span>\n`;
          });
          html += `    </div>\n`;
        }
        if (card.note) {
          html += `\n    <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); font-size: 0.84rem; color: var(--text-muted);">\n`;
          html += `      ${escapeHtml(card.note)}\n`;
          html += `    </div>\n`;
        }
        if (card.link && card.link.text) {
          html += `\n    <a href="${escapeHtml(card.link.url || '#')}" target="_blank" rel="noopener noreferrer" class="project-link" style="margin-top: 16px;">\n`;
          html += `      <span>${escapeHtml(card.link.text)}</span>\n`;
          html += `      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>\n`;
          html += `    </a>\n`;
        }
      }

      html += `  </article>\n\n`;
    });

    html += '</main>\n';
    return html;
  }

  // Save & Copy Action
  function saveAndCopyCode() {
    const code = generateGridHtml();
    saveCardsToStorage();

    navigator.clipboard.writeText(code).then(() => {
      triggerTactileSound();
      showToast('✨ Code copied to clipboard! You can paste it into your editor.');

      // Update button state visually
      const saveBtn = document.getElementById('save-copy-btn');
      if (saveBtn) {
        const originalHtml = saveBtn.innerHTML;
        saveBtn.classList.add('copied');
        saveBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied Code!</span>
        `;
        setTimeout(() => {
          saveBtn.classList.remove('copied');
          saveBtn.innerHTML = originalHtml;
        }, 2500);
      }
    }).catch(err => {
      console.error('Clipboard write failed, opening modal:', err);
      openCodeModal();
    });
  }

  // Code Modal
  function openCodeModal() {
    const modal = document.getElementById('bento-code-modal');
    const codePre = document.getElementById('generated-code-snippet');
    if (!modal || !codePre) return;

    codePre.textContent = generateGridHtml();
    modal.classList.add('open');
  }

  function closeCodeModal() {
    const modal = document.getElementById('bento-code-modal');
    if (modal) modal.classList.remove('open');
  }

  function initCodeModalEvents() {
    document.getElementById('close-code-modal-btn')?.addEventListener('click', closeCodeModal);
    document.getElementById('modal-copy-btn')?.addEventListener('click', () => {
      const code = document.getElementById('generated-code-snippet')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        triggerTactileSound();
        showToast('Code copied to clipboard!');
      });
    });

    // Close on backdrop click
    document.getElementById('bento-code-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'bento-code-modal') closeCodeModal();
    });
  }

  // Toolbar Events
  function initToolbarEvents() {
    // Add Box Button & Dropdown
    const addBtn = document.getElementById('add-box-btn');
    const addMenu = document.getElementById('add-box-menu');
    addBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      addMenu?.classList.toggle('show');
    });

    document.querySelectorAll('.add-template-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        addCard(type);
        addMenu?.classList.remove('show');
      });
    });

    // Close dropdowns on click outside
    window.addEventListener('click', () => {
      addMenu?.classList.remove('show');
      document.getElementById('preset-menu')?.classList.remove('show');
    });

    // Presets Button & Dropdown
    const presetBtn = document.getElementById('presets-btn');
    const presetMenu = document.getElementById('preset-menu');
    presetBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      presetMenu?.classList.toggle('show');
    });

    document.querySelectorAll('.preset-item').forEach(item => {
      item.addEventListener('click', () => {
        const preset = item.dataset.preset;
        applyPresetLayout(preset);
        presetMenu?.classList.remove('show');
      });
    });

    // Mode Toggle (Edit / Preview)
    const modeBtn = document.getElementById('editor-mode-toggle');
    modeBtn?.addEventListener('click', () => {
      isEditMode = !isEditMode;
      modeBtn.classList.toggle('active', !isEditMode);
      modeBtn.innerHTML = isEditMode
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg><span>Preview Mode</span>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg><span>Edit Mode</span>`;
      
      closeInspector();
      renderGrid();
      triggerTactileSound();
      showToast(isEditMode ? 'Switched to Edit Mode' : 'Previewing Clean Layout');
    });

    // Save & Copy Button
    document.getElementById('save-copy-btn')?.addEventListener('click', saveAndCopyCode);

    // View Code Modal Button
    document.getElementById('view-code-btn')?.addEventListener('click', openCodeModal);

    // Reset Defaults Button
    document.getElementById('reset-defaults-btn')?.addEventListener('click', () => {
      if (confirm('Reset layout back to default sample cards?')) {
        cards = JSON.parse(JSON.stringify(DEFAULT_CARDS));
        saveCardsToStorage();
        renderGrid();
        triggerTactileSound();
        showToast('Reset to default bento boxes');
      }
    });
  }

  // Toast Notification
  function showToast(msg) {
    let toast = document.getElementById('bento-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bento-toast';
      toast.className = 'bento-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');

    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  function triggerTactileSound() {
    if (window.tactileAudio) {
      window.tactileAudio.playPop();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export globally for initialization
  window.BentoEditor = {
    init,
    getCards: () => cards,
    saveAndCopyCode,
    generateGridHtml
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
