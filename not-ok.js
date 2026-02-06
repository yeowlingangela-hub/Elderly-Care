import { db } from './firebase-config.js';

class NotOkView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
          padding: 30px;
          text-align: center;
        }
        .action-btn {
          display: block;
          width: 90%;
          margin: 15px auto;
          padding: 20px;
          font-size: 1.5em;
          font-weight: 500;
          border-radius: 12px;
          text-decoration: none;
          color: var(--white);
        }
        .contact-btn {
            background-color: var(--primary-color);
        }
        .message-btn {
            background-color: #5bc0de;
        }
        .help-btn {
          background-color: var(--danger-color);
          border: none;
          cursor: pointer;
        }
        .reason-buttons {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .reason-btn {
            padding: 15px;
            font-size: 1em;
            border-radius: 8px;
            background-color: var(--light-gray);
            border: 1px solid var(--medium-gray);
            cursor: pointer;
        }
        .reason-btn.selected {
            background-color: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }
        .note-input {
            margin-top: 30px;
            width: 90%;
            height: 100px;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid var(--medium-gray);
            font-size: 1em;
        }
      </style>
      <div class="wrapper">
        <a href="tel:+1234567890" class="action-btn contact-btn">Contact My Child</a>
        <a href="sms:+1234567890" class="action-btn message-btn">Message My Child</a>
        <button class="action-btn help-btn">Request Help</button>

        <div class="reason-buttons">
            <button class="reason-btn">I feel unwell</button>
            <button class="reason-btn">I fell or hurt myself</button>
            <button class="reason-btn">I need help at home</button>
            <button class="reason-btn">Other</button>
        </div>

        <textarea class="note-input" placeholder="Add a quick note..."></textarea>
      </div>
    `;

    this.helpBtn = this.shadowRoot.querySelector('.help-btn');
    this.reasonButtons = this.shadowRoot.querySelectorAll('.reason-btn');
    this.noteInput = this.shadowRoot.querySelector('.note-input');

    this.reasonButtons.forEach(button => {
        button.addEventListener('click', () => {
            this.reasonButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    this.helpBtn.addEventListener('click', () => this.requestHelp());
  }

  requestHelp() {
    let reason = '';
    const selectedButton = this.shadowRoot.querySelector('.reason-btn.selected');
    if (selectedButton) {
        reason = selectedButton.textContent;
    }
    const note = this.noteInput.value;
    let message = 'Parent requested help!';
    if (reason) message += ` Reason: ${reason}.`;
    if (note) message += ` Note: ${note}.`;

    this.logEvent(message, 'critical');
    // Immediately escalate
    this.escalate();

    alert('Your child and emergency contacts have been notified.');
  }

  logEvent(message, level = 'info') {
    db.collection('escalation_events').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: message,
      level: level
    })
    .then(() => console.log('Event logged'))
    .catch((error) => console.error('Error logging event: ', error));
  }

  escalate() {
      db.collection('escalations').add({
          parentId: 'user1', // Hardcoded for now
          startTime: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'critical_help_requested',
          lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}

customElements.define('not-ok-view', NotOkView);
