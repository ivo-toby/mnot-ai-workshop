import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  category: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Error loading todos. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (err) {
      setError('Error creating todo. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="todo-app">
      <header className="app-header">
        <h1>Smart Todo App</h1>
        <p>Tasks are automatically categorized using AI</p>
      </header>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          disabled={submitting}
        />
        <button 
          type="submit" 
          className="todo-button"
          disabled={submitting || !newTodoText.trim()}
        >
          {submitting ? 'Adding...' : 'Add Todo'}
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="todo-item">No todos yet. Add one above!</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <span className="todo-text">{todo.text}</span>
                <span className="todo-category">{todo.category}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default TodoApp;
