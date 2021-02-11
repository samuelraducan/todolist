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
