"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. 질문 풀 (총 15개 중 랜덤 10개 추출)
const allQuestions = [
  { id: 1, question: "오늘 아침 눈을 떴을 때 느낌은?", options: [{ text: "고요한 새벽이 더 길었으면", score: -2 }, { text: "재미있는 일이 생길 것 같아!", score: 2 }] },
  { id: 2, question: "외출 전 거울을 본 내 모습은?", options: [{ text: "조용히 셀카 한 장!", score: -1 }, { text: "당장 친구 불러!", score: 1 }] },
  { id: 3, question: "갑자기 할 일이 추가됐을 때 내 머릿속은?", options: [{ text: "어떻게든 되겠지!", score: 0 }, { text: "오늘 계획 다 망했네...", score: 5 }] },
  { id: 4, question: "지금 당장 방 안의 조명을 바꾼다면?", options: [{ text: "은은한 오렌지빛 무드등", score: -1 }, { text: "집중 잘 되는 하얀 LED", score: 1 }] },
  { id: 5, question: "모르는 번호로 전화가 왔을 때?", options: [{ text: "일단 받고 본다", score: 1 }, { text: "문자가 올 때까지 기다린다", score: -1 }] },
  { id: 6, question: "지금 내 기분을 '질감'으로 표현하면?", options: [{ text: "폭신폭신한 솜사탕", score: -2 }, { text: "매끄럽고 단단한 대리석", score: 2 }] },
  { id: 7, question: "오늘 점심 메뉴를 고를 때 나는?", options: [{ text: "늘 먹던 검증된 메뉴", score: -1 }, { text: "한 번도 안 먹어본 새로운 메뉴", score: 1 }] },
  { id: 8, question: "내 마음을 소리로 표현한다면?", options: [{ text: "잔잔하게 흐르는 클래식", score: -2 }, { text: "비트가 강렬한 힙합", score: 2 }] },
  { id: 9, question: "길을 가다 귀여운 고양이를 만나면?", options: [{ text: "멀리서 지켜본다", score: -1 }, { text: "가까이 가서 사진을 찍는다", score: 1 }] },
  { id: 10, question: "스트레스 받을 때 위로가 되는 건?", options: [{ text: "이불 속 영화 한 편", score: -2 }, { text: "땀 흘리는 격렬한 운동", score: 2 }] },
  { id: 11, question: "지금 당장 텔레포트를 할 수 있다면?", options: [{ text: "고요한 남극 빙하 위", score: -3 }, { text: "축제가 한창인 리우", score: 3 }] },
  { id: 12, question: "친구가 내 고민을 묻는다면?", options: [{ text: "혼자 정리할 시간이 필요해", score: -2 }, { text: "기다렸다는 듯 다 털어놓는다", score: 2 }] },
  { id: 13, question: "단톡방에 메시지가 쌓여있을 때?", options: [{ text: "중요한 것만 읽는다", score: -1 }, { text: "하나하나 다 확인한다", score: 1 }] },
  { id: 14, question: "오늘 하루를 마무리하는 단어는?", options: [{ text: "평온함", score: -2 }, { text: "성취감", score: 2 }] },
  { id: 15, question: "새로운 취미를 시작한다면?", options: [{ text: "정적인 명상이나 요가", score: -2 }, { text: "동적인 서핑이나 댄스", score: 2 }] },
];

