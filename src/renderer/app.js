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
    
    this.settings = {
      font: 'serif',
      lineHeight: 1.6,
      fontSize: 16,
      width: 700
    };
    
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
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.settingsDrawer.classList.contains('open')) {
        this.closeSettings();
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
}

document.addEventListener('DOMContentLoaded', () => {
  new JustAPaper();
});