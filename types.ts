// Fix: Import React to provide the React.ReactNode type.
import type React from 'react';

export interface Event {
  id: string;
  title: string;
  description: string; // The short tagline for the card, e.g., "INNOVATION STARTS HERE !"
  icon: React.ReactNode;
  details: {
    longDescription: string;
    themes?: string[];
    guidelines?: string[];
    howItWorks: string[];
    teamSize: string;
    registrationFee: string;
    prize: {
      total: string;
      winner: string;
      runner: string;
    };
    contact: {
      phones: string[];
      email: string;
    };
  };
}
