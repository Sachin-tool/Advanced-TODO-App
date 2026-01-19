import { todos, completedTodos, searchQuery, currentFilter } from "./state.js";

export function filterTodos(todos, completed, filter, search) {
  let result = [...todos];

  if (filter === 'active') {
    result = result.filter(t => !t.completed);
  } else if (filter === 'completed') {
    result = result.filter(t => t.completed);
  } else if (filter === 'high') {
    result = result.filter(t => t.priority === 'high' && !t.completed);
  }


  if (search) {
    result = result.filter(t =>
      t.text.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search)
    );
  }

  return result;
}

export function filterCompleted(completedTodos, search) {
  let result = [...completedTodos];

  if (search) {
    result = result.filter(t =>
      t.text.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search)
    );
  }

  return result;
}

export function sortTodos(todos, sortBy) {
  const sorted = [...todos];

  switch (sortBy) {
    case 'date':
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;

    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      sorted.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;

    case 'name':
      sorted.sort((a, b) => a.text.localeCompare(b.text));
      break;

    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;

    default:
      break;
  }

  return sorted;
}
