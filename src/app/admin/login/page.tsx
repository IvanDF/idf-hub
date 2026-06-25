'use client'

import Text from '@/components/atoms/text'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import styles from './page.module.scss'

const DEMO_PASSWORD = 'wubbalubbadubdub'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Login failed')
      setLoading(false)
      return
    }

    const next = searchParams.get('next') ?? '/admin'
    router.push(next)
    router.refresh()
  }

  function fillDemo() {
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
          <Text as="span" variant="mono" className={styles.prompt}>root@idf-hub:~$</Text>
          <Text as="h1" variant="h1" className={styles.title}>admin access</Text>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              <Text as="span" variant="mono" className={styles.errorIcon}>✗</Text> {error}
            </div>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
                <Text as="span" variant="mono" className={styles.loading}>
                  <Text as="span" variant="mono" className={styles.cursor}>_</Text> authenticating...
                </Text>
            ) : (
              '> login'
            )}
          </button>
        </form>

        <div className={styles.demo}>
          <div className={styles.demoHeader}>
            <Text as="span" variant="mono" className={styles.demoTag}>[C-137]</Text>
            <Text as="span" variant="mono" className={styles.demoLabel}>Morty-level access</Text>
          </div>
          <div className={styles.demoCredentials}>
            <div><Text as="span" variant="mono" className={styles.demoKey}>pass</Text><Text as="span" variant="mono" className={styles.demoVal}>{DEMO_PASSWORD}</Text></div>
          </div>
          <Text as="p" variant="body" className={styles.demoNote}>Read-write, but changes self-destruct at session end.<br/>Wubba lubba dub dub!</Text>
          <button className={styles.demoBtn} onClick={fillDemo} type="button">
            &gt; use Morty credentials
          </button>
        </div>
      </div>
    </div>
  )
}
