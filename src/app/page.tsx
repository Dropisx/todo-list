'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span>⚡</span>
            <h1 className={styles.title}>TaskFlow</h1>
          </div>
          <p className={styles.subtitle}>Seu assistente IA para gerenciar tarefas</p>
        </div>

        {/* User Input */}
        <div className={styles.card}>
          <label className={styles.label}>👤 Identificar-se</label>
          <input
            type="text"
            placeholder="Digite seu nome ou e-mail..."
            value={user}
            onChange={e => setUser(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Add Todo */}
        {user && (
          <div className={styles.card}>
            <label className={styles.label}>✨ Nova tarefa</label>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="O que você precisa fazer? (IA vai melhorar)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addTodo()}
                className={`${styles.input} ${styles.inputFlex}`}
              />
              <button
                onClick={addTodo}
                disabled={!title || loading}
                className={styles.button}
              >
                + Adicionar
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {user && totalCount > 0 && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <p className={styles.statLabel}>📊 Total</p>
              <p className={styles.statValue}>{totalCount}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statLabel}>✅ Concluídas</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#16a34a' }}>
                {completedCount}
              </p>
            </div>
          </div>
        )}

        {/* Todos List */}
        <div className={styles.todoList}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}>⏳</div>
              <p className={styles.loadingText}>Carregando tarefas...</p>
            </div>
          )}

          {!loading && todos.length === 0 && user && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>📝 Nenhuma tarefa</p>
              <p className={styles.emptySubtitle}>
                Crie uma nova tarefa para começar sua jornada
              </p>
            </div>
          )}

          {todos.map(todo => (
            <div key={todo.id} className={styles.todoItem}>
              <button
                onClick={() => toggleTodo(todo)}
                className={styles.todoCheckbox}
              >
                {todo.completed ? '✓' : '○'}
              </button>

              <span
                className={`${styles.todoText} ${
                  todo.completed ? styles.completed : ''
                }`}
              >
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className={styles.todoDelete}
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