// 2. 8가지 세분화된 결과 데이터
const results = [
  { threshold: 15, name: "비비드 옐로우 (Vivid Yellow)", color: "#FFDE17", energy: 98, desc: "창의적인 에너지가 폭발하는 상태입니다!", therapy: "심리학적으로 노란색은 지적 능력과 자신감을 자극합니다. 현재 당신의 뇌는 새로운 아이디어를 수용할 준비가 완벽히 되어 있습니다. 컬러 테라피 관점에서 이 색은 소화계 기능을 돕고 근육에 활력을 불어넣습니다. 오늘 당신의 직관을 믿고 평소 망설였던 프로젝트를 시작해 보세요." },
  { threshold: 10, name: "번트 오렌지 (Burnt Orange)", color: "#CC5500", energy: 80, desc: "열정적으로 목표를 향해 달리고 있군요.", therapy: "오렌지는 사교성과 즐거움을 상징합니다. 하지만 '번트' 계열은 단순한 즐거움을 넘어 성숙한 열정을 의미하죠. 현재 당신은 성과를 내기 위해 에너지를 집중하고 있는 상태입니다. 오렌지 컬러는 우울감을 해소하고 활력을 높여주는 효과가 있으니, 이 흐름을 타고 중요한 업무를 처리하기 좋습니다." },
  { threshold: 5, name: "로즈 핑크 (Rose Pink)", color: "#F49AC2", energy: 65, desc: "사랑스럽고 따뜻한 공감의 주파수입니다.", therapy: "핑크는 무조건적인 사랑과 돌봄을 상징합니다. 현재 당신은 주변 사람들과 정서적으로 깊게 연결되어 있으며, 마음이 매우 부드러워진 상태입니다. 핑크 컬러 테라피는 아드레날린 분비를 조절하여 공격성을 완화하고 심리적 안정을 줍니다. 오늘 소중한 사람과 따뜻한 대화를 나누어 보세요." },
  { threshold: 2, name: "라벤더 퍼플 (Lavender Purple)", color: "#B57EDC", energy: 55, desc: "직관과 영감이 샘솟는 예술적인 상태입니다.", therapy: "보라색은 예술적 영감과 영성을 자극하는 색입니다. 빨간색의 열정과 파란색의 냉정함이 조화를 이룬 상태죠. 라벤더 컬러는 신경 과민을 억제하고 수면의 질을 높이는 데 도움을 줍니다. 현재 당신은 복잡한 현실보다는 내면의 깊은 통찰을 즐기기에 아주 적합한 상태입니다." },
  { threshold: -2, name: "차분한 세이지 (Sage Green)", color: "#9CAF88", energy: 45, desc: "내면의 균형이 잘 잡힌 평온한 상태입니다.", therapy: "초록색은 자연의 색으로 심신의 균형을 맞추는 데 최고의 색입니다. 세이지 그린이 나온 당신은 현재 외부 자극에 흔들리지 않는 단단한 마음을 가지고 있습니다. 이 컬러는 안구의 피로를 풀어주고 혈압을 낮추는 컬러 테라피 효과가 있습니다. 지금의 여유를 충분히 음미하며 휴식을 취하세요." },
  { threshold: -6, name: "스카이 블루 (Sky Blue)", color: "#87CEEB", energy: 35, desc: "구속받지 않는 자유로움이 느껴집니다.", therapy: "파란색은 소통과 자유를 상징합니다. 하늘색은 당신의 마음이 어떤 편견이나 압박에서 벗어나 맑게 정화되었음을 뜻합니다. 심리학적으로 파란색은 맥박수를 낮추고 체온을 떨어뜨려 마음을 차분하게 가라앉혀 줍니다. 새로운 환경으로 떠나거나 창조적인 구상을 하기에 아주 좋은 타이밍입니다." },
  { threshold: -10, name: "미드나잇 블루 (Midnight Blue)", color: "#191970", energy: 20, desc: "고요하고 깊은 사색의 시간을 지나고 있네요.", therapy: "깊은 남색은 신뢰와 권위, 그리고 깊은 고요함을 상징합니다. 현재 당신은 에너지를 외부로 쓰기보다 내면 깊숙한 곳으로 응축하고 있습니다. 이 색상은 불면증과 불안 해소에 효과적이며 분석적인 능력을 높여줍니다. 오늘 밤은 휴대폰을 멀리하고 책을 읽거나 명상을 하며 자신과 대화해 보세요." },
  { threshold: -99, name: "차콜 그레이 (Charcoal Grey)", color: "#36454F", energy: 10, desc: "냉철한 판단과 효율성이 필요한 시점입니다.", therapy: "회색은 이성적 사고와 철저함을 상징합니다. 현재 당신은 감정에 휘둘리지 않고 상황을 객관적으로 보려 노력하고 있군요. 차콜 컬러 테라피는 혼란스러운 감정을 차단하고 집중력을 높이는 데 도움을 줍니다. 다만 에너지가 많이 고갈된 상태일 수 있으니, 계획적인 휴식 시간을 반드시 확보하시길 권장합니다." },
];

