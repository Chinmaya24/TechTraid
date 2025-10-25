import React from 'react';

interface Sponsor {
  name: string;
  logoUrl: string;
}

interface SponsorsProps {
  sponsors: Sponsor[];
}

const Sponsors: React.FC<SponsorsProps> = ({ sponsors }) => {
  return (
    <section id="sponsors" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
        Our Sponsors
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
        {sponsors.map((sponsor) => (
          <div 
            key={sponsor.name} 
            className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 w-full h-32 flex items-center justify-center text-center transition-all duration-300 hover:bg-gray-700/60 hover:border-teal-500/50"
          >
            <img 
              src={sponsor.logoUrl} 
              alt={`${sponsor.name} Logo`} 
              className="max-h-16 max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sponsors;
