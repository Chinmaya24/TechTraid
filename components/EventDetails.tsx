import React from 'react';
import type { Event } from '../types';

interface EventDetailsProps {
  event: Event;
  venue: string;
  date: string;
  onRegister: (event: Event) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h4 className="text-xl font-semibold text-teal-300 mb-4 border-b-2 border-teal-500/30 pb-2">{title}</h4>
    {children}
  </div>
);

const EventDetails: React.FC<EventDetailsProps> = ({ event, venue, date, onRegister }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 md:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b-2 border-gray-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            {event.title}
          </h2>
          <p className="text-gray-400 mt-2 text-lg">"{event.description}"</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
            <p className="font-semibold text-teal-300">{date}</p>
            <p className="text-gray-400">{venue}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-8">
          <DetailSection title="About the Event">
            <p className="text-gray-300 leading-relaxed">{event.details.longDescription}</p>
          </DetailSection>

          {event.details.themes && (
            <DetailSection title="Themes">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {event.details.themes.map((theme, index) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </DetailSection>
          )}

          {event.details.guidelines && (
            <DetailSection title="Guidelines">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {event.details.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </DetailSection>
          )}

           <DetailSection title="How It Works">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {event.details.howItWorks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </DetailSection>
        </div>

        <div className="space-y-8">
            <DetailSection title="Event Info">
                <div className="space-y-3 text-gray-300">
                    <p><strong>Team Size:</strong> {event.details.teamSize}</p>
                    <p><strong>Registration Fee:</strong> {event.details.registrationFee}</p>
                </div>
            </DetailSection>

            <DetailSection title="Prize Pool">
                <div className="space-y-3 text-gray-300">
                    <p><strong>Total Prize:</strong> <span className="font-bold text-yellow-400">{event.details.prize.total}</span></p>
                    <p><strong>Winner:</strong> {event.details.prize.winner}</p>
                    <p><strong>Runner Up:</strong> {event.details.prize.runner}</p>
                </div>
            </DetailSection>

            <DetailSection title="Contact">
                 <div className="space-y-2 text-gray-300">
                    <p>
                        <strong>Phone:</strong> {event.details.contact.phones.join(' / ')}
                    </p>
                    <p>
                        <strong>Email:</strong> <a href={`mailto:${event.details.contact.email}`} className="text-blue-400 hover:underline">{event.details.contact.email}</a>
                    </p>
                </div>
            </DetailSection>

            <div className="mt-12 text-center">
                 <button 
                    onClick={() => onRegister(event)}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition-colors duration-300 shadow-lg hover:shadow-blue-500/30 text-lg"
                    >
                    Register for {event.title}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
