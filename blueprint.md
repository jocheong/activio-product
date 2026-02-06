# Activio Project Blueprint

## Overview
Activio is a web application designed to help users manage child profiles and track their activities. It features a simple navigation system, local storage for data persistence, and a calendar view to visualize activities.

## Design and Style
The application uses a clean, modern design with a light color scheme and clear typography.

*   **Fonts:** Nunito sans-serif.
*   **Color Palette:**
    *   Primary: `--primary-color: #89CFF0;` (light blue)
    *   Secondary: `--secondary-color: #F5F5DC;` (beige)
    *   Accent: `--accent-color: #FFD700;` (yellow)
    *   Text: `--text-color: #333333;` (dark gray)
    *   Background: `--bg-color: #f0f8ff;` (alice blue)
    *   Card Background: `--card-bg-color: #ffffff;` (white)
    *   Shadow: `--shadow-color: rgba(0, 0, 0, 0.1);`
    *   Glow: `--glow-color: rgba(137, 207, 240, 0.5);`
    *   Success: `--success-color: #4CAF50;` (green)
    *   Error: `--error-color: #f44336;` (red)
*   **Visual Effects:** Multi-layered drop shadows for depth, subtle background pattern, glow effects on interactive elements.
*   **Responsiveness:** Designed to adapt to different screen sizes.

## Features

### 1. Child Profile Management
*   Users can add new child profiles.
*   Profiles are listed and stored in `localStorage`.

### 2. Activity Tracking
*   Users can add new activities for specific children.
*   Activities include fields for child, activity name, date, time, duration, and location.
*   Activities are stored in `localStorage`.
*   Input validation ensures required fields are filled.
*   **Date Pre-fill:** The 'activity-date' input in the 'Add New Activity' form is pre-filled with the date selected on the calendar.

### 3. Navigation and Routing
*   Single-page application (SPA) like navigation using a `router` function.
*   Screens include `Welcome`, `Profiles`, `Add Activity`, and `Calendar`.
*   Active navigation buttons are highlighted.

### 4. Calendar View
*   Integrates `VanillaCalendar` for displaying dates.
*   Shows activity details as popups when a day on the calendar is clicked.
*   Provides day, week, and month summary views for activities, selectable by corresponding buttons.
*   **Month Change Update:** The summary of activities automatically updates to match the newly selected month when the calendar's navigation arrows are used.

### 5. Calendar Activity Dot
*   Days with recorded activities are visually marked with a small, colored dot on the calendar using a custom CSS class (`has-activity`) applied via `VanillaCalendar`'s `specialDays` setting.

### 6. Message System
*   Displays success or error messages to the user for actions like adding profiles or activities.

## Current Plan

### Implement: When user change the month in the calendar, the summary of activities should match the month accordingly.

*   **Status:** Completed
*   **Description:**
    *   Added an `onClickArrow` action to the `VanillaCalendar` configuration within `renderCalendarScreen`.
    *   Inside this action, the currently displayed month and year are retrieved from the calendar instance, and `renderSummary` is called with the first day of that month and a `view` type of `'month'`.
    *   The `highlightActiveSummaryView('month')` function is also called to ensure the "Month" summary button is active.
