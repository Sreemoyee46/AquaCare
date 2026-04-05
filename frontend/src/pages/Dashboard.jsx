import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTank } from '../context/TankContext'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const FISH_DB = {
  betta:      { tempMin:24, tempMax:28, phMin:6.5, phMax:7.5, ammMax:0.5, temper:'Solitary' },
  goldfish:   { tempMin:18, tempMax:24, phMin:7.0, phMax:7.4, ammMax:0.25, temper:'Peaceful' },
  guppy:      { tempMin:22, tempMax:28, phMin:6.8, phMax:7.8, ammMax:0.5, temper:'Peaceful' },
  neon_tetra: { tempMin:20, tempMax:26, phMin:6.0, phMax:7.0, ammMax:0.25, temper:'Peaceful' },
  molly:      { tempMin:22, tempMax:28, phMin:7.0, phMax:8.0, ammMax:0.5, temper:'Peaceful' },
  platy:      { tempMin:18, tempMax:28, phMin:7.0, phMax:8.0, ammMax:0.5, temper:'Peaceful' },
  angelfish:  { tempMin:24, tempMax:30, phMin:6.0, phMax:7.5, ammMax:0.25, temper:'Semi' },
  oscar:      { tempMin:23, tempMax:28, phMin:6.0, phMax:8.0, ammMax:0.25, temper:'Aggressive' },
  discus:     { tempMin:28, tempMax:31, phMin:6.0, phMax:7.0, ammMax:0.0, temper:'Peaceful' },
  clownfish:  { tempMin:24, tempMax:28, phMin:8.1, phMax:8.4, ammMax:0.0, temper:'Peaceful' },
  blue_tang:  { tempMin:24, tempMax:26, phMin:8.1, phMax:8.4, ammMax:0.0, temper:'Peaceful' },
  corydoras:  { tempMin:22, tempMax:26, phMin:6.5, phMax:7.8, ammMax:0.5, temper:'Peaceful' },
  zebra_danio:{ tempMin:18, tempMax:24, phMin:6.5, phMax:7.0, ammMax:0.5, temper:'Peaceful' },
  cichlid:    { tempMin:24, tempMax:28, phMin:7.8, phMax:8.5, ammMax:0.25, temper:'Aggressive' },
  koi:        { tempMin:15, tempMax:25, phMin:7.0, phMax:8.6, ammMax:0.25, temper:'Peaceful' },
  swordtail:  { tempMin:22, tempMax:28, phMin:7.0, phMax:8.0, ammMax:0.5, temper:'Peaceful' },
  rainbowfish:{ tempMin:22, tempMax:28, phMin:7.0, phMax:8.0, ammMax:0.5, temper:'Peaceful' },
  clown_loach:{ tempMin:25, tempMax:30, phMin:6.0, phMax:7.5, ammMax:0.25, temper:'Semi' },
  tiger_barb: { tempMin:20, tempMax:26, phMin:6.0, phMax:7.0, ammMax:0.5, temper:'Aggressive' },
  paradise_fish:{ tempMin:16, tempMax:26, phMin:6.0, phMax:8.0, ammMax:0.5, temper:'Aggressive' },
  flowerhorn: { tempMin:25, tempMax:30, phMin:7.0, phMax:8.0, ammMax:0.25, temper:'Aggressive' },
  arowana:    { tempMin:24, tempMax:30, phMin:6.5, phMax:7.5, ammMax:0.1, temper:'Aggressive' },
  gourami:    { tempMin:22, tempMax:28, phMin:6.0, phMax:7.5, ammMax:0.5, temper:'Semi' },
  pleco:      { tempMin:22, tempMax:30, phMin:6.5, phMax:7.5, ammMax:0.5, temper:'Peaceful' },
  firemouth:  { tempMin:24, tempMax:28, phMin:6.5, phMax:8.0, ammMax:0.25, temper:'Aggressive' },
}

