import React,{ useState } from "react"

function App() {
  const [newTask, setNewTask] = useState("")
  const [tasks, setTasks] = useState([
    {
      id: 1, title: "Acheter du pain", completed: false
    },
     {
      id: 2, title: "Faire la lessive", completed: true
    },
  ])

  const addNewTask = ()=> {
    setTasks([...tasks,{id:tasks.length+1, title:newTask, completed:false}])
    setNewTask("")
  }

  const pendingTasks = tasks.filter(task => task.completed == false)

  const handleToggleTask = (id) => {
    const updatedTasks = tasks.map((task)=> {
      if(task.id == id){
        task.completed = !task.completed
      }
      return task
    })

    setTasks(updatedTasks)
  }

  const deleTask = (id)=> {
      const updatedTasks = tasks.filter(task => task.id != id)
      setTasks(updatedTasks)
  }

  return (
    <>

    <div>
        <div>
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
          <button onClick={addNewTask}>Ajouter</button>
        </div>
          <ul>
             {
              tasks.map(task => (
                  <li style={{listStyle: "none", display:"flex", gap:3}} key={task.id}>
                  <input checked={task.completed} onChange={() => handleToggleTask(task.id)} type="checkbox"/>
                  <p>{task.title}</p>
                  <button style={{backgroundColor:"red", color:"white", padding:5, borderRadius:5}} onClick={() => deleTask(task.id)}>Supprimer</button>
                  </li>
              ))
             }
          </ul>

          <div>
            <p>{pendingTasks.length} tâches restantes</p>
          </div>
    </div>
     
    </>
  )
}

export default App
