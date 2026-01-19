import { todos, completedTodos, setTodos, setCompletedTodos } from "./state.js";
import { saveData } from "./storage.js";

export function addTodo(text, dueDate = '', priority = 'medium', category = '') {
  if (!text.trim()) return false;

  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    category: category.trim() || 'Uncategorized',
    priority: priority,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [...todos, newTodo];
  setTodos(updated);
  saveData(updated, completedTodos);
  return true;
}

export function editTodo(id, text, dueDate = '', priority = 'medium', category = '') {
  const updated = todos.map(t =>
    t.id === id
      ? {
          ...t,
          text: text.trim(),
          dueDate,
          priority,
          category: category.trim() || 'Uncategorized',
        }
      : t
  );
  setTodos(updated);
  saveData(updated, completedTodos);
}

export function toggleTodo(id) {
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return;

  const updatedTodos = [...todos];
  updatedTodos[todoIndex].completed = !updatedTodos[todoIndex].completed;
  setTodos(updatedTodos);
  saveData(updatedTodos, completedTodos);
}

export function completeTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const updatedTodos = todos.filter(t => t.id !== id);
  const completedTodo = { ...todo, completed: true, completedAt: new Date().toISOString() };

  setTodos(updatedTodos);
  setCompletedTodos([completedTodo, ...completedTodos]);
  saveData(updatedTodos, [completedTodo, ...completedTodos]);
}

export function deleteActiveTodo(id) {
  const updated = todos.filter(t => t.id !== id);
  setTodos(updated);
  saveData(updated, completedTodos);
  return true;
}

export function deleteCompletedTodo(id) {
  const updated = completedTodos.filter(t => t.id !== id);
  setCompletedTodos(updated);
  saveData(todos, updated);
  return true;
}

export function clearAllCompleted() {
  setCompletedTodos([]);
  saveData(todos, []);
  return completedTodos.length;
}

export function getTodoById(id) {
  return todos.find(t => t.id === id);
}
