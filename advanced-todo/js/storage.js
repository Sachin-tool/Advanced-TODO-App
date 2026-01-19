import { setTodos, setCompletedTodos } from "./state.js";

const STORAGE_KEYS = {
  todos: 'advancedTodos',
  completed: 'advancedCompletedTodos',
};

export function loadData() {
  try {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos)) || [];
    const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completed)) || [];
    setTodos(todos);
    setCompletedTodos(completed);
    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    return false;
  }
}

export function saveData(todos, completedTodos) {
  try {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completedTodos));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

export function exportData(todos, completedTodos) {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    todos: todos,
    completed: completedTodos,
    totalTasks: todos.length + completedTodos.length,
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.todos && Array.isArray(data.todos) && Array.isArray(data.completed)) {
          resolve({
            todos: data.todos,
            completed: data.completed || [],
          });
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
