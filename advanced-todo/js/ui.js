import {
  toggleTodo,
  deleteActiveTodo,
  deleteCompletedTodo,
  editTodo,
  completeTodo,
} from "./todo.js";
import { formatDate, isPastDate, isDueToday } from "./utils.js";

export function renderActiveTodos(filteredTodos, element, allTodos) {
  element.innerHTML = "";

  if (filteredTodos.length === 0) {
    element.parentElement.style.display = 'none';
    return;
  }

  element.parentElement.style.display = 'block';

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.priority}-priority`;

    if (todo.completed) {
      li.classList.add("completed");
    }

    if (isPastDate(todo.dueDate) && !todo.completed) {
      li.classList.add("overdue");
    } else if (isDueToday(todo.dueDate)) {
      li.classList.add("due-soon");
    }

    const dueInfo = todo.dueDate ? `<span class="due-date">📅 ${formatDate(todo.dueDate)}</span>` : '';
    const categoryBadge = todo.category ? `<span class="category-badge">${escapeHtml(todo.category)}</span>` : '';
    const priorityBadge = `<span class="priority-badge priority-${todo.priority}">${todo.priority.toUpperCase()}</span>`;

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark task as completed">
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-meta">
          ${priorityBadge}
          ${categoryBadge}
          ${dueInfo}
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-edit" title="Edit task"> Edit</button>
        <button class="btn-delete" title="Delete task"> Delete</button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    checkbox.onclick = () => {
      toggleTodo(todo.id);
      updateUI();
    };

    const editBtn = li.querySelector(".btn-edit");
    editBtn.onclick = () => editTodoPrompt(todo);

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.onclick = () => {
      if (confirm(`Delete task: "${todo.text}"?`)) {
        deleteActiveTodo(todo.id);
        updateUI();
      }
    };

    element.appendChild(li);
  });
}

export function renderCompletedTodos(filteredCompleted, element) {
  if (filteredCompleted.length === 0) {
    element.parentElement.style.display = 'none';
    document.getElementById('completedListCount').textContent = '0';
    return;
  }

  element.parentElement.style.display = 'block';
  document.getElementById('completedListCount').textContent = filteredCompleted.length;
  element.innerHTML = "";

  filteredCompleted.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item completed";

    const completedDate = todo.completedAt ? `<span class="due-date"> ${formatDate(todo.completedAt)}</span>` : '';
    const categoryBadge = todo.category ? `<span class="category-badge">${escapeHtml(todo.category)}</span>` : '';

    li.innerHTML = `
      <input type="checkbox" class="checkbox" checked aria-label="Mark task as incomplete">
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-meta">
          ${categoryBadge}
          ${completedDate}
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-delete" title="Delete task"> Delete</button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    checkbox.onclick = () => {
      toggleTodo(todo.id);
      updateUI();
    };

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.onclick = () => {
      if (confirm(`Delete completed task: "${todo.text}"?`)) {
        deleteCompletedTodo(todo.id);
        updateUI();
      }
    };

    element.appendChild(li);
  });
}

function editTodoPrompt(todo) {
  const newText = prompt("Edit task text:", todo.text);
  if (newText !== null && newText.trim()) {
    editTodo(todo.id, newText);
    updateUI();
  }
}

export function updateStats(todos, completedTodos) {
  const total = todos.length + completedTodos.length;
  const active = todos.length;
  const completed = completedTodos.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('activeCount').textContent = active;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('progressPercent').textContent = `${progress}%`;

  const emptyMessage = document.getElementById('emptyMessage');
  if (total === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
