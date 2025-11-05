import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register as registerRequest } from '../services/authService.js'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!name || !email || !password) {
            alert('Molimo ispunite sva polja.')
            return
        }
        setSubmitting(true)
        try {
            const data = await registerRequest({ name, email, password })
            console.log('Register successful:', data)
        } catch (error) {
            console.error('Register error:', error)
            alert('Registracija nije uspjela. Pokušajte ponovno.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Registracija</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360 }}>
                <label>
                    Ime
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vaše ime" />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </label>
                <label>
                    Lozinka
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </label>
                <button type="submit" disabled={submitting}>{submitting ? 'Slanje...' : 'Registriraj se'}</button>
            </form>
            <div style={{ marginTop: '1rem' }}>
                <Link to="/">Povratak na početnu</Link>
            </div>
        </div>
    )
}

export default Register


