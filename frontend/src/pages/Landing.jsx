import { useNavigate } from 'react-router-dom'

const s = {
  page: { paddingTop: 60, minHeight: '100vh' },
  hero: { minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)' },
  fish: { fontSize: '5rem', marginBottom: 20, display: 'block', animation: 'float 3s ease-in-out infinite' },
  h1: { fontSize: 'clamp(2.4rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 },
  p: { color: 'var(--text2)', fontSize: '1.1rem', maxWidth: 520, lineHeight: 1.7, marginBottom: 36 },
  btns: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  primary: { background: 'linear-gradient(135deg,var(--cyan),var(--teal))', color: '#060d1a', border: 'none', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: 12, cursor: 'pointer' },
  outline: { background: 'none', border: '1.5px solid rgba(0,200,255,0.18)', color: 'var(--text)', fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '1rem', padding: '14px 32px', borderRadius: 12, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, padding: '40px 28px 60px', maxWidth: 900, margin: '0 auto' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 },
}

const features = [
  { icon: '🧪', title: 'Parameter Tracking', desc: 'Log temperature, pH, turbidity and ammonia. Get instant AI analysis based on your specific fish species.' },
  { icon: '🔬', title: 'Disease Diagnosis', desc: 'Answer questions about symptoms. Get a confident AI diagnosis with specific do\'s and don\'ts.' },
  { icon: '⏰', title: 'Smart Reminders', desc: 'Never forget feeding time, water changes, or filter cleaning. Custom schedules for your fish.' },
  { icon: '🏪', title: 'Trusted Shop', desc: 'Buy tanks, decorations, medicines and fish from verified aquarium vendors.' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div style={s.page}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div style={s.hero}>
        <span style={s.fish}>🐠</span>
        <h1 style={s.h1}>Your fish deserve<br /><span style={{color:'var(--cyan)'}}>expert care</span></h1>
        <p style={s.p}>AquaCare monitors your aquarium health, detects diseases early, and tells you exactly what to do — backed by real fisheries science and AI.</p>
        <div style={s.btns}>
          <button style={s.primary} onClick={() => navigate('/register')}>Get Started Free</button>
          <button style={s.outline} onClick={() => navigate('/login')}>I have an account</button>
        </div>
      </div>
      <div style={s.grid}>
        {features.map(f => (
          <div key={f.title} style={s.card}>
            <div style={{fontSize:'2rem',marginBottom:12}}>{f.icon}</div>
            <h3 style={{fontSize:'1rem',marginBottom:8}}>{f.title}</h3>
            <p style={{fontSize:'0.84rem',color:'var(--text2)',lineHeight:1.6}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
