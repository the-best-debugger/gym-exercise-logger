import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const emptyForm = {
  exercise_name: "",
  weight_kg: "",
  reps: "",
};

export default function App() {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadLogs() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/logs`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message || "Something went wrong while loading logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const payload = {
      exercise_name: formData.exercise_name.trim(),
      weight_kg: Number(formData.weight_kg),
      reps: Number(formData.reps),
    };

    if (!payload.exercise_name || payload.weight_kg <= 0 || payload.reps <= 0) {
      setError("Please fill all fields with valid values");
      return;
    }

    const url = editId === null ? `${BACKEND_URL}/logs` : `${BACKEND_URL}/logs/${editId}`;
    const method = editId === null ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Failed to save log");
      }

      resetForm();
      await loadLogs();
    } catch (err) {
      setError(err.message || "Failed to save log");
    }
  }

  function handleEdit(log) {
    setEditId(log.id);
    setFormData({
      exercise_name: log.exercise_name,
      weight_kg: String(log.weight_kg),
      reps: String(log.reps),
    });
  }

  async function handleDelete(id) {
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/logs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Failed to delete log");
      }
      await loadLogs();
    } catch (err) {
      setError(err.message || "Failed to delete log");
    }
  }

  return (
    <main className="container">
      <h1>Gym Exercise Logger</h1>
      <p className="subtitle">Track sets so you never guess your last weight again.</p>

      <section className="card">
        <h2>{editId === null ? "Add New Log" : "Edit Log"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Exercise Name
            <input
              type="text"
              name="exercise_name"
              value={formData.exercise_name}
              onChange={handleInputChange}
              placeholder="e.g. Bench Press"
              required
            />
          </label>

          <label>
            Weight (kg)
            <input
              type="number"
              name="weight_kg"
              value={formData.weight_kg}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              required
            />
          </label>

          <label>
            Reps
            <input
              type="number"
              name="reps"
              value={formData.reps}
              onChange={handleInputChange}
              min="1"
              step="1"
              required
            />
          </label>

          <div className="buttons">
            <button type="submit">{editId === null ? "Save Log" : "Update Log"}</button>
            {editId !== null && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Workout History</h2>
        {loading && <p className="info">Loading logs...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && logs.length === 0 ? (
          <p className="info">No logs yet. Add your first set.</p>
        ) : (
          logs.map((log) => (
            <div className="log-item" key={log.id}>
              <div className="log-info">
                <strong>{log.exercise_name}</strong>
                <br />
                {log.weight_kg} kg x {log.reps} reps
              </div>
              <div className="log-actions">
                <button type="button" onClick={() => handleEdit(log)}>
                  Edit
                </button>
                <button type="button" className="delete" onClick={() => handleDelete(log.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
