# Task Manager - Todo Application

A fully functional Todo application built with React and TypeScript, featuring a component-driven architecture, global state management with Context API, and mobile-friendly interactions.

## Features

- **Task Management**

  - Add, edit, delete, and mark tasks as completed
  - Star important tasks for quick access
  - Set due dates with notifications for upcoming tasks
  - Categorize tasks (personal, work, shopping, health, other)
  - Prioritize tasks (low, medium, high)

- **Organization & Filtering**

  - Search and filter tasks by various criteria
  - Sort tasks by importance, due date, alphabetically, and more
  - Mobile-friendly drag and drop reordering
  - Show/hide completed tasks

- **User Experience**

  - Responsive design that works on desktop and mobile
  - Touch-optimized interactions for mobile devices
  - Visual feedback for actions and states
  - Notifications for upcoming tasks

- **Data Management**
  - Local storage persistence
  - Global state management with Context API
  - Demo user authentication

## Technologies Used

- **Core**

  - React 18
  - TypeScript
  - Context API for global state management

- **UI & Styling**

  - CSS3 with custom variables
  - Fluent UI Icons
  - Responsive design

- **Features**
  - Custom touch-based drag and drop for mobile
  - Local storage for data persistence
  - Custom hooks for notifications and local storage

## Project Structure

The project follows a modular structure:

\`\`\`
src/
├── components/ # UI components
├── contexts/ # Context providers for global state
├── hooks/ # Custom React hooks
├── services/ # API integration services
├── styles/ # CSS styles
└── types/ # TypeScript interfaces and types
\`\`\`

### Context Architecture

The application uses React's Context API for global state management:

- **TodoContext**: Manages todo items and related operations
- **UserContext**: Manages user authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/taskmanager.git
   \`\`\`

2. Navigate to the project directory:
   \`\`\`
   cd taskmanager
   \`\`\`

3. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

4. Start the development server:
   \`\`\`
   npm start
   \`\`\`

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding Tasks

- Click on "Add a task" input field to add a task
- You can click on the calendar icon below the input to add a due date(optional)

### Managing Tasks

- Click the checkbox to mark tasks as completed
- Click the star icon to mark tasks as important
- In list view, click on a task to see edit(where you cann add a description, duedate, mark as complete or star) and delete options and in grid view, click on the task title to do the same.
- Drag and drop tasks to reorder them

### Filtering and Sorting Tasks

- Use the search box to find specific tasks
- Toggle "Show completed" to show/hide completed tasks
- Open the sidebar to see options to filter by planned, important or my day
- Sort tasks by importance, due date, alphabetically, or creation date

## Authentication

This demo includes a simple authentication system:

- Any username with a password of at least 6 characters will work
- User data is stored in localStorage

## Future Enhancements

- Backend integration with a real database
- User accounts and data synchronization
- Dark mode support
- Keyboard shortcuts
- Task sharing and collaboration
- Recurring tasks
