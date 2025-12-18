import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 2000; // 최대 입력 길이

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    // 입력 검증
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    // 입력 길이 제한
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { 
          error: `입력이 너무 깁니다. 최대 ${MAX_TEXT_LENGTH}자까지 입력 가능합니다. 현재: ${text.length}자`,
          maxLength: MAX_TEXT_LENGTH,
          currentLength: text.length
        },
        { status: 400 }
      );
    }

    // Google AI API 키 확인
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY 환경 변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요." },
        { status: 500 }
      );
    }

    // 감성 분석 및 신뢰도, 이유 요청
    const { text: result } = await generateText({
      model: google("models/gemini-2.0-flash-lite"),
      prompt: `다음 텍스트의 감성을 분석해주세요.

텍스트: ${text}

다음 형식으로 답변해주세요:
감성: [긍정/중립/부정 중 하나]
긍정 신뢰도: [0-100 숫자]%
중립 신뢰도: [0-100 숫자]%
부정 신뢰도: [0-100 숫자]%
이유: [간단한 설명 1-2문장]`,
      temperature: 0.3,
    });

    // 결과 파싱
    const resultText = result.trim();
    
    // 감성 추출
    let normalizedSentiment: "긍정" | "중립" | "부정" = "중립";
    if (resultText.includes("감성: 긍정") || resultText.match(/감성:\s*긍정/i)) {
      normalizedSentiment = "긍정";
    } else if (resultText.includes("감성: 부정") || resultText.match(/감성:\s*부정/i)) {
      normalizedSentiment = "부정";
    } else if (resultText.includes("감성: 중립") || resultText.match(/감성:\s*중립/i)) {
      normalizedSentiment = "중립";
    } else {
      // 폴백: 텍스트에서 직접 감성 찾기
      const lowerResult = resultText.toLowerCase();
      if (lowerResult.includes("긍정") || lowerResult.includes("positive")) {
        normalizedSentiment = "긍정";
      } else if (lowerResult.includes("부정") || lowerResult.includes("negative")) {
        normalizedSentiment = "부정";
      }
    }

    // 신뢰도 추출
    const positiveMatch = resultText.match(/긍정 신뢰도:\s*(\d+)/i);
    const neutralMatch = resultText.match(/중립 신뢰도:\s*(\d+)/i);
    const negativeMatch = resultText.match(/부정 신뢰도:\s*(\d+)/i);
    
    const positiveConfidence = positiveMatch ? parseInt(positiveMatch[1]) : 
      (normalizedSentiment === "긍정" ? 70 : (normalizedSentiment === "중립" ? 10 : 10));
    const neutralConfidence = neutralMatch ? parseInt(neutralMatch[1]) : 
      (normalizedSentiment === "중립" ? 70 : (normalizedSentiment === "긍정" ? 15 : 15));
    const negativeConfidence = negativeMatch ? parseInt(negativeMatch[1]) : 
      (normalizedSentiment === "부정" ? 70 : (normalizedSentiment === "중립" ? 10 : 15));

    // 이유 추출
    const reasonMatch = resultText.match(/이유:\s*(.+?)(?:\n|$)/i) || resultText.match(/이유[:\s]+(.+?)(?:\n\n|$)/i);
    let reason = reasonMatch ? reasonMatch[1].trim() : "텍스트의 감성을 분석했습니다.";
    
    // 이유가 너무 길면 자르기
    if (reason.length > 200) {
      reason = reason.substring(0, 197) + "...";
    }

    return NextResponse.json({
      sentiment: normalizedSentiment,
      confidence: {
        positive: Math.min(100, Math.max(0, positiveConfidence)),
        neutral: Math.min(100, Math.max(0, neutralConfidence)),
        negative: Math.min(100, Math.max(0, negativeConfidence)),
      },
      reason: reason,
    });
  } catch (error: unknown) {
    console.error("감성분석 오류:", error);
    
    let errorMessage = "알 수 없는 오류";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // API 키 관련 에러 체크
    if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
      return NextResponse.json(
        { 
          error: "API 키 인증에 실패했습니다. API 키를 확인해주세요.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 401 }
      );
    }
    
    // 모델 관련 에러 체크
    if (errorMessage.includes("is not found") || errorMessage.includes("not supported")) {
      return NextResponse.json(
        { 
          error: "모델을 찾을 수 없거나 지원되지 않습니다.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 400 }
      );
    }
    
    // 네트워크 관련 에러 체크
    if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { 
          error: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "감성분석 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
