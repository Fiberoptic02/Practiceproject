# Todo List App with Supabase, React, and Vite

This is a simple Todo List application built with **React**, **Supabase**, and **Vite**. It allows users to create, read, update, and delete their own tasks, stored securely in a Supabase database.

Check out my YouTube channel for more tutorials: [@pedrotechnologies](https://www.youtube.com/@pedrotechnologies)

## Features

- Create a new todo item
- Read (view) all todos created by the authenticated user
- Update the name or completion status of a todo
- Delete a todo item

## Technologies Used

- **React**: Frontend library for building the user interface
- **Supabase**: Backend as a service for managing the database and authentication
- **Vite**: Build tool for fast development
- **PostgreSQL**: Database for storing todo items

## Setup

Follow these steps to set up the project locally.

### 1. Clone the repository

Clone this repository to your local machine:

```
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### 2. Install dependencies

Install the required dependencies using npm:

```
npm install
```

### 3. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Set up your database by creating a `todos` table with the following columns:
   - `id` (Integer, Primary Key, Auto-increment)
   - `created_at` (Timestamp, default to `now()`)
   - `name` (Text)
   - `isCompleted` (Boolean)
3. Copy your Supabase **URL** and **anon key** from the project settings.

### 4. Configure Supabase Client

In your project folder, create a new file named `src/supabaseClient.js` and paste the following configuration:

```javascript
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with your credentials
const supabaseUrl = "https://your-project-id.supabase.co";
const supabaseKey = "your-public-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

Replace `your-project-id` and `your-public-anon-key` with your actual Supabase credentials.

### 5. Run the Application

Start the development server with:

```
npm run dev
```

Visit `http://localhost:5173` in your browser to see the Todo List app in action.

## Usage

1. **Create Todos**: Add a new todo by typing in the input field and clicking the "Add Todo" button.
2. **Read Todos**: View your todos listed below the input field.
3. **Update Todos**: Edit the name of a todo by clicking the "Edit" button and updating it.
4. **Mark as Completed**: Toggle the completion status of a todo by clicking the "Complete" button.
5. **Delete Todos**: Remove a todo by clicking the "Delete" button.

## Contributing

Feel free to fork this project and submit pull requests for bug fixes or enhancements.
