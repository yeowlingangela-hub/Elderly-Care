# Guardian Angel

## Overview

A simple, framework-less web application designed to help families ensure the well-being of their elderly loved ones through a daily check-in system. This application is built using modern web standards, including Web Components, and leverages Firebase for backend services.

## Features

- **Daily Check-in:** A simple interface for the parent to confirm they are okay each day.
- **Always-Visible "I'm Not OK" Button:** The parent's home screen always displays a clear "I'm Not OK" button, ensuring immediate access to the help flow.
- **Auto-Routing to "Not OK" Page:** If the parent's last recorded status is "NOT_OK", the application automatically loads the "Not OK" page upon startup, providing immediate access to contact and help options.
- **Not OK Flow:** A dedicated tab for parents to quickly contact their child or request help in an emergency.
- **Automated Escalation:** If the parent misses a check-in or requests help, the system automatically initiates an escalation process.
- **Persistent Escalation:** The escalation process is managed in Firestore, making it reliable and persistent across page reloads.
- **Real-time Dashboard:** The child has a real-time view of the parent's status and a log of all events.
- **In-app Notifications:** The application uses a custom notification service to display alerts and reminders.
- **Enhanced UI:** A modern and visually appealing design with a background photo, improved typography, and a clear layout.
- **Dynamic Event Log Labels:** The event log displays clear, actionable labels like "Checked-In" or "Call Parent".
- **Auto-Captured Check-in Time:** The system automatically captures and displays the exact server-side check-in time, removing manual input.
- **Last Seen:** The dashboard displays the last time the parent checked in.
- **Date & Time Formatting:** All timestamps are correctly parsed and formatted to be displayed in a clear, human-readable format.

## Project Structure

- `index.html`: The main entry point of the application.
- `style.css`: Global styles for the application.
- `main.js`: Contains the core logic for the `checkin-widget` and the escalation process.
- `dashboard.js`: Contains the logic for the `dashboard-view` and schedule configuration.
- `not-ok.js`: Contains the logic for the `not-ok-view` component.
- `firebase-config.js`: Firebase configuration.
- `notification-service.js`: A simple service for displaying in-app notifications.
- `logo.svg`: The application logo.
- `background.jpg`: A background image for the application.

## Design and Styling

- **Modern Color Scheme:** The application uses a modern color palette inspired by the Homage design.
- **Clean and Simple UI:** The interface is designed to be simple and intuitive for users of all ages.
- **Responsive Design:** The layout adapts to different screen sizes, making it usable on both mobile and desktop devices.
- **Polished and Professional Look:** The application has a header with a logo and a title, giving it a more professional look.
- **Background Image:** A background image of a loving adult child with an elderly parent is used to create a warm and personal feel.

## Current Plan

- **Restore "I'm Not OK" Flow:** The "I'm Not OK" button has been restored to the parent's home screen and is always visible. Tapping it navigates the user to the "Not OK" page.
- **Implement Auto-Routing:** The application now checks the parent's status on load. If the last status was "NOT_OK", it automatically routes the user to the "Not OK" page.
