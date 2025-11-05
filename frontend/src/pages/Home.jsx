import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>StanInfo</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => navigate('/login')}>Prijavi se</button>
        <button onClick={() => navigate('/register')}>Registriraj se</button>
      </div>
    </div>
  )
}

export default Home


