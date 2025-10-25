import React from 'react';

interface HeaderProps {
  eventName: string;
  tagline: string;
  date: string;
}

const Header: React.FC<HeaderProps> = ({ eventName, tagline, date }) => {
  return (
    <header className="relative text-center py-20 md:py-24 px-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="relative z-10">
        <div className="mb-8">
            <h3 className="text-lg md:text-xl text-gray-400 font-light">
                DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MANAGEMENT
            </h3>
            <h4 className="text-md md:text-lg text-gray-500">
                DEPARTMENT OF INFORMATION SCIENCE & ENGINEERING
            </h4>
            <p className="text-2xl text-teal-300 font-semibold mt-4">
                INNOVISIONS Presents
            </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          {eventName}
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
          "{tagline}"
        </p>
        <div className="mt-8 inline-block bg-teal-500/10 border border-teal-500/30 text-teal-300 font-semibold py-3 px-6 rounded-full shadow-lg">
          <span className="animate-pulse">📅</span> {date}
        </div>
      </div>
    </header>
  );
};

export default Header;
