export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email?: string;
  address?: string;
  type: 'General' | 'Corporate';
  idProof?: File;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  availability: TimeSlot[];
  consultationFee: number;
  rating: number;
  image?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  date: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  priority: 'Normal' | 'Urgent' | 'Emergency';
  createdAt: Date;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  prescriptions: Prescription[];
  tests: Test[];
  followUp?: string;
  consultationFee: number;
  createdAt: Date;
}

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  price: number;
}

export interface Test {
  id: string;
  testName: string;
  category: string;
  price: number;
  instructions?: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  expiryDate: string;
  batchNumber: string;
}

export interface Bill {
  id: string;
  patientId: string;
  consultationFee: number;
  medicineCharges: number;
  testCharges: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Insurance';
  status: 'Pending' | 'Paid' | 'Partial';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Pharmacist' | 'Receptionist';
  permissions: string[];
}

export type AppContextType = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: Consultation[];
  medicines: Medicine[];
  bills: Bill[];
  currentPatient: Patient | null;
  currentAppointment: Appointment | null;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  addConsultation: (consultation: Consultation) => void;
  updateConsultation: (id: string, consultation: Partial<Consultation>) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  setCurrentAppointment: (appointment: Appointment | null) => void;
};