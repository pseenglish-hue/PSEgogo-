import React from 'react';
import Reveal from './Reveal';

const InstructorsSection: React.FC = () => {
  return (
    <section className="py-[80px] px-[20px] bg-white font-[Pretendard]">
      <style>{`
        @keyframes fadeUpSoft {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes holoSweep {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .holo-accent {
          background: linear-gradient(90deg,#2563eb,#60a5fa,#2563eb);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: holoSweep 6s linear infinite;
        }
      `}</style>
      <Reveal className="max-w-[980px] mx-auto">
        <h2 className="text-center mb-[48px] leading-tight">

          <span
            className="block text-[16px] md:text-[18px]
                       font-[600] text-gray-500
                       animate-[fadeUpSoft_.7s_ease-out]"
          >
            우리를 책임질
          </span>

          <span
            className="block mt-2
                       text-[28px] md:text-[36px]
                       font-[900]
                       holo-accent
                       animate-[fadeUpSoft_.9s_ease-out]"
          >
            실력파 강사진
          </span>

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          
          {/* Robin (Left) */}
          <div className="flex flex-col md:flex-row items-center gap-[24px] p-[28px] bg-[#f8f9ff] rounded-[24px] shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-[6px]">
            <div className="shrink-0 w-[120px] h-[120px] rounded-full overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
              <img 
                src="https://i.imgur.com/tmg7Ec9.jpg" 
                alt="Robin" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[20px] font-[800] mb-[6px] text-gray-900">Robin</h3>
              <p className="text-[14px] font-[700] text-[#2563eb] mb-[6px]">순수 국내파 영어 전문 강사</p>
              <p className="text-[13px] font-[700] text-[#4f46e5] mb-[14px]">Level 0 · Essential 수업 담당</p>

              <p className="text-[14px] leading-[1.6] text-[#333] break-keep">
                “한국에서만 공부해도 영어 정복?<br />
                가능합니다! 한국인의 입장에서<br />
                헷갈리는 부분들을 가장 명확하고<br />
                친절하게 설명해드릴게요.”
              </p>
            </div>
          </div>

          {/* Dale (Right) */}
          <div className="flex flex-col md:flex-row items-center gap-[24px] p-[28px] bg-[#f8f9ff] rounded-[24px] shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-[6px]">
            <div className="shrink-0 w-[120px] h-[120px] rounded-full overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
              <img 
                src="https://i.imgur.com/Vna451G.jpg" 
                alt="Dale" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[20px] font-[800] mb-[6px] text-gray-900">Dale</h3>
              <p className="text-[14px] font-[700] text-[#2563eb] mb-[6px]">회계사를 포기한 캐나다 정통 교포 강사</p>
              <p className="text-[13px] font-[700] text-[#4f46e5] mb-[14px]">Level 1 ~ Level 4 담당</p>

              <p className="text-[14px] leading-[1.6] text-[#333] break-keep">
                “단순 암기는 이제 그만!<br />
                정확한 구조와 원어민의 뉘앙스를<br />
                완벽하게 이해시켜 드립니다.<br />
                영어를 꿈을 이루는 밑거름으로 만드세요.”
              </p>
            </div>
          </div>

        </div>
      </Reveal>
    </section>
  );
};

export default InstructorsSection;