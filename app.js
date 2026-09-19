const STORAGE_KEY = 'todo-list-items';

// 取得頁面上的互動元素。
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

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

// 將最新的待辦清單保存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生每筆待辦的唯一識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 依照目前資料重新繪製清單與未完成數量。
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
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

  emptyState.hidden = todos.length > 0;
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

// 頁面載入時顯示已保存的待辦事項。
render();
