import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const TankContext = createContext()

export const TankProvider = ({ children }) => {
  const { user } = useAuth()
  const [tanks, setTanks] = useState([])
  const [activeTank, setActiveTank] = useState(null)

  useEffect(() => {
    if (user) fetchTanks()
  }, [user])

  const fetchTanks = async () => {
    try {
      const { data } = await axios.get('/api/tanks')
      setTanks(data)
      if (data.length > 0 && !activeTank) setActiveTank(data[0])
    } catch (err) {
      console.error(err)
    }
  }

  const addTank = async (tankData) => {
    const { data } = await axios.post('/api/tanks', tankData)
    setTanks(prev => [data, ...prev])
    setActiveTank(data)
    return data
  }

  const updateTank = async (id, tankData) => {
    const { data } = await axios.patch(`/api/tanks/${id}`, tankData)
    setTanks(prev => prev.map(t => t._id === id ? data : t))
    if (activeTank?._id === id) setActiveTank(data)
    return data
  }

  const deleteTank = async (id) => {
    await axios.delete(`/api/tanks/${id}`)
    setTanks(prev => prev.filter(t => t._id !== id))
    if (activeTank?._id === id) setActiveTank(tanks[0] || null)
  }

  return (
    <TankContext.Provider value={{ tanks, activeTank, setActiveTank, addTank, updateTank, deleteTank, fetchTanks }}>
      {children}
    </TankContext.Provider>
  )
}

export const useTank = () => useContext(TankContext)
