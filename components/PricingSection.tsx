import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { COURSE_LINK } from "../constants";

/**
 * PricingSection (Redesigned)
 */

const PricingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [animatePrice, setAnimatePrice] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);

  // REFUND: how-to toggle
  const [openHow, setOpenHow] = useState(false);

  // BENEFITS scroll activation
  const benefitRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [benefitActive, setBenefitActive] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  // Benefit 3 lecture button scroll activation
  const lectureBtnRef = useRef<HTMLButtonElement | null>(null);
  const [showLectureBtn, setShowLectureBtn] = useState(false);

  // REFUND highlight + amount reveal
  const refundRef = useRef<HTMLDivElement | null>(null);
  const [showRefundHighlight, setShowRefundHighlight] = useState(false);
  const [showRefundAmount, setShowRefundAmount] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimatePrice(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Benefits: activate each item on scroll
  useEffect(() => {
    const nodes = benefitRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const ios: IntersectionObserver[] = [];

    nodes.forEach((node, idx) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setBenefitActive((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(node);
      ios.push(io);
    });

    return () => {
      ios.forEach((io) => io.disconnect());
    };
  }, []);

  // Benefit 3: button activation
  useEffect(() => {
    const btn = lectureBtnRef.current;
    if (!btn) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowLectureBtn(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    io.observe(btn);
    return () => io.disconnect();
  }, []);

  // Refund: shimmer + amount reveal
  useEffect(() => {
    const el = refundRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowRefundHighlight(true);
          setTimeout(() => setShowRefundAmount(true), 420);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gray-900 text-white break-keep overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute top-[35%] -left-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[520px] w-[520px] rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      <Reveal className="relative mx-auto max-w-6xl px-5 md:px-8">
        {/* ================= 1) HERO ================= */}
        <header className="pt-20 md:pt-28 pb-16 md:pb-20">
          <div className="mx-auto max-w-xl md:max-w-3xl text-center">
            <p className="text-base md:text-lg text-white/70 tracking-tight">
              이번이 당신의
            </p>

            <h1 className="mt-4 md:mt-5 text-[34px] md:text-[56px] font-extrabold leading-tight tracking-tight">
              <span className="inline-block">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
                  마지막 영어 공부!
                </span>
              </span>
            </h1>

            <div className="mt-10 md:mt-12 flex items-center justify-center">
              <a
                href={COURSE_LINK}
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-7 py-4 text-black font-extrabold shadow-xl transition hover:scale-[1.02] active:scale-[0.99]
                           text-base md:text-lg"
              >
                지금 바로 수강 신청
              </a>
            </div>

            <div className="mt-10 md:mt-12 border-t border-white/10" />
          </div>
        </header>

        {/* ================= 2) PRICE + PACKAGE ================= */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-xl md:max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-7">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-black font-extrabold shadow-lg text-sm md:text-base">
                    🔥 20% 할인 진행 중
                  </span>
                </div>

                <p className="mt-6 text-lg md:text-xl text-white/90">
                  구구단 패키지 수강료
                </p>

                <div className="mt-7 md:mt-8">
                  <div className="text-white/55 text-base md:text-lg">
                    정가 :{" "}
                    <span className="line-through font-semibold">
                      375,000원
                    </span>
                  </div>

                  <div className="mt-3 flex items-end gap-3">
                    <div className="text-white/70 text-base md:text-lg">
                      할인가 :
                    </div>
                    <div
                      className={[
                        "font-black text-yellow-300 tracking-tight whitespace-nowrap",
                        "text-[clamp(34px,4.8vw,64px)] leading-none",
                        "transition-transform duration-300",
                        animatePrice ? "scale-100" : "scale-[0.98]",
                      ].join(" ")}
                    >
                      300,000원
                    </div>
                  </div>

                  <div className="mt-8 md:mt-9">
                    <a
                      href={COURSE_LINK}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-7 py-4 text-black font-extrabold shadow-xl transition hover:scale-[1.02] active:scale-[0.99]
                                 text-base md:text-lg"
                    >
                      수강료 할인 받고 공부 시작!
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="h-full rounded-3xl bg-transparent p-1">
                <div className="rounded-3xl border border-white/10 bg-white/0 p-8 md:p-10">
                  <div className="flex items-center gap-3">
                    <span className="text-lg md:text-xl font-extrabold text-yellow-300">
                      📦 구구단 패키지 기본 구성
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-white/85">
                    <LineItem label="대상 과정 :" value="Essential ~ Lv.4" />
                    <LineItem label="구성 :" value="99가지 주제 · 273강" />
                    <LineItem label="학습 방식 :" value="하루 한 주제 · 반복 훈련" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3) BENEFITS ================= */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-xl md:max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-4 py-2 text-yellow-200 font-extrabold border border-yellow-400/20 text-sm md:text-base">
              🎁 지금 등록하면 아래 혜택 전부 제공
            </p>

            <h2 className="mt-6 text-2xl md:text-4xl font-extrabold tracking-tight">
              수강생 특별 혜택
            </h2>

            <div className="mt-10 md:mt-12 space-y-10 md:space-y-12">
              <div
                ref={(el) => { benefitRefs.current[0] = el; }}
                className={["transition-all duration-700 ease-out", benefitActive[0] ? "opacity-100 translate-y-0" : "opacity-40 translate-y-6"].join(" ")}
              >
                <Benefit
                  number="혜택 1"
                  title="등록 시 수강료 20% 파격 할인"
                  body={<><span className="font-extrabold text-yellow-300">375,000원</span> 강의를 <span className="font-extrabold text-yellow-300">300,000원</span> 에!<br />하루에 커피 한 잔 가격이면 충분해요 ☕</>}
                />
              </div>

              <div
                ref={(el) => { benefitRefs.current[1] = el; }}
                className={["transition-all duration-700 ease-out", benefitActive[1] ? "opacity-100 translate-y-0" : "opacity-40 translate-y-6"].join(" ")}
              >
                <Benefit
                  number="혜택 2"
                  title="등록 시 추가 수강 기간 100일 증정"
                  body={<>2026년 내내 들을 수 있는 온라인 강의,<br /><span className="font-extrabold text-yellow-300">총 350일</span> 동안 완벽하게 복습하세요</>}
                />
              </div>

              <div
                ref={(el) => { benefitRefs.current[2] = el; }}
                className={["transition-all duration-700 ease-out", benefitActive[2] ? "opacity-100 translate-y-0" : "opacity-40 translate-y-6"].join(" ")}
              >
                <Benefit
                  number="혜택 3"
                  title="등록 시 온/오프라인 특강 무료 제공"
                  body={
                    <>
                      프린서플 어학원에서 제공되는 모든 특강에 참여하세요!<br /><span className="font-extrabold text-yellow-300">온/오프라인 모두 무료</span> 입니다
                      <div className="mt-4">
                        <button
                          ref={lectureBtnRef}
                          onClick={() => setShowLectureModal(true)}
                          className={["inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white/90 transition-all duration-500 ease-out", showLectureBtn ? "opacity-100 translate-y-0 hover:bg-white/10 active:scale-[0.99]" : "opacity-0 translate-y-4 pointer-events-none"].join(" ")}
                        >
                          ▶ 진행된 특강 실제 영상 보기
                        </button>
                      </div>
                    </>
                  }
                />
              </div>

              <div
                ref={(el) => { benefitRefs.current[3] = el; }}
                className={["transition-all duration-700 ease-out", benefitActive[3] ? "opacity-100 translate-y-0" : "opacity-40 translate-y-6"].join(" ")}
              >
                <Benefit
                  number="혜택 4"
                  title="완강 시 프린서플 어학원 강의 20% 할인"
                  body={<>다음 영어 공부도 프린서플에서 이어가세요.<br /><span className="font-extrabold text-yellow-300">모든 강의에 사용 가능한 20% 할인권</span> 을 드립니다</>}
                />
              </div>
            </div>

            <div className="mt-12 md:mt-14 flex justify-start">
              <a
                href={COURSE_LINK}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-yellow-400 px-7 py-4 text-black font-extrabold shadow-xl transition hover:scale-[1.02] active:scale-[0.99] text-base md:text-lg"
              >
                👉 혜택 받고 수강 신청하기
              </a>
            </div>
          </div>
        </section>

        {/* ================= 4) REFUND CHALLENGE (Updated Section) ================= */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-xl md:max-w-4xl">
            <div className="rounded-3xl bg-yellow-400/10 border border-yellow-400/20 p-8 md:p-12">
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-yellow-200">
                🏁 99일 완성 환급 챌린지
              </h2>

              <p className="mt-2 text-white/80">
                매일 공부만 하면 되는 세상 가장 쉬운 챌린지
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Chip>📅 하루 한 주제 · 1~3강</Chip>
                <Chip>⏱ 하루 10~30분 학습</Chip>
                <Chip>💾 학습 기록 자동 저장</Chip>
              </div>

              <button
                type="button"
                onClick={() => setOpenHow(!openHow)}
                className="mt-6 text-yellow-300 font-extrabold underline underline-offset-4"
              >
                어떻게 참여하나요?
              </button>

              {openHow && (
                <div className="mt-4 space-y-2 text-sm text-white/80">
                  <p>
                    99일 챌린지는 99일 기간 동안 매일 1가지 주제의 수업을 들어주시면 되는 챌린지입니다! 
                    각각의 주제는 1강에서 3강으로 구성되어 있고, 모두 수강하면 10분에서 30분 정도 소요돼요.
                  </p>
                  <p className="font-extrabold text-yellow-300">
                    따로 인증하실 필요 없이, 매일 매일 수강만 해주시면 된답니다!
                  </p>
                </div>
              )}

              {/* ✅ 수강료 50% 강조 및 금액 표시 (요청하신 코드로 교체 완료) */}
              <div ref={refundRef} className="mt-10 md:mt-12 rounded-2xl bg-black/20 p-7 md:p-10 text-center">
                <p className="text-lg md:text-2xl font-extrabold text-white">
                  🎉 99일, 챌린지 완주하면
                </p>

                <p className="mt-3 text-xl md:text-3xl font-black tracking-tight text-white">
                  <span
                    className={[
                      "relative font-black",
                      showRefundHighlight ? "shimmer-text" : "text-yellow-300",
                    ].join(" ")}
                  >
                    수강료 50%
                  </span>
                  를 돌려드립니다!
                </p>

                {showRefundAmount && (
                  <div className="mt-3 text-sm md:text-base font-semibold text-yellow-200/80 fade-up">
                    👉 150,000원
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <a
                    href={COURSE_LINK}
                    className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-8 py-4 text-black font-extrabold shadow-xl transition hover:scale-[1.03] active:scale-[0.98] text-base md:text-lg"
                  >
                    지금 바로 수강 신청
                  </a>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .shimmer-text {
              background: linear-gradient(90deg, #facc15, #fff2a6, #facc15);
              background-size: 220% 100%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 2.6s ease-in-out infinite;
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .fade-up {
              animation: fadeUp 0.6s ease-out both;
            }
          `}</style>
        </section>

        {/* ================= 5) FAQ ================= */}
        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-xl md:max-w-4xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center">
              ❓ 자주 물어보시는 질문
            </h2>

            <div className="mt-10 md:mt-12 space-y-4">
              <FaqAccordion q="완전 초보도 가능한가요?" a="가능합니다! 영어의 기본 중 기본부터 하나씩 스텝을 밟아나가실 수 있어요." />
              <FaqAccordion q="숙제가 많나요?" a="없습니다. 수업 안에서 학습과 복습이 함께 이루어집니다." />
              <FaqAccordion q="전용 학습 앱은 무엇인가요?" a="프린서플 어학원 전용 [클래스 카드]를 사용해 문장을 무한 반복하며 연습할 수 있어요!" />
              <FaqAccordion q="기본 혜택은 모든 수강생에게 적용되나요?" a="네. 추가 100일, 특강 무료, 20% 할인권은 전원 제공됩니다.\n\n환급 챌린지만 별도로 진행되는 내용입니다." />
              <FaqAccordion q="99일 완성 환급 챌린지가 정확히 무엇인가요?" a="구구단 패키지의 수업은 총 99개 주제, 273강 구성입니다.\n\n이 챌린지에 참여 하시기 위해서는 하루 한 주제씩, 주제당 1~3강을 수강하며\n\n하루 10~30분 투자해주시면 됩니다." />
              <FaqAccordion q="참여 방법은?" a="자동으로 학습 일자가 기록됩니다.\n\n따로 인증하실 필요 없습니다." />
              <FaqAccordion q="성공하면?" a="프린서플 안내데스크(02-539-8963) 또는\n\n프린서플 어학원 카카오톡 공식 페이지로 연락을 주세요.\n\n친절히 안내해 드리겠습니다." />
            </div>
          </div>
        </section>
      </Reveal>

      {showLectureModal && <LectureModal onClose={() => setShowLectureModal(false)} />}
    </section>
  );
};

/* ----------------- UI Sub-Components ----------------- */

const LineItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3">
    <div className="min-w-[88px] md:min-w-[100px] text-white/65 font-semibold">{label}</div>
    <div className="text-white/90 font-bold">{value}</div>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm md:text-base font-semibold text-white/90">{children}</div>
);

const Benefit = ({ number, title, body }: { number: string; title: string; body: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-yellow-200/90">{number}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
    <h3 className="mt-4 text-lg md:text-2xl font-extrabold text-white tracking-tight">{title}</h3>
    <p className="mt-3 text-sm md:text-base leading-relaxed text-white/75">{body}</p>
  </div>
);

const sanitizeFaqText = (s: string) => {
  return s.replace(/\/n\/n\//g, " ").replace(/\\n\\n/g, " ").replace(/\\n/g, " ").replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
};

const FaqAccordion = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const cleanedAnswer = useMemo(() => sanitizeFaqText(a), [a]);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-6 py-5 md:px-7 md:py-6 flex items-start justify-between gap-4 text-left">
        <div><p className="text-sm md:text-base font-extrabold text-yellow-200">Q. {q}</p></div>
        <span className={["mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-transform", open ? "rotate-180" : ""].join(" ")}>⌄</span>
      </button>
      <div className={["overflow-hidden transition-all duration-300", open ? "max-h-[420px]" : "max-h-0"].join(" ")}>
        <div className="px-6 pb-6 md:px-7 md:pb-7">
          <p className="text-sm md:text-base leading-relaxed text-white/75">{cleanedAnswer}</p>
        </div>
      </div>
    </div>
  );
};

const LectureModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="w-full max-w-xl rounded-3xl bg-gray-900 text-white border border-white/10 shadow-2xl">
      <div className="relative p-7 md:p-9">
        <button onClick={onClose} className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xl transition hover:bg-white/10 active:scale-[0.98]">✕</button>
        <h3 className="text-xl md:text-2xl font-extrabold text-yellow-300">🎓 실제 진행된 무료 특강 영상</h3>
        <div className="mt-7 space-y-6">
          <LectureItem title="원어민 표현 100개 특강" href="https://youtu.be/mXdIcpI3pxE?si=DamkTZlc44TPBZDP" />
          <LectureItem title="실전 워홀 영어 특강" href="https://youtu.be/h6otOl0g5yE?si=L-w6jaBoeCeFrrw6" />
        </div>
      </div>
    </div>
  </div>
);

const LectureItem = ({ title, href }: { title: string; href: string }) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
    <div className="font-bold text-white/90">✔ {title}</div>
    <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 font-extrabold text-yellow-300 underline underline-offset-4">▶ 영상 보러 가기</a>
  </div>
);

export default PricingSection;