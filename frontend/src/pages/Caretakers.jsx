import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTank } from '../context/TankContext';

const CARETAKERS = [
  { id: 'c1', name: 'Priya Sharma', specialties: 'Saltwater, Reefs', rating: 4.9, reviews: 124, pricePerDay: 800, emoji: '👩🏽‍🔬', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'c2', name: 'Rahul Desai', specialties: 'Freshwater, Cichlids', rating: 4.8, reviews: 89, pricePerDay: 600, emoji: '🧔🏽‍♂️', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'c3', name: 'Arjun Menon', specialties: 'Aquascaping, CO2', rating: 5.0, reviews: 201, pricePerDay: 1000, emoji: '👨🏽‍🌾', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'c4', name: 'Sneha Patel', specialties: 'Bettas, Nano Tanks', rating: 4.7, reviews: 56, pricePerDay: 500, emoji: '👩🏽‍🦱', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80' }
];

export default function Caretakers() {
  const { tanks } = useTank();
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ tank: tanks?.[0]?._id || '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleHireClick = (caretaker) => {
    setSelectedCaretaker(caretaker);
    setShowModal(true);
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays(bookingForm.startDate, bookingForm.endDate);
  const totalCost = selectedCaretaker ? days * selectedCaretaker.pricePerDay : 0;

  const handleBook = async () => {
    if (!bookingForm.tank || !bookingForm.startDate || !bookingForm.endDate) {
      return toast.error('Please fill in all fields');
    }
    if (new Date(bookingForm.endDate) < new Date(bookingForm.startDate)) {
      return toast.error('End date cannot be before start date');
    }

    setLoading(true);
    try {
      await axios.post('/api/bookings', {
        tank: bookingForm.tank,
        caretakerId: selectedCaretaker.id,
        caretakerName: selectedCaretaker.name,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        totalCost
      });
      toast.success(`🎉 Successfully booked ${selectedCaretaker.name}!`);
      setShowModal(false);
      fetchBookings();
    } catch (e) {
      toast.error('Failed to book caretaker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', padding: '80px 24px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Verified Caretakers 🤝</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Going on Holiday? Hire top-rated aquarium experts nearby to care for your ecosystem while you're away.</p>

        {/* Existing Bookings */}
        {bookings.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Your Upcoming Holidays</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {bookings.map(b => (
                <div key={b._id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--cyan)' }}>{b.caretakerName} is watching {b.tank?.name || 'Tank'}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 4 }}>
                      {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, background: 'rgba(0,230,118,0.1)', padding: '4px 10px', borderRadius: 20 }}>
                      ✓ {b.status}
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: 6 }}>₹{b.totalCost} paid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {CARETAKERS.map(c => (
            <div key={c.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 20, textAlign: 'center' }}>
              <img src={c.image} alt={c.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--cyan)', marginBottom: 12 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{c.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600, marginBottom: 8 }}>{c.specialties}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 16 }}>
                <span>⭐ {c.rating} ({c.reviews})</span>
                <span>•</span>
                <span>₹{c.pricePerDay}/day</span>
              </div>

              <button 
                onClick={() => handleHireClick(c)}
                style={{ width: '100%', background: 'linear-gradient(135deg, var(--cyan), var(--teal))', color: '#060d1a', border: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, padding: '10px 0', borderRadius: 8, cursor: 'pointer' }}>
                Hire {c.emoji}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedCaretaker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.2rem' }}>Hire {selectedCaretaker.name}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 20 }}>Rate: ₹{selectedCaretaker.pricePerDay}/day</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8 }}>Select Tank</label>
              <select value={bookingForm.tank} onChange={e => setBookingForm({ ...bookingForm, tank: e.target.value })}
                style={{ width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px', outline: 'none' }}>
                {tanks.length === 0 && <option value="">No tanks found</option>}
                {tanks.map(t => <option key={t._id} value={t._id}>{t.emoji || '🐠'} {t.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8 }}>Holiday Start</label>
                <input type="date" value={bookingForm.startDate} onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                  style={{ width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8 }}>Return Date</label>
                <input type="date" value={bookingForm.endDate} onChange={e => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                  style={{ width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px', outline: 'none' }} />
              </div>
            </div>

            {totalCost > 0 && (
              <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid var(--cyan)', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--cyan)' }}>Estimated Cost ({days} days)</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>₹{totalCost}</span>
              </div>
            )}

            <button onClick={handleBook} disabled={loading || !bookingForm.tank} style={{ width: '100%', background: 'linear-gradient(135deg, var(--cyan), var(--teal))', color: '#060d1a', border: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, padding: '12px 0', borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