const inp = { width:'100%', background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:'var(--radius2)', color:'var(--text)', fontSize:'0.95rem', padding:'11px 16px', outline:'none' }
const btn = (color='var(--cyan)') => ({ background:`linear-gradient(135deg,${color},var(--teal))`, color:'#060d1a', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.9rem', padding:'11px 20px', borderRadius:10, cursor:'pointer', width:'100%', marginTop:10 })

export default function Dashboard() {
  const { tanks, activeTank, setActiveTank } = useTank()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [logForm, setLogForm] = useState({ temperature:26, ph:7.0, turbidity:'Clear', ammonia:0.0 })
  const [logging, setLogging] = useState(false)
  const [aiText, setAiText] = useState('')
  const [loadingLogs, setLoadingLogs] = useState(false)

  useEffect(() => { if (activeTank) fetchLogs() }, [activeTank])

  const fetchLogs = async () => {
    setLoadingLogs(true)
    try {
      const { data } = await axios.get(`/api/logs?tankId=${activeTank._id}`)
      setLogs(data)
      if (data[0]?.aiAnalysis) setAiText(data[0].aiAnalysis)
    } catch (e) { console.error(e) }
    finally { setLoadingLogs(false) }
  }

  const handleLog = async () => {
    setLogging(true)
    try {
      const { data } = await axios.post('/api/logs', { tankId: activeTank._id, ...logForm })
      setLogs(prev => [data, ...prev])
      if (data.aiAnalysis) setAiText(data.aiAnalysis)
      setShowModal(false)
      toast.success('✅ Parameters logged & analysed!')
    } catch (e) { toast.error('Failed to log parameters') }
    finally { setLogging(false) }
  }

  if (!activeTank) return (
    <div style={{paddingTop:60,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <div style={{fontSize:'4rem'}}>🐠</div>
      <h2>No tanks yet</h2>
      <p style={{color:'var(--text2)'}}>Set up your first tank to get started</p>
      <button onClick={()=>navigate('/setup')} style={{...btn(),width:'auto',padding:'12px 28px'}}>+ Set Up Tank</button>
    </div>
  )

  const tankFishes = activeTank.fishes?.length > 0 
    ? activeTank.fishes 
    : [{ fishId: activeTank.fishId || 'betta', quantity: 1, name: activeTank.fishName, emoji: activeTank.fishEmoji }]

  let minTemp = -Infinity; let maxTemp = Infinity;
  let minPh = -Infinity; let maxPh = Infinity;
  let maxAmm = Infinity;
  let hasSolitary = false;
  let hasAggressive = false;
  let hasPeaceful = false;
  
  tankFishes.forEach(f => {
    const db = FISH_DB[f.fishId] || FISH_DB.betta
    if (db.tempMin > minTemp) minTemp = db.tempMin;
    if (db.tempMax < maxTemp) maxTemp = db.tempMax;
    if (db.phMin > minPh) minPh = db.phMin;
    if (db.phMax < maxPh) maxPh = db.phMax;
    if (db.ammMax < maxAmm) maxAmm = db.ammMax;

    if (db.temper === 'Solitary') hasSolitary = true;
    if (db.temper === 'Aggressive') hasAggressive = true;
    if (db.temper === 'Peaceful') hasPeaceful = true;
  })

  const sizeCapacities = {
    'Small (under 20L)': 5,
    'Medium (20–60L)': 15,
    'Large (60–150L)': 40,
    'Extra Large (150L+)': 100
  }
  const capacity = sizeCapacities[activeTank.size] || 15
  const totalFishCount = tankFishes.reduce((a, b) => a + (b.quantity || 1), 0)
  const isOverstocked = totalFishCount > capacity

  let temperConflict = null;
  if (hasSolitary && totalFishCount > 1) temperConflict = "Fighter fish (Bettas) are extremely solitary and cannot be housed with other fish.";
  else if (hasAggressive && hasPeaceful) temperConflict = "Predator risk! Aggressive species cannot be mixed with peaceful species.";

  const incompatible = (minTemp > maxTemp) || (minPh > maxPh);
  const fishRanges = { tempMin: minTemp, tempMax: maxTemp, phMin: minPh, phMax: maxPh, ammMax: maxAmm }

  const latest = logs[0]
  const getStatus = (log) => {
    if (incompatible || temperConflict) return 'critical'
    if (!log) return isOverstocked ? 'warn' : 'good'
    const tOk = log.temperature >= fishRanges.tempMin && log.temperature <= fishRanges.tempMax
    const pOk = log.ph >= fishRanges.phMin && log.ph <= fishRanges.phMax
    const aOk = log.ammonia <= fishRanges.ammMax
    const issues = [tOk, pOk, aOk].filter(v=>!v).length
    return issues > 0 || isOverstocked ? (issues > 1 ? 'critical' : 'warn') : 'good'
  }

  const status = getStatus(latest)
  const statusColor = { good:'var(--green)', warn:'var(--amber)', critical:'var(--coral)' }
  const statusLabel = { good:'All Good', warn:'Check Required', critical:'Critical Alert' }

  const chartData = [...logs].reverse().slice(-10).map((l, i) => ({
    name: i + 1,
    Temp: l.temperature,
    pH: l.ph,
    Ammonia: l.ammonia
  }))

  const metrics = [
    { label:'Tank Stocking', value: isOverstocked ? 'Over' : 'Good', unit:'', ok: !isOverstocked, range:`Max ${capacity} fish`, icon:'🐟' },
    { label:'Temperature', value: latest?.temperature ?? '--', unit:'°C', ok: latest ? (!incompatible && latest.temperature>=fishRanges.tempMin && latest.temperature<=fishRanges.tempMax) : !incompatible, range: incompatible ? 'CONFLICT' : `${fishRanges.tempMin}–${fishRanges.tempMax}°C`, icon:'🌡️' },
    { label:'pH Level', value: latest?.ph ?? '--', unit:'', ok: latest ? (!incompatible && latest.ph>=fishRanges.phMin && latest.ph<=fishRanges.phMax) : !incompatible, range: incompatible ? 'CONFLICT' : `${fishRanges.phMin}–${fishRanges.phMax}`, icon:'🧪' },
    { label:'Turbidity', value: latest?.turbidity ?? '--', unit:'', ok: latest ? latest.turbidity==='Clear' : true, range:'Clear', icon:'💧' },
    { label:'Ammonia', value: latest?.ammonia ?? '--', unit:'ppm', ok: latest ? latest.ammonia<=fishRanges.ammMax : true, range:`≤${fishRanges.ammMax} ppm`, icon:'⚗️' },
  ]

  return (
    <div style={{paddingTop:60,minHeight:'100vh',padding:'72px 24px 40px'}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',gap:6,marginBottom:6,fontSize:'1.8rem'}}>
              {tankFishes.slice(0,5).map((f,i)=><span key={i}>{f.emoji}</span>)}
              {tankFishes.length > 5 && <span style={{fontSize:'1rem',display:'flex',alignItems:'center',color:'var(--text2)'}}>+</span>}
            </div>
            <h2 style={{fontSize:'1.6rem'}}>{activeTank.name}</h2>
            <p style={{color:'var(--text2)',fontSize:'0.87rem',marginTop:4}}>{totalFishCount} fish ({tankFishes.length} species) · {activeTank.size} · {activeTank.waterType}</p>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
            {tanks.length > 1 && (
              <select value={activeTank._id} onChange={e=>setActiveTank(tanks.find(t=>t._id===e.target.value))}
                style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text)',padding:'6px 12px',fontSize:'0.82rem'}}>
                {tanks.map(t=><option key={t._id} value={t._id}>{t.emoji || '🐠'} {t.name}</option>)}
              </select>
            )}
            <button onClick={() => navigate(`/edit-tank/${activeTank._id}`)} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',fontSize:'0.82rem',padding:'6px 12px',borderRadius:8,cursor:'pointer'}}>✏️ Edit</button>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:20,fontSize:'0.82rem',fontWeight:600,
              background:`rgba(${status==='good'?'0,230,118':status==='warn'?'255,184,0':'255,107,107'},0.12)`,
              color:statusColor[status], border:`1px solid rgba(${status==='good'?'0,230,118':status==='warn'?'255,184,0':'255,107,107'},0.25)`}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>
              {statusLabel[status]}
            </div>
          </div>
        </div>

        {temperConflict && (
          <div style={{background:'rgba(255,107,107,0.1)',border:'1px solid var(--coral)',color:'var(--coral)',padding:'12px 20px',borderRadius:8,fontSize:'0.9rem',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'1.2rem'}}>⚠️</span> <strong>Dangerous Cohabitation!</strong> {temperConflict}
          </div>
        )}
        {incompatible && !temperConflict && (
          <div style={{background:'rgba(255,107,107,0.1)',border:'1px solid var(--coral)',color:'var(--coral)',padding:'12px 20px',borderRadius:8,fontSize:'0.9rem',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'1.2rem'}}>⚠️</span> <strong>Incompatible Species!</strong> Their safe water parameter ranges severely conflict.
          </div>
        )}
        {isOverstocked && (
          <div style={{background:'rgba(255,184,0,0.1)',border:'1px solid var(--amber)',color:'var(--amber)',padding:'12px 20px',borderRadius:8,fontSize:'0.9rem',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'1.2rem'}}>⚠️</span> <strong>Overstocked!</strong> Your tank size ({activeTank.size}) is too small for {totalFishCount} fish. This may cause dangerous ammonia spikes.
          </div>
        )}
        {!isOverstocked && !incompatible && !temperConflict && totalFishCount > 0 && (
          <div style={{background:'rgba(0,230,118,0.1)',border:'1px solid var(--green)',color:'var(--green)',padding:'12px 20px',borderRadius:8,fontSize:'0.9rem',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'1.2rem'}}>✅</span> <strong>Perfect Stocking!</strong> The fish are safely cohabitating and your tank size ({activeTank.size}) beautifully supports {totalFishCount} fish.
          </div>
        )}

        {/* AI Banner */}
        <div style={{background:'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(0,255,204,0.05))',border:'1px solid var(--border2)',borderRadius:'var(--radius)',padding:'16px 20px',marginBottom:20,display:'flex',gap:14,alignItems:'flex-start'}}>
          <span style={{fontSize:'1.6rem',flexShrink:0}}>🤖</span>
          <p style={{fontSize:'0.87rem',color:'var(--text2)',lineHeight:1.7}}>
            <strong style={{color:'var(--cyan)'}}>AI Analysis: </strong>
            {aiText || `Welcome! Log your first parameters to get AI-powered analysis for your community.`}
          </p>
        </div>

        {/* Metrics */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:20}}>
          {metrics.map(m => (
            <div key={m.label} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
              <div style={{fontSize:'0.75rem',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{m.icon} {m.label}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:700,color:m.ok?'var(--green)':'var(--coral)',marginBottom:4}}>
                {m.value}<span style={{fontSize:'0.85rem',color:'var(--text2)'}}> {m.unit}</span>
              </div>
              <div style={{fontSize:'0.78rem',color:m.ok?'var(--green)':'var(--coral)',marginBottom:2}}>{m.ok?'✓ Safe':'⚠ Out of range'}</div>
              <div style={{fontSize:'0.72rem',color:'var(--text3)'}}>Safe: {m.range}</div>
            </div>
          ))}
        </div>

        {/* Chart + Logs */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
          {/* Chart */}
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
            <h3 style={{fontSize:'1rem',marginBottom:16}}>📊 Parameter Trends</h3>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text3)" tick={{fontSize:11}} />
                  <YAxis stroke="var(--text3)" tick={{fontSize:11}} />
                  <Tooltip contentStyle={{background:'var(--card2)',border:'1px solid var(--border2)',borderRadius:8,fontSize:'0.8rem'}} />
                  <Line type="monotone" dataKey="Temp" stroke="var(--coral)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pH" stroke="var(--cyan)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Ammonia" stroke="var(--amber)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{height:180,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:'0.85rem'}}>Log at least 2 entries to see trends</div>
            )}
          </div>

          {/* Recent logs */}
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20}}>
            <h3 style={{fontSize:'1rem',marginBottom:16}}>📋 Recent Logs</h3>
            {logs.slice(0,4).map((l,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontSize:'0.85rem',fontWeight:500}}>{new Date(l.loggedAt).toLocaleDateString()}</div>
                  <div style={{fontSize:'0.76rem',color:'var(--text2)'}}>🌡️{l.temperature}° · pH{l.ph} · {l.turbidity}</div>
                </div>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:l.status==='good'?'var(--green)':l.status==='warn'?'var(--amber)':'var(--coral)'}}>
                  {l.status==='good'?'✓ Good':l.status==='warn'?'⚠ Watch':'🔴 Critical'}
                </div>
              </div>
            ))}
            {logs.length === 0 && <p style={{color:'var(--text3)',fontSize:'0.85rem'}}>No logs yet. Log your first reading below.</p>}
            <button onClick={()=>setShowModal(true)} style={btn()}>+ Log Parameters</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:'var(--radius)',padding:28,width:'100%',maxWidth:460}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontSize:'1.1rem'}}>🧪 Log Parameters</h3>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'var(--text2)',fontSize:'1.4rem',cursor:'pointer'}}>×</button>
            </div>
            {[
              { key:'temperature', label:`Temperature (${fishRanges.tempMin}–${fishRanges.tempMax}°C)`, min:15, max:36, step:0.5 },
              { key:'ph', label:`pH (${fishRanges.phMin}–${fishRanges.phMax})`, min:4, max:10, step:0.1 },
              { key:'ammonia', label:`Ammonia ppm (≤${fishRanges.ammMax})`, min:0, max:5, step:0.1 },
            ].map(f => (
              <div key={f.key} style={{marginBottom:18}}>
                <label style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem',color:'var(--text2)',marginBottom:8}}>
                  <span>{f.label}</span>
                  <span style={{color:'var(--cyan)',fontWeight:600}}>{logForm[f.key]}</span>
                </label>
                <input type="range" min={f.min} max={f.max} step={f.step} value={logForm[f.key]}
                  onChange={e=>setLogForm({...logForm,[f.key]:parseFloat(e.target.value)})}
                  style={{width:'100%',accentColor:'var(--cyan)'}} />
              </div>
            ))}
            <div style={{marginBottom:18}}>
              <label style={{display:'block',fontSize:'0.85rem',color:'var(--text2)',marginBottom:8}}>Turbidity</label>
              <div style={{display:'flex',gap:8}}>
                {['Clear','Slightly Cloudy','Very Cloudy'].map(t => (
                  <div key={t} onClick={()=>setLogForm({...logForm,turbidity:t})}
                    style={{flex:1,background:logForm.turbidity===t?'rgba(0,212,255,0.1)':'var(--card)',border:`1.5px solid ${logForm.turbidity===t?'var(--cyan)':'var(--border)'}`,borderRadius:8,padding:'8px 4px',textAlign:'center',fontSize:'0.75rem',cursor:'pointer',color:logForm.turbidity===t?'var(--cyan)':'var(--text2)'}}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleLog} disabled={logging} style={{...btn(),opacity:logging?0.7:1}}>
              {logging ? 'Analysing...' : 'Save & Analyse with AI'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
