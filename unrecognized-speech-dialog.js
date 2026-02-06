class UnrecognizedSpeechDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .dialog-content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .dialog-content p {
                    font-size: 1.2em;
                    margin-bottom: 20px;
                }
                .button-container {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
                .ok-btn, .not-ok-btn {
                    padding: 15px 30px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    border: none;
                    color: white;
                }
                .ok-btn {
                    background-color: var(--success-color);
                }
                .not-ok-btn {
                    background-color: var(--danger-color);
                }
            </style>
            <div id="dialog" class="dialog-overlay" style="display: none;">
                <div class="dialog-content">
                    <p>Sorry, I didn’t catch that. Are you OK?</p>
                    <div class="button-container">
                        <button id="ok-btn" class="ok-btn">I'm OK</button>
                        <button id="not-ok-btn" class="not-ok-btn">I'm Not OK</button>
                    </div>
                </div>
            </div>
        `;

        this.dialog = this.shadowRoot.getElementById('dialog');
        this.okButton = this.shadowRoot.getElementById('ok-btn');
        this.notOkButton = this.shadowRoot.getElementById('not-ok-btn');

        this.okButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('response', { detail: { status: 'ok' } }));
            this.hide();
        });

        this.notOkButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('response', { detail: { status: 'not-ok' } }));
            this.hide();
        });
    }

    show() {
        this.dialog.style.display = 'flex';
    }

    hide() {
        this.dialog.style.display = 'none';
    }
}

customElements.define('unrecognized-speech-dialog', UnrecognizedSpeechDialog);
