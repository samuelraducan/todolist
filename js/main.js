// ====================================

/* NOTE: Global Variables */
const todolist = document.querySelector('.todolist');
const taskList = todolist.querySelector('.todolist__tasks');

// ====================================
/* NOTE: Functions */

/**
 * Generates a unique id
 * @param {*} length
 */
const generateUniqueString = length =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

/**
 * Creates a new task element
 * @param {*} taskName
 */
const makeTaskElement = taskName => {
  // Create a task.
  const uniqueID = generateUniqueString(10);
  const taskElement = document.createElement('li');
  taskElement.classList.add('task');

  taskElement.setAttribute('tabindex', -1);
  taskElement.innerHTML = DOMPurify.sanitize(`
	<input type="checkbox" id="${uniqueID}" />
	<label for="${uniqueID}">
	<svg viewBox="0 0 20 15">
		<path d="M0 8l2-2 5 5L18 0l2 2L7 15z" fill-rule="nonzero" />
	</svg>
	</label>
	<span class="task__name">${taskName}</span>
	<button type="button" class="task__delete-button">
		<svg viewBox="0 0 20 20">
			<path
			d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
			/>
		</svg>
	</button>
  `);

  return taskElement;
};

const isSuperKey = event => {
  const os =
    navigator.userAgent.includes('Mac OS X') !== -1 ? 'mac' : 'windows';
  if (os === 'mac' && event.metaKey) return true;
  if (os === 'windows' && event.ctrlKey) return true;
  return false;
};

// ====================================
/* NOTE: Event Listeners */

// Add a new todo
todolist.addEventListener('submit', event => {
  event.preventDefault();

  // Get the value of a task.
  const newTaskField = todolist.querySelector('input');
  const inputValue = newTaskField.value.trim();

  // Clear the new task field -> Input area
  newTaskField.value = '';

  // Brings back the focus to the input area.
  newTaskField.focus();

  // Prevents adding empty tasks.
  if (!inputValue) return;

  const taskElement = makeTaskElement(inputValue);

  // Add the task into the DOM
  taskList.appendChild(taskElement);
});

// Delete a task/todo.
todolist.addEventListener('click', event => {
  if (!event.target.matches('.task__delete-button')) return;

  // Get the parent element (li)
  const taskElement = event.target.parentElement;
  taskList.removeChild(taskElement);

  // Triggers empty state.
  if (taskList.children.length === 0) {
    taskList.innerHTML = '';
  }
});

// Up/down to select item
document.addEventListener('keydown', event => {
  const { key } = event;
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    const tasks = [...taskList.children];
    const firstTask = tasks[0];
    const lastTask = tasks[tasks.length - 1];

    // Select first or last task with arrow keys.
    // Works when focus is not on the tasklist
    if (!event.target.closest('.task')) {
      if (key === 'ArrowUp') return lastTask.focus();
      if (key === 'ArrowDown') return firstTask.focus();
    }

    // Selects previous/next element with arrow keys
    // Does round robin
    if (event.target.closest('.task')) {
      const currentTaskElement = event.target.closest('.task');
      if (currentTaskElement === firstTask && key === 'ArrowUp')
        return lastTask.focus();
      if (currentTaskElement === lastTask && key === 'ArrowDown')
        return firstTask.focus();
      if (key === 'ArrowUp')
        return currentTaskElement.previousElementSibling.focus();
      if (key === 'ArrowDown')
        return currentTaskElement.nextElementSibling.focus();
    }
  }
});

// Super + Enter to check/uncheck task
taskList.addEventListener('keydown', event => {
  if (event.key === 'Enter' && isSuperKey(event)) {
    const task = event.target.closest('.task');
    const checkbox = task.querySelector('input[type="checkbox"]');
    checkbox.click();
  }
});

// Super + Backspace or delete to delete task
taskList.addEventListener('keydown', event => {
  const deleteTask = event => {
    const task = event.target.closest('.task');
    const deleteButton = task.querySelector('.task__delete-button');
    deleteButton.click();
  };

  if (event.key === 'Backspace' && isSuperKey(event)) return deleteTask(event);
  if (event.key === 'Delete') return deleteTask(event);
});

// // Press n to focus on task
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key !== 'n') return;
  if (event.target.matches('input[type="text"]')) return;
  event.preventDefault();

  const newTaskField = todolist.querySelector('input');
  newTaskField.focus();
});
