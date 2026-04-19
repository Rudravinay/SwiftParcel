import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sp_token')
    const saved = localStorage.getItem('sp_user')
    if (token && saved) {
      setUser(JSON.parse(saved))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    _persist(data)
    return data.user
  }

  const register = async (body) => {
    const { data } = await api.post('/auth/register', body)
    _persist(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('sp_token')
    localStorage.removeItem('sp_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const _persist = ({ token, user }) => {
    localStorage.setItem('sp_token', token)
    localStorage.setItem('sp_user', JSON.stringify(user))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
