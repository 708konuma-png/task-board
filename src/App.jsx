import { useEffect, useState } from 'react';

const STORAGE_KEY = 'task-board-tasks';

const loadTasks = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedTasks = window.localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch {
    return [];
  }
};

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Task Board</h1>
        <form onSubmit={addTask} className="task-form">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="新しいタスクを入力"
            aria-label="新しいタスク"
          />
          <button type="submit">追加</button>
        </form>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <label className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>
              <button type="button" onClick={() => deleteTask(task.id)} className="delete-btn">
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
