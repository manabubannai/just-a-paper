class JustAPaper {
  constructor() {
    this.editor = document.getElementById('editor');
    this.paper = document.getElementById('paper');
    this.menuButton = document.getElementById('menuButton');
    this.closeButton = document.getElementById('closeButton');
    this.settingsDrawer = document.getElementById('settingsDrawer');
    this.overlay = document.getElementById('overlay');
    
    this.fontSelect = document.getElementById('fontSelect');
    this.lineHeightRange = document.getElementById('lineHeightRange');
    this.lineHeightValue = document.getElementById('lineHeightValue');
    this.fontSizeRange = document.getElementById('fontSizeRange');
    this.fontSizeValue = document.getElementById('fontSizeValue');
    this.widthRange = document.getElementById('widthRange');
    this.widthValue = document.getElementById('widthValue');
    
    this.linkDialog = document.getElementById('linkDialog');
    this.linkUrl = document.getElementById('linkUrl');
    this.linkOk = document.getElementById('linkOk');
    this.linkCancel = document.getElementById('linkCancel');
    this.linkRemove = document.getElementById('linkRemove');
    
    this.settings = {
      font: 'serif',
      lineHeight: 1.6,
      fontSize: 16,
      width: 700
    };
    
    this.savedSelection = null;
    this.currentLink = null;
    
    this.init();
  }
  
  init() {
    this.loadSettings();
    this.applySettings();
    this.attachEventListeners();
    this.editor.focus();
  }
  
  loadSettings() {
    const saved = localStorage.getItem('justAPaperSettings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }
  
  saveSettings() {
    localStorage.setItem('justAPaperSettings', JSON.stringify(this.settings));
  }
  
  applySettings() {
    this.editor.className = `editor ${this.settings.font}`;
    this.editor.style.lineHeight = this.settings.lineHeight;
    this.editor.style.fontSize = `${this.settings.fontSize}px`;
    this.paper.style.width = `${this.settings.width}px`;
    
    this.fontSelect.value = this.settings.font;
    this.lineHeightRange.value = this.settings.lineHeight;
    this.lineHeightValue.textContent = this.settings.lineHeight;
    this.fontSizeRange.value = this.settings.fontSize;
    this.fontSizeValue.textContent = `${this.settings.fontSize}px`;
    this.widthRange.value = this.settings.width;
    this.widthValue.textContent = `${this.settings.width}px`;
  }
  
  attachEventListeners() {
    this.menuButton.addEventListener('click', () => this.openSettings());
    this.closeButton.addEventListener('click', () => this.closeSettings());
    this.overlay.addEventListener('click', () => this.closeSettings());
    
    this.fontSelect.addEventListener('change', (e) => {
      this.settings.font = e.target.value;
      this.applySettings();
      this.saveSettings();
    });
    
    this.lineHeightRange.addEventListener('input', (e) => {
      this.settings.lineHeight = parseFloat(e.target.value);
      this.applySettings();
      this.saveSettings();
    });
    
    this.fontSizeRange.addEventListener('input', (e) => {
      this.settings.fontSize = parseInt(e.target.value);
      this.applySettings();
      this.saveSettings();
    });
    
    this.widthRange.addEventListener('input', (e) => {
      this.settings.width = parseInt(e.target.value);
      this.applySettings();
      this.saveSettings();
    });
    
    // Intercept paste events to ensure only plain text is inserted, preventing
    // unintended inline styles (e.g., red font colour) from external sources.
    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.linkDialog.classList.contains('open')) {
          this.closeLinkDialog();
        } else if (this.settingsDrawer.classList.contains('open')) {
          this.closeSettings();
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openLinkDialog();
      }
    });
    
    this.linkOk.addEventListener('click', () => this.handleLinkSubmit());
    this.linkCancel.addEventListener('click', () => this.closeLinkDialog());
    this.linkRemove.addEventListener('click', () => this.removeLink());
    
    this.linkUrl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleLinkSubmit();
      }
    });
    
    this.editor.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const url = e.target.href;
        if (url && window.electronAPI) {
          window.electronAPI.openExternal(url);
        }
      }
    });
  }
  
  openSettings() {
    this.settingsDrawer.classList.add('open');
    this.overlay.classList.add('active');
    this.menuButton.style.display = 'none';
    this.fontSelect.focus();
  }
  
  closeSettings() {
    this.settingsDrawer.classList.remove('open');
    this.overlay.classList.remove('active');
    setTimeout(() => {
      this.menuButton.style.display = '';
    }, 300);
    this.editor.focus();
  }
  
  openLinkDialog() {
    const selection = window.getSelection();
    
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    this.savedSelection = {
      start: range.startOffset,
      end: range.endOffset,
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      range: range.cloneRange()
    };
    
    let existingLink = null;
    let node = range.commonAncestorContainer;
    
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    
    while (node && node !== this.editor) {
      if (node.tagName === 'A') {
        existingLink = node;
        break;
      }
      node = node.parentNode;
    }
    
    this.currentLink = existingLink;
    
    if (existingLink) {
      this.linkUrl.value = existingLink.href;
      this.linkRemove.style.display = 'block';
      this.linkDialog.querySelector('h3').textContent = 'リンクを編集';
    } else {
      this.linkUrl.value = '';
      this.linkRemove.style.display = 'none';
      this.linkDialog.querySelector('h3').textContent = 'リンクを追加';
    }
    
    this.linkDialog.classList.add('open');
    this.overlay.classList.add('active');
    this.linkUrl.focus();
    this.linkUrl.select();
  }
  
  closeLinkDialog() {
    this.linkDialog.classList.remove('open');
    this.overlay.classList.remove('active');
    this.savedSelection = null;
    this.currentLink = null;
    this.editor.focus();
  }
  
  handleLinkSubmit() {
    const url = this.linkUrl.value.trim();
    
    if (!url) return;
    
    if (!url.match(/^https?:\/\//)) {
      this.linkUrl.value = 'https://' + url;
      return;
    }
    
    if (this.savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedSelection.range);
      
      if (this.currentLink) {
        this.currentLink.href = url;
      } else {
        document.execCommand('createLink', false, url);
        
        const links = this.editor.querySelectorAll('a[href="' + url + '"]');
        const newLink = links[links.length - 1];
        if (newLink) {
          newLink.target = '_blank';
          newLink.rel = 'noopener noreferrer';
        }
      }
    }
    
    this.closeLinkDialog();
  }
  
  removeLink() {
    if (this.currentLink) {
      const parent = this.currentLink.parentNode;
      while (this.currentLink.firstChild) {
        parent.insertBefore(this.currentLink.firstChild, this.currentLink);
      }
      parent.removeChild(this.currentLink);
    }
    
    this.closeLinkDialog();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new JustAPaper();
});