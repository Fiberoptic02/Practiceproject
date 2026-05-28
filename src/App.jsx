import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
import AuthPage from "./AuthPage";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // ── Check existing session on mount ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  // ── Fetch todos whenever user changes ────────────────────────────────────
  useEffect(() => {
    if (user) fetchTodos();
    else setTodoList([]);
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) console.log("Error fetching: ", error);
    else setTodoList(data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from("TodoList")
      .insert([{ name: newTodo, isCompleted: false }])
      .select()
      .single();

    if (error) console.log("Error adding todo: ", error);
    else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  const completeTask = async (id, isCompleted) => {
    const { error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id)
      .select();

    if (error) console.log("Error toggling task: ", error);
    else
      setTodoList((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        )
      );
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from("TodoList").delete().eq("id", id);
    if (error) console.log("Error deleting task: ", error);
    else setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ── Loading splash ────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="app-loading">
        <span className="app-loading-spinner" />
      </div>
    );
  }

  // ── Not logged in → show auth page ───────────────────────────────────────
  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  // ── Logged in → show todo app ─────────────────────────────────────────────
  return (
    <div className="app-root">
      <div className="app-blob app-blob-1" />
      <div className="app-blob app-blob-2" />

      <div className="app-card">
        {/* Header */}
        <div className="app-header">
          <div>
            <h1 className="app-title">OpenIntelligence</h1>
            <p className="app-user-email">{user.email}</p>
          </div>
          <button className="app-signout" onClick={handleSignOut}>
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M13.5 10H4m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6.5V5a1.5 1.5 0 011.5-1.5h5A1.5 1.5 0 0116 5v10a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 15v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </div>

        {/* Add todo */}
        <div className="app-add-row">
          <input
            className="app-input"
            type="text"
            placeholder="Add a new task…"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="app-add-btn" onClick={addTodo}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Todo list */}
        <ul className="app-list">
          {todoList.length === 0 && (
            <li className="app-empty">No tasks yet — add one above!</li>
          )}
          {todoList.map((todo) => (
            <li key={todo.id} className={`app-item ${todo.isCompleted ? "completed" : ""}`}>
              <button
                className="app-check"
                onClick={() => completeTask(todo.id, todo.isCompleted)}
                aria-label={todo.isCompleted ? "Mark incomplete" : "Mark complete"}
              >
                {todo.isCompleted && (
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className="app-item-name">{todo.name}</span>
              <button
                className="app-delete"
                onClick={() => deleteTask(todo.id)}
                aria-label="Delete task"
              >
                <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {todoList.length > 0 && (
          <p className="app-summary">
            {todoList.filter((t) => t.isCompleted).length} of {todoList.length} completed
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
