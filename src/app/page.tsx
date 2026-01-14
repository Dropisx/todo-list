'use client'

import { useEffect, useState } from 'react'

type Todo = {
  id: string
  title: string
  completed: boolean
}

export default function Home() {
  const [user, setUser] = useState('')
  const [title, setTitle] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])

  async function loadTodos() {
    if (!user) return

    const res = await fetch(`/api/todos?user=${user}`)
    const data = await res.json()
    setTodos(data)
  }

  async function addTodo() {
    if (!title || !user) return

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, user })
    })

    setTitle('')
    loadTodos()
  }

  async function toggleTodo(todo: Todo) {
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: todo.id,
        completed: !todo.completed
      })
    })

    loadTodos()
  }

  useEffect(() => {
    loadTodos()
  }, [user])

  return (
    <main style={{ padding: 20 }}>
      <h1>To-Do List</h1>

      <div>
        <input
          placeholder="Seu nome ou e-mail"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="Nova tarefa"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>Adicionar</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </main>
  )
}
