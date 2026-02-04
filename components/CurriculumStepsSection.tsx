import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";

/* =========================
   학습 타입
========================= */

const lessonTypes = [
  { key: "how", label: "얼마나 ~ 해?" },
  { key: "ing", label: "~하는 중이야" },
  { key: "freq", label: "자주 / 가끔 / 종종 ~해" }
] as const;

type LessonKey = typeof lessonTypes[number]["key"];

/* =========================
   데이터
========================= */

const howWords = ["old", "tall", "fast", "big", "small"];
const ingVerbs = ["studying", "working", "eating", "running"];
const freqWords = ["usually", "often", "sometimes", "rarely"];

/* =========================
   메인
========================= */

const CurriculumStepsSection: React.FC = () => {
  // 첫 활성화: 얼마나 ~ 해
  const [lesson, setLesson] = useState<LessonKey>("how");
  const [wordIndex, setWordIndex] = useState(0);

  const activeWords =
    lesson === "how" ? howWords :
    lesson === "ing" ? ingVerbs :
    freqWords;

  useEffect(() => {
    const t = setInterval(() => {
      setWordIndex(i => (i + 1) % activeWords.length);
    }, 1400);
    return () => clearInterval(t);
  }, [lesson]);

  return (
    <section className="py-[120px] px-[20px] bg-gradient-to-b from-white to-[#eef2ff]">
      <Reveal className="max-w-[1200px] mx-auto">

        {/* ===== 헤더 ===== */}
        <div className="text-center mb-[90px]">
          <h2 className="text-[38px] md:text-[48px] font-[900] tracking-tight">
            학습 방식
          </h2>

          {/* 학습 순서 */}
          <div className="mt-8 flex justify-center">
            <div className="
              flex items-center gap-2
              px-6 py-4 rounded-[28px]
              bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500
              text-white font-[800]
              shadow-[0_12px_30px_rgba(59,108,255,0.35)]
            ">
              <Flow>구조</Flow><Arrow/>
              <Flow>단어</Flow><Arrow/>
              <Flow>문장</Flow><Arrow/>
              <Flow>자동화</Flow>
            </div>
          </div>

          {/* 선택 영역 */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {lessonTypes.map(t => (
              <button
                key={t.key}
                onClick={() => setLesson(t.key)}
                className={`
                  px-6 py-4 rounded-[18px]
                  font-[800] text-[14px]
                  transition-all duration-300
                  ${lesson === t.key
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white border text-gray-600 hover:-translate-y-1 hover:shadow-md"}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== 카드 ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">

          {/* STEP 1 */}
          <Card accent="blue" step="1" badge="USAGE" title="구조 이해">
            {lesson === "how" && (
              <>
                <p className="font-[700] mb-2">“얼마나 ~ 해?”</p>
                <div className="font-[900] text-blue-600 mb-2">
                  How + 형용사 + be + 주어
                </div>
                <p className="text-[14px]">
                  How old are you?<br/>
                  → <b>정도를 묻는 질문 구조</b> 습득
                </p>
              </>
            )}

            {lesson === "ing" && (
              <>
                <p className="font-[700] mb-2">“~하는 중이야”</p>
                <div className="font-[900] text-blue-600 mb-2">
                  be + 동사-ing
                </div>
                <p className="text-[14px]">
                  I’m studying.<br/>
                  → <b>지금 진행 중인 상태</b>를 말하는 구조 확인
                </p>
              </>
            )}

            {lesson === "freq" && (
              <>
                <p className="font-[700] mb-2">“자주 / 가끔 / 종종 ~해”</p>
                <div className="font-[900] text-blue-600 mb-2">
                  빈도부사 + 동사
                </div>
                <p className="text-[14px]">
                  I usually work out.<br/>
                  → <b>행동의 빈도</b>를 말하는 구조 이해
                </p>
              </>
            )}
          </Card>

          {/* STEP 2 — 단어 확장 (… 적용) */}
          <Card accent="indigo" step="2" badge="VOCAB" title="단어 확장">
            <div className="flex flex-wrap gap-2 text-[13px] font-[700]">
              {activeWords.map(w => (
                <span
                  key={w}
                  className="px-2 py-1 bg-indigo-100 rounded"
                >
                  {w}
                </span>
              ))}

              {/* 더 많은 단어 암시 */}
              <span
                className="
                  px-2 py-1
                  bg-indigo-50
                  rounded
                  text-indigo-400
                  font-[900]
                  cursor-default
                "
              >
                …
              </span>
            </div>

            <div className="mt-5 text-center text-[18px] font-[900]">
              {lesson === "how" && <>How <span className="text-indigo-600">{activeWords[wordIndex]}</span> are you?</>}
              {lesson === "ing" && <>I’m <span className="text-indigo-600">{activeWords[wordIndex]}</span>.</>}
              {lesson === "freq" && <>I <span className="text-indigo-600">{activeWords[wordIndex]}</span> work out.</>}
            </div>
          </Card>

          {/* STEP 3 — 고정 단계 */}
          <Card accent="purple" step="3" badge="PRACTICE · WRITING" title="문장 만들기" fixed>
            <p className="text-[14px] font-[700]">
              어떤 구조를 배우든
            </p>
            <p className="mt-2 text-[15px] font-[900] text-purple-700">
              구조 습득 → 단어 확장 → 발화
            </p>
            <p className="mt-1 text-[13px] text-purple-600">
              이 흐름은 항상 동일합니다
            </p>
          </Card>

          {/* PLUS — 고정 단계 */}
          <Card accent="yellow" step="+" badge="PLUS · APP" title="자동화" fixed>
            <p className="font-[900] text-[17px] text-yellow-700 leading-tight">
              모든 구조의 끝은<br/>
              <span className="text-[20px]">자동 반응</span>
            </p>
            <p className="mt-3 text-[13px] font-[700]">
              구조가 달라도<br/>
              <b>훈련 방식은 변하지 않습니다</b>
            </p>
          </Card>

        </div>

      </Reveal>
    </section>
  );
};

/* ===== 공통 ===== */

const Flow = ({ children }: any) => (
  <span className="bg-white/20 px-3 py-1 rounded-full font-[900] text-[13px]">
    {children}
  </span>
);

const Arrow = () => <span className="font-[900] opacity-80">→</span>;

const Card = ({ step, badge, title, accent, children, fixed }: any) => {
  const colorMap: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-300"
  };

  return (
    <div
      className={`
        rounded-[22px] border
        bg-gradient-to-br ${colorMap[accent]}
        p-[24px]
        transition-all duration-300
        ${fixed
          ? "ring-2 ring-black/10 shadow-inner"
          : "hover:-translate-y-2 hover:shadow-xl"}
      `}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-[32px] h-[32px] bg-black text-white rounded-full flex items-center justify-center font-[900]">
          {step}
        </div>
        <span className="text-[11px] font-[900] tracking-widest opacity-70">
          {badge}
        </span>
      </div>

      <div className="font-[900] text-[18px] mb-3">{title}</div>
      {children}
    </div>
  );
};

export default CurriculumStepsSection;
