import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import EventDetails from './components/EventDetails';
import Sponsors from './components/Sponsors';
import RegistrationModal from './components/RegistrationModal'; // Import the new modal component
import ScrollToTopButton from './components/ScrollToTopButton';
import type { Event } from './types';

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const events: Event[] = [
  {
    id: 'ideathon',
    title: 'Ideathon',
    description: 'INNOVATION STARTS HERE!',
    icon: <LightbulbIcon />,
    details: {
      longDescription: 'Use your creativity, research, and critical thinking skills to develop innovative concepts and business models.',
      themes: [
        'Smart City and Urban Development',
        'Smart Manufacturing-IOT and Automation',
        'EduTech-AI driven Learning solutions',
        'AI in Healthcare',
        'Safe and Secure Banking Application through Cyber Security',
        'Open Theme: To solve a real world problem',
      ],
      howItWorks: [
        'All participants must adhere to a code of conduct promoting respect, inclusivity, and professionalism.',
        'Ideation sessions will have specific activities or challenges with a dedicated Pitching Session.',
        'Proposed solutions must be original and should not violate any intellectual property rights.',
        'Evaluation will be based on creativity, feasibility, market potential, clarity of the pitch, and overall uniqueness of the concept.',
        'Meals (Lunch) as well as snacks will be provided for registered participants in the duration of the ideathon.'
      ],
      teamSize: '2-4 Members',
      registrationFee: '₹200 / Team',
      prize: { total: '₹22,000', winner: '₹15,000', runner: '₹7,000' },
      contact: { phones: ['+91 7760822596', '+91 6300628364'], email: 'iseinnovisions@gmail.com' }
    }
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    description: 'PUSH LIMITS, SOLVE PROBLEMS, AND SHOWCASE YOUR CODING GENIUS.',
    icon: <CodeIcon />,
    details: {
      longDescription: 'Use your creativity and coding skills to develop innovative solutions. Problem statements will be revealed at the start of the hackathon.',
      guidelines: [
        '12 Hour Hackathon',
        'Bring fully charged laptops'
      ],
      howItWorks: [
        'All participants must adhere to a code of conduct promoting respect, inclusivity, and professionalism.',
        'The format will be announced at the start of the event. All code must be written during the competition period.',
        'Applications developed must be original and should not violate any intellectual property rights.',
        'Evaluation will be based on creativity, uniqueness, design, and overall execution.',
        'Meals (breakfast and lunch) as well as snacks will be provided for registered participants in the duration of hackathon.'
      ],
      teamSize: '2-4 Members',
      registrationFee: '₹300 / Team',
      prize: { total: '₹40,000', winner: '₹30,000', runner: '₹10,000' },
      contact: { phones: ['+91 8431614069', '+91 9446114441'], email: 'iseinnovisions@gmail.com' }
    }
  },
  {
    id: 'datathon',
    title: 'Datathon',
    description: 'MODEL THE FUTURE. SOLVE WITH INSIGHT WIN.',
    icon: <ChartBarIcon />,
    details: {
      longDescription: 'Use your creativity and coding skills to develop innovative data solutions. Problem Statements and associated data will be revealed at the start of the event.',
      guidelines: [
        '12 Hour Datathon',
        'Bring fully charged laptops with extensions'
      ],
      howItWorks: [
        'All code must be written during the competition period and applications developed must be original.',
        'Solutions must be original and should not violate any intellectual property rights.',
        'The precise format will be announced at the start of the event.',
        'All participants must adhere to a Code of Conduct promoting respect, inclusivity, and professionalism.',
        'Judging will be based on creativity, uniqueness, design, and overall execution.',
        'Meals (breakfast and lunch) and snacks will be provided for all registered participants throughout the event\'s duration.'
      ],
      teamSize: '2-4 Members',
      registrationFee: '₹150 / Team',
      prize: { total: '₹15,000', winner: '₹10,000', runner: '₹5,000' },
      contact: { phones: ['+91 7760822596', '+91 6300628364'], email: 'iseinnovisions@gmail.com' }
    }
  },
];

const sponsors = [
    { name: 'Synolase', logoUrl: 'https://placehold.co/150x80/1B2735/FFFFFF?text=Synolase' },
    { name: 'JPQ TECH BOOTCAMP', logoUrl: 'https://placehold.co/150x80/1B2735/FFFFFF?text=JPQ+TECH' },
    { name: 'smart Desert', logoUrl: 'https://placehold.co/150x80/1B2735/FFFFFF?text=smart+Desert' },
    { name: 'unacademy', logoUrl: 'https://placehold.co/150x80/1B2735/FFFFFF?text=unacademy' },
    { name: 'IMPERIAL Overseas', logoUrl: 'https://placehold.co/150x80/1B2735/FFFFFF?text=IMPERIAL' },
];

const App: React.FC = () => {
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollToDetail = (id: string) => {
    detailRefs.current[id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleOpenRegistration = (event: Event) => {
    setModalEvent(event);
  };
  
  const handleCloseRegistration = () => {
    setModalEvent(null);
  };
  
  const handleScrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (scrollContainer) {
        setShowScrollButton(scrollContainer.scrollTop > 300);
      }
    };

    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const eventInfo = {
    date: '12TH NOVEMBER 2025',
    venue: 'A- BLOCK SEMINAR HALL'
  };

  return (
    <div ref={scrollContainerRef} className="min-h-screen font-sans relative z-10 h-screen overflow-y-auto">
      <Header
        eventName="TECH TRIAD 2025"
        tagline="SPARK CREATIVITY, DRIVE POSSIBILITY"
        date={eventInfo.date}
      />
      
      <main className="container mx-auto px-6 py-16">
        <section id="events" className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onKnowMore={handleScrollToDetail} onRegister={handleOpenRegistration} />
            ))}
          </div>
        </section>

        <section id="details" className="space-y-20 mb-20">
          {events.map((event) => (
             <div key={event.id} ref={(el) => (detailRefs.current[event.id] = el)}>
               <EventDetails event={event} venue={eventInfo.venue} date={eventInfo.date} onRegister={handleOpenRegistration} />
             </div>
          ))}
        </section>

        <Sponsors sponsors={sponsors} />
      </main>

      <footer className="text-center py-8 border-t border-gray-700/50">
        <p>&copy; {new Date().getFullYear()} Innovisions, DSATM. All rights reserved.</p>
      </footer>

      <ScrollToTopButton isVisible={showScrollButton} onClick={handleScrollToTop} />

      {modalEvent && (
        <RegistrationModal 
          event={modalEvent}
          isOpen={!!modalEvent}
          onClose={handleCloseRegistration}
        />
      )}
    </div>
  );
};

export default App;