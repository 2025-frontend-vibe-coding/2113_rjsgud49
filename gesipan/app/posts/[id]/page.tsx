'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { postApi } from '@/services/api'
import type { PostDetailDTO } from '@/types/api'
import Header from '@/components/Header'
// date-fns에서 필요한 함수만 임포트 (트리 쉐이킹)
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getUsernameFromToken } from '@/utils/jwt'
import { getErrorMessage } from '@/utils/errorHandler'
import { PostDetailSkeleton } from '@/components/SkeletonLoader'
import { cache } from '@/utils/cache'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [post, setPost] = useState<PostDetailDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const fetchedPostIdRef = useRef<string | null>(null)

  useEffect(() => {
    const postId = String(params.id)
    // React Strict Mode로 인한 중복 호출 방지
    // 같은 게시글 ID에 대해 한 번만 조회
    if (postId && fetchedPostIdRef.current !== postId) {
      fetchedPostIdRef.current = postId
      fetchPost()
    }
  }, [params.id])

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await postApi.getPostDetail(Number(params.id))
      if (response.success && response.data) {
        setPost(response.data)
      }
    } catch (error) {
      console.error('게시글 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })
    } catch {
      return dateString
    }
  }, [])

  const currentUsername = useMemo(() => getUsernameFromToken(), [])
  const isOwner = useMemo(() => 
    isAuthenticated && post && currentUsername === post.username,
    [isAuthenticated, post, currentUsername]
  )

  const handleDelete = useCallback(async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      setDeleting(true)
      const response = await postApi.deletePost(Number(params.id))
      if (response.success) {
        cache.clear()
        router.push('/')
      }
    } catch (error: any) {
      alert(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }, [params.id, router])

  const handleEdit = useCallback(() => {
    router.push(`/posts/${params.id}/edit`)
  }, [router, params.id])

  const handleBack = useCallback(() => {
    router.push('/posts-list')
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => router.push('/')} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <PostDetailSkeleton />
        ) : post ? (
          <article className="bg-white">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-4 border-b">
              <div className="flex items-center space-x-4">
                <span>{post.username}</span>
                <span>조회수: {post.views || post.Views || '0'}</span>
              </div>
              <div className="flex flex-col items-end">
                <span>작성일: {formatDate(post.createDateTime)}</span>
                {post.updateDateTime !== post.createDateTime && (
                  <span className="text-xs">수정일: {formatDate(post.updateDateTime)}</span>
                )}
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed break-words">
                {post.body}
              </div>
            </div>
            <div className="mt-8 pt-8 border-t flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                목록으로
              </button>
              {isOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="text-center text-gray-500">게시글을 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  )
}

