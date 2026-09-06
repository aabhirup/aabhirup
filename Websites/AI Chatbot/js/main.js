/**
 * Aabhirup AI - Apple-Grade Conversational UI & Profile Customizer
 * Manages renamable chat threads, prompts above chatbox, and theme color personalization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Color Palette Definitions
  const colorThemes = {
    indigo: {
      accent: '#6366f1',
      hover: '#4f46e5',
      glow: 'rgba(99, 102, 241, 0.35)',
      subtle: 'rgba(99, 102, 241, 0.14)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
    },
    cyan: {
      accent: '#06b6d4',
      hover: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.35)',
      subtle: 'rgba(6, 182, 212, 0.14)',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)'
    },
    emerald: {
      accent: '#10b981',
      hover: '#059669',
      glow: 'rgba(16, 185, 129, 0.35)',
      subtle: 'rgba(16, 185, 129, 0.14)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
    },
    rose: {
      accent: '#f43f5e',
      hover: '#e11d48',
      glow: 'rgba(244, 63, 94, 0.35)',
      subtle: 'rgba(244, 63, 94, 0.14)',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #c084fc 100%)'
    },
    amber: {
      accent: '#f59e0b',
      hover: '#d97706',
      glow: 'rgba(245, 158, 11, 0.35)',
      subtle: 'rgba(245, 158, 11, 0.14)',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)'
    },
    slate: {
      accent: '#94a3b8',
      hover: '#64748b',
      glow: 'rgba(148, 163, 184, 0.35)',
      subtle: 'rgba(148, 163, 184, 0.14)',
      gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #334155 100%)'
    }
  };

  // State
  let chats = JSON.parse(localStorage.getItem('aabhirup_chats')) || [
    { id: '1', title: 'Introduction to Aabhirup', prompt: 'Who is Aabhirup?' },
    { id: '2', title: 'AI & Machine Learning Journey', prompt: 'What is Aabhirup learning in AI and ML?' },
    { id: '3', title: 'Flagship Projects & Systems', prompt: 'What projects has Aabhirup built?' },
    { id: '4', title: 'Skills & Technical Stack', prompt: 'What is his tech stack?' },
    { id: '5', title: 'Connect & Collaborate', prompt: 'How can I contact Aabhirup?' }
  ];

  let activeChatId = chats[0]?.id || '1';
  let isGenerating = false;

  // DOM Elements
  const chatScrollArea = document.getElementById('chat-scroll-area');
  const chatContent = document.getElementById('chat-content');
  const welcomeHero = document.getElementById('welcome-hero');
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const newChatBtn = document.getElementById('new-chat-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const soundToggle = document.getElementById('sound-toggle');
  const sidebarThreads = document.getElementById('sidebar-threads');

  // Customizer Modal Elements
  const profileBadge = document.getElementById('user-profile-badge');
  const customizerModal = document.getElementById('customizer-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const cancelModalBtn = document.getElementById('modal-cancel-btn');
  const saveModalBtn = document.getElementById('modal-save-btn');
  const customNameInput = document.getElementById('custom-name-input');
  const customStatusInput = document.getElementById('custom-status-input');
  const colorSwatchesContainer = document.getElementById('color-swatches');

  const profileNameEl = document.getElementById('profile-name');
  const profileStatusEl = document.getElementById('profile-status');
  const profileAvatarEl = document.getElementById('profile-avatar');

  // Init
  initProfileAndColorTheme();
  renderSidebarThreads();
  initPromptStrip();
  initAutoExpandInput();
  initModalListeners();

  /* --------------------------------------------------------------------------
     Sidebar Chats Management (Create, Rename, Delete)
     -------------------------------------------------------------------------- */
  function renderSidebarThreads() {
    sidebarThreads.innerHTML = '';

    chats.forEach((chat) => {
      const item = document.createElement('div');
      item.className = `thread-item ${chat.id === activeChatId ? 'active' : ''}`;
      item.setAttribute('data-id', chat.id);

      item.innerHTML = `
        <div class="thread-main">
          <svg class="thread-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="thread-title-text">${escapeHTML(chat.title)}</span>
        </div>
        <div class="thread-actions">
          <button class="thread-action-btn btn-rename" title="Rename Chat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="thread-action-btn btn-delete" title="Delete Chat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      // Select Chat
      item.querySelector('.thread-main').addEventListener('click', () => {
        selectChat(chat.id);
      });

      // Rename Chat (Inline)
      item.querySelector('.btn-rename').addEventListener('click', (e) => {
        e.stopPropagation();
        startRenameChat(item, chat);
      });

      // Delete Chat
      item.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
      });

      sidebarThreads.appendChild(item);
    });
  }

  function startRenameChat(threadItemEl, chat) {
    const mainEl = threadItemEl.querySelector('.thread-main');
    const titleSpan = threadItemEl.querySelector('.thread-title-text');
    const currentTitle = chat.title;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'thread-edit-input';
    input.value = currentTitle;

    titleSpan.style.display = 'none';
    mainEl.appendChild(input);
    input.focus();
    input.select();

    const finishRename = () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== currentTitle) {
        chat.title = newTitle;
        saveChats();
      }
      renderSidebarThreads();
    };

    input.addEventListener('blur', finishRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.removeEventListener('blur', finishRename);
        finishRename();
      } else if (e.key === 'Escape') {
        input.removeEventListener('blur', finishRename);
        renderSidebarThreads();
      }
    });
  }

  function deleteChat(id) {
    if (chats.length <= 1) {
      alert("At least one conversation must remain.");
      return;
    }
    chats = chats.filter((c) => c.id !== id);
    if (activeChatId === id) {
      activeChatId = chats[0].id;
      selectChat(activeChatId);
    }
    saveChats();
    renderSidebarThreads();
  }

  function saveChats() {
    localStorage.setItem('aabhirup_chats', JSON.stringify(chats));
  }

  function selectChat(id) {
    activeChatId = id;
    renderSidebarThreads();

    const target = chats.find((c) => c.id === id);
    if (target && target.prompt) {
      handleSubmit(target.prompt);
    } else {
      // Empty / New chat
      chatContent.innerHTML = '';
      if (welcomeHero) {
        welcomeHero.style.display = 'flex';
        chatContent.appendChild(welcomeHero);
      }
    }
  }

  // New Chat Creation
  newChatBtn.addEventListener('click', () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: 'New Conversation',
      isNew: true
    };
    chats.unshift(newChat);
    activeChatId = newId;
    saveChats();
    renderSidebarThreads();

    chatContent.innerHTML = '';
    if (welcomeHero) {
      welcomeHero.style.display = 'flex';
      chatContent.appendChild(welcomeHero);
    }
    promptInput.value = '';
    updateInputState();
    promptInput.focus();
  });

  /* --------------------------------------------------------------------------
     Prompts Strip Directly Above Chatbox
     -------------------------------------------------------------------------- */
  function initPromptStrip() {
    const stripPills = document.querySelectorAll('.strip-pill');
    stripPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const prompt = pill.getAttribute('data-prompt');
        if (prompt) {
          handleSubmit(prompt);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Auto-Expanding Input & Submission
     -------------------------------------------------------------------------- */
  function initAutoExpandInput() {
    promptInput.addEventListener('input', updateInputState);

    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    });

    sendBtn.addEventListener('click', () => {
      handleSubmit();
    });
  }

  function updateInputState() {
    promptInput.style.height = 'auto';
    promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + 'px';

    const hasText = promptInput.value.trim().length > 0;
    sendBtn.classList.toggle('active', hasText && !isGenerating);
  }

  function handleSubmit(overridePrompt) {
    if (isGenerating) return;

    const query = overridePrompt || promptInput.value.trim();
    if (!query) return;

    // Automatically rename active chat if it was a new conversation
    const currentChat = chats.find((c) => c.id === activeChatId);
    if (currentChat && (currentChat.isNew || currentChat.title === 'New Conversation')) {
      currentChat.title = query.length > 28 ? query.slice(0, 28) + '...' : query;
      delete currentChat.isNew;
      saveChats();
      renderSidebarThreads();
    }

    // Reset input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    updateInputState();

    if (welcomeHero) {
      welcomeHero.style.display = 'none';
    }

    if (window.appleAudio) window.appleAudio.playSend();

    appendUserMessage(query);
    streamAssistantResponse(query);
  }

  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user';
    row.innerHTML = `<div class="message-bubble">${escapeHTML(text)}</div>`;
    chatContent.appendChild(row);
    scrollToBottom();
  }

  async function streamAssistantResponse(query) {
    isGenerating = true;
    sendBtn.classList.remove('active');

    const row = document.createElement('div');
    row.className = 'message-row assistant';

    const avatar = document.createElement('div');
    avatar.className = 'assistant-avatar-box';
    avatar.innerText = (profileNameEl.textContent || 'A').charAt(0).toUpperCase();

    const body = document.createElement('div');
    body.className = 'assistant-message-body';
    body.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    row.appendChild(avatar);
    row.appendChild(body);
    chatContent.appendChild(row);
    scrollToBottom();

    const responseData = await window.aabhirupChatEngine.getResponse(query);
    await new Promise((r) => setTimeout(r, 400));

    body.innerHTML = '';
    const textContainer = document.createElement('div');
    const cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';

    body.appendChild(textContainer);
    body.appendChild(cursor);

    const tokens = responseData.text.split(' ');
    let currentText = '';

    for (let i = 0; i < tokens.length; i++) {
      currentText += (i === 0 ? '' : ' ') + tokens[i];
      textContainer.innerHTML = formatMarkdown(currentText);
      scrollToBottom();
      await new Promise((r) => setTimeout(r, 16 + Math.random() * 10));
    }

    cursor.remove();

    // Cards
    if (responseData.cards && responseData.cards.length > 0) {
      responseData.cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'chat-project-card';
        cardEl.innerHTML = `
          <div class="chat-project-top">
            <span class="chat-project-name">${card.title}</span>
            <span class="chat-project-badge">${card.badge}</span>
          </div>
          <div class="chat-project-desc">${card.desc}</div>
          <div class="chat-project-tags">
            ${card.tags.map((t) => `<span class="chat-tag">${t}</span>`).join('')}
          </div>
          <div style="margin-top: 6px;">
            <a href="${card.link}" target="_blank" style="color: var(--accent); font-size: 0.82rem; font-weight: 500; text-decoration: none;">View Project Schematics &rarr;</a>
          </div>
        `;
        body.appendChild(cardEl);
      });
    }

    // Follow-up action chips
    if (responseData.actions && responseData.actions.length > 0) {
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'action-chips-container';

      responseData.actions.forEach((act) => {
        const chip = document.createElement('button');
        chip.className = 'action-chip';
        chip.innerText = act.label;
        chip.addEventListener('click', () => {
          handleSubmit(act.prompt);
        });
        chipsContainer.appendChild(chip);
      });

      body.appendChild(chipsContainer);
    }

    if (window.appleAudio) window.appleAudio.playReceive();

    isGenerating = false;
    updateInputState();
    scrollToBottom();
  }

  function scrollToBottom() {
    chatScrollArea.scrollTop = chatScrollArea.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function formatMarkdown(text) {
    let html = escapeHTML(text);
    html = html.replace(/^#### (.*?)$/gm, '<h5 style="font-size: 0.95rem; font-weight: 600; margin: 8px 0 4px;">$1</h5>');
    html = html.replace(/^### (.*?)$/gm, '<h4 style="font-size: 1.05rem; font-weight: 700; margin: 12px 0 6px;">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 style="font-size: 1.15rem; font-weight: 700; margin: 14px 0 6px;">$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^> (.*?)$/gm, '<blockquote style="border-left: 3px solid var(--accent); padding-left: 12px; margin: 8px 0; color: var(--text-secondary);">$1</blockquote>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">$1</a>');
    html = html.replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.88em;">$1</code>');
    html = html.replace(/^\* (.*?)$/gm, '<li style="margin-bottom: 4px;">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul>$1</ul>');

    return html.split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<blockquote')) return p;
      return `<p style="margin-bottom: 10px;">${p}</p>`;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     Profile & Color Theme Customization
     -------------------------------------------------------------------------- */
  function initProfileAndColorTheme() {
    const savedName = localStorage.getItem('aabhirup_profile_name') || 'Aabhirup';
    const savedStatus = localStorage.getItem('aabhirup_profile_status') || 'Exploring AI/ML & Deep Learning';
    const savedColorKey = localStorage.getItem('aabhirup_theme_color_key') || 'indigo';

    profileNameEl.textContent = savedName;
    profileStatusEl.textContent = savedStatus;
    profileAvatarEl.textContent = savedName.charAt(0).toUpperCase();

    customNameInput.value = savedName;
    customStatusInput.value = savedStatus;

    applyThemeColor(savedColorKey);
  }

  function applyThemeColor(colorKey) {
    const theme = colorThemes[colorKey] || colorThemes.indigo;
    const root = document.documentElement;

    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.hover);
    root.style.setProperty('--accent-glow', theme.glow);
    root.style.setProperty('--accent-subtle', theme.subtle);
    root.style.setProperty('--accent-gradient', theme.gradient);

    // Render swatches in modal
    colorSwatchesContainer.innerHTML = '';
    Object.keys(colorThemes).forEach((k) => {
      const swatch = document.createElement('div');
      swatch.className = `color-swatch ${k === colorKey ? 'active' : ''}`;
      swatch.style.background = colorThemes[k].accent;
      swatch.setAttribute('data-color', k);

      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        applyThemeColor(k);
        localStorage.setItem('aabhirup_theme_color_key', k);
      });

      colorSwatchesContainer.appendChild(swatch);
    });
  }

  function initModalListeners() {
    // Open modal
    profileBadge.addEventListener('click', () => {
      customNameInput.value = profileNameEl.textContent;
      customStatusInput.value = profileStatusEl.textContent;
      customizerModal.classList.add('active');
    });

    // Close / Cancel
    const closeModal = () => customizerModal.classList.remove('active');
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) closeModal();
    });

    // Save
    saveModalBtn.addEventListener('click', () => {
      const newName = customNameInput.value.trim() || 'Aabhirup';
      const newStatus = customStatusInput.value.trim() || 'Exploring AI/ML & Deep Learning';

      profileNameEl.textContent = newName;
      profileStatusEl.textContent = newStatus;
      profileAvatarEl.textContent = newName.charAt(0).toUpperCase();

      localStorage.setItem('aabhirup_profile_name', newName);
      localStorage.setItem('aabhirup_profile_status', newStatus);

      closeModal();
      if (window.appleAudio) window.appleAudio.playSend();
    });
  }

  /* --------------------------------------------------------------------------
     Sidebar Toggle & Shortcuts
     -------------------------------------------------------------------------- */
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('open');
    });
  }

  if (themeToggle) {
    const savedTheme = localStorage.getItem('apple_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('apple_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('apple_theme', 'light');
      }
    });
  }

  if (soundToggle && window.appleAudio) {
    if (window.appleAudio.enabled) soundToggle.classList.add('active');

    soundToggle.addEventListener('click', () => {
      const enabled = window.appleAudio.toggle();
      soundToggle.classList.toggle('active', enabled);
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (newChatBtn) newChatBtn.click();
    }
  });
});
