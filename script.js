const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-btn');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

startBtn.addEventListener('click', () => {
  recognition.start();
  status.textContent = 'Listening...';
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  status.textContent = `Heard: "${transcript}"`;

  if (transcript.startsWith("add task")) {
    const task = transcript.replace("add task", "").trim();
    if (task) addTask(task);
  } else if (transcript.startsWith("complete task")) {
    const keyword = transcript.replace("complete task", "").trim();
    completeTask(keyword);
  } else if (transcript.includes("clear completed")) {
    clearCompleted();
  } else {
    status.textContent = 'Command not recognized.';
  }
};

function addTask(text) {
  const li = document.createElement('li');
  li.textContent = text;
  li.tabIndex = 0;
  li.addEventListener('click', () => li.classList.toggle('completed'));
  taskList.appendChild(li);
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