export default function ColorLog() {
  const [step, setStep] = useState("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("데이터 수집 중...");

  // 질문 10개 랜덤 추출
  const quizSet = useMemo(() => {
    return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [step === "start"]);

  const handleAnswer = (score: number) => {
    setTotalScore(totalScore + score);
    if (currentIdx < quizSet.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep("loading");
    }
  };

  useEffect(() => {
    if (step === "loading") {
      const statusSequence = [
        { time: 0, text: "감정 데이터 수집 중..." },
        { time: 800, text: "주파수 패턴 분석 중..." },
        { time: 1600, text: "컬러 스펙트럼 매칭 중..." },
        { time: 2400, text: "최종 로그 생성 중..." },
      ];
      statusSequence.forEach((item) => {
        setTimeout(() => setLoadingStatus(item.text), item.time);
      });
      const timer = setTimeout(() => setStep("result"), 3300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const finalResult = useMemo(() => {
    return results.find(r => totalScore >= r.threshold) || results[results.length - 1];
  }, [totalScore, step]);

  const handleShare = async () => {
    const shareData = {
      title: "컬러로그 (Color Log)",
      text: `나의 감정 주파수 결과는 [${finalResult.name}] 입니다. 당신의 컬러도 확인해보세요!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다!");
      }
    } catch (err) {
      console.error("공유 실패:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4 font-sans text-gray-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {step === "start" && (
          <motion.div key="start" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="text-center bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-sm w-full border border-gray-50">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-200 via-pink-200 to-blue-200 rounded-3xl mx-auto mb-8 animate-pulse" />
            <h1 className="text-4xl font-black mb-4 tracking-tighter">Color Log</h1>
            <p className="text-gray-400 mb-12 leading-relaxed text-sm font-medium italic">"나의 감정을 색으로 기록하다"</p>
            <button onClick={() => setStep("quiz")} className="w-full bg-black text-white py-6 rounded-2xl font-bold text-lg hover:scale-[1.03] transition-all shadow-xl active:scale-95">주파수 스캔 시작</button>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md w-full px-4">
            <div className="mb-12">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">LOGGING...</span>
                <span className="text-xs font-black">{currentIdx + 1} / 10</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${((currentIdx + 1) / 10) * 100}%` }} />
              </div>
            </div>
            <h2 className="text-2xl font-black mb-12 leading-tight break-keep">{quizSet[currentIdx].question}</h2>
            <div className="space-y-4">
              {quizSet[currentIdx].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt.score)} className="w-full p-6 text-left bg-white border border-gray-100 rounded-[2rem] hover:border-black transition-all hover:shadow-lg font-bold text-gray-700 hover:text-black active:scale-98">
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 rounded-full blur-[100px] opacity-60 animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-40 h-40 mb-12">
                <motion.div className="absolute inset-0 border-t-2 border-r-2 border-black/10 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                <motion.div className="absolute inset-4 border-t-4 border-l-4 rounded-full" style={{ borderTopColor: '#FFDE17', borderLeftColor: '#87CEEB', borderRightColor: 'transparent', borderBottomColor: 'transparent' }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                <motion.div className="absolute inset-10 bg-black/5 rounded-full flex items-center justify-center" animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
              </div>
              <motion.h2 key={loadingStatus} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-black tracking-tighter mb-4 text-gray-900">Color Analysis</motion.h2>
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase animate-pulse">{loadingStatus}</p>
            </div>
            <div className="absolute bottom-10 w-full max-w-xs px-6 py-6 bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-[2.5rem] text-center">
              <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-2">Notice</p>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">분석 결과를 생성하는 동안<br />잠시만 기다려 주세요.</p>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full py-6">
            <div className="bg-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] overflow-hidden mb-8 border border-gray-50">
              <div style={{ backgroundColor: finalResult.color }} className="h-80 w-full flex items-end p-10 transition-colors duration-1000">
                {/* 🎨 가독성 개선: 반투명 다크 배경 추가 */}
                <div className="bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full text-white text-[10px] font-black tracking-widest uppercase border border-white/20">
                  ENERGY LEVEL {finalResult.energy}%
                </div>
              </div>
              <div className="p-10">
                <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase mb-2 block">Official Log 2026-02</span>
                <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter">{finalResult.name}</h2>
                <p className="text-gray-600 font-bold leading-relaxed mb-10 text-lg break-keep">{finalResult.desc}</p>
                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 mb-10 text-left">
                  <h3 className="text-xs font-black text-black mb-4 tracking-wider uppercase flex items-center">
                    <span className="w-4 h-[2px] bg-black mr-2" /> Color Therapy Guide
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{finalResult.therapy}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => window.location.reload()} className="py-5 bg-gray-100 rounded-2xl font-black text-gray-800 hover:bg-gray-200 transition text-sm">다시하기</button>
                  <button onClick={handleShare} className="py-5 bg-black text-white rounded-2xl font-black hover:opacity-90 transition text-sm shadow-lg shadow-black/10">공유하기</button>
                </div>
              </div>
            </div>
            <div className="w-full p-10 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center">
              <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-4">Advertisement Area</p>
              <div className="h-32 flex items-center justify-center text-gray-200 font-bold text-xs">광고 승인 후 이곳에 <br /> 애드센스 코드를 삽입하세요.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}