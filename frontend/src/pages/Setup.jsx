import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTank } from '../context/TankContext'

const FISH_DB = [
  { id:'betta', name:'Betta', emoji:'🐠', difficulty:'Beginner', water:'Freshwater' },
  { id:'goldfish', name:'Goldfish', emoji:'🐡', difficulty:'Beginner', water:'Freshwater' },
  { id:'guppy', name:'Guppy', emoji:'🐟', difficulty:'Beginner', water:'Freshwater' },
  { id:'neon_tetra', name:'Neon Tetra', emoji:'🐠', difficulty:'Beginner', water:'Freshwater' },
  { id:'molly', name:'Molly', emoji:'🐟', difficulty:'Beginner', water:'Freshwater' },
  { id:'platy', name:'Platy', emoji:'🐠', difficulty:'Beginner', water:'Freshwater' },
  { id:'angelfish', name:'Angelfish', emoji:'🦋', difficulty:'Intermediate', water:'Freshwater' },
  { id:'oscar', name:'Oscar', emoji:'🐡', difficulty:'Intermediate', water:'Freshwater' },
  { id:'discus', name:'Discus', emoji:'🫧', difficulty:'Expert', water:'Freshwater' },
  { id:'clownfish', name:'Clownfish', emoji:'🤡', difficulty:'Intermediate', water:'Saltwater' },
  { id:'blue_tang', name:'Blue Tang', emoji:'💙', difficulty:'Expert', water:'Saltwater' },
  { id:'corydoras', name:'Corydoras', emoji:'🐟', difficulty:'Beginner', water:'Freshwater' },
  { id:'zebra_danio', name:'Zebra Danio', emoji:'🦓', difficulty:'Beginner', water:'Freshwater' },
  { id:'cichlid', name:'African Cichlid', emoji:'🐠', difficulty:'Intermediate', water:'Freshwater' },
  { id:'koi', name:'Koi', emoji:'🎏', difficulty:'Intermediate', water:'Freshwater' },
  { id:'swordtail', name:'Swordtail', emoji:'⚔️', difficulty:'Beginner', water:'Freshwater' },
  { id:'rainbowfish', name:'Rainbowfish', emoji:'🌈', difficulty:'Beginner', water:'Freshwater' },
  { id:'clown_loach', name:'Clown Loach', emoji:'🐍', difficulty:'Intermediate', water:'Freshwater' },
  { id:'tiger_barb', name:'Tiger Barb', emoji:'🐯', difficulty:'Beginner', water:'Freshwater' },
  { id:'paradise_fish', name:'Paradise Fish', emoji:'🌺', difficulty:'Beginner', water:'Freshwater' },
  { id:'flowerhorn', name:'Flowerhorn', emoji:'🌸', difficulty:'Intermediate', water:'Freshwater' },
  { id:'arowana', name:'Arowana', emoji:'🐉', difficulty:'Expert', water:'Freshwater' },
  { id:'gourami', name:'Gourami', emoji:'💜', difficulty:'Beginner', water:'Freshwater' },
  { id:'pleco', name:'Pleco', emoji:'🦎', difficulty:'Beginner', water:'Freshwater' },
  { id:'firemouth', name:'Firemouth Cichlid', emoji:'🔥', difficulty:'Intermediate', water:'Freshwater' },
]

const diffColor = { Beginner:'var(--green)', Intermediate:'var(--amber)', Expert:'var(--coral)' }

