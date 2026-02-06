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

### Speech Input for "I'm OK" / "I'm Not OK"

**Goal:** Allow elderly parents to indicate their status using voice as an accessible alternative to buttons.

**UI Changes:**

1.  **Microphone Button:**
    *   Add a microphone button to the "Today" page and the "Not OK" page.
    *   Label: "Tap to Speak" with helper text: "You can say ‘I’m OK’ or ‘I’m not OK’".

**Speech Recognition:**

1.  **Technology:** Use the browser's native Web Speech API (`SpeechRecognition`).
2.  **Process:**
    *   On mic button tap, start listening and show a visual indicator.
    *   The recording will stop automatically after a short duration (5-8 seconds) or when the user clicks a "Done" button.
    *   The speech will be converted to text locally.
3.  **Keyword Matching:**
    *   "ok", "okay" -> "I'm OK"
    *   "not ok", "help", "unwell", "hurt", "fell" -> "I'm Not OK"

**System Actions:**

1.  **"I'm OK":** Trigger the existing "I'm OK" functionality.
2.  **"I'm Not OK":**
    *   Navigate to the "Not OK" page.
    *   Pre-select a reason if a keyword like "unwell", "hurt", or "fell" is detected.
    *   Require the parent to confirm by tapping "Submit" or "Request Help".

**Error Handling:**

*   If the speech is not recognized, display a prompt: "Sorry, I didn’t catch that. Are you OK?" with "I'm OK" and "I'm Not OK" buttons.

**Child Dashboard:**

*   Updates from speech input will be indistinguishable from button clicks.

**Accessibility:**

*   The feature will be designed with large text and clear visual feedback.
*   Buttons will always be available.
