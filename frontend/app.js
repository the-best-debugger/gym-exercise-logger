const BACKEND_URL = "http://localhost:3000";

const form = document.getElementById("log-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit");
const logsContainer = document.getElementById("logs-container");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

const exerciseNameInput = document.getElementById("exercise_name");
const weightInput = document.getElementById("weight_kg");
const repsInput = document.getElementById("reps");

let currentEditId = null;
let logsCache = [];

function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
}

function setError(message) {
  if (!message) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    return;
  }

  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function resetFormState() {
  currentEditId = null;
  form.reset();
  formTitle.textContent = "Add New Log";
  submitBtn.textContent = "Save Log";
  cancelEditBtn.classList.add("hidden");
}

function renderLogs(logs) {
  if (logs.length === 0) {
    logsContainer.innerHTML = "<p class=\"info\">No logs yet. Add your first set.</p>";
    return;
  }

  logsContainer.innerHTML = logs
    .map(
      (log) => `
      <div class="log-item">
        <div class="log-info">
          <strong>${log.exercise_name}</strong><br />
          ${log.weight_kg} kg x ${log.reps} reps
        </div>
        <div class="log-actions">
          <button data-action="edit" data-id="${log.id}">Edit</button>
          <button class="delete" data-action="delete" data-id="${log.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

async function loadLogs() {
  setError("");
  setLoading(true);

  try {
    const response = await fetch(`${BACKEND_URL}/logs`);
    if (!response.ok) {
      throw new Error("Failed to fetch logs");
    }

    logsCache = await response.json();
    renderLogs(logsCache);
  } catch (error) {
    setError(error.message || "Something went wrong while loading logs");
  } finally {
    setLoading(false);
  }
}

async function createLog(payload) {
  const response = await fetch(`${BACKEND_URL}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create log");
  }
}

async function updateLog(id, payload) {
  const response = await fetch(`${BACKEND_URL}/logs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to update log");
  }
}

async function deleteLog(id) {
  const response = await fetch(`${BACKEND_URL}/logs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to delete log");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setError("");

  const payload = {
    exercise_name: exerciseNameInput.value.trim(),
    weight_kg: Number(weightInput.value),
    reps: Number(repsInput.value),
  };

  if (!payload.exercise_name || !payload.weight_kg || !payload.reps) {
    setError("Please fill all fields with valid values");
    return;
  }

  try {
    if (currentEditId === null) {
      await createLog(payload);
    } else {
      await updateLog(currentEditId, payload);
    }

    resetFormState();
    await loadLogs();
  } catch (error) {
    setError(error.message || "Failed to save log");
  }
});

cancelEditBtn.addEventListener("click", () => {
  resetFormState();
  setError("");
});

logsContainer.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    const selected = logsCache.find((log) => log.id === id);
    if (!selected) {
      setError("Log not found");
      return;
    }

    currentEditId = id;
    formTitle.textContent = "Edit Log";
    submitBtn.textContent = "Update Log";
    cancelEditBtn.classList.remove("hidden");

    exerciseNameInput.value = selected.exercise_name;
    weightInput.value = selected.weight_kg;
    repsInput.value = selected.reps;
    return;
  }

  if (action === "delete") {
    try {
      await deleteLog(id);
      await loadLogs();
    } catch (error) {
      setError(error.message || "Failed to delete log");
    }
  }
});

loadLogs();