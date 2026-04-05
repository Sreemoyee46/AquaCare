import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', form)
      login(data)
      toast.success('Account created! Set up your first tank.')
      navigate('/setup')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{paddingTop:60,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 24px'}}>
      <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:'var(--radius)',padding:36,width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:'2.5rem',marginBottom:8}}>🐟</div>
          <h2 style={{fontSize:'1.5rem',marginBottom:4}}>Create Account</h2>
          <p style={{color:'var(--text2)',fontSize:'0.87rem'}}>Start monitoring your fish for free</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[['name','Full Name','text'],['email','Email','email'],['password','Password','password']].map(([key,label,type]) => (
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:'0.85rem',color:'var(--text2)'}}>
          Already have an account? <Link to="/login" style={{color:'var(--cyan)'}}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
