import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTank } from '../context/TankContext'
import { useNavigate } from 'react-router-dom'

const iconMap = { feed:'🍽️', water_change:'💧', filter_clean:'🧹', parameter_check:'🔬', custom:'⏰' }
const bgMap   = { feed:'rgba(0,230,118,0.1)', water_change:'rgba(0,212,255,0.1)', filter_clean:'rgba(255,184,0,0.1)', parameter_check:'rgba(0,255,204,0.1)', custom:'rgba(255,107,107,0.1)' }

const daysUntil = (date) => {
  const diff = new Date(date) - new Date()
  const days = Math.ceil(diff / (1000*60*60*24))
  if (days < 0) return { label:'Overdue!', color:'var(--coral)' }
  if (days === 0) return { label:'Due today', color:'var(--coral)' }
  if (days === 1) return { label:'Due tomorrow', color:'var(--amber)' }
  return { label:`Due in ${days} days`, color:'var(--green)' }
}

export default function Reminders() {
  const { activeTank } = useTank()
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newRem, setNewRem] = useState({ title:'', type:'custom', frequency:'Daily', nextDue:'' })
  const [adding, setAdding] = useState(false)

  useEffect(() => { if (activeTank) fetchReminders() }, [activeTank])

  const fetchReminders = async () => {
    try {
      const { data } = await axios.get(`/api/reminders?tankId=${activeTank._id}`)
      setReminders(data)
    } catch (e) { console.error(e) }
  }

  const toggleReminder = async (id) => {
    try {
      const { data } = await axios.patch(`/api/reminders/${id}/toggle`)
      setReminders(prev => prev.map(r => r._id === id ? data : r))
      toast.success(data.enabled ? '⏰ Reminder enabled' : '🔕 Reminder disabled')
    } catch (e) { toast.error('Failed to update reminder') }
  }

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`)
      setReminders(prev => prev.filter(r => r._id !== id))
      toast.success('Reminder deleted')
    } catch (e) { toast.error('Failed to delete') }
  }

  const markDone = async (id) => {
    try {
      const { data } = await axios.patch(`/api/reminders/${id}/done`)
      setReminders(prev => prev.map(r => r._id === id ? data : r))
      toast.success('✅ Marked as done & rescheduled!')
    } catch (e) { toast.error('Failed to mark done') }
  }

  const addReminder = async () => {
    if (!newRem.title || !newRem.nextDue) { toast.error('Fill in all fields'); return }
    setAdding(true)
    try {
      const { data } = await axios.post('/api/reminders', { tankId: activeTank._id, ...newRem, icon: iconMap[newRem.type] })
      setReminders(prev => [...prev, data])
      setShowAdd(false)
      setNewRem({ title:'', type:'custom', frequency:'Daily', nextDue:'' })
      toast.success('⏰ Reminder added!')
    } catch (e) { toast.error('Failed to add reminder') }
    finally { setAdding(false) }
  }

  if (!activeTank) return (
    <div style={{paddingTop:60,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <div style={{fontSize:'4rem'}}>⏰</div>
      <h2>No tanks yet</h2>
      <button onClick={()=>navigate('/setup')} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'12px 28px',borderRadius:10,cursor:'pointer'}}>+ Set Up Tank</button>
    </div>
  )

  return (
    <div style={{paddingTop:72,minHeight:'100vh',padding:'72px 24px 40px'}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h2 style={{fontSize:'1.8rem',marginBottom:8}}>Smart Reminders ⏰</h2>
        <p style={{color:'var(--text2)',marginBottom:24}}>For your <strong style={{color:'var(--cyan)'}}>{activeTank.fishEmoji} {activeTank.name}</strong>. Toggle to enable or disable any reminder.</p>

        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
          {reminders.map(r => {
            const due = daysUntil(r.nextDue)
            return (
              <div key={r._id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'16px 18px',display:'flex',alignItems:'center',gap:14,opacity:r.enabled?1:0.5,transition:'opacity 0.2s'}}>
                <div style={{width:46,height:46,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',background:bgMap[r.type]||bgMap.custom,flexShrink:0}}>
                  {iconMap[r.type]||r.icon||'⏰'}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.92rem',fontWeight:500,marginBottom:2}}>{r.title}</div>
                  <div style={{fontSize:'0.78rem',color:'var(--text2)'}}>{r.frequency}</div>
                  <div style={{fontSize:'0.76rem',color:due.color,marginTop:2}}>{due.label}</div>
                </div>
                <label style={{position:'relative',width:44,height:24,flexShrink:0}}>
                  <input type="checkbox" checked={r.enabled} onChange={()=>toggleReminder(r._id)} style={{opacity:0,position:'absolute',width:0,height:0}} />
                  <div style={{position:'absolute',inset:0,background:r.enabled?'rgba(0,212,255,0.3)':'var(--bg3)',borderRadius:24,cursor:'pointer',transition:'background 0.3s'}}>
                    <div style={{position:'absolute',top:3,left:r.enabled?23:3,width:18,height:18,background:r.enabled?'var(--cyan)':'var(--text3)',borderRadius:'50%',transition:'left 0.3s'}}/>
                  </div>
                </label>
                <div style={{display:'flex',gap:2,flexShrink:0}}>
                  <button onClick={()=>markDone(r._id)} style={{background:'none',border:'none',fontSize:'1.1rem',cursor:'pointer',padding:4,transition:'transform 0.2s', filter: r.enabled ? 'none' : 'grayscale(1)'}} disabled={!r.enabled} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} title="Mark Done">✅</button>
                  <button onClick={()=>deleteReminder(r._id)} style={{background:'none',border:'none',color:'var(--text3)',fontSize:'1.1rem',cursor:'pointer',padding:4,transition:'transform 0.2s'}} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} title="Delete">🗑</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add reminder */}
        {!showAdd ? (
          <div onClick={()=>setShowAdd(true)} style={{background:'var(--card)',border:'1.5px dashed var(--border2)',borderRadius:'var(--radius)',padding:20,textAlign:'center',cursor:'pointer',transition:'border-color 0.2s'}}>
            <p style={{color:'var(--text2)',fontSize:'0.9rem'}}>+ Add Custom Reminder</p>
          </div>
        ) : (
          <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:'var(--radius)',padding:20}}>
            <h4 style={{marginBottom:16}}>New Reminder</h4>
            {[
              { key:'title', label:'Title', type:'text', placeholder:'e.g. Check filter' },
              { key:'nextDue', label:'Next Due Date', type:'date', placeholder:'' },
            ].map(f => (
              <div key={f.key} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:'0.83rem',color:'var(--text2)',marginBottom:6}}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={newRem[f.key]} onChange={e=>setNewRem({...newRem,[f.key]:e.target.value})}
                  style={{width:'100%',background:'var(--bg3)',border:'1.5px solid var(--border)',borderRadius:8,color:'var(--text)',fontSize:'0.9rem',padding:'10px 14px',outline:'none'}} />
              </div>
            ))}
            {[
              { key:'type', label:'Type', opts:[['feed','Feeding'],['water_change','Water Change'],['filter_clean','Filter Clean'],['parameter_check','Parameter Check'],['custom','Custom']] },
              { key:'frequency', label:'Frequency', opts:[['Daily','Daily'],['Every 2 days','Every 2 days'],['Weekly','Weekly'],['Every 2 weeks','Every 2 weeks'],['Monthly','Monthly']] },
            ].map(f => (
              <div key={f.key} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:'0.83rem',color:'var(--text2)',marginBottom:6}}>{f.label}</label>
                <select value={newRem[f.key]} onChange={e=>setNewRem({...newRem,[f.key]:e.target.value})}
                  style={{width:'100%',background:'var(--bg3)',border:'1.5px solid var(--border)',borderRadius:8,color:'var(--text)',fontSize:'0.9rem',padding:'10px 14px',outline:'none'}}>
                  {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowAdd(false)} style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text2)',padding:'10px 18px',borderRadius:8,cursor:'pointer',fontSize:'0.9rem'}}>Cancel</button>
              <button onClick={addReminder} disabled={adding} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'10px 20px',borderRadius:8,cursor:'pointer',fontSize:'0.9rem',flex:1,opacity:adding?0.7:1}}>
                {adding?'Adding...':'Add Reminder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
