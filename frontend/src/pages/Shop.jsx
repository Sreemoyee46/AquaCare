import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CATS = [
  { id:'all', label:'All' },
  { id:'tank', label:'🪣 Tanks & Bowls' },
  { id:'decor', label:'🌿 Decorations' },
  { id:'medicine', label:'💊 Medicines' },
  { id:'food', label:'🍽️ Fish Food' },
  { id:'equipment', label:'⚙️ Equipment' },
]

export default function Shop() {
  const [items, setItems] = useState([])
  const [aquariums, setAquariums] = useState([])
  const [cat, setCat] = useState('all')
  const [loading, setLoading] = useState(true)
  const { cart, addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [itemsRes, aqRes] = await Promise.all([
        axios.get('/api/shop/items'),
        axios.get('/api/shop/aquariums')
      ])
      setItems(itemsRes.data)
      setAquariums(aqRes.data)
    } catch (e) { toast.error('Failed to load shop') }
    finally { setLoading(false) }
  }

  const fetchByCategory = async (c) => {
    setCat(c)
    try {
      const { data } = await axios.get(`/api/shop/items?category=${c}`)
      setItems(data)
    } catch (e) { console.error(e) }
  }

  // const addToCart = (item) => { ... } is now correctly from context

  const filtered = cat === 'all' ? items : items.filter(i => i.cat === cat)

  if (loading) return <div style={{paddingTop:80,textAlign:'center',color:'var(--text2)'}}>Loading shop...</div>

  return (
    <div style={{paddingTop:72,minHeight:'100vh',padding:'72px 24px 40px'}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8,flexWrap:'wrap',gap:12}}>
          <div>
            <h2 style={{fontSize:'1.8rem'}}>Aquarium Shop 🏪</h2>
            <p style={{color:'var(--text2)',marginTop:4}}>Everything your fish needs.</p>
          </div>
          {cart.length > 0 && (
            <div onClick={() => navigate('/cart')} style={{background:'rgba(0,212,255,0.1)',border:'1px solid var(--border2)',borderRadius:10,padding:'8px 16px',fontSize:'0.85rem',color:'var(--cyan)',cursor:'pointer',transition:'background 0.2s'}}
                 onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,0.2)'}
                 onMouseLeave={e=>e.currentTarget.style.background='rgba(0,212,255,0.1)'}>
              🛒 {cart.length} item{cart.length>1?'s':''} in cart (Click to Open)
            </div>
          )}
        </div>

        {/* Category pills */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20,marginTop:16}}>
          {CATS.map(c => (
            <div key={c.id} onClick={()=>fetchByCategory(c.id)}
              style={{background:cat===c.id?'rgba(0,212,255,0.1)':'var(--card)',border:`1.5px solid ${cat===c.id?'var(--cyan)':'var(--border)'}`,color:cat===c.id?'var(--cyan)':'var(--text2)',borderRadius:20,padding:'7px 16px',fontSize:'0.82rem',cursor:'pointer',transition:'all 0.2s'}}>
              {c.label}
            </div>
          ))}
        </div>

        {/* Shop grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16,marginBottom:40}}>
          {filtered.map(item => (
            <div key={item.id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',transition:'transform 0.2s,border-color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{height:110,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',background:'var(--bg3)'}}>
                {item.emoji}
              </div>
              <div style={{padding:14}}>
                <div style={{fontSize:'0.88rem',fontWeight:600,marginBottom:4}}>{item.name}</div>
                <div style={{fontSize:'0.77rem',color:'var(--text2)',marginBottom:10,lineHeight:1.5}}>{item.desc}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:700,color:'var(--cyan)'}}>₹{item.price.toLocaleString()}</span>
                  <button onClick={()=>addToCart(item)}
                    style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',fontSize:'0.75rem',padding:'5px 10px',borderRadius:6,cursor:'pointer'}}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aquariums */}
        <h3 style={{fontSize:'1.2rem',marginBottom:16}}>🏠 Trusted Aquarium Vendors</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
          {aquariums.map(a => (
            <div key={a.id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <h4 style={{fontSize:'0.95rem'}}>{a.name}</h4>
                <span style={{fontSize:'0.78rem',color:'var(--amber)'}}>⭐ {a.rating}</span>
              </div>
              <p style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:4}}>📍 {a.location}</p>
              <p style={{fontSize:'0.8rem',color:'var(--text2)',marginBottom:10,lineHeight:1.5}}>{a.description}</p>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                {a.tags.map(t => (
                  <span key={t} style={{fontSize:'0.7rem',background:'rgba(0,212,255,0.08)',border:'1px solid var(--border)',color:'var(--cyan2)',padding:'3px 8px',borderRadius:20}}>{t}</span>
                ))}
              </div>
              <button onClick={()=>toast.success(`📞 Calling ${a.name}: ${a.phone}`)}
                style={{background:'linear-gradient(135deg,var(--teal),var(--cyan))',color:'#060d1a',border:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.82rem',padding:'9px 14px',borderRadius:8,cursor:'pointer',width:'100%'}}>
                Contact — {a.phone}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
