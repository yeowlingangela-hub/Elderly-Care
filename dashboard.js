import { db } from './firebase-config.js';

// Helper function to format Firestore timestamps
const formatTimestamp = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    } else {
        return 'Date unavailable';
    }
};

class DashboardView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
            margin-top: 40px;
            padding: 30px;
            border-radius: 15px;
            background-color: var(--white);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: var(--primary-color);
            font-size: 2em;
        }
        .status-display {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .status-text {
            font-size: 1.8em;
            font-weight: 500;
        }
        .call-btn {
            background-color: var(--primary-color);
            color: var(--white);
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .call-btn:hover {
            background-color: #008a8a;
        }
        #event-log {
          list-style-type: none;
          padding: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        #event-log li {
          margin-bottom: 12px;
          padding: 15px;
          background-color: var(--light-gray);
          border-radius: 8px;
          border-left: 5px solid var(--primary-color);
        }
        #event-log li.critical {
            border-left-color: var(--danger-color);
        }
        .checkin-time {
            margin-top: 10px;
            font-size: 1.1em;
            color: #333;
            font-weight: 500;
        }
      </style>
      <div class="wrapper">
        <h2>Dashboard</h2>
        <div class="status-display">
            <div>
                <div class="status-text">Parent's Status: <span id="parent-status"></span></div>
                <div id="last-seen" class="checkin-time">Last Check-in: <span id="last-checkin-time">--:--</span></div>
            </div>
            <a href="tel:+1234567890" class="call-btn">Call Parent</a>
        </div>
        <div>
          <h3>Event Log</h3>
          <ul id="event-log"></ul>
        </div>
      </div>
    `;

    this.eventLog = this.shadowRoot.querySelector('#event-log');
    this.parentStatus = this.shadowRoot.querySelector('#parent-status');
    this.lastCheckinTime = this.shadowRoot.querySelector('#last-checkin-time');
  }

  connectedCallback() {
    this.fetchEventLog();
    this.listenForStatusChanges();
    this.listenForParentData();
  }

  fetchEventLog() {
    db.collection('escalation_events').orderBy('timestamp', 'desc').onSnapshot((querySnapshot) => {
      this.eventLog.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const listItem = document.createElement('li');

        if (event.type === 'check-in') {
            listItem.textContent = event.status; // "Checked-In"
        } else if (event.type === 'help_request') {
            const callLink = document.createElement('a');
            callLink.href = 'tel:+1234567890';
            callLink.textContent = event.status; // "Call Parent"
            listItem.appendChild(callLink);
        } else {
            const formattedTime = formatTimestamp(event.timestamp);
            listItem.textContent = `${formattedTime} - ${event.message}`;
        }

        if (event.level === 'critical') {
            listItem.classList.add('critical');
        }
        this.eventLog.appendChild(listItem);
      });
    });
  }

  listenForStatusChanges() {
    const checkinWidget = document.querySelector('checkin-widget');
    if (!checkinWidget) return;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'status') {
                this.parentStatus.textContent = checkinWidget.getAttribute('status');
            }
        });
    });

    observer.observe(checkinWidget, {
        attributes: true 
    });
    this.parentStatus.textContent = checkinWidget.getAttribute('status');
  }

  listenForParentData() {
    db.collection('parents').doc('user1').onSnapshot((doc) => {
        if (doc.exists) {
            const parentData = doc.data();
            if (parentData.last_checkin_at) {
                this.lastCheckinTime.textContent = formatTimestamp(parentData.last_checkin_at);
            }
        }
    });
  }
}

customElements.define('dashboard-view', DashboardView);
