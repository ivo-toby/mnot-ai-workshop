import React, { useState, useEffect, FormEvent } from 'react';

interface Todo {
  id: number;
  text: string;
  category: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [textInput, setTextInput] = useState('');

  // Fetch the list of todos on component mount.
  useEffect(() => {
    fetch('/todos')
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  // Handle the form submission to create a new todo.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });
      if (!res.ok) {
        throw new Error('Failed to create todo');
      }
      const newTodo: Todo = await res.json();
      setTodos([...todos, newTodo]);
      setTextInput('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter todo..."
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map(({ id, text, category }) => (
          <li key={id}>
            {text} — <em>{category}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
