"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Sentiment = "긍정" | "중립" | "부정" | null;

interface SentimentResult {
  sentiment: Sentiment;
  confidence: {
    positive: number;
    neutral: number;
    negative: number;
  };
  reason: string;
}

const MAX_TEXT_LENGTH = 2000;

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    // 입력 검증
    if (!text.trim()) {
      setError("텍스트를 입력해주세요.");
      return;
    }

    // 길이 제한 검증
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`입력이 너무 깁니다. 최대 ${MAX_TEXT_LENGTH}자까지 입력 가능합니다. 현재: ${text.length}자`);
      return;
    }

    setIsLoading(true);
    setShowResult(false);
    setError(null);

    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : (errorData.error || `서버 오류: ${response.status}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResult(data);

      // 애니메이션을 위해 약간의 지연 후 결과 표시
      setTimeout(() => {
        setShowResult(true);
      }, 50);
    } catch (error) {
      console.error("감성분석 오류:", error);
      let errorMessage = "감성분석 중 오류가 발생했습니다.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 네트워크 오류 처리
        if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch")) {
          errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
        }
      }
      
      setError(errorMessage);
      setResult(null);
      setShowResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "긍정":
        return "bg-green-500 text-white";
      case "부정":
        return "bg-red-500 text-white";
      case "중립":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "긍정":
        return "😊";
      case "부정":
        return "😟";
      case "중립":
        return "😐";
      default:
        return "";
    }
  };

  const getConfidenceColor = (type: "positive" | "neutral" | "negative") => {
    switch (type) {
      case "positive":
        return "bg-green-500";
      case "neutral":
        return "bg-gray-500";
      case "negative":
        return "bg-red-500";
    }
  };

  const remainingChars = MAX_TEXT_LENGTH - text.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        <div className="space-y-8">
          {/* 제목 및 설명 */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                AI 감성분석기
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              텍스트를 입력하면 AI가 감성을 분석해드립니다
            </p>
          </div>

          {/* 입력 영역 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>텍스트 입력</CardTitle>
              <CardDescription>
                분석하고 싶은 텍스트를 입력해주세요 (최대 {MAX_TEXT_LENGTH}자)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError(null);
                  }}
                  placeholder="여러 줄의 텍스트를 입력할 수 있습니다..."
                  className={cn(
                    "min-h-[200px] resize-y text-base",
                    text.length > MAX_TEXT_LENGTH && "border-red-500 focus-visible:border-red-500"
                  )}
                  disabled={isLoading}
                  maxLength={MAX_TEXT_LENGTH + 10} // 약간의 여유를 두되, 실제 검증은 코드에서
                />
                <div className="flex justify-between items-center text-sm">
                  <span className={cn(
                    "text-muted-foreground",
                    isNearLimit && "text-orange-500",
                    text.length > MAX_TEXT_LENGTH && "text-red-500 font-semibold"
                  )}>
                    {text.length} / {MAX_TEXT_LENGTH}자
                  </span>
                  {text.length > MAX_TEXT_LENGTH && (
                    <span className="text-red-500 text-xs font-medium">
                      입력 제한을 초과했습니다
                    </span>
                  )}
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={analyzeSentiment}
                disabled={isLoading || !text.trim() || text.length > MAX_TEXT_LENGTH}
                className="w-full md:w-auto md:min-w-[200px]"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  "감성분석 실행"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 결과 영역 */}
          {result && (
            <Card
              className={cn(
                "shadow-lg transition-all duration-500",
                showResult
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4"
              )}
            >
              <CardHeader>
                <CardTitle>분석 결과</CardTitle>
                <CardDescription>입력하신 텍스트의 감성 분석 결과입니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 주요 감성 표시 */}
                <div
                  className={cn(
                    getSentimentColor(result.sentiment),
                    "rounded-lg p-8 text-center transition-all duration-300 hover:scale-105"
                  )}
                >
                  <div className="text-6xl mb-4 animate-bounce">
                    {getSentimentIcon(result.sentiment)}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {result.sentiment}
                  </div>
                </div>

                {/* 신뢰도 표시 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">신뢰도</h3>
                  
                  {/* 긍정 신뢰도 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-green-700 dark:text-green-400">긍정</span>
                      <span className="text-muted-foreground">{result.confidence.positive}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={cn("h-2.5 rounded-full transition-all duration-500", getConfidenceColor("positive"))}
                        style={{ width: `${result.confidence.positive}%` }}
                      />
                    </div>
                  </div>

                  {/* 중립 신뢰도 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-400">중립</span>
                      <span className="text-muted-foreground">{result.confidence.neutral}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={cn("h-2.5 rounded-full transition-all duration-500", getConfidenceColor("neutral"))}
                        style={{ width: `${result.confidence.neutral}%` }}
                      />
                    </div>
                  </div>

                  {/* 부정 신뢰도 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-red-700 dark:text-red-400">부정</span>
                      <span className="text-muted-foreground">{result.confidence.negative}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={cn("h-2.5 rounded-full transition-all duration-500", getConfidenceColor("negative"))}
                        style={{ width: `${result.confidence.negative}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 분석 이유 */}
                {result.reason && (
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">분석 이유</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
