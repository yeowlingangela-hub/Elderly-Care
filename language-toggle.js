import { setLanguage, getLanguage } from './localization.js';

class LanguageToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .language-toggle {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }
                select {
                    padding: 5px;
                    border-radius: 5px;
                }
            </style>
            <div class="language-toggle">
                <select id="language-select">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ms">Bahasa Melayu</option>
                    <option value="ta">தமிழ்</option>
                </select>
            </div>
        `;

        this.languageSelect = this.shadowRoot.getElementById('language-select');
        this.languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    connectedCallback() {
        this.languageSelect.value = getLanguage();
    }
}

customElements.define('language-toggle', LanguageToggle);
