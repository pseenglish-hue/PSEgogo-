import React from 'react';
import { COURSE_LINK } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img 
            src="https://i.imgur.com/W6sfkrl.png"
            alt="프린서플 어학원 로고"
            className="h-10 w-auto"
          />
        </a>
        <a 
          href={COURSE_LINK}
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition"
        >
          수강 신청하기
        </a>
      </div>
    </nav>
  );
};

export default Navbar;