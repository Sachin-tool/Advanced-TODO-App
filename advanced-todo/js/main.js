import { todos, completedTodos, setCurrentFilter, setCurrentSort, setSearchQuery } from "./state.js";
import { loadData, saveData, exportData, importData } from "./storage.js";
import { addTodo, deleteActiveTodo, deleteCompletedTodo, clearAllCompleted } from "./todo.js";
import { renderActiveTodos, renderCompletedTodos, updateStats } from "./ui.js";
import { filterTodos, filterCompleted, sortTodos } from "./filters.js";
import { showToast } from "./utils.js";


const input = document.getElementById("todoInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");


let currentFilter = 'all';
let currentSort = 'date';
let searchQuery = '';


document.addEventListener('DOMContentLoaded', () => {
  loadData();
  render();
  setupEventListeners();
});

function setupEventListeners() {
  addBtn.addEventListener('click', handleAddTodo);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTodo();
  });
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      setCurrentFilter(currentFilter);
      render();
    });
  });
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sortType = btn.id.replace('sort', '').toLowerCase();
      currentSort = sortType;
      setCurrentSort(sortType);
      render();
    });
  });
  clearCompletedBtn.addEventListener('click', () => {
    if (completedTodos.length === 0) {
      showToast('No completed tasks to clear', 'info');
      return;
    }
    if (confirm(`Clear ${completedTodos.length} completed task(s)?`)) {
      clearAllCompleted();
      showToast('Completed tasks cleared', 'success');
      render();
    }
  });
  exportBtn.addEventListener('click', () => {
    exportData(todos, completedTodos);
    showToast('Tasks exported successfully', 'success');
  });
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', handleImport);
}
function handleAddTodo() {
  if (!input.value.trim()) {
    showToast('Please enter a task', 'error');
    return;
  }

  if (addTodo(input.value, dueDate.value, priority.value, category.value)) {
    input.value = '';
    dueDate.value = '';
    priority.value = 'medium';
    category.value = '';
    showToast('Task added successfully', 'success');
    render();
  }
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  importData(file)
    .then(data => {
      const mergedTodos = [...todos, ...data.todos];
      const mergedCompleted = [...completedTodos, ...data.completed];
      saveData(mergedTodos, mergedCompleted);
      loadData();
      render();
      showToast(`Imported ${data.todos.length + data.completed.length} task(s)`, 'success');
      importFile.value = '';
    })
    .catch(error => {
      console.error('Import error:', error);
      showToast('Failed to import tasks', 'error');
    });
}

function render() {
  let filteredTodos = filterTodos(todos, completedTodos, currentFilter, searchQuery);
  filteredTodos = sortTodos(filteredTodos, currentSort);


  let filteredCompleted = filterCompleted(completedTodos, searchQuery);


  renderActiveTodos(filteredTodos, todoList, todos);
  renderCompletedTodos(filteredCompleted, completedList);


  updateStats(todos, completedTodos);
}
window.updateUI = render;
