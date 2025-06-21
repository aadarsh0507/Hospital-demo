import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, Patient, Doctor, Appointment, Consultation, Medicine, Bill } from '../types';
import { mockDoctors, mockMedicines, generateMockPatients, generateMockAppointments } from '../utils/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medicines] = useState<Medicine[]>(mockMedicines);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setPatients(generateMockPatients());
    setAppointments(generateMockAppointments());
  }, []);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedPatient } : p));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updatedAppointment } : a));
  };

  const addConsultation = (consultation: Consultation) => {
    setConsultations(prev => [...prev, consultation]);
  };

  const updateConsultation = (id: string, updatedConsultation: Partial<Consultation>) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...updatedConsultation } : c));
  };

  const addBill = (bill: Bill) => {
    setBills(prev => [...prev, bill]);
  };

  const updateBill = (id: string, updatedBill: Partial<Bill>) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updatedBill } : b));
  };

  return (
    <AppContext.Provider value={{
      patients,
      doctors,
      appointments,
      consultations,
      medicines,
      bills,
      currentPatient,
      currentAppointment,
      addPatient,
      updatePatient,
      addAppointment,
      updateAppointment,
      addConsultation,
      updateConsultation,
      addBill,
      updateBill,
      setCurrentPatient,
      setCurrentAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
};