export default function Setup() {
  const [step, setStep] = useState(1)
  const [selectedFish, setSelectedFish] = useState(null)
  const [form, setForm] = useState({ name:'', size:'Medium (20–60L)', waterType:'Freshwater' })
  const [loading, setLoading] = useState(false)
  const { addTank } = useTank()
  const navigate = useNavigate()

  const handleFinish = async () => {
    if (!selectedFish) { toast.error('Please select a fish'); return }
    if (!form.name) { toast.error('Please enter a tank name'); return }
    setLoading(true)
    try {
      await addTank({ fishId: selectedFish.id, fishName: selectedFish.name, fishEmoji: selectedFish.emoji, ...form })
      toast.success('🎉 Tank created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to create tank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{paddingTop:80,minHeight:'100vh',padding:'80px 24px 40px'}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h2 style={{fontSize:'1.8rem',marginBottom:8}}>Set Up Your Tank 🐟</h2>
        <p style={{color:'var(--text2)',marginBottom:24}}>Tell us about your aquarium and we'll personalise everything.</p>

        {/* Step indicators */}
        <div style={{display:'flex',gap:8,marginBottom:28}}>
          {[1,2,3].map(i => (
            <div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<=step?'var(--cyan)':'var(--bg3)',transition:'background 0.3s'}} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <p style={{fontSize:'0.85rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:16}}>Step 1 — Choose your fish</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10,maxHeight:420,overflowY:'auto',marginBottom:20}}>
              {FISH_DB.map(f => (
                <div key={f.id} onClick={() => setSelectedFish(f)}
                  style={{background:'var(--card)',border:`1.5px solid ${selectedFish?.id===f.id?'var(--cyan)':'var(--border)'}`,borderRadius:'var(--radius2)',padding:'14px 10px',textAlign:'center',cursor:'pointer',transition:'all 0.2s',background:selectedFish?.id===f.id?'rgba(0,212,255,0.08)':'var(--card)'}}>
                  <div style={{fontSize:'1.8rem',marginBottom:6}}>{f.emoji}</div>
                  <div style={{fontSize:'0.82rem',fontWeight:600,marginBottom:3}}>{f.name}</div>
                  <div style={{fontSize:'0.7rem',color:diffColor[f.difficulty]}}>{f.difficulty}</div>
                  <div style={{fontSize:'0.7rem',color:'var(--text3)'}}>{f.water}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { if(!selectedFish){toast.error('Select a fish first');return} setStep(2) }}
              style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'12px 28px',borderRadius:10,cursor:'pointer',fontSize:'0.95rem'}}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <p style={{fontSize:'0.85rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:16}}>Step 2 — Tank details</p>
            {[
              { key:'name', label:'Tank Name', type:'text', placeholder:'e.g. Living Room Tank' },
            ].map(f => (
              <div key={f.key} style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:'0.85rem',color:'var(--text2)',marginBottom:8}}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                  style={{width:'100%',background:'var(--card)',border:'1.5px solid var(--border)',borderRadius:'var(--radius2)',color:'var(--text)',fontSize:'0.95rem',padding:'12px 16px',outline:'none'}} />
              </div>
            ))}
            {[
              { key:'size', label:'Tank Size', opts:['Small (under 20L)','Medium (20–60L)','Large (60–150L)','Extra Large (150L+)'] },
              { key:'waterType', label:'Water Type', opts:['Freshwater','Saltwater','Brackish'] },
            ].map(f => (
              <div key={f.key} style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:'0.85rem',color:'var(--text2)',marginBottom:8}}>{f.label}</label>
                <select value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                  style={{width:'100%',background:'var(--card)',border:'1.5px solid var(--border)',borderRadius:'var(--radius2)',color:'var(--text)',fontSize:'0.95rem',padding:'12px 16px',outline:'none'}}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:12,marginTop:8}}>
              <button onClick={()=>setStep(1)} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text2)',padding:'12px 20px',borderRadius:10,cursor:'pointer',fontSize:'0.95rem'}}>← Back</button>
              <button onClick={()=>setStep(3)} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'12px 28px',borderRadius:10,cursor:'pointer',fontSize:'0.95rem'}}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <p style={{fontSize:'0.85rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:16}}>Step 3 — Confirm & Create</p>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:28,textAlign:'center',marginBottom:20}}>
              <div style={{fontSize:'3rem',marginBottom:12}}>{selectedFish?.emoji}</div>
              <h3 style={{fontSize:'1.2rem',marginBottom:8}}>{form.name || 'My Tank'}</h3>
              <p style={{color:'var(--text2)',fontSize:'0.9rem'}}>{selectedFish?.name} · {form.size} · {form.waterType}</p>
              <p style={{color:'var(--text3)',fontSize:'0.82rem',marginTop:8}}>Default reminders for feeding, water changes, and filter cleaning will be auto-created.</p>
            </div>
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>setStep(2)} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text2)',padding:'12px 20px',borderRadius:10,cursor:'pointer',fontSize:'0.95rem'}}>← Back</button>
              <button onClick={handleFinish} disabled={loading} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'12px 28px',borderRadius:10,cursor:'pointer',fontSize:'0.95rem',opacity:loading?0.7:1}}>
                {loading ? 'Creating...' : '🎉 Create Tank'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
