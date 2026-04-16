'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'
import styles from './page.module.scss'

const DEMO_EMAIL = 'morty@c-137.com'
const DEMO_PASSWORD = 'wubbalubbadubdub'

export default function AdminLoginPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
  }

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backBtn}>← site</Link>
      <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '○ light' : '● dark'}
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.prompt}>root@idf-hub:~$</span>
          <h1 className={styles.title}>admin access</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>✗</span> {error}
            </div>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <span className={styles.loading}>
                <span className={styles.cursor}>_</span> authenticating...
              </span>
            ) : (
              '> login'
            )}
          </button>
        </form>

        <div className={styles.demo}>
          <div className={styles.demoHeader}>
            <span className={styles.demoTag}>[C-137]</span>
            <span className={styles.demoLabel}>Morty-level access</span>
          </div>
          <div className={styles.demoCredentials}>
            <div><span className={styles.demoKey}>email</span><span className={styles.demoVal}>{DEMO_EMAIL}</span></div>
            <div><span className={styles.demoKey}>pass</span><span className={styles.demoVal}>{DEMO_PASSWORD}</span></div>
          </div>
          <p className={styles.demoNote}>Read-write, but changes self-destruct at session end.<br/>Wubba lubba dub dub!</p>
          <button className={styles.demoBtn} onClick={fillDemo} type="button">
            &gt; use Morty credentials
          </button>
        </div>
      </div>
    </div>
  )
}
