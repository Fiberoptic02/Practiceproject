# Taskly — React + Supabase Todo App

A practice project for learning how to connect a React (Vite) frontend to a Supabase backend with authentication and real-time database operations.

---

## What This App Does

- Register and sign in with email and password using Supabase Auth
- Add, complete, and delete todo tasks
- Tasks are stored in a Supabase PostgreSQL database
- Session persists on page refresh

---

## Tech Stack

| Tech | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Supabase Auth | User registration and login |
| Supabase Database | PostgreSQL table for todos |
| CSS (vanilla) | Styling |

---

## Project Structure

```
src/
├── App.jsx              # Main app — auth gate + todo logic
├── App.css              # Todo app styles
├── AuthPage.jsx         # Sign in / Register UI
├── AuthPage.css         # Auth page styles
├── supabase-client.js   # Supabase client setup
├── main.jsx             # React entry point
└── index.css            # Global styles
```

---

## Supabase Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Enable Email Auth
**Authentication → Providers → Email → Enable**

> During development, turn off **"Confirm email"** so users can log in immediately after registering.

### 3. Create the TodoList table

Go to **Table Editor → New Table** and create the following:

**Table name:** `TodoList`

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | `int8` | auto | Primary key, auto-increment |
| `created_at` | `timestamptz` | `now()` | Auto-created by Supabase |
| `name` | `text` | — | The task text |
| `isCompleted` | `bool` | `false` | ⚠️ Must be `bool`, not `text` |

> **Important:** `isCompleted` must be type `bool`. If you accidentally created it as `text`, run this in the SQL Editor to fix it:
> ```sql
> ALTER TABLE "TodoList"
> ALTER COLUMN "isCompleted" TYPE bool
> USING ("isCompleted"::boolean);
> ```

### 4. Disable RLS (for development)
**Table Editor → TodoList → Toggle RLS off**

> For production, enable RLS and add a `user_id` column — see the Per-User Tasks section below.

### 5. Add your credentials
Update `supabase-client.js` with your project URL and anon key (found in **Project Settings → API**):

```js
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## How It Works

### Authentication flow
1. App checks for an existing Supabase session on load
2. If no session → shows `AuthPage` (Sign In / Register tabs)
3. On successful login → shows the Todo app
4. Sign Out clears the session and returns to the auth screen

### Todo operations
| Action | Supabase method |
|---|---|
| Fetch all tasks | `.from("TodoList").select("*")` |
| Add a task | `.insert([{ name, isCompleted: false }]).select().single()` |
| Toggle complete | `.update({ isCompleted: !current }).eq("id", id).select()` |
| Delete a task | `.delete().eq("id", id)` |

> **Note:** Always chain `.select()` after `.update()` or `.insert()` in Supabase v2 — without it, the operation may silently fail to return data.

---

## Per-User Tasks (Optional Upgrade)

Currently all logged-in users share the same task list. To make tasks private per user:

**1. Add a `user_id` column to `TodoList`:**

| Column | Type |
|---|---|
| `user_id` | `uuid` |

**2. Update `fetchTodos` in `App.jsx`:**
```js
const { data } = await supabase
  .from("TodoList")
  .select("*")
  .eq("user_id", user.id);
```

**3. Update `addTodo` in `App.jsx`:**
```js
.insert([{ name: newTodo, isCompleted: false, user_id: user.id }])
```

**4. Add an RLS policy in Supabase:**
```sql
CREATE POLICY "Users can only access their own todos"
ON "TodoList"
FOR ALL
USING (auth.uid() = user_id);
```

---

## Things Learned from This Project

- How to set up Supabase Auth with email and password
- How to use `supabase.auth.getSession()` to persist login state
- How to perform CRUD operations with the Supabase JS client
- Why `.select()` must be chained after `.insert()` and `.update()` in Supabase v2
- Why column types matter — `bool` vs `text` breaks toggle logic
- How RLS policies control who can read and write data

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---|---|---|
| Tasks not inserting | Missing `.select()` after `.insert()` | Chain `.select().single()` |
| `isCompleted` not toggling | Column type is `text` not `bool` | Alter column type to `bool` |
| All operations blocked | RLS enabled with no policies | Disable RLS or add policies |
| Can't log in after register | Email confirmation required | Disable "Confirm email" in Auth settings |