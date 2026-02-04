import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { COURSE_LINK } from "../constants";

/* =====================================================
   TYPES & UTILS (DRAG QUIZ)
===================================================== */

type Q = {
  id: number;
  ko: string;
  subjectLabel: string; // 문제에 주어를 명시 (애매함 방지)
  adjective: string;
  be: "is";
  subject: string; // 카드로 제공될 주어(정답 단 1개)
  answer: string; // 최종 정답 문장
};

type CardType = "adj" | "be" | "sub";

type Card = {
  id: string;
  label: string;
  type: CardType;
  hint: "형용사" | "be동사" | "주어";
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickN = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);

const uniq = (arr: string[]) => Array.from(new Set(arr));

/* =====================================================
   COPY POOLS (NO CONSECUTIVE REPEAT)
===================================================== */

const CORRECT_COPY = [
  "⭕ 좋아요! 구조가 정확해요.",
  "⭕ 아주 좋아요. 패턴이 보이기 시작했어요.",
  "⭕ 완벽해요. 이제 ‘얼마나~해?’는 이 구조로 가면 돼요.",
  "⭕ 정답! 이건 ‘외운 문장’이 아니라 ‘만든 문장’이에요.",
  "⭕ 좋아요! 다음 문장도 같은 방식으로 만들 수 있어요.",
];

const WRONG_COPY = [
  "❌ 괜찮아요. 이 단계에서 틀리는 게 정상이에요.",
  "❌ 단어가 아니라 ‘순서’를 다시 보면 돼요.",
  "❌ 거의 왔어요! 구조만 다시 맞춰볼까요?",
  "❌ 아직 헷갈릴 수 있어요. 패턴만 다시 확인해요.",
  "❌ 괜찮아요. 한 번만 더 하면 확실히 잡혀요.",
];

