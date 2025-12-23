import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient(request)
    
    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 요청 본문 파싱
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      )
    }

    const { email, password } = body as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      )
    }

    if (email !== user.email) {
      return NextResponse.json(
        { error: "이메일이 일치하지 않습니다." },
        { status: 400 }
      )
    }

    // 비밀번호 확인
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }

    // 사용자 데이터 삭제
    const { error: todosError } = await supabase
      .from("todos")
      .delete()
      .eq("user_id", user.id)

    if (todosError) {
      console.error("Todos delete error:", todosError)
    }

    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id)

    if (usersError) {
      console.error("Users delete error:", usersError)
    }

    // 로그아웃 처리 (데이터는 이미 삭제됨)
    await supabase.auth.signOut()

    return NextResponse.json({
      message: "회원 탈퇴가 완료되었습니다.",
    })
  } catch (error: unknown) {
    console.error("Delete account error:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    
    return NextResponse.json(
      { error: `회원 탈퇴 처리 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    )
  }
}

