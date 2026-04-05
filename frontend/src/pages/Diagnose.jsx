import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTank } from '../context/TankContext'
import { useNavigate } from 'react-router-dom'

const SYMPTOMS = [
  { id:'white_spots', label:'White spots on body', icon:'⚪' },
  { id:'torn_fins', label:'Torn or ragged fins', icon:'💔' },
  { id:'not_eating', label:'Not eating', icon:'🚫' },
  { id:'lethargy', label:'Lethargic / inactive', icon:'😴' },
  { id:'gasping_surface', label:'Gasping at surface', icon:'🫧' },
  { id:'scratching', label:'Scratching on objects', icon:'🔄' },
  { id:'bloating', label:'Bloated belly', icon:'🎈' },
  { id:'discoloration', label:'Color fading', icon:'🎨' },
  { id:'clamped_fins', label:'Clamped fins', icon:'📌' },
  { id:'swimming_sideways', label:'Swimming sideways', icon:'↔️' },
  { id:'rapid_breathing', label:'Rapid breathing', icon:'💨' },
  { id:'raised_scales', label:'Raised / pinecone scales', icon:'🌲' },
  { id:'floating', label:'Floating at top', icon:'⬆️' },
  { id:'sinking', label:'Sinking to bottom', icon:'⬇️' },
  { id:'gold_dust', label:'Gold dust on body', icon:'✨' },
  { id:'red_gills', label:'Red / inflamed gills', icon:'🔴' },
  { id:'white_patches', label:'White patches on body', icon:'🔵' },
  { id:'frayed_fins', label:'Frayed fin edges', icon:'✂️' },
]

