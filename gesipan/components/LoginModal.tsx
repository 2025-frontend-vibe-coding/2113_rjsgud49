'use client'

import { useState, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { authApi } from '@/services/api'
import { useRouter } from 'next/navigation'
import { getErrorMessage, getFieldErrors } from '@/utils/errorHandler'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      if (isLogin) {
        const response = await authApi.login({
          username: formData.username,
          password: formData.password,
        })
        if (response.success && response.data) {
          dispatch(setCredentials({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          }))
          onClose()
          router.refresh()
        }
      } else {
        const response = await authApi.register({
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          email: formData.email,
        })
        if (response.success) {
          // 회원가입 성공 후 자동 로그인
          const loginResponse = await authApi.login({
            username: formData.username,
            password: formData.password,
          })
          if (loginResponse.success && loginResponse.data) {
            dispatch(setCredentials({
              accessToken: loginResponse.data.accessToken,
              refreshToken: loginResponse.data.refreshToken,
            }))
            onClose()
            router.refresh()
          }
        }
      }
    } catch (err: any) {
      // 로그인 실패 시 특별 처리
      if (isLogin && err.response?.status === 500) {
        setError('아이디 또는 비밀번호가 틀렸습니다.')
        setFieldErrors({})
      } else {
        const errorMessage = getErrorMessage(err)
        const errors = getFieldErrors(err)
        
        setError(errorMessage)
        setFieldErrors(errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? '로그인' : '회원가입'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.nickname ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.nickname && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.nickname}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </>
            )}

            {error && !Object.keys(fieldErrors).length && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFieldErrors({})
                setFormData({ username: '', password: '', nickname: '', email: '' })
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LoginModal)

