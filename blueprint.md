# Project Blueprint

## Overview

This project is a parent-child communication application. It allows a parent to share their status with their child, and for the child to monitor the parent's well-being. The application is built using HTML, CSS, and JavaScript, with Firebase for real-time data synchronization.

## Implemented Features

### Core Functionality

*   **Parent Status Updates:** The parent can set their status to "OK" or "Not OK".
*   **Real-time Dashboard:** The child has a dashboard that displays the parent's current status and a log of recent events.
*   **Emergency Alerts:** The parent can send an emergency alert to the child by clicking "Request Help".
*   **Contact Options:** The child can easily call or message the parent from the dashboard.

### "Not OK" Reasons

*   **Pre-set Reasons:** When a parent's status is "Not OK", they can select from a list of pre-set reasons:
    *   "I feel unwell"
    *   "I fell or hurt myself"
    *   "I need help at home"
    *   "Other"
*   **Informational Updates:** The parent can submit a reason as an informational update to the child without triggering an emergency alert. This is done by clicking the "Submit" button.
*   **Real-time Updates:** The child's dashboard is updated in real-time with the reason for the "Not OK" status.

### Event Log

*   **Differentiated Events:** The event log on the child's dashboard clearly distinguishes between informational updates and emergency alerts.
*   **Detailed Information:** The event log displays the specific reason for a "Not OK" status, as well as any additional notes provided by the parent.

## Current Plan

This is the first version of the blueprint. The implemented features are documented above. The next step is to continue building out the application's features based on user feedback.
