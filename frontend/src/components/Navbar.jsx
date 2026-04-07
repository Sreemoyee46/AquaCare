import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTank } from '../context/TankContext'
import { useCart } from '../context/CartContext'

const styles = {
  nav: { position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(6,13,26,0.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(0,200,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:60 },
  logo: { fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.2rem', color:'var(--cyan)', textDecoration:'none', letterSpacing:'0.02em' },
  tabs: { display:'flex', gap:4 },
  tab: { background:'none', border:'none', fontFamily:'DM Sans,sans-serif', fontSize:'0.82rem', padding:'7px 12px', borderRadius:8, cursor:'pointer', transition:'all 0.2s', textDecoration:'none', color:'var(--text2)' },
  activeTab: { color:'var(--cyan)', background:'rgba(0,212,255,0.1)' },
  right: { display:'flex', alignItems:'center', gap:8 },
  btn: { background:'linear-gradient(135deg,var(--cyan),var(--teal))', color:'#060d1a', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem', padding:'7px 14px', borderRadius:8, cursor:'pointer' },
  logoutBtn: { background:'none', border:'1px solid rgba(0,200,255,0.18)', color:'var(--text2)', fontFamily:'DM Sans,sans-serif', fontSize:'0.78rem', padding:'7px 14px', borderRadius:8, cursor:'pointer' }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { activeTank } = useTank()
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const navLinks = user ? [
    { to:'/dashboard', label:'Dashboard' },
    { to:'/diagnose', label:'Diagnose' },
    { to:'/caretakers', label:'Caretakers' },
    { to:'/shop', label:'Shop' },
    { to:'/reminders', label:'Reminders' },
    { to:'/profile', label:'Profile' },
  ] : []

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Aqua<span style={{color:'var(--teal)'}}>Care</span></Link>
      <div style={styles.tabs}>
        {navLinks.map(l => (
          <Link key={l.to} to={l.to} style={{...styles.tab, ...(path===l.to ? styles.activeTab : {})}}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={styles.right}>
        {user ? (
          <>
            <Link to="/cart" style={{...styles.tab, display:'flex', alignItems:'center', gap:4, ...(path==='/cart' ? styles.activeTab : {})}}>
              🛒 Cart
              {cart.length > 0 && (
                <span style={{background:'var(--cyan)', color:'#060d1a', fontSize:'0.7rem', fontWeight:800, padding:'2px 6px', borderRadius:20}}>
                  {cart.length}
                </span>
              )}
            </Link>
            <button style={styles.btn} onClick={() => navigate('/setup')}>+ Tank</button>
            <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/') }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{...styles.tab}}>Login</Link>
            <button style={styles.btn} onClick={() => navigate('/register')}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  )
}
