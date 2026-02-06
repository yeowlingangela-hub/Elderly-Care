class SpeechButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .speech-button-container {
                    text-align: center;
                    margin-top: 20px;
                }
                #mic-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                #mic-icon {
                    width: 50px;
                    height: 50px;
                }
                .listening #mic-icon {
                    animation: pulse 1s infinite;
                }
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                .helper-text {
                    font-size: 0.9rem;
                    color: #666;
                }
            </style>
            <div class="speech-button-container">
                <button id="mic-button">
                    <img id="mic-icon" src="https://www.gstatic.com/images/icons/material/system/2x/mic_black_24dp.png" alt="Microphone">
                </button>
                <p class="helper-text">Tap to Speak</p>
                <p class="helper-text">You can say ‘I’m OK’ or ‘I’m not OK’</p>
            </div>
        `;

        this.micButton = this.shadowRoot.getElementById('mic-button');
        this.micIcon = this.shadowRoot.getElementById('mic-icon');
        this.isListening = false;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processTranscript(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.dispatchEvent(new CustomEvent('speech-unrecognized'));
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.micButton.classList.remove('listening');
            };

            this.micButton.addEventListener('click', () => {
                if (this.isListening) {
                    this.recognition.stop();
                } else {
                    this.recognition.start();
                    this.isListening = true;
                    this.micButton.classList.add('listening');
                }
            });
        } else {
            this.micButton.style.display = 'none';
        }
    }

    processTranscript(transcript) {
        if (transcript.includes('ok') || transcript.includes('okay')) {
            this.dispatchEvent(new CustomEvent('speech-recognized', { detail: { status: 'ok' } }));
        } else if (transcript.includes('not ok') || transcript.includes('help') || transcript.includes('unwell') || transcript.includes('hurt') || transcript.includes('fell')) {
            this.dispatchEvent(new CustomEvent('speech-recognized', { detail: { status: 'not-ok' } }));
        } else {
            this.dispatchEvent(new CustomEvent('speech-unrecognized'));
        }
    }
}

customElements.define('speech-button', SpeechButton);