function useNoRepeatRandom(pool: string[]) {
  const lastRef = useRef<string | null>(null);
  return () => {
    if (pool.length === 1) return pool[0];
    let next = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (next === lastRef.current && guard < 10) {
      next = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
    lastRef.current = next;
    return next;
  };
}

/* =====================================================
   10 QUESTION POOL (EXACT AS YOUR FULL CODE)
===================================================== */

const QUESTION_POOL: Q[] = [
  {
    id: 1,
    ko: "이거(this) 얼마나 어려워?",
    subjectLabel: "this",
    adjective: "difficult",
    be: "is",
    subject: "this",
    answer: "How difficult is this?",
  },
  {
    id: 2,
    ko: "그 역(the station) 얼마나 멀어?",
    subjectLabel: "the station",
    adjective: "far",
    be: "is",
    subject: "the station",
    answer: "How far is the station?",
  },
  {
    id: 3,
    ko: "이 차(this car) 얼마나 빨라?",
    subjectLabel: "this car",
    adjective: "fast",
    be: "is",
    subject: "this car",
    answer: "How fast is this car?",
  },
  {
    id: 4,
    ko: "그 강아지(that dog) 얼마나 귀여워?",
    subjectLabel: "that dog",
    adjective: "cute",
    be: "is",
    subject: "that dog",
    answer: "How cute is that dog?",
  },
  {
    id: 5,
    ko: "이거(this) 얼마나 비싸?",
    subjectLabel: "this",
    adjective: "expensive",
    be: "is",
    subject: "this",
    answer: "How expensive is this?",
  },
  {
    id: 6,
    ko: "그 사람(that person) 얼마나 친절해?",
    subjectLabel: "that person",
    adjective: "kind",
    be: "is",
    subject: "that person",
    answer: "How kind is that person?",
  },
  {
    id: 7,
    ko: "그 문제(that problem) 얼마나 쉬워?",
    subjectLabel: "that problem",
    adjective: "easy",
    be: "is",
    subject: "that problem",
    answer: "How easy is that problem?",
  },
  {
    id: 8,
    ko: "이 영화(this movie) 얼마나 길어?",
    subjectLabel: "this movie",
    adjective: "long",
    be: "is",
    subject: "this movie",
    answer: "How long is this movie?",
  },
  {
    id: 9,
    ko: "이 길(this road) 얼마나 위험해?",
    subjectLabel: "this road",
    adjective: "dangerous",
    be: "is",
    subject: "this road",
    answer: "How dangerous is this road?",
  },
  {
    id: 10,
    ko: "그 시험(that test) 얼마나 어려워?",
    subjectLabel: "that test",
    adjective: "hard",
    be: "is",
    subject: "that test",
    answer: "How hard is that test?",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ComparisonSection: React.FC = () => {
  /* -----------------------------------------------------
     PHASE
     0 = 체험 (단어배치 + 문장쓰기2문항)
     1 = 차이 보여주기
     2 = 확장하기
  ----------------------------------------------------- */
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  const topRef = useRef<HTMLDivElement | null>(null);

  const smoothToTop = (offset = 20) => {
    window.setTimeout(() => {
      if (!topRef.current) return;
      const top = topRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - offset), behavior: "smooth" });
    }, 40);
  };

  const ENABLE_CTA_AUTO_TRANSITION = false;

  /* =====================================================
     PHASE 0: 체험 파트
  ===================================================== */

  const [bankWords, setBankWords] = useState<string[]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [step1Result, setStep1Result] = useState<null | "correct" | "wrong">(null);

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [step2Result, setStep2Result] = useState<null | "correct" | "wrong">(null);

  useEffect(() => {
    if (bankWords.length === 0 && placedWords.length === 0) {
      setBankWords(shuffle(["how", "old", "are", "you"]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveWord = (word: string, index: number, fromBank: boolean) => {
    if (step1Result) return;

    if (fromBank) {
      const b = [...bankWords];
      b.splice(index, 1);
      setBankWords(b);
      setPlacedWords((p) => [...p, word]);
    } else {
      const p = [...placedWords];
      p.splice(index, 1);
      setPlacedWords(p);
      setBankWords((b) => [...b, word]);
    }
  };

  const checkStep1 = () => {
    const sentence = placedWords.join(" ").toLowerCase().trim();
    if (sentence === "how old are you") setStep1Result("correct");
    else setStep1Result("wrong");
  };

  const checkStep2 = () => {
    const a1 = input1.trim().toLowerCase().replace(/\?$/, "");
    const a2 = input2.trim().toLowerCase().replace(/\?$/, "");
    const correct1 = "how tall is he";
    const correct2 = "how cute is that dog";

    if (a1 === correct1 && a2 === correct2) setStep2Result("correct");
    else setStep2Result("wrong");
  };

  const resetPhase0 = () => {
    setPlacedWords([]);
    setBankWords(shuffle(["how", "old", "are", "you"]));
    setStep1Result(null);

    setInput1("");
    setInput2("");
    setStep2Result(null);
  };

  /* =====================================================
     PHASE 2: 확장하기
  ===================================================== */

  const [view, setView] = useState<0 | 1 | 2 | 3>(1);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const quizSet = useMemo(() => pickN(QUESTION_POOL, 3), []);
  const [qIndex, setQIndex] = useState(0);
  const q = quizSet[qIndex];

  const [slotAdj, setSlotAdj] = useState<Card | null>(null);
  const [slotBe, setSlotBe] = useState<Card | null>(null);
  const [slotSub, setSlotSub] = useState<Card | null>(null);

  const [bank, setBank] = useState<Card[]>([]);
  const [checked, setChecked] = useState<null | "correct" | "wrong">(null);
  const [feedback, setFeedback] = useState<string>("");

  const [hoverHint, setHoverHint] = useState<null | CardType>(null);

  const nextCorrectCopy = useNoRepeatRandom(CORRECT_COPY);
  const nextWrongCopy = useNoRepeatRandom(WRONG_COPY);

  const [overlayPhase, setOverlayPhase] = useState<"in" | "hold" | "out">("in");
  const [oldAnimStep, setOldAnimStep] = useState(0);

  // ✅ [추가] 모바일에서 결과가 "문제 카드 안에서" 펼쳐지도록 제어
  const [mobileInlineResultOpen, setMobileInlineResultOpen] = useState(false);

  const initQuestion = (question: Q) => {
    const correctAdj: Card = {
      id: `adj:${question.adjective}`,
      label: question.adjective,
      type: "adj",
      hint: "형용사",
    };
    const correctBe: Card = {
      id: `be:${question.be}`,
      label: question.be,
      type: "be",
      hint: "be동사",
    };
    const correctSub: Card = {
      id: `sub:${question.subject}`,
      label: question.subject,
      type: "sub",
      hint: "주어",
    };

    const otherAdjs = uniq(
      QUESTION_POOL.map((x) => x.adjective).filter((a) => a !== question.adjective)
    );
    const otherSubs = uniq(
      QUESTION_POOL.map((x) => x.subject).filter((s) => s !== question.subject)
    );

    const distractAdj = pickN(otherAdjs, 2).map((a) => ({
      id: `adj:${a}`,
      label: a,
      type: "adj" as const,
      hint: "형용사" as const,
    }));

    const distractSub = pickN(otherSubs, 2).map((s) => ({
      id: `sub:${s}`,
      label: s,
      type: "sub" as const,
      hint: "주어" as const,
    }));

    const cards = shuffle([correctAdj, correctBe, correctSub, ...distractAdj, ...distractSub]);

    setSlotAdj(null);
    setSlotBe(null);
    setSlotSub(null);

    setChecked(null);
    setFeedback("");
    setHoverHint(null);
    setBank(cards);

    // ✅ [추가] 문제 바뀌면 모바일 인라인 결과 닫기
    setMobileInlineResultOpen(false);
  };

  useEffect(() => {
    if (phase !== 2) return;
    initQuestion(quizSet[0]);
    setQIndex(0);
    setView(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    initQuestion(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  useEffect(() => {
    if (phase !== 1) return;
    setOldAnimStep(0);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setOldAnimStep(1), 700));
    timers.push(window.setTimeout(() => setOldAnimStep(2), 1600));
    timers.push(window.setTimeout(() => setOldAnimStep(3), 2600));
    timers.push(window.setTimeout(() => setOldAnimStep(4), 3600));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase]);

  const onDragStart = (e: React.DragEvent, card: Card) => {
    if (checked) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "move";
  };

  const allowDrop = (e: React.DragEvent) => {
    if (checked) return;
    e.preventDefault();
  };

  const removeFromBank = (cardId: string) => setBank((prev) => prev.filter((c) => c.id !== cardId));

  const putBackToBank = (card: Card) => setBank((prev) => shuffle([...prev, card]));

  const dropToSlot = (slot: CardType, e: React.DragEvent) => {
    if (checked) return;
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    let card: Card | null = null;
    try {
      card = JSON.parse(raw) as Card;
    } catch {
      return;
    }
    if (!card) return;

    if (card.type !== slot) return;

    if (slot === "adj" && slotAdj) putBackToBank(slotAdj);
    if (slot === "be" && slotBe) putBackToBank(slotBe);
    if (slot === "sub" && slotSub) putBackToBank(slotSub);

    removeFromBank(card.id);
    if (slot === "adj") setSlotAdj(card);
    if (slot === "be") setSlotBe(card);
    if (slot === "sub") setSlotSub(card);
  };

  const clickCardToAutoPlace = (card: Card) => {
    if (checked) return;
    const slot = card.type;

    if (slot === "adj") {
      if (slotAdj) putBackToBank(slotAdj);
      setSlotAdj(card);
    }
    if (slot === "be") {
      if (slotBe) putBackToBank(slotBe);
      setSlotBe(card);
    }
    if (slot === "sub") {
      if (slotSub) putBackToBank(slotSub);
      setSlotSub(card);
    }
    removeFromBank(card.id);
  };

  const removeFromSlot = (slot: CardType) => {
    if (checked) return;
    if (slot === "adj" && slotAdj) {
      putBackToBank(slotAdj);
      setSlotAdj(null);
    }
    if (slot === "be" && slotBe) {
      putBackToBank(slotBe);
      setSlotBe(null);
    }
    if (slot === "sub" && slotSub) {
      putBackToBank(slotSub);
      setSlotSub(null);
    }
  };

  const reshuffle = () => {
    if (checked) return;
    const all: Card[] = [...bank];
    if (slotAdj) all.push(slotAdj);
    if (slotBe) all.push(slotBe);
    if (slotSub) all.push(slotSub);
    setSlotAdj(null);
    setSlotBe(null);
    setSlotSub(null);
    setBank(shuffle(all));
    setHoverHint(null);
  };

  const canCheck = !!slotAdj && !!slotBe && !!slotSub;

  const computedSentence = () => {
    const a = slotAdj?.label || "";
    const b = slotBe?.label || "";
    const s = slotSub?.label || "";
    if (!a || !b || !s) return "";
    return `How ${a} ${b} ${s}?`;
  };

  const check = () => {
    if (!canCheck) return;

    const built = computedSentence().trim();
    if (built === q.answer) {
      setChecked("correct");
      setFeedback(nextCorrectCopy());
    } else {
      setChecked("wrong");
      setFeedback(nextWrongCopy());
    }

    // ✅ [추가] 정답 확인 후 모바일은 "문제 카드 안 결과" 자동 오픈
    setMobileInlineResultOpen(true);
  };

  const nextQuestion = () => {
    if (qIndex < 2) {
      setQIndex((i) => i + 1);
      return;
    }
    setView(3);
  };

  useEffect(() => {
    if (phase !== 2) return;
    if (view !== 3) return;

    window.setTimeout(() => {
      if (ctaRef.current) {
        const top = ctaRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 20, behavior: "smooth" });
      }
    }, 60);

    if (!ENABLE_CTA_AUTO_TRANSITION) return;

    const t = window.setTimeout(() => {
      setView(2);
      setOverlayPhase("in");
    }, 2400);

    return () => window.clearTimeout(t);
  }, [phase, view, ENABLE_CTA_AUTO_TRANSITION]);

  useEffect(() => {
    if (phase !== 2) return;
    if (view !== 2) return;

    if (!ENABLE_CTA_AUTO_TRANSITION) return;

    const t1 = window.setTimeout(() => setOverlayPhase("hold"), 650);
    const t2 = window.setTimeout(() => setOverlayPhase("out"), 2350);
    const t3 = window.setTimeout(() => {
      setPhase(1);
      setView(1);
      setQIndex(0);
      setOverlayPhase("in");
      smoothToTop(30);
    }, 2950);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, view, ENABLE_CTA_AUTO_TRANSITION]);

  const typeStyles: Record<CardType, { chip: string; glow: string; slot: string }> = {
    adj: {
      chip: "bg-[#fde047] text-[#111827] shadow-[0_10px_24px_rgba(253,224,71,0.35)]",
      glow: "ring-2 ring-[#fde047] shadow-[0_0_0_6px_rgba(253,224,71,0.22)]",
      slot: "border-[#facc15] bg-[#fffbeb]",
    },
    be: {
      chip: "bg-[#e0e7ff] text-[#1f2a5a] shadow-[0_10px_24px_rgba(99,102,241,0.18)]",
      glow: "ring-2 ring-[#6366f1] shadow-[0_0_0_6px_rgba(99,102,241,0.18)]",
      slot: "border-[#93c5fd] bg-[#eff6ff]",
    },
    sub: {
      chip: "bg-[#dbeafe] text-[#0b2a55] shadow-[0_10px_24px_rgba(59,130,246,0.18)]",
      glow: "ring-2 ring-[#60a5fa] shadow-[0_0_0_6px_rgba(96,165,250,0.18)]",
      slot: "border-[#60a5fa] bg-[#f0f9ff]",
    },
  };

  const GlobalStyle = (
    <style>{`
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .fadeUp { animation: fadeUp .55s ease both; }

      @keyframes overlayIn {
        0% { opacity: 0; transform: scale(1.04); filter: blur(6px); }
        100% { opacity: 1; transform: scale(1); filter: blur(0); }
      }
      @keyframes overlayOut {
        0% { opacity: 1; transform: scale(1); filter: blur(0); }
        100% { opacity: 0; transform: scale(0.98); filter: blur(10px); }
      }
      .overlayIn { animation: overlayIn .65s ease both; }
      .overlayOut { animation: overlayOut .6s ease both; }

      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .marquee { animation: marquee 24s linear infinite; width: max-content; }

      .hintTip {
        position: absolute;
        top: -34px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(17, 24, 39, 0.92);
        color: #fff;
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 999px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity .15s ease, transform .15s ease;
      }
      .hintWrap:hover .hintTip {
        opacity: 1;
        transform: translateX(-50%) translateY(-2px);
      }

      /* ✅ 모바일 인라인 결과: 부드러운 펼침 */
      .inlineResultWrap {
        overflow: hidden;
        transition: max-height .35s ease, opacity .2s ease;
      }
    `}</style>
  );

  const goPhase1 = () => {
    setPhase(1);
    smoothToTop(30);
  };

  const goPhase2 = () => {
    setPhase(2);
    setView(1);
    setQIndex(0);
    setOverlayPhase("in");
    smoothToTop(30);
  };

  // ✅ 공용: 결과 패널 JSX (재사용)
  const ResultPanel = () => {
    if (!checked) return null;
    return (
      <div
        className={[
          "p-5 rounded-[18px] border",
          checked === "correct" ? "bg-[#eef4ff] border-[#c7d2fe]" : "bg-[#fff2f2] border-[#fecaca]",
        ].join(" ")}
      >
        <p
          className={[
            "font-[900] text-[15px] mb-3",
            checked === "correct" ? "text-[#2563eb]" : "text-[#dc2626]",
          ].join(" ")}
        >
          {feedback}
        </p>

        <p className="text-[14px] text-gray-900 leading-[1.7] mb-4">
          “얼마나 ~ 해?”는 <strong className="font-[900]">How + 형용사 + be + 주어</strong>예요.
        </p>

        {checked === "wrong" && (
          <div className="bg-white rounded-[14px] p-4 border border-gray-100 shadow-sm mb-4">
            <p className="text-[12px] font-[900] text-gray-500 mb-1">정답</p>
            <p className="text-[16px] font-[900] text-gray-900">{q.answer}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={nextQuestion}
            className="flex-1 py-[16px] rounded-full bg-black text-white font-[900] text-[15px] hover:-translate-y-[2px] transition-all"
          >
            {qIndex < 2 ? "다음 문제 →" : "완료하기 →"}
          </button>

          <button
            onClick={() => initQuestion(q)}
            className="flex-1 py-[16px] rounded-full bg-white text-gray-900 font-[900] text-[15px] border border-gray-200 hover:bg-gray-50 transition-all"
          >
            같은 문제 다시
          </button>
        </div>
      </div>
    );
  };

  return (
    <section ref={topRef} className="py-24 bg-gray-50/60 font-[Pretendard]">
      {GlobalStyle}

      {/* =====================================================
          PHASE 0: 체험 (단어배치 + 문장쓰기)
      ===================================================== */}
      {phase === 0 && (
        <Reveal className="mx-auto px-4 max-w-[520px]">
          {/* --- 네 코드 그대로 (생략 없이 유지) --- */}
          <div className="text-center fadeUp">
            <h2 className="text-lg md:text-xl font-extrabold mb-3 text-gray-900 leading-tight">
              다음 질문을 영어로 말해 보세요!
            </h2>

            <div className="inline-block px-4 py-2 bg-[#eef2ff] rounded-full font-bold text-gray-900 mb-7">
              “너 몇 살이야?”
            </div>

            <div className="min-h-[64px] border-2 border-dashed border-[#6366f1] rounded-[16px] p-[12px] mb-5 flex gap-[10px] justify-center items-center flex-wrap bg-white transition-colors">
              {placedWords.length === 0 && (
                <span className="text-[#9ca3af] text-sm pointer-events-none select-none">
                  단어를 순서대로 배치하세요
                </span>
              )}
              {placedWords.map((word, i) => (
                <button
                  key={`placed-${i}`}
                  onClick={() => moveWord(word, i, false)}
                  className="px-[16px] py-[10px] bg-[#4f46e5] text-white rounded-[12px] font-bold cursor-pointer select-none hover:bg-[#4338ca] active:scale-95 transition-all"
                  disabled={!!step1Result}
                  title="클릭하면 되돌리기"
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-[10px] mb-7 flex-wrap min-h-[44px]">
              {bankWords.map((word, i) => (
                <button
                  key={`bank-${i}`}
                  onClick={() => moveWord(word, i, true)}
                  className="px-[16px] py-[10px] bg-[#4f46e5] text-white rounded-[12px] font-bold cursor-pointer select-none hover:bg-[#4338ca] active:scale-95 transition-all shadow-sm"
                  disabled={!!step1Result}
                  title="클릭해서 배치"
                >
                  {word}
                </button>
              ))}
            </div>

            {!step1Result && (
              <button
                onClick={checkStep1}
                className="w-full p-[18px] rounded-full border-none bg-[#fde047] text-[#111827] font-extrabold text-[16px] cursor-pointer shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-[2px]"
              >
                정답 확인하기
              </button>
            )}

            {step1Result && (
              <div className="mt-8 p-5 rounded-[18px] bg-[#f5f7ff] text-center fadeUp">
                <p className="text-gray-900 font-[900] mb-4">
                  {step1Result === "correct"
                    ? "⭕ 정답입니다! 다음 문제도 도전해 보세요"
                    : "❌ 아쉽게도 오답이에요. 그래도 다음 문제도 도전해 봅시다!"}
                </p>

                <div className="mt-6 text-left">
                  <h3 className="text-center text-xl font-extrabold mb-7 text-gray-900">
                    이 문장들도 만들어 보세요!
                  </h3>

                  <div className="mb-[18px]">
                    <p className="font-bold mb-2 text-gray-900">“그 남자 얼마나 키 커?”</p>
                    <input
                      value={input1}
                      onChange={(e) => setInput1(e.target.value)}
                      placeholder="영어로 입력하세요"
                      className="w-full p-[14px] text-[15px] rounded-[12px] border border-[#e5e7eb] focus:outline-none focus:border-[#4f46e5] transition-colors shadow-sm"
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-[18px]">
                    <p className="font-bold mb-2 text-gray-900">“그 강아지 얼마나 귀여워?”</p>
                    <input
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                      placeholder="영어로 입력하세요"
                      className="w-full p-[14px] text-[15px] rounded-[12px] border border-[#e5e7eb] focus:outline-none focus:border-[#4f46e5] transition-colors shadow-sm"
                      autoComplete="off"
                    />
                  </div>

                  {!step2Result && (
                    <button
                      onClick={checkStep2}
                      className="w-full mt-6 py-[16px] px-[18px] rounded-full border-none bg-[#4f46e5] text-white font-extrabold text-[16px] cursor-pointer shadow-[0_10px_24px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_14px_32px_rgba(79,70,229,0.45)]"
                    >
                      정답 확인하기
                    </button>
                  )}

                  {step2Result && (
                    <div className="mt-6 p-6 rounded-[18px] bg-white border border-gray-200 shadow-sm fadeUp">
                      <p className="font-[900] text-gray-900 mb-4">
                        {step2Result === "correct"
                          ? "⭕ 좋아요! 이제 ‘차이’를 보면 더 확실해져요."
                          : "❌ 지금은 헷갈릴 수 있어요. 학습법 차이를 보면 바로 이해됩니다."}
                      </p>

                      <div className="bg-[#f7f8ff] rounded-[14px] p-4 mb-5">
                        <p className="text-[13px] font-[900] text-gray-500 mb-1">정답</p>
                        <p className="text-[15px] font-[900] text-gray-900">How tall is he?</p>
                        <p className="text-[15px] font-[900] text-gray-900">How cute is that dog?</p>
                      </div>

                      <button
                        onClick={() => goPhase1()}
                        className="w-full py-[16px] rounded-full bg-black text-white font-[900] hover:-translate-y-[2px] transition-all"
                      >
                        학습법 차이 확인하기 →
                      </button>

                      <button
                        onClick={() => resetPhase0()}
                        className="mt-4 text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors"
                      >
                        ↺ 처음부터 다시 해보기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* =====================================================
          PHASE 1: 차이 보여주기 (네 코드 유지)
      ===================================================== */}
      {phase === 1 && (
        <div className="mx-auto px-4 max-w-[980px] fadeUp">
          <h2 className="text-[28px] md:text-[32px] font-[900] text-center mb-10 text-gray-900">
            학습 방식의 차이가 느껴지시나요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
            <div className="p-7 rounded-[22px] bg-white/70 border border-gray-200 shadow-[0_18px_40px_rgba(0,0,0,0.08)] text-left">
              <h3 className="text-[18px] font-[900] mb-4 text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 font-black">
                  ✕
                </span>
                기존 방식 (단순 표현 암기)
              </h3>

              <ul className="text-[15px] leading-[1.9] text-gray-800">
                <li className={`transition-all ${oldAnimStep >= 1 ? "opacity-100" : "opacity-30"}`}>
                  너 몇 살이야 → <strong>How old are you!</strong>
                </li>
                <li className={`transition-all ${oldAnimStep >= 2 ? "opacity-100" : "opacity-30"}`}>
                  너 얼마나 키 커 → <strong>How tall...?</strong>
                </li>

                <li
                  className={`mt-3 text-[#111] text-[16px] transition-all ${
                    oldAnimStep >= 3 ? "opacity-100" : "opacity-30"
                  }`}
                >
                  ❓ <strong>그 차 얼마나 빨라?</strong>
                </li>

                <li className={`transition-all ${oldAnimStep >= 3 ? "opacity-100" : "opacity-30"}`}>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-gray-500 font-[800]">How</span>
                    <span className="relative inline-flex items-center">
                      <span className="text-gray-400 font-[900]">…</span>
                      <span className="absolute -bottom-[2px] left-0 right-0 h-[6px] bg-red-200/60 -z-10 rounded-sm"></span>
                    </span>
                    <span className="text-gray-400">(망설임)</span>
                  </span>
                </li>

                <li
                  className={`mt-2 text-[#e11d48] font-[900] transition-all ${
                    oldAnimStep >= 4 ? "opacity-100" : "opacity-30"
                  }`}
                >
                  😵 대답 못함
                </li>
                <li
                  className={`text-[#b91c1c] font-[900] transition-all ${
                    oldAnimStep >= 4 ? "opacity-100" : "opacity-30"
                  }`}
                >
                  새 질문이 나오면 다시 막힘
                </li>
              </ul>
            </div>

            <div className="p-7 rounded-[22px] bg-[#e8edff] border border-[#d9ddff] shadow-[0_18px_40px_rgba(0,0,0,0.08)] text-left hover:-translate-y-[6px] hover:scale-[1.01] transition-all duration-300">
              <h3 className="text-[18px] font-[900] mb-3 text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-black">
                  ✓
                </span>
                구구단 패키지 (구조 자동화)
              </h3>

              <p className="text-[14px] text-gray-800 mb-4">
                외우는 게 아니라{" "}
                <span className="font-[900] text-[#4338ca]">패턴을 보고 무한 확장</span>합니다.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white text-[#3730a3] font-[900] mb-4">
                How + 형용사 + be + 주어
              </div>

              <p className="text-[14px] leading-[1.6] text-gray-900 mb-3">
                👉 “얼마나 ~ 해?”라는 질문은
                <br />
                아래처럼 <strong className="font-[900]">하나의 패턴</strong>으로 계속 바뀝니다.
              </p>

              <div className="overflow-hidden rounded-[14px] bg-white/80 border border-white shadow-sm">
                <div className="flex gap-[28px] py-[14px] px-[16px] marquee whitespace-nowrap">
                  {[
                    ["How difficult is this?", "이거 얼마나 어려워?"],
                    ["How far is the station?", "그 역 얼마나 멀어?"],
                    ["How fast is this car?", "이 차 얼마나 빨라?"],
                    ["How cute is that dog?", "그 강아지 얼마나 귀여워?"],
                    ["How expensive is this?", "이거 얼마나 비싸?"],
                    ["How kind is that person?", "그 사람 얼마나 친절해?"],
                    ["How difficult is this?", "이거 얼마나 어려워?"],
                    ["How far is the station?", "그 역 얼마나 멀어?"],
                    ["How fast is this car?", "이 차 얼마나 빨라?"],
                    ["How cute is that dog?", "그 강아지 얼마나 귀여워?"],
                    ["How expensive is this?", "이거 얼마나 비싸?"],
                    ["How kind is that person?", "그 사람 얼마나 친절해?"],
                  ].map(([en, ko], i) => (
                    <div key={i} className="inline-flex items-center gap-3">
                      <span className="font-[900] text-gray-900">{en}</span>
                      <span className="text-[13px] text-gray-500">→ {ko}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[18px] font-[800] mb-5 text-gray-900 leading-relaxed">
              하나를 알면 무한으로 확장되는 영어 문장들.
              <br />
              지금 바로 <span className="text-[#4f46e5] font-[900]">확장하기</span>로 체감해 보세요.
            </p>

            <button
              onClick={() => goPhase2()}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#4f46e5] text-white font-[900] shadow-[0_14px_30px_rgba(79,70,229,0.35)] hover:-translate-y-[2px] hover:shadow-[0_18px_38px_rgba(79,70,229,0.45)] transition-all"
            >
              확장하기 시작 →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          PHASE 2: 확장하기
      ===================================================== */}
      {phase === 2 && (
        <>
          {view === 1 && (
            <div className="mx-auto px-4 max-w-[980px] fadeUp">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-sm font-[900] text-[#4f46e5]">
                    확장하기
                  </span>
                  <h2 className="mt-2 text-[22px] md:text-[26px] font-[900] text-gray-900 leading-tight">
                    “얼마나 ~ 해?”를 패턴으로 만들어 보세요
                  </h2>
                </div>

                <div className="text-sm text-gray-500 font-[800]">
                  문제 <span className="text-gray-900">{qIndex + 1}</span> / 3
                </div>
              </div>

              {/* ✅ 핵심: md 이상에서는 2열(문제/결과), 모바일에서는 1열(인라인 결과) */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-start">
                {/* ================= LEFT: 문제/카드 섹션 ================= */}
                <div className="min-w-0">
                  {/* Prompt card */}
                  <div className="bg-white rounded-[18px] p-5 border border-gray-200 shadow-sm mb-6">
                    <p className="font-[900] text-gray-900 mb-2">{q.ko}</p>
                    <p className="text-[13px] text-gray-500">
                      아래 카드들을 끌어와서 문장을 완성해 보세요.
                    </p>

                    {/* ✅ 모바일: 결과를 "프롬프트 카드 안에서" 펼쳐서 보여줌 */}
                    <div
                      className={[
                        "mt-4 inlineResultWrap md:hidden",
                        mobileInlineResultOpen && checked ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
                      ].join(" ")}
                    >
                      {checked && (
                        <div className="pt-4 border-t border-gray-100">
                          <ResultPanel />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slots row */}
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="px-5 py-3 rounded-[14px] bg-[#4f46e5] text-white font-[900] shadow-[0_12px_28px_rgba(79,70,229,0.35)]">
                      How
                    </div>

                    <div
                      onDragOver={allowDrop}
                      onDrop={(e) => dropToSlot("adj", e)}
                      className={[
                        "relative flex-1 min-w-[180px] px-4 py-3 rounded-[14px] border-2 border-dashed transition-all",
                        typeStyles.adj.slot,
                        hoverHint === "adj" ? typeStyles.adj.glow : "",
                        checked ? "opacity-90" : "hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-[900] text-[#7a5b00] opacity-80">형용사</div>
                        <div className="text-[12px] text-gray-400 font-[800]">여기에 놓기</div>
                      </div>

                      <div className="mt-2 min-h-[34px] flex items-center">
                        {slotAdj ? (
                          <button
                            onClick={() => removeFromSlot("adj")}
                            className={`relative inline-flex items-center justify-center px-4 py-2 rounded-[12px] font-[900] ${typeStyles.adj.chip} hover:scale-[1.02] transition`}
                            title="클릭하면 되돌리기"
                          >
                            {slotAdj.label}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[13px] font-[700]">
                            형용사 카드가 여기를 들어가요
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      onDragOver={allowDrop}
                      onDrop={(e) => dropToSlot("be", e)}
                      className={[
                        "relative flex-1 min-w-[170px] px-4 py-3 rounded-[14px] border-2 border-dashed transition-all",
                        typeStyles.be.slot,
                        hoverHint === "be" ? typeStyles.be.glow : "",
                        checked ? "opacity-90" : "hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-[900] text-[#1f2a5a] opacity-80">be동사</div>
                        <div className="text-[12px] text-gray-400 font-[800]">여기에 놓기</div>
                      </div>

                      <div className="mt-2 min-h-[34px] flex items-center">
                        {slotBe ? (
                          <button
                            onClick={() => removeFromSlot("be")}
                            className={`relative inline-flex items-center justify-center px-4 py-2 rounded-[12px] font-[900] ${typeStyles.be.chip} hover:scale-[1.02] transition`}
                            title="클릭하면 되돌리기"
                          >
                            {slotBe.label}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[13px] font-[700]">
                            be동사 카드가 여기를 들어가요
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      onDragOver={allowDrop}
                      onDrop={(e) => dropToSlot("sub", e)}
                      className={[
                        "relative flex-1 min-w-[180px] px-4 py-3 rounded-[14px] border-2 border-dashed transition-all",
                        typeStyles.sub.slot,
                        hoverHint === "sub" ? typeStyles.sub.glow : "",
                        checked ? "opacity-90" : "hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-[900] text-[#0b2a55] opacity-80">주어</div>
                        <div className="text-[12px] text-gray-400 font-[800]">여기에 놓기</div>
                      </div>

                      <div className="mt-2 min-h-[34px] flex items-center">
                        {slotSub ? (
                          <button
                            onClick={() => removeFromSlot("sub")}
                            className={`relative inline-flex items-center justify-center px-4 py-2 rounded-[12px] font-[900] ${typeStyles.sub.chip} hover:scale-[1.02] transition`}
                            title="클릭하면 되돌리기"
                          >
                            {slotSub.label}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[13px] font-[700]">
                            주어 카드가 여기를 들어가요
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bank cards */}
                  <div className="bg-white rounded-[18px] p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-[14px] font-[900] text-gray-900">
                        카드들을 끌어서 완성해 보세요
                      </p>
                      <button
                        onClick={reshuffle}
                        className="text-[13px] font-[900] text-gray-500 hover:text-gray-700 transition"
                        disabled={!!checked}
                      >
                        다시 섞기
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {bank.map((card) => {
                        const style = typeStyles[card.type].chip;
                        return (
                          <div key={card.id} className="relative hintWrap">
                            <div className="hintTip">{card.hint} 자리로</div>

                            <button
                              draggable={!checked}
                              onDragStart={(e) => onDragStart(e, card)}
                              onMouseEnter={() => setHoverHint(card.type)}
                              onMouseLeave={() => setHoverHint(null)}
                              onClick={() => clickCardToAutoPlace(card)}
                              className={[
                                "relative px-4 py-2 rounded-[14px] font-[900] cursor-grab active:cursor-grabbing select-none transition-all",
                                style,
                                checked
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:-translate-y-[1px] hover:scale-[1.01]",
                              ].join(" ")}
                              disabled={!!checked}
                              title="드래그하거나 클릭해서 배치"
                            >
                              {card.label}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-3">
                      <button
                        onClick={check}
                        disabled={!canCheck || !!checked}
                        className={[
                          "flex-1 py-[16px] rounded-full font-[900] text-[15px] transition-all",
                          canCheck && !checked
                            ? "bg-[#4f46e5] text-white shadow-[0_14px_30px_rgba(79,70,229,0.35)] hover:-translate-y-[2px]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed",
                        ].join(" ")}
                      >
                        정답 확인하기
                      </button>

                      <button
                        onClick={reshuffle}
                        disabled={!!checked}
                        className={[
                          "flex-1 py-[16px] rounded-full font-[900] text-[15px] border transition-all",
                          checked
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        다시 섞기
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT: 데스크탑 결과 패널 ================= */}
                <div className="hidden md:block">
                  <div className="sticky top-[18px]">
                    <div className="bg-white rounded-[18px] p-5 border border-gray-200 shadow-sm">
                      <p className="text-[14px] font-[900] text-gray-900 mb-3">결과</p>

                      {!checked ? (
                        <div className="rounded-[14px] border border-dashed border-gray-200 p-4 text-sm text-gray-500 font-[800]">
                          정답 확인을 누르면<br />
                          여기에서 결과가 바로 보여요.
                        </div>
                      ) : (
                        <ResultPanel />
                      )}

                      {checked && (
                        <button
                          onClick={() => setMobileInlineResultOpen((v) => !v)}
                          className="mt-4 w-full py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-700 font-[900] hover:bg-gray-100 transition"
                        >
                          (모바일 인라인 결과 토글 테스트)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 2 && (
            <div
              className={[
                "fixed inset-0 z-[60] flex items-center justify-center",
                overlayPhase === "out" ? "overlayOut" : "overlayIn",
              ].join(" ")}
              style={{
                background:
                  "radial-gradient(1200px 500px at 70% 30%, rgba(99,102,241,0.18), rgba(0,0,0,0.98))",
              }}
            >
              <div className="text-center px-6">
                <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-[12px] font-[900] mb-4">
                  FINISH
                </div>

                <h2 className="text-white text-[30px] md:text-[44px] font-[900] leading-tight">
                  이제, 구조로 영어를 정복할 시간.
                </h2>

                <p className="mt-4 text-white/70 text-[14px] md:text-[15px] font-[700]">
                  구구단 패키지에서 시작할 수 있어요.
                </p>

                <div className="mt-8 h-[2px] w-[220px] mx-auto rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            </div>
          )}

          {view === 3 && (
            <div ref={ctaRef} className="mx-auto px-4 max-w-[980px] fadeUp">
              <p className="text-center text-[18px] md:text-[20px] font-[900] text-gray-900 leading-relaxed mb-8">
                하나를 알면 무한으로 확장되는 영어 문장들. <br />
                <br />
                이 차이를 만드는 것,  <br /><span className="text-[#4f46e5]">구구단 패키지</span>로 시작하세요.
              </p>

              <div className="rounded-[24px] border border-white shadow-[0_26px_60px_rgba(0,0,0,0.12)] p-6 md:p-7 mb-10 relative overflow-hidden bg-white">
                <ul className="relative z-10 space-y-4 w-full">
                  {["기초 · 구조 중심 수업", "무한 이용 · 전용 학습 어플리케이션", "부담스럽지 않은 수업 시간"].map(
                    (t, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[3px] inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4f46e5] text-white font-[900] shadow-[0_10px_24px_rgba(79,70,229,0.35)]">
                          ✓
                        </span>
                        <span className="text-[15px] md:text-[16px] font-[900] text-gray-900">{t}</span>
                      </li>
                    )
                  )}
                </ul>

                <div className="relative z-10 mt-7 flex flex-col gap-3">
                  <a
                    href={COURSE_LINK}
                    className="w-full text-center py-[16px] rounded-full bg-[#4f46e5] text-white font-[900] shadow-[0_16px_36px_rgba(79,70,229,0.38)] hover:-translate-y-[2px] transition-all"
                  >
                    제대로 영어 공부하고 싶다면?
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ComparisonSection;
