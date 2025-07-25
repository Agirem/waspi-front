import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let token = localStorage.getItem('token') || ''

// Initialize token from localStorage if it exists
if (token) {
  apiClient.defaults.headers.common['Authorization'] = token
}

export const setToken = (newToken) => {
  token = newToken
  localStorage.setItem('token', token)
  apiClient.defaults.headers.common['Authorization'] = token
}

export const clearToken = () => {
  token = ''
  localStorage.removeItem('token')
  delete apiClient.defaults.headers.common['Authorization']
}

export const login = async (email, password) => {
  const response = await apiClient.post('/login', { email, password })
  if (response.data.success) {
    setToken(response.data.token)
  }
  return response.data
}

export const getUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}

export const getComments = async () => {
  const response = await apiClient.get('/comments')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Erreur lors de la récupération des commentaires')
}

export const addComment = async (text, userId) => {
  const response = await apiClient.post('/comments', { text, user_id: userId })
  if (response.data.success) {
    return response.data
  }
  throw new Error('Erreur lors de l\'ajout du commentaire')
}

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`)
  if (response.data.success) {
    return response.data
  }
  throw new Error('Erreur lors de la suppression du commentaire')
}

export const likeComment = async (commentId) => {
  const response = await apiClient.post('/likes', { comment_id: commentId })
  if (response.data.success) {
    return response.data
  }
  throw new Error('Erreur lors du like du commentaire')
}

export const unlikeComment = async (commentId) => {
  const response = await apiClient.delete('/likes', { data: { comment_id: commentId } })
  if (response.data.success) {
    return response.data
  }
  throw new Error('Erreur lors du unlike du commentaire')
}

export const getProfile = async () => {
  const response = await apiClient.get('/profile')
  return response.data
}

export const getLikes = async () => {
  const response = await apiClient.get('/likes')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Erreur lors de la récupération des likes')
}

export default {
  setToken,
  login,
  getUsers,
  getComments,
  addComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getProfile,
  getLikes
}