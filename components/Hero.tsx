import React from "react";
import { COURSE_LINK } from '../constants';

export default function Hero() {
  return (
    <section className="w-full bg-[#2F66E4] text-white py-20 flex flex-col items-center text-center font-[Pretendard] overflow-hidden">
      {/* 상단 타이틀 (이미지) */}
      <h1 className="mb-4">
        <img
          src="https://i.imgur.com/WbDrBjG.png"
          alt="구구단 패키지"
          className="w-[260px] md:w-[320px] mx-auto drop-shadow-md"
        />
      </h1>

      <p className="text-sm opacity-90 tracking-[0.2em] font-bold mb-12">
        기초 완성 99단
      </p>

      {/* 메인 카피 */}
      <div className="mt-6 mb-14">
        <p className="text-2xl font-bold mb-4">
          정석으로 가는
        </p>
        <p className="text-6xl md:text-7xl font-extrabold text-yellow-300 mb-6 font-['Paperlogy'] drop-shadow-md leading-tight">
          기초의 힘!
        </p>

        <p className="text-lg md:text-xl leading-relaxed text-white/95 font-medium">
          왕초보도 바로 말이 나오게 만드는{" "}
          <span className="text-yellow-300 font-extrabold">99주제</span>
          <br />
          기초를 다지면 영어,{" "}
          <span className="text-yellow-300 font-extrabold">무한 확장</span>이 가능합니다!
        </p>
      </div>

      {/* 버튼 */}
      <a 
        href={COURSE_LINK}
        className="relative mt-8 px-10 py-4 bg-white text-[#2F66E4] font-bold text-xl rounded-full overflow-hidden group inline-block shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300"
      >
        {/* 아주 은은한 홀로그램 (회전 시 빈 공간 없도록 inset 확장) */}
        <span
          className="pointer-events-none absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,245,200,0.12), rgba(255,210,230,0.18), rgba(255,245,200,0.12))",
            animation: "holo 4s ease-in-out infinite",
          }}
        />

        {/* 버튼 텍스트 */}
        <span className="relative z-10">영어 정복하기</span>
      </a>
    </section>
  );
}