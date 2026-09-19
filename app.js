const STORAGE_KEY = 'todo-list-items';
const THEME_KEY = 'todo-list-theme';

// 取得頁面上的互動元素。
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const filterButtons = document.querySelectorAll('.btn-filter');

// 從 localStorage 讀取資料，格式不正確時使用空陣列。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

let todos = loadTodos();
let currentFilter = 'all';

// 套用主題並更新切換按鈕的圖示與文字。
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';

  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

// 有手動選擇時優先使用保存的主題，否則跟隨系統設定。
function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// 將最新的待辦清單保存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生每筆待辦的唯一識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 依照目前的篩選條件取得要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

// 清單為空時，依目前情況顯示對應提示文字。
function getEmptyMessage() {
  if (todos.length === 0) return '還沒有任何待辦事項，新增一個吧!';
  if (currentFilter === 'active') return '太棒了，沒有未完成的事項!';
  return '目前沒有已完成的事項。';
}

// 依照目前資料重新繪製清單與未完成數量。
function render() {
  const visibleTodos = getVisibleTodos();
  list.replaceChildren();

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `完成「${todo.text}」`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = getEmptyMessage();
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 表單送出時新增待辦，空白內容不會被加入。
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({
    id: createId(),
    text,
    completed: false,
  });
  saveTodos();
  render();
  input.value = '';
  input.focus();
});

// 使用事件委派處理勾選與刪除，讓動態產生的項目也能運作。
list.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;

  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);
  if (!todo) return;

  if (event.target.matches('input[type="checkbox"]')) {
    todo.completed = event.target.checked;
  } else if (event.target.matches('.btn-delete')) {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
  } else {
    return;
  }

  saveTodos();
  render();
});

// 切換深色或淺色模式，並把使用者選擇保存到 localStorage。
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

// 切換篩選條件並更新選中按鈕的樣式。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    render();
  });
});

// 頁面載入時先初始化主題，再顯示已保存的待辦事項。
initializeTheme();
render();
