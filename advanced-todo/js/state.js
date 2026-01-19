export let todos = [];
export let completedTodos = [];
export let currentFilter = 'all';
export let currentSort = 'date';
export let searchQuery = '';

export function setTodos(data) {
  todos = data;
}

export function setCompletedTodos(data) {
  completedTodos = data;
}

export function setCurrentFilter(filter) {
  currentFilter = filter;
}

export function setCurrentSort(sort) {
  currentSort = sort;
}

export function setSearchQuery(query) {
  searchQuery = query.toLowerCase();
}

export function getAllTodos() {
  return [...todos, ...completedTodos];
}
