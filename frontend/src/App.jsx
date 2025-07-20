import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // Obtener tareas desde el backend
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newTask.trim() === '') return

    try {
      const res = await axios.post('http://localhost:5000/api/tasks', {
        title: newTask
      })
      setTasks([...tasks, res.data])
      setNewTask('')
    } catch (err) {
      console.error(err)
    }
  }

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: !currentStatus
      })

      setTasks(tasks.map(task =>
        task._id === id ? res.data : task
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`)
    setTasks(tasks.filter(task => task._id !== id))
  } catch (err) {
    console.error(err)
  }
}


  return (
    <div style={{ padding: '20px' }}>
      <h1>📝 To-Do List MERN</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li
            key={task._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              cursor: 'pointer',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}
          >
            <span onClick={() => toggleComplete(task._id, task.completed)}>
              {task.title} {task.completed ? '✅' : '🕓'}
            </span>
            <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px' }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
