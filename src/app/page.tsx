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
  const [loading, setLoading] = useState(false)

  async function loadTodos() {
    if (!user) return
    setLoading(true)
    const res = await fetch(`/api/todos?user=${user}`)
    const data = await res.json()
    setTodos(data)
    setLoading(false)
  }

  async function addTodo() {
    if (!title || !user) return
    setLoading(true)

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

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
    loadTodos()
  }

  useEffect(() => {
    loadTodos()
  }, [user])

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '48px 16px'
  }

  const wrapperStyle = {
    maxWidth: '48rem',
    margin: '0 auto'
  }

  const headerStyle = {
    marginBottom: '48px',
    textAlign: 'center' as const,
    color: 'white'
  }

  const titleStyle = {
    fontSize: '48px',
    fontWeight: 900,
    margin: 0
  }

  const subtitleStyle = {
    fontSize: '18px',
    opacity: 0.9,
    margin: 0,
    color: 'white'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    marginBottom: '24px'
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: '14px',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '12px'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    outline: 'none' as const,
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  }

  const inputGroupStyle = {
    display: 'flex' as const,
    gap: '12px'
  }

  const inputFlexStyle = {
    ...inputStyle,
    flex: 1
  }

  const buttonStyle = {
    background: 'linear-gradient(to right, #9333ea, #2563eb)',
    color: 'white',
    border: 'none' as const,
    padding: '16px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 10px 15px rgba(147, 51, 234, 0.3)',
    fontFamily: 'inherit'
  }

  const statsStyle = {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  }

  const statStyle = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease'
  }

  const todoListStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px'
  }

  const todoItemStyle = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    transition: 'all 0.3s ease'
  }

  const emptyStateStyle = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    padding: '64px 32px',
    textAlign: 'center' as const
  }

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', fontSize: '40px' }}>
            <span>⚡</span>
            <h1 style={titleStyle}>TaskFlow</h1>
          </div>
          <p style={subtitleStyle}>Seu assistente IA para gerenciar tarefas</p>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>👤 Identificar-se</label>
          <input
            type="text"
            placeholder="Digite seu nome ou e-mail..."
            value={user}
            onChange={e => setUser(e.target.value)}
            style={inputStyle}
          />
        </div>

        {user && (
          <div style={cardStyle}>
            <label style={labelStyle}>✨ Nova tarefa</label>
            <div style={inputGroupStyle}>
              <input
                type="text"
                placeholder="O que você precisa fazer? (IA vai melhorar)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addTodo()}
                style={inputFlexStyle}
              />
              <button
                onClick={addTodo}
                disabled={!title || loading}
                style={buttonStyle}
              >
                + Adicionar
              </button>
            </div>
          </div>
        )}

        {user && totalCount > 0 && (
          <div style={statsStyle}>
            <div style={statStyle}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '14px', marginBottom: '8px', marginTop: 0 }}>📊 Total</p>
              <p style={{ fontSize: 36, fontWeight: 900, margin: 0, background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{totalCount}</p>
            </div>
            <div style={statStyle}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '14px', marginBottom: '8px', marginTop: 0 }}>✅ Concluídas</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#16a34a', margin: 0 }}>
                {completedCount}
              </p>
            </div>
          </div>
        )}

        <div style={todoListStyle}>
          {loading && (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: '#4b5563', fontSize: '18px', fontWeight: 600, margin: 0 }}>Carregando tarefas...</p>
            </div>
          )}

          {!loading && todos.length === 0 && user && (
            <div style={emptyStateStyle}>
              <p style={{ fontSize: '24px', color: '#9ca3af', fontWeight: 600, marginBottom: '8px', marginTop: 0 }}>📝 Nenhuma tarefa</p>
              <p style={{ color: '#d1d5db', fontSize: '16px', margin: 0 }}>
                Crie uma nova tarefa para começar sua jornada
              </p>
            </div>
          )}

          {todos.map(todo => (
            <div key={todo.id} style={todoItemStyle}>
              <button
                onClick={() => toggleTodo(todo)}
                style={{ flex: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '24px', transition: 'transform 0.3s ease', display: 'flex', alignItems: 'center' }}
              >
                {todo.completed ? '✓' : '○'}
              </button>

              <span
                style={{
                  flex: 1,
                  fontSize: '18px',
                  fontWeight: 500,
                  color: todo.completed ? '#9ca3af' : '#1f2937',
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}
              >
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ flex: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af', fontSize: '20px', transition: 'color 0.3s ease' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
