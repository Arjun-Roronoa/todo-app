import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  // ✅ Fetch Tasks from Backend
  const fetchTasks = () => {
    axios.get("http://localhost:5000/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add a New Task
  const addTask = () => {
    if (!newTask.trim()) return;
    axios.post("http://localhost:5000/api/tasks", { title: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // ✅ Update Task (Fixed)
  const updateTask = async (id) => {
    if (!editedTask.trim()) return; // Prevent empty task update
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`, { title: editedTask });

      // ✅ Immediately update the state (no need to refresh tasks)
      setTasks(tasks.map(task => task._id === id ? response.data : task));

      // ✅ Reset edit mode
      setEditingTaskId(null);
      setEditedTask("");
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  // ✅ Delete Task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div>
      <h1>My To-Do App</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
        placeholder="Add a task..."
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <div key={task._id}>
            {editingTaskId === task._id ? (
              // Show input field when editing
              <input
                type="text"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateTask(task._id);
                }}
              />
            ) : (
              // Show normal task text
              <span>{task.title}</span>
            )}

            {editingTaskId === task._id ? (
              // Show save button when in edit mode
              <button onClick={() => updateTask(task._id)}>Save</button>
            ) : (
              // Show edit button when not in edit mode
              <button onClick={() => {
                setEditingTaskId(task._id);
                setEditedTask(task.title); // Set initial value
              }}>
                Edit
              </button>
            )}

            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
