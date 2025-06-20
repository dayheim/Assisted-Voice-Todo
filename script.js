const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-btn');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

window.onload = () => {
	const saved = JSON.parse(localstorage.getItem("tasks") || "[]");
	saved.forEach (t => addTask(t.text, t.done));
};


startBtn.addEventListener('click', () => {
  recognition.start();
  status.textContent = 'Listening...';
});

clearBtn.addEventListener('click', () => {   
  const items = taskList.querySelectorAll('.completed');
  items.forEach(item => item.remove());
});
	

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  status.textContent = `Heard: "${transcript}"`;

  if (transcript.startsWith("add task")) {
    const task = transcript.replace("add task", "").trim();
    if (task) addTask(task, false);
  } else if (transcript.startsWith("complete task")) {
    const keyword = transcript.replace("complete task", "").trim();
    completeTask(keyword);
  } else if (transcript.includes("clear completed")) {
    clearCompleted();
  } else {
    status.textContent = 'Command not recognized.';
  }
};

function addTask(text, completed = false) {
  const li = document.createElement('li');
  li.textContent = text;
  if (completed) li.classList.add('completed');
  li.tabIndex = 0;
  li.addEventListener('click', () => {
	li.classList.toggle('completed');
	saveTasks();
});	
  taskList.appendChild(li);
  saveTasks();
}

function completeTask(keyword) {
  const items = taskList.getElementsByTagName('li');
  for (let li of items) {
    if (li.textContent.toLowerCase().includes(keyword)) {
      li.classList.add('completed');
    }
  }
}

function clearCompleted() {
  const items = taskList.querySelectorAll('.completed');
  items.forEach(item => item.remove());
}

addTaskBtn.addEventListener('click', () => {
	const text = taskInput.value.trim();
	if (text) {
		addTask(text, false);
		taskInput.value = "";
	}
});

function saveTasks() {
	const tasks = [];
	const items = taskList.getElementsByTagName('li');
	for (let li of items) {
		tasks.push({ text: li.textContent, 
		done: li.classList.contains('completed') });
	}
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
		