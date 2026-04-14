const reminderForm = document.getElementById("reminder-form");
const noteForm = document.getElementById("note-form");
const reminderList = document.getElementById("reminder-list");
const noteList = document.getElementById("note-list");
const template = document.getElementById("item-template");

const REMINDER_KEY = "couple_reminders";
const NOTE_KEY = "couple_notes";

const read = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleString();
}

function render() {
  renderList(reminderList, read(REMINDER_KEY), (item) => {
    return `<strong>For ${item.forPerson}</strong><small>${item.text}</small><small>⏰ ${formatDate(item.time)}</small>`;
  }, REMINDER_KEY);

  renderList(noteList, read(NOTE_KEY), (item) => {
    return `<strong>${item.title}</strong><small>${item.body}</small><small>📝 Shared note</small>`;
  }, NOTE_KEY);
}

function renderList(container, items, renderHtml, storageKey) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<li class="item"><div class="item-content"><small>No items yet. Add one above.</small></div></li>`;
    return;
  }

  items.forEach((item, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".item-content").innerHTML = renderHtml(item);
    node.querySelector("button").addEventListener("click", () => {
      const updated = read(storageKey).filter((_, i) => i !== index);
      write(storageKey, updated);
      render();
    });
    container.appendChild(node);
  });
}

reminderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const forPerson = document.getElementById("forPerson").value.trim();
  const text = document.getElementById("reminderText").value.trim();
  const time = document.getElementById("reminderTime").value;

  const reminders = read(REMINDER_KEY);
  reminders.unshift({ forPerson, text, time });
  write(REMINDER_KEY, reminders);

  reminderForm.reset();
  render();
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("noteTitle").value.trim();
  const body = document.getElementById("noteBody").value.trim();

  const notes = read(NOTE_KEY);
  notes.unshift({ title, body });
  write(NOTE_KEY, notes);

  noteForm.reset();
  render();
});

render();
