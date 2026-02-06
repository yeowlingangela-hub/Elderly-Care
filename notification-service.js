class NotificationService extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px;
          background-color: var(--primary-color);
          color: var(--white);
          border-radius: 5px;
          z-index: 1000;
          display: none;
        }
      </style>
      <div class="notification"></div>
    `;
    this.notification = this.shadowRoot.querySelector('.notification');
  }

  show(message) {
    this.notification.textContent = message;
    this.notification.style.display = 'block';
    setTimeout(() => {
      this.notification.style.display = 'none';
    }, 5000);
  }
}

customElements.define('notification-service', NotificationService);
