# Guardian Angel

## Overview

A simple, framework-less web application designed to help families ensure the well-being of their elderly loved ones through a daily check-in system. This application is built using modern web standards, including Web Components, and leverages Firebase for backend services.

## Features

- **Daily Check-in:** A simple interface for the parent to confirm they are okay each day.
- **Not OK Flow:** A dedicated tab for parents to quickly contact their child or request help in an emergency.
- **Configurable Check-in Windows:** The child can configure the time window for the morning check-in.
- **Automated Escalation:** If the parent misses a check-in or requests help, the system automatically initiates an escalation process.
- **Persistent Escalation:** The escalation process is managed in Firestore, making it reliable and persistent across page reloads.
- **Real-time Dashboard:** The child has a real-time view of the parent's status and a log of all events.
- **In-app Notifications:** The application uses a custom notification service to display alerts and reminders.
- **Enhanced UI:** A modern and visually appealing design with a logo, improved typography, and a clear layout.
- **Call Button:** A button on the dashboard to easily call the parent.
- **Last Seen:** The dashboard displays the last time the parent checked in.

## Project Structure

- `index.html`: The main entry point of the application.
- `style.css`: Global styles for the application.
- `main.js`: Contains the core logic for the `checkin-widget` and the escalation process.
- `dashboard.js`: Contains the logic for the `dashboard-view` and schedule configuration.
- `not-ok.js`: Contains the logic for the `not-ok-view` component.
- `firebase-config.js`: Firebase configuration.
- `notification-service.js`: A simple service for displaying in-app notifications.
- `logo.svg`: The application logo.

## Design and Styling

- **Modern Color Scheme:** The application uses a modern color palette inspired by the Homage design.
- **Clean and Simple UI:** The interface is designed to be simple and intuitive for users of all ages.
- **Responsive Design:** The layout adapts to different screen sizes, making it usable on both mobile and desktop devices.
- **Polished and Professional Look:** The application has a header with a logo and a title, giving it a more professional look.

## Current Plan

- **Not OK Flow:** A new tab has been added to the parent's view with options to call, message, or request help.
- **Dashboard Enhancements:** The dashboard now highlights critical events in the event log.

