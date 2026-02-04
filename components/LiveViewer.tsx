import React, { useEffect, useState } from "react";

export default function LiveViewer() {
  const getBaseRange = () => {
    const hour = new Date().getHours();

    // 🌙 새벽 1시 ~ 6시
    if (hour >= 1 && hour < 6) {
      return { min: 10, max: 18 };
    }

    // ☀️ 그 외 시간
    return { min: 28, max: 62 };
  };

  const [{ min, max }, setRange] = useState(getBaseRange());
  const [viewerCount, setViewerCount] = useState(
    Math.floor(Math.random() * (max - min + 1)) + min
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const { min, max } = getBaseRange();
      setRange({ min, max });

      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) + 1; // 1~5명 변동
        const direction = Math.random() > 0.5 ? 1 : -1;

        let next = prev + delta * direction;
        if (next < min) next = min;
        if (next > max) next = max;

        return next;
      });
    }, 6000); // ⏱ 6초마다 (느리게)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-24 left-4 z-50 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all hover:bg-black/70 animate-fadeIn">
      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      지금 <span className="font-semibold">{viewerCount}명</span>이 보고 있습니다
    </div>
  );
}