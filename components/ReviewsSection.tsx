import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/* =========================
   후기 데이터
========================= */

const reviews = [
  {
    meta: "회화 초보 · 34세",
    text: "단어만 떠올리다가 항상 멈췄는데 이제는 문장이 이어져서 말이 나와요.",
    name: "최*지"
  },
  {
    meta: "퇴근 후 공부 · 31세",
    text: "하루 분량이 짧아서 시작이 쉬웠고, 그래서 오히려 꾸준히 하게 됐어요.",
    name: "정*훈"
  },
  {
    meta: "워홀 준비 중 · 29세",
    text: "맨날 표현만 외우고 실제 상황에서는 말이 안 나왔어요. 문장 구조를 이해하고 나니까 생각보다 자연스럽게 말이 나오기 시작했어요.",
    name: "이*주"
  },
  {
    meta: "직장인 · 32세",
    text: "영어로 말해야 하는 상황이 오면 항상 피했어요. 지금은 틀려도 문장을 끝까지 말해보는 연습을 하게 됐어요.",
    name: "박*현"
  }
];

const AUTO_DELAY = 6000;

/* =========================
   메인
========================= */

const ReviewsSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % reviews.length);
    }, AUTO_DELAY);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goPrev = () => {
    setIndex(i => (i - 1 + reviews.length) % reviews.length);
    startTimer();
  };

  const goNext = () => {
    setIndex(i => (i + 1) % reviews.length);
    startTimer();
  };

  const visible = [
    reviews[(index - 1 + reviews.length) % reviews.length],
    reviews[index],
    reviews[(index + 1) % reviews.length]
  ];

  return (
    <section className="py-[120px] px-[20px] bg-gradient-to-b from-[#f8faff] to-white">
      <Reveal className="max-w-[1100px] mx-auto">

        {/* 헤더 */}
        <div className="text-center mb-[70px]">
          <h2 className="text-[36px] md:text-[46px] font-[900]">
            수강생 후기
          </h2>
          <p className="mt-3 text-gray-600 font-[700]">
            직접 넘기며 천천히 읽어보세요
          </p>
        </div>

        {/* 카드 + 컨트롤 */}
        <div className="flex items-center justify-center gap-[18px]">

          {/* PC 좌 버튼 */}
          <button
            onClick={goPrev}
            className="hidden md:flex w-[40px] h-[240px]
                       items-center justify-center
                       rounded-[16px]
                       border border-blue-100 bg-white
                       text-[20px] text-gray-400
                       hover:text-blue-600 transition-colors"
          >
            ‹
          </button>

          {/* 카드 */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-[22px]">

            {/* 모바일 오버레이 버튼 (아주 연하게, 카드 밖 경계) */}
            <div className="md:hidden absolute inset-y-0 right-[-10px]
                            flex flex-col justify-center gap-3 z-10">

              <button
                onClick={goPrev}
                className="w-[28px] h-[28px]
                           rounded-full
                           bg-white/70
                           border border-gray-200
                           text-[14px] text-gray-400"
              >
                ↑
              </button>

              <button
                onClick={goNext}
                className="w-[28px] h-[28px]
                           rounded-full
                           bg-white/70
                           border border-gray-200
                           text-[14px] text-gray-400"
              >
                ↓
              </button>

            </div>

            {visible.map((r, i) => (
              <ReviewCard
                key={`${index}-${i}`}
                {...r}
                active={i === 1}
              />
            ))}
          </div>

          {/* PC 우 버튼 */}
          <button
            onClick={goNext}
            className="hidden md:flex w-[40px] h-[240px]
                       items-center justify-center
                       rounded-[16px]
                       border border-blue-100 bg-white
                       text-[20px] text-gray-400
                       hover:text-blue-600 transition-colors"
          >
            ›
          </button>

        </div>

      </Reveal>
    </section>
  );
};

/* =========================
   카드
========================= */

const ReviewCard = ({
  meta,
  text,
  name,
  active
}: {
  meta: string;
  text: string;
  name: string;
  active: boolean;
}) => (
  <div
    className={`
      rounded-[26px] p-[30px] bg-white border
      transition-all duration-500
      ${active
        ? "border-blue-400 shadow-[0_30px_80px_rgba(40,80,200,0.22)]"
        : "border-blue-100 opacity-60"
      }
    `}
  >
    <div className="text-[13px] font-[800] text-gray-500 mb-3">
      {meta}
    </div>

    <p className="text-[15px] md:text-[16px] font-[700] leading-[1.7] text-gray-800">
      {text}
    </p>

    <div className="mt-5 text-blue-600 font-[900] text-[14px]">
      — {name}
    </div>
  </div>
);

export default ReviewsSection;
