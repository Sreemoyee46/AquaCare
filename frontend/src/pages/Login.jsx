import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', form)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{paddingTop:60,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 24px'}}>
      <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:'var(--radius)',padding:36,width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:'2.5rem',marginBottom:8}}>🐠</div>
          <h2 style={{fontSize:'1.5rem',marginBottom:4}}>Welcome back</h2>
          <p style={{color:'var(--text2)',fontSize:'0.87rem'}}>Sign in to your AquaCare account</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[['email','Email','email'],['password','Password','password']].map(([key,label,type]) => (
            <div key={key} style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:'0.85rem',color:'var(--text2)',marginBottom:8}}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({...form,[key]:e.target.value})}
                required
                style={{width:'100%',background:'var(--bg3)',border:'1.5px solid var(--border)',borderRadius:'var(--radius2)',color:'var(--text)',fontSize:'0.95rem',padding:'12px 16px',outline:'none'}}
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{width:'100%',background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',padding:'13px',borderRadius:'var(--radius2)',cursor:'pointer',marginTop:8,opacity:loading?0.7:1}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:'0.85rem',color:'var(--text2)'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--cyan)'}}>Register</Link>
        </p>
      </div>
    </div>
  )
}
