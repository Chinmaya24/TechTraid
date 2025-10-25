import React, { useState, useEffect, FormEvent } from 'react';
import type { Event } from '../types';

interface RegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

// --- IMPORTANT ---
// To make this form work, you need to set up a Google Apps Script.
// 1. Create a new Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the server-side script content (provided in comments below) and deploy it.
// 4. Get the Web App URL and paste it here.
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
/*
// --- Google Apps Script Content (doPost function) ---
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registrations');
      sheet.appendRow(['Timestamp', 'Event', 'Team Name', 'Participant 1', 'Participant 2', 'Participant 3', 'Participant 4', 'Contact Email', 'Contact Phone', 'Transaction ID', 'Screenshot Link']);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Handle the file upload
    var fileData = data.screenshot.split(',');
    var contentType = fileData[0].match(/:(.*?);/)[1];
    var decodedData = Utilities.base64Decode(fileData[1]);
    var blob = Utilities.newBlob(decodedData, contentType, data.screenshotName);
    
    // Create a folder to store screenshots if it doesn't exist
    var folder;
    var folders = DriveApp.getFoldersByName('EventRegistrations');
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder('EventRegistrations');
    }
    
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();

    var newRow = [
      new Date(),
      data.event,
      data.teamName,
      data.participants[0] || '',
      data.participants[1] || '',
      data.participants[2] || '',
      data.participants[3] || '',
      data.contactEmail,
      data.contactPhone,
      data.transactionId,
      fileUrl
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
*/

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';
interface FormData {
  teamName: string;
  participants: string[];
  contactEmail: string;
  contactPhone: string;
  transactionId: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ event, isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    participants: [''],
    contactEmail: '',
    contactPhone: '',
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const resetState = () => {
    setFormData({
      teamName: '',
      participants: [''],
      contactEmail: '',
      contactPhone: '',
      transactionId: '',
    });
    setScreenshot(null);
    setIsConfirming(false);
    setSubmissionStatus('idle');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData((prev) => ({ ...prev, participants: newParticipants }));
  };
  
  const addParticipant = () => {
    if (formData.participants.length < 4) {
      setFormData(prev => ({ ...prev, participants: [...prev.participants, ''] }));
    }
  };

  const removeParticipant = (index: number) => {
    if (formData.participants.length > 1) {
      const newParticipants = formData.participants.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, participants: newParticipants }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };
  
  const handleReview = (e: FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!screenshot || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      setErrorMessage(GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ? 'Setup is incomplete. Please add a valid Google Apps Script URL.' : 'Payment screenshot is required.');
      setSubmissionStatus('error');
      setIsConfirming(false);
      return;
    }

    setSubmissionStatus('submitting');
    
    try {
        const screenshotBase64 = await fileToBase64(screenshot);
        
        const payload = {
            event: event.title,
            ...formData,
            screenshot: screenshotBase64,
            screenshotName: screenshot.name,
        };

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Use 'no-cors' for basic requests to Apps Script from client-side
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        // As we use 'no-cors', we can't inspect the response. We assume success if the request doesn't throw.
        // For a more robust solution, you'd need a proper API or a different deployment method for the script.
        setSubmissionStatus('success');

    } catch (error: any) {
        console.error('Submission Error:', error);
        setErrorMessage(error.message || 'Failed to submit form. Please try again.');
        setSubmissionStatus('error');
    }
  };

  if (!isOpen) return null;
  
  const renderContent = () => {
    switch(submissionStatus) {
      case 'success':
        return (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-white">Registration Successful!</h2>
            <p className="text-gray-400 mt-2">Thank you for registering for the {event.title}. You will receive a confirmation email shortly. Please check your inbox and spam folder.</p>
            <button onClick={handleClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">Done</button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-white">Submission Failed</h2>
            <p className="text-gray-400 mt-2">{errorMessage}</p>
            <div className="mt-6 flex gap-4">
              <button onClick={() => setSubmissionStatus('idle')} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">Try Again</button>
              <button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">Close</button>
            </div>
          </div>
        );
      case 'submitting':
      case 'idle':
        if (isConfirming) {
          return (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Review Your Details</h3>
              <div className="space-y-3 text-gray-300 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <p><strong>Event:</strong> {event.title}</p>
                <p><strong>Team Name:</strong> {formData.teamName}</p>
                <p><strong>Participants:</strong></p>
                <ul className="list-disc list-inside pl-4">{formData.participants.map((p, i) => <li key={i}>{p}</li>)}</ul>
                <p><strong>Contact Email:</strong> {formData.contactEmail}</p>
                <p><strong>Contact Phone:</strong> {formData.contactPhone}</p>
                <p><strong>Transaction ID:</strong> {formData.transactionId}</p>
                <p><strong>Screenshot:</strong> {screenshot?.name}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setIsConfirming(false)} disabled={submissionStatus === 'submitting'} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-full transition-colors duration-300">Go Back & Edit</button>
                <button onClick={handleSubmit} disabled={submissionStatus === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors duration-300 flex justify-center items-center">
                  {submissionStatus === 'submitting' ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          );
        }
        // The main form
        return (
          <form onSubmit={handleReview}>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Register for {event.title}
            </h2>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4">
              {/* Team and Participant Details */}
              <input type="text" name="teamName" value={formData.teamName} onChange={handleInputChange} placeholder="Team Name" required className="w-full bg-gray-900/50 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="space-y-2">
                {formData.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={p} onChange={(e) => handleParticipantChange(i, e.target.value)} placeholder={`Participant ${i + 1} Name`} required className="w-full bg-gray-900/50 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {formData.participants.length > 1 && <button type="button" onClick={() => removeParticipant(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">&times;</button>}
                  </div>
                ))}
                {formData.participants.length < 4 && <button type="button" onClick={addParticipant} className="text-sm text-blue-400 hover:underline">Add Participant</button>}
              </div>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="Contact Email" required className="w-full bg-gray-900/50 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} placeholder="Contact Phone" required className="w-full bg-gray-900/50 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              {/* Payment Details */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-teal-300">Payment Instructions</h3>
                <p className="text-sm text-gray-400 mb-4">Pay <span className="font-bold">{event.details.registrationFee}</span> using the QR code below, then upload the screenshot and enter the Transaction ID.</p>
                <div className="flex justify-center mb-4">
                  <img src="https://placehold.co/200x200/1B2735/FFFFFF?text=UPI+QR+Code" alt="UPI QR Code" className="rounded-lg" />
                </div>
                <input type="text" name="transactionId" value={formData.transactionId} onChange={handleInputChange} placeholder="UTR / Transaction ID" required className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                <label className="block w-full text-center cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg border border-gray-500">
                  <span>{screenshot ? `Selected: ${screenshot.name}` : 'Upload Payment Screenshot'}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} required className="hidden" />
                </label>
              </div>
            </div>
            <button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">Submit Registration</button>
          </form>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700/50 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default RegistrationModal;
