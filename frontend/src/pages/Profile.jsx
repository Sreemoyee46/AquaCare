import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useTank } from '../context/TankContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const { tanks, activeTank, setActiveTank, deleteTank } = useTank()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (activeTank) fetchData() }, [activeTank])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [logsRes, diagRes] = await Promise.all([
        axios.get(`/api/logs?tankId=${activeTank._id}`),
        axios.get(`/api/diagnose?tankId=${activeTank._id}`)
      ])
      setLogs(logsRes.data)
      setDiagnoses(diagRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDeleteTank = async (id) => {
    if (!window.confirm('Delete this tank and all its data?')) return
    try {
      await deleteTank(id)
      toast.success('Tank deleted')
      navigate('/dashboard')
    } catch (e) { toast.error('Failed to delete tank') }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out')
  }

  const statusColor = { good:'var(--green)', warn:'var(--amber)', critical:'var(--coral)' }

  return (
    <div style={{paddingTop:72,minHeight:'100vh',padding:'72px 24px 40px'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <h2 style={{fontSize:'1.8rem',marginBottom:20}}>My Profile 👤</h2>

        {/* User card */}
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:24,marginBottom:16,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,var(--cyan),var(--teal))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1.3rem',color:'#060d1a',flexShrink:0}}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <h3 style={{fontSize:'1.1rem',marginBottom:2}}>{user?.name}</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text2)'}}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} style={{background:'none',border:'1px solid rgba(255,107,107,0.3)',color:'var(--coral)',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:'0.82rem'}}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
          {[
            { label:'Tanks', value:tanks.length, icon:'🐠' },
            { label:'Logs', value:logs.length, icon:'📊' },
            { label:'Diagnoses', value:diagnoses.length, icon:'🔬' },
          ].map(s => (
            <div key={s.label} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:18,textAlign:'center'}}>
              <div style={{fontSize:'1.6rem',marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.6rem',fontWeight:700,color:'var(--cyan)',marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* My tanks */}
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20,marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{fontSize:'1rem'}}>My Tanks</h3>
            <button onClick={()=>navigate('/setup')} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.78rem',padding:'7px 14px',borderRadius:8,cursor:'pointer'}}>+ Add Tank</button>
          </div>
          {tanks.map(t => (
            <div key={t._id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:'1.5rem'}}>{t.fishEmoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.9rem',fontWeight:500}}>{t.name}</div>
                <div style={{fontSize:'0.76rem',color:'var(--text2)'}}>{t.fishName} · {t.size} · {t.waterType}</div>
              </div>
              <button onClick={()=>{setActiveTank(t);navigate('/dashboard')}}
                style={{background:'rgba(0,212,255,0.1)',border:'1px solid var(--border)',color:'var(--cyan)',fontSize:'0.76rem',padding:'5px 10px',borderRadius:6,cursor:'pointer'}}>
                View
              </button>
              <button onClick={()=>handleDeleteTank(t._id)}
                style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:'1rem'}}>🗑</button>
            </div>
          ))}
          {tanks.length === 0 && <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>No tanks yet.</p>}
        </div>

        {/* Log history */}
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20,marginBottom:16}}>
          <h3 style={{fontSize:'1rem',marginBottom:14}}>📊 Parameter Log History</h3>
          {loading ? <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>Loading...</p> :
            logs.length === 0 ? <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>No logs yet. Log your first parameters from the Dashboard.</p> :
            logs.slice(0,8).map((l,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>{new Date(l.loggedAt).toLocaleString()}</div>
                <div style={{fontSize:'0.82rem',color:'var(--text2)'}}>🌡️{l.temperature}° · pH{l.ph} · {l.turbidity} · NH₃{l.ammonia}</div>
                <div style={{fontSize:'0.76rem',fontWeight:600,color:statusColor[l.status]||'var(--green)'}}>
                  {l.status==='good'?'✓ Good':l.status==='warn'?'⚠ Watch':'🔴 Critical'}
                </div>
              </div>
            ))
          }
        </div>

        {/* Diagnosis history */}
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
          <h3 style={{fontSize:'1rem',marginBottom:14}}>🔬 Diagnosis History</h3>
          {loading ? <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>Loading...</p> :
            diagnoses.length === 0 ? <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>No diagnoses yet. Use the Diagnose tab if you notice symptoms.</p> :
            diagnoses.map((d,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontSize:'0.88rem',fontWeight:600,color:'var(--coral)',marginBottom:2}}>{d.disease}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{d.symptoms.length} symptoms · {d.fishName}</div>
                </div>
                <div style={{fontSize:'0.75rem',color:'var(--text3)',textAlign:'right'}}>
                  <div>Confidence: {d.confidence}%</div>
                  <div>{new Date(d.diagnosedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
