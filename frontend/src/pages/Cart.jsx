import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cart.length === 0) return
    toast.success('🎉 Checkout successful! (Demo)')
    clearCart()
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div style={{paddingTop:72, minHeight:'100vh', padding:'72px 24px 40px'}}>
      <div style={{maxWidth:800, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
          <div>
            <h2 style={{fontSize:'1.8rem'}}>Your Cart 🛒</h2>
            <p style={{color:'var(--text2)', marginTop:4}}>Review your items before checkout.</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} style={{background:'rgba(255,100,100,0.1)', border:'1px solid rgba(255,100,100,0.3)', color:'#ff6b6b', fontSize:'0.85rem', padding:'6px 12px', borderRadius:8, cursor:'pointer'}}>
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{textAlign:'center', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'60px 20px'}}>
            <div style={{fontSize:'3rem', marginBottom:16}}>🐠</div>
            <h3 style={{marginBottom:8}}>Your cart is empty</h3>
            <p style={{color:'var(--text2)', marginBottom:20}}>Looks like you haven't added anything to your aquarium yet.</p>
            <button onClick={() => navigate('/shop')} style={{background:'linear-gradient(135deg,var(--teal),var(--cyan))', color:'#060d1a', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.9rem', padding:'10px 20px', borderRadius:8, cursor:'pointer'}}>
              Go to Shop
            </button>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            {cart.map(item => (
              <div key={item.id} style={{display:'flex', alignItems:'center', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:16, gap:16}}>
                <div style={{width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', background:'var(--bg3)', borderRadius:8}}>
                  {item.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'1rem', fontWeight:600}}>{item.name}</div>
                  <div style={{fontSize:'0.8rem', color:'var(--text2)'}}>{item.cat}</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, background:'var(--bg)', borderRadius:8, padding:'4px 8px', border:'1px solid var(--border2)'}}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:'1.2rem', display:'flex', alignItems:'center'}}>-</button>
                    <span style={{fontSize:'0.9rem', width:20, textAlign:'center'}}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:'1.2rem', display:'flex', alignItems:'center'}}>+</button>
                  </div>
                  <div style={{fontFamily:'Syne,sans-serif', fontWeight:700, color:'var(--cyan)', width:80, textAlign:'right'}}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'1.2rem', marginLeft:8}}>
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24, marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{color:'var(--text2)', fontSize:'0.9rem'}}>Total Amount</div>
                <div style={{fontFamily:'Syne,sans-serif', fontSize:'1.8rem', fontWeight:700, color:'var(--cyan)'}}>
                  ₹{total.toLocaleString()}
                </div>
              </div>
              <button onClick={handleCheckout} style={{background:'linear-gradient(135deg,var(--teal),var(--cyan))', color:'#060d1a', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.1rem', padding:'12px 32px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                Checkout 💳
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
