import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { COURSE_LINK } from "../constants";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};

const problems = [
  {
    tag: "#기초_부족",
    problem: (
      <>
        <span className="font-bold">기초가 없어</span> 영어가 필요할 때마다<br />
        <span className="font-bold">돈만 쓰게 돼요.</span>
      </>
    ),
    solution: (
      <>
        👉 <br />한 번 기초를 쌓아두면,<br />
        이후 공부는 스스로 척척!<br />
        <span className="font-bold">영어 독립의 시작은 기초입니다.</span>
      </>
    ),
  },
  {
    tag: "#입이_안_떨어짐",
    problem: (
      <>
        머리로는 아는데<br />
        <span className="font-bold">입 밖으로 나오질 않아요.</span>
      </>
    ),
    solution: (
      <>
        👉 <br />영어도 운동처럼 훈련이 필요해요.<br />
        <span className="font-bold">매일 말하는 연습이 답이에요.</span>
      </>
    ),
  },
  {
    tag: "#시간_부족",
    problem: (
      <>
        공부는 하고 싶은데…<br />
        <span className="font-bold">시간이 부족해요.</span>
      </>
    ),
    solution: (
      <>
        👉 <br />부담 없이 짧게, 그러나 꾸준히.<br />
        <span className="font-bold">매일 주제 1개씩이면 충분해요!</span>
      </>
    ),
  },
];

const ProblemSection = () => {
  const isMobile = useIsMobile();
  const swiperRef = useRef(null);

  // ✅ 떠오르는 카드용
  const revealRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.3 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <section className="relative bg-[#f8f9ff] pt-[120px] pb-[32px] px-4 overflow-hidden font-[Pretendard]">

        <style>{`
          @keyframes anxiousShake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-0.5px); }
            40% { transform: translateX(0.5px); }
            60% { transform: translateX(-0.3px); }
            80% { transform: translateX(0.3px); }
            100% { transform: translateX(0); }
          }
          .anxious-word {
            display: inline-block;
            animation: anxiousShake 2.8s ease-in-out infinite;
          }

          /* ✅ 스크롤 등장 애니메이션 */
          .reveal-up {
            opacity: 0;
            transform: translateY(24px);
            transition: all 0.7s ease;
          }
          .reveal-up.show {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>

        {/* 타이틀 */}
        <h2 className="text-center text-[28px] md:text-[36px] font-[800] mb-[12px] break-keep">
          영어로 하고 싶은 말은 많은데 늘{" "}
          <span className="anxious-word text-red-500">불안한</span> 당신에게
        </h2>

        <p className="mt-3 text-center text-[#999] mb-[24px]">
          * PC에서는 자동, 모바일에서는 좌우로 넘겨보세요
        </p>

        {/* 슬라이더 */}
        <div className="relative max-w-[420px] mx-auto px-4">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            autoHeight
            observer
            observeParents
            loop
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
          >
            {problems.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="group relative bg-white rounded-[24px] p-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] min-h-[260px] flex flex-col justify-center">
                  <p className="text-[#3b6cff] font-[700] mb-[12px]">
                    {item.tag}
                  </p>

                  <div className="text-[18px] leading-[1.6] text-left whitespace-pre-line transition-opacity duration-300 group-hover:opacity-0 text-[#222]">
                    {item.problem}
                  </div>

                  <div className="absolute inset-0 p-[32px] rounded-[24px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                    <p className="text-[18px] leading-[1.6] text-left whitespace-pre-line text-[#222]">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* CTA 슬라이드 */}
            <SwiperSlide>
              <div className="bg-[#2f5cff] text-white rounded-[32px] p-[44px] shadow-[0_40px_80px_rgba(47,92,255,0.4)] min-h-[320px] flex justify-center">
                <div className="flex flex-col items-center text-center gap-8 w-full max-w-[560px]">

                  <ul className="space-y-[16px] text-[15px] md:text-[16px] font-medium text-left w-full">
                    <li>✔️ 마지막 도전!<span className="font-extrabold"> 탄탄한 기초 학습</span></li>
                    <li>✔️ 원할 때마다<span className="font-extrabold"> 전용 앱 무한 이용</span></li>
                    <li>✔️ 부담없는 수강<span className="font-extrabold"> 짧은 학습 시간</span></li>
                  </ul>

                  <p className="text-yellow-300 font-extrabold text-[22px] md:text-[24px] animate-pulse">
                    구구단 패키지
                  </p>

                  <a
                    href={COURSE_LINK}
                    className="w-full bg-[#ffe600] text-[#1a1a1a] font-extrabold text-[18px] py-[16px] rounded-full hover:scale-[1.04] transition shadow-xl"
                  >
                    마지막 영어 공부 도전!
                  </a>

                </div>
              </div>
            </SwiperSlide>

          </Swiper>

          {/* 좌우 버튼 */}
          <button
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-md bg-white/25 border border-white/40 shadow-lg hover:bg-white/50 transition z-20"
          >
            ‹
          </button>

          <button
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-md bg-white/25 border border-white/40 shadow-lg hover:bg-white/50 transition z-20"
          >
            ›
          </button>

        </div>

        {/* ✅ 스크롤 떠오르는 강조 카드 */}
        <div
          ref={revealRef}
          className={`relative mt-[100px] mb-[100px] flex justify-center reveal-up ${revealed ? "show" : ""}`}
        >
          <div className="
  bg-white
  px-5 md:px-8
  py-4 md:py-5
  rounded-2xl md:rounded-full
  shadow-lg
  border border-gray-100
  max-w-[92vw] md:max-w-none
">

<p className="
  text-[15px] md:text-[19px]
  font-[700]
  text-[#222]
  text-center
  leading-relaxed
">

하지만! 영어 공부 핵심은…

<span className="relative inline px-1 font-[900] text-[#3b6cff]">
구조
<span className="absolute inset-x-0 bottom-1 h-[8px] bg-[#3b6cff]/20 -z-10 rounded-sm"></span>
</span>

에 있다는 사실!

</p>
</div>


      </section>
    </>
  );
};

export default ProblemSection;
