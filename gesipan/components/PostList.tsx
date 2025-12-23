'use client'

import { useEffect, useState, useCallback } from 'react'
import { postApi } from '@/services/api'
import type { PostListDTO } from '@/types/api'
import PostCard from './PostCard'
import { PostListSkeleton } from './SkeletonLoader'

export default function PostList() {
  const [posts, setPosts] = useState<PostListDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await postApi.getPostList(page, 10, 'RESENT')
      if (response.success && response.data) {
        setPosts(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
      }
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 게시글</h2>
        <p className="text-gray-600">다양한 주제의 게시글을 확인해보세요</p>
      </div>

      {loading && posts.length === 0 ? (
        <PostListSkeleton />
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          아직 게시글이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-4 py-2 text-gray-700">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </section>
  )
}

