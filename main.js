import { db } from './firebase-config.js';

const notificationService = document.querySelector('#notification-service');

class CheckinWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          background-color: var(--white);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
        }
        .pending {
            background-color: #ffc107;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
        }
        .ok {
            background-color: var(--success-color);
        }
        .overdue {
            background-color: var(--danger-color);
        }
        .status {
          font-size: 1.5em;
          margin-bottom: 30px;
          font-weight: 500;
        }
        .check-in-btn {
          width: 90%;
          padding: 25px;
          font-size: 2em;
          font-weight: bold;
          border-radius: 15px;
          cursor: pointer;
          border: none;
          color: var(--white);
          background-color: var(--success-color);
          transition: transform 0.2s;
        }
        .check-in-btn:hover {
            transform: scale(1.02);
        }
        .emergency-btn {
          width: 90%;
          padding: 15px;
          font-size: 1.2em;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          color: var(--danger-color);
          background-color: transparent;
          margin-top: 20px;
        }
      </style>
      <div class="wrapper">
        <div class="status"><span id="status-indicator" class="status-indicator"></span>Status: <span id="status-text"></span></div>
        <button class="check-in-btn">I'm OK</button>
        <button class="emergency-btn">I need help</button>
      </div>
    `;

    this.statusIndicator = this.shadowRoot.querySelector('#status-indicator');
    this.statusText = this.shadowRoot.querySelector('#status-text');
    this.checkInBtn = this.shadowRoot.querySelector('.check-in-btn');
    this.emergencyBtn = this.shadowRoot.querySelector('.emergency-btn');

    this.checkInBtn.addEventListener('click', () => this.checkIn());
    this.emergencyBtn.addEventListener('click', () => this.triggerEmergency());
    document.addEventListener('schedule-updated', (e) => this.updateSchedule(e.detail));

    this.checkinInterval = null;
    this.escalationInterval = null;
    this.loadSchedule();
    this.checkTime();
    this.startCheckinWindow();
    this.startEscalationProcessor();
  }

  updateSchedule(schedule) {
      this.checkinWindow = {
          start: parseInt(schedule.start.split(':')[0]),
          end: parseInt(schedule.end.split(':')[0])
      };
      this.checkTime();
      this.startCheckinWindow();
  }

  loadSchedule() {
      const schedule = JSON.parse(localStorage.getItem('checkinSchedule'));
      if (schedule) {
          this.checkinWindow = {
              start: parseInt(schedule.start.split(':')[0]),
              end: parseInt(schedule.end.split(':')[0])
          };
      } else {
          this.checkinWindow = { start: 7, end: 10 }; // Default
      }
  }

  checkIn() {
    this.setStatus('OK');
    this.logEvent('Check-in received');
    this.checkInBtn.disabled = true;
    this.checkInBtn.style.backgroundColor = '#aaa';
    clearInterval(this.checkinInterval);
    this.cancelEscalation();
  }

  triggerEmergency() {
    this.setStatus('Escalated');
    this.logEvent('Emergency triggered by parent');
    // This should also create an escalation document with a high priority
  }

  setStatus(status) {
    this.statusText.textContent = status;
    this.setAttribute('status', status);
    this.statusIndicator.className = 'status-indicator ' + status.toLowerCase();
  }

  logEvent(message) {
    db.collection('escalation_events').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: message
    })
    .then(() => console.log('Event logged'))
    .catch((error) => console.error('Error logging event: ', error));
  }

  checkTime() {
    const now = new Date();
    const currentHour = now.getHours();
    if (this.getAttribute('status') !== 'OK' && currentHour >= this.checkinWindow.start && currentHour < this.checkinWindow.end) {
      this.setStatus('Pending');
      this.checkInBtn.disabled = false;
      this.checkInBtn.style.backgroundColor = 'var(--success-color)';
    } else if (this.getAttribute('status') !== 'OK') {
      this.setStatus('Outside check-in window');
    }
  }

  startCheckinWindow() {
    if (this.checkinInterval) {
        clearInterval(this.checkinInterval);
    }
    const now = new Date();
    const endOfWindow = new Date();
    endOfWindow.setHours(this.checkinWindow.end, 0, 0, 0);

    if (now < endOfWindow) {
        this.checkinInterval = setInterval(() => {
            const now = new Date();
            if(now > endOfWindow && this.getAttribute('status') === 'Pending') {
                this.setStatus('Overdue');
                this.logEvent('Check-in window ended, no check-in');
                this.escalate();
                clearInterval(this.checkinInterval);
            }
        }, 60000); // Check every minute
    }
  }

  escalate() {
      db.collection('escalations').add({
          parentId: 'user1', // Hardcoded for now
          startTime: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'initiated',
          lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      });
  }

  cancelEscalation() {
      db.collection('escalations').where('parentId', '==', 'user1').get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
              doc.ref.update({ status: 'resolved' });
          });
      });
  }

  startEscalationProcessor() {
      this.escalationInterval = setInterval(() => {
          db.collection('escalations').where('status', '!=', 'resolved').where('status', '!=', 'cancelled').get().then(querySnapshot => {
              querySnapshot.forEach(doc => {
                  this.processEscalation(doc.data(), doc.id);
              });
          });
      }, 60000); // Run every minute
  }

  processEscalation(escalation, docId) {
    const now = new Date();
    const lastUpdate = escalation.lastUpdate.toDate();
    const diffMinutes = (now - lastUpdate) / (1000 * 60);

    switch (escalation.status) {
        case 'initiated':
            this.logEvent("Sending soft reminder to parent.");
            notificationService.show("Good morning — tap ‘I’m OK’ when you’re ready.");
            db.collection('escalations').doc(docId).update({ status: 'soft_reminder_sent', lastUpdate: firebase.firestore.FieldValue.serverTimestamp() });
            break;
        case 'soft_reminder_sent':
            if (diffMinutes >= 1) { // 30 minutes in reality
                this.logEvent("Sending second reminder to parent.");
                notificationService.show("Just checking in. Tap once to confirm you’re okay.");
                db.collection('escalations').doc(docId).update({ status: 'grace_period', lastUpdate: firebase.firestore.FieldValue.serverTimestamp() });
            }
            break;
        case 'grace_period':
            if (diffMinutes >= 1) { // 30 minutes in reality
                this.logEvent("Notifying child.");
                notificationService.show("No check-in from Mom this morning.");
                db.collection('escalations').doc(docId).update({ status: 'child_notified', lastUpdate: firebase.firestore.FieldValue.serverTimestamp() });
            }
            break;
        default:
            break;
    }
  }
}

customElements.define('checkin-widget', CheckinWidget);