export default function Diagnose() {
  const { activeTank, tanks } = useTank()
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [diagnosing, setDiagnosing] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedSpecies, setSelectedSpecies] = useState(null)

  const tankFishes = activeTank?.fishes?.length > 0 
    ? activeTank.fishes 
    : [{ fishId: activeTank?.fishId || 'unknown', name: activeTank?.fishName || 'Your Fish', emoji: activeTank?.fishEmoji || '🐠', quantity: 1 }]
  
  const targetFish = selectedSpecies || (tankFishes[0] || {})

  useEffect(() => { if (activeTank) fetchHistory() }, [activeTank])

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`/api/diagnose?tankId=${activeTank._id}`)
      setHistory(data)
    } catch (e) { console.error(e) }
  }

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s=>s!==id) : [...prev, id])

  const handleDiagnose = async () => {
    if (selected.length === 0) { toast.error('Select at least one symptom'); return }
    if (!activeTank) { toast.error('No tank selected'); return }
    setDiagnosing(true)
    setResult(null)
    try {
      const { data } = await axios.post('/api/diagnose', { tankId: activeTank._id, symptoms: selected, fishName: targetFish.name })
      setResult(data)
      fetchHistory()
      toast.success('🔬 Diagnosis complete!')
    } catch (e) { toast.error('Diagnosis failed') }
    finally { setDiagnosing(false) }
  }

  if (!activeTank) return (
    <div style={{paddingTop:60,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <div style={{fontSize:'4rem'}}>🔬</div>
      <h2>No tanks yet</h2>
      <button onClick={()=>navigate('/setup')} style={{background:'linear-gradient(135deg,var(--cyan),var(--teal))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,padding:'12px 28px',borderRadius:10,cursor:'pointer'}}>+ Set Up Tank</button>
    </div>
  )

  return (
    <div style={{paddingTop:72,minHeight:'100vh',padding:'72px 24px 40px'}}>
      <div style={{maxWidth:760,margin:'0 auto'}}>
        <h2 style={{fontSize:'1.8rem',marginBottom:8}}>Disease Diagnosis 🔬</h2>
        <p style={{color:'var(--text2)',marginBottom:20}}>Select every symptom you notice. Our AI will identify the disease and give you a treatment plan for your <strong style={{color:'var(--cyan)'}}>{targetFish.emoji} {targetFish.name}</strong>.</p>

        {tankFishes.length > 1 && (
          <div style={{marginBottom:24}}>
            <p style={{fontSize:'0.85rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:12}}>1. Select Sick Fish</p>
            <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:8}}>
              {tankFishes.map(f => (
                <div key={f.fishId} onClick={() => setSelectedSpecies(f)}
                  style={{background:targetFish.fishId===f.fishId?'rgba(0,212,255,0.08)':'var(--card)',border:`1.5px solid ${targetFish.fishId===f.fishId?'var(--cyan)':'var(--border)'}`,borderRadius:'var(--radius2)',padding:'10px 18px',cursor:'pointer',whiteSpace:'nowrap',color:targetFish.fishId===f.fishId?'var(--text)':'var(--text2)',fontWeight:targetFish.fishId===f.fishId?600:400,transition:'all 0.2s'}}>
                  {f.emoji} {f.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{fontSize:'0.85rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:12}}>{tankFishes.length > 1 ? '2. Select Symptoms' : 'Symptoms'}</p>

        {/* Symptom Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:20}}>
          {SYMPTOMS.map(s => (
            <div key={s.id} onClick={()=>toggle(s.id)}
              style={{background:selected.includes(s.id)?'rgba(255,107,107,0.08)':'var(--card)',border:`1.5px solid ${selected.includes(s.id)?'var(--coral)':'var(--border)'}`,borderRadius:10,padding:'12px 14px',cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',gap:10,fontSize:'0.86rem',color:selected.includes(s.id)?'var(--text)':'var(--text2)'}}>
              <span style={{fontSize:'1.1rem'}}>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        {selected.length > 0 && (
          <div style={{marginBottom:16,padding:'10px 16px',background:'rgba(255,107,107,0.06)',border:'1px solid rgba(255,107,107,0.15)',borderRadius:8,fontSize:'0.84rem',color:'var(--text2)'}}>
            {selected.length} symptom{selected.length>1?'s':''} selected
          </div>
        )}

        <button onClick={handleDiagnose} disabled={diagnosing}
          style={{background:'linear-gradient(135deg,var(--coral),#ff9a6b)',color:'#1a0a0a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.95rem',padding:'13px 28px',borderRadius:10,cursor:'pointer',opacity:diagnosing?0.7:1,marginBottom:24}}>
          {diagnosing ? '🤖 AI is analysing...' : '🔍 Diagnose Now'}
        </button>

        {/* Result */}
        {result && (
          <div style={{background:'var(--card)',border:'1.5px solid var(--border2)',borderRadius:'var(--radius)',padding:24,marginBottom:24}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.3rem',fontWeight:700,color:'var(--coral)',marginBottom:4}}>{result.disease}</div>
            <div style={{fontSize:'0.82rem',color:'var(--text2)',marginBottom:4}}>Confidence: {result.confidence}% · Fish: {targetFish.emoji} {result.fishName}</div>
            {result.aiResponse && <p style={{fontSize:'0.86rem',color:'var(--text2)',lineHeight:1.7,marginBottom:16,padding:'10px 14px',background:'rgba(0,212,255,0.05)',borderRadius:8,borderLeft:'3px solid var(--cyan)'}}>{result.aiResponse}</p>}

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div>
                <h4 style={{fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text3)',marginBottom:10}}>✅ What to Do</h4>
                {result.dos?.map((d,i) => (
                  <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:'0.86rem',lineHeight:1.5}}>
                    <span style={{color:'var(--green)',fontWeight:700,flexShrink:0}}>✓</span> {d}
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{fontSize:'0.82rem',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text3)',marginBottom:10}}>❌ What NOT to Do</h4>
                {result.donts?.map((d,i) => (
                  <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:'0.86rem',lineHeight:1.5}}>
                    <span style={{color:'var(--coral)',fontWeight:700,flexShrink:0}}>✕</span> {d}
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginTop:14,padding:'10px 14px',background:'rgba(255,184,0,0.08)',border:'1px solid rgba(255,184,0,0.2)',borderRadius:8}}>
              <p style={{fontSize:'0.78rem',color:'var(--amber)'}}>⚠ AI-assisted guidance based on fisheries expert data. For severe cases, consult a professional aquarist.</p>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
            <h3 style={{fontSize:'1rem',marginBottom:14}}>📋 Past Diagnoses</h3>
            {history.map((d,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontSize:'0.87rem',fontWeight:600,color:'var(--coral)'}}>{d.disease}</div>
                  <div style={{fontSize:'0.76rem',color:'var(--text3)'}}>{d.symptoms.length} symptoms · {d.fishName}</div>
                </div>
                <div style={{fontSize:'0.76rem',color:'var(--text3)'}}>{new Date(d.diagnosedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
