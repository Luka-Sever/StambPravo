import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login as loginRequest } from '../services/authService.js'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!email || !password) {
            alert('Molimo unesite email i lozinku.')
            return
        }
        setSubmitting(true)
        try {
            const data = await loginRequest({ email, password })
            console.log('Login successful:', data)
        } catch (error) {
            console.error('Login error:', error)
            alert('Neuspjela prijava. Provjerite podatke i pokušajte ponovno.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Prijava</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360 }}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </label>
                <label>
                    Lozinka
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </label>
                <button type="submit" disabled={submitting}>{submitting ? 'Slanje...' : 'Prijavi se'}</button>
            </form>
            <div style={{ marginTop: '1rem' }}>
                <Link to="/">Povratak na početnu</Link>
            </div>
        </div>
    )
}

export default Login


