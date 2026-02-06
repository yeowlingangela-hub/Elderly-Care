import { db } from './firebase-config.js';

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
        .schedule-inputs input {
          margin-right: 10px;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid var(--medium-gray);
        }
        #save-schedule {
            background-color: var(--primary-color);
            color: var(--white);
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
      </style>
      <div class="wrapper">
        <h2>Dashboard</h2>
        <div class="status-display">
            <div>
                <div class="status-text">Parent's Status: <span id="parent-status"></span></div>
                <div id="last-seen"></div>
            </div>
            <a href="tel:+1234567890" class="call-btn">Call Parent</a>
        </div>
        <div>
          <h3>Event Log</h3>
          <ul id="event-log"></ul>
        </div>
        <div>
            <h3>Schedule</h3>
            <div class="schedule-inputs">
                <label for="start-time">Morning Check-in Start:</label>
                <input type="time" id="start-time" name="start-time">
                <label for="end-time">Morning Check-in End:</label>
                <input type="time" id="end-time" name="end-time">
                <button id="save-schedule">Save</button>
            </div>
        </div>
      </div>
    `;

    this.eventLog = this.shadowRoot.querySelector('#event-log');
    this.parentStatus = this.shadowRoot.querySelector('#parent-status');
    this.lastSeen = this.shadowRoot.querySelector('#last-seen');
    this.saveScheduleBtn = this.shadowRoot.querySelector('#save-schedule');
    this.startTimeInput = this.shadowRoot.querySelector('#start-time');
    this.endTimeInput = this.shadowRoot.querySelector('#end-time');

    this.saveScheduleBtn.addEventListener('click', () => this.saveSchedule());
  }

  connectedCallback() {
    this.fetchEventLog();
    this.listenForStatusChanges();
    this.loadSchedule();
  }

  fetchEventLog() {
    db.collection('escalation_events').orderBy('timestamp', 'desc').onSnapshot((querySnapshot) => {
      this.eventLog.innerHTML = '';
      let lastCheckinTime = null;
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const listItem = document.createElement('li');
        listItem.textContent = `${new Date(event.timestamp?.toDate()).toLocaleString()} - ${event.message}`;
        if (event.level === 'critical') {
            listItem.classList.add('critical');
        }
        this.eventLog.appendChild(listItem);

        if (event.message === 'Check-in received' && !lastCheckinTime) {
            lastCheckinTime = event.timestamp.toDate();
        }
      });

      if(lastCheckinTime) {
          this.lastSeen.textContent = `Last seen: ${lastCheckinTime.toLocaleString()}`;
      }
    });
  }

  listenForStatusChanges() {
    const checkinWidget = document.querySelector('checkin-widget');
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

  saveSchedule() {
    const schedule = {
        start: this.startTimeInput.value,
        end: this.endTimeInput.value
    };
    localStorage.setItem('checkinSchedule', JSON.stringify(schedule));
    // Dispatch an event to notify the checkin-widget of the change
    document.dispatchEvent(new CustomEvent('schedule-updated', { detail: schedule }));
  }

  loadSchedule() {
      const schedule = JSON.parse(localStorage.getItem('checkinSchedule'));
      if(schedule) {
          this.startTimeInput.value = schedule.start;
          this.endTimeInput.value = schedule.end;
      }
  }
}

customElements.define('dashboard-view', DashboardView);
