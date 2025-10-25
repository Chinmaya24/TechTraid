import React from 'react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onKnowMore: (id: string) => void;
  onRegister: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onKnowMore, onRegister }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 shadow-lg h-full">
      <div className="mb-6 bg-gray-900 p-4 rounded-full border-2 border-gray-700">
        {event.icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
        {event.title}
      </h3>
      <p className="text-gray-400 mb-6 flex-grow">"{event.description}"</p>
      
      <div className="mt-auto flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => onKnowMore(event.id)}
          className="bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 font-semibold py-2 px-6 rounded-full border border-teal-500/30 transition-colors duration-300"
        >
          View Details
        </button>
        <button 
          onClick={() => onRegister(event)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-lg hover:shadow-blue-500/30"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
