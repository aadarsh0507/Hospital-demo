import { Doctor, Medicine, Patient, Appointment, User } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    qualification: 'MD, FACC',
    experience: 15,
    consultationFee: 500,
    rating: 4.8,
    availability: [
      { id: '1', startTime: '09:00', endTime: '12:00', isAvailable: true, date: '2024-01-15' },
      { id: '2', startTime: '14:00', endTime: '17:00', isAvailable: true, date: '2024-01-15' },
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Orthopedics',
    qualification: 'MS Ortho, FRCS',
    experience: 12,
    consultationFee: 450,
    rating: 4.7,
    availability: [
      { id: '3', startTime: '10:00', endTime: '13:00', isAvailable: true, date: '2024-01-15' },
      { id: '4', startTime: '15:00', endTime: '18:00', isAvailable: true, date: '2024-01-15' },
    ]
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    qualification: 'MD Pediatrics',
    experience: 8,
    consultationFee: 400,
    rating: 4.9,
    availability: [
      { id: '5', startTime: '08:00', endTime: '11:00', isAvailable: true, date: '2024-01-15' },
      { id: '6', startTime: '13:00', endTime: '16:00', isAvailable: true, date: '2024-01-15' },
    ]
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Internal Medicine',
    qualification: 'MD Internal Medicine',
    experience: 20,
    consultationFee: 350,
    rating: 4.6,
    availability: [
      { id: '7', startTime: '09:30', endTime: '12:30', isAvailable: true, date: '2024-01-15' },
      { id: '8', startTime: '14:30', endTime: '17:30', isAvailable: true, date: '2024-01-15' },
    ]
  }
];

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    manufacturer: 'PharmaCorp',
    price: 2.5,
    stock: 500,
    expiryDate: '2025-12-31',
    batchNumber: 'PC001'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    manufacturer: 'MediCare Ltd',
    price: 12.0,
    stock: 200,
    expiryDate: '2025-08-15',
    batchNumber: 'MC002'
  },
  {
    id: '3',
    name: 'Lisinopril 10mg',
    category: 'ACE Inhibitor',
    manufacturer: 'CardioMed',
    price: 15.5,
    stock: 150,
    expiryDate: '2025-10-20',
    batchNumber: 'CM003'
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    category: 'Antidiabetic',
    manufacturer: 'DiabeCare',
    price: 8.0,
    stock: 300,
    expiryDate: '2025-11-30',
    batchNumber: 'DC004'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'Admin',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'Doctor',
    permissions: ['consultation', 'prescription', 'reports']
  },
  {
    id: '3',
    name: 'Nurse Mary',
    email: 'mary@hospital.com',
    role: 'Nurse',
    permissions: ['patient_management', 'appointments']
  },
  {
    id: '4',
    name: 'Pharmacist John',
    email: 'john@hospital.com',
    role: 'Pharmacist',
    permissions: ['pharmacy', 'medicine_management']
  }
];

export const generateMockAppointments = (): Appointment[] => [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-15',
    timeSlot: '09:00-09:30',
    reason: 'Chest pain evaluation',
    status: 'Scheduled',
    priority: 'Urgent',
    createdAt: new Date()
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2024-01-15',
    timeSlot: '10:00-10:30',
    reason: 'Knee joint pain',
    status: 'In Progress',
    priority: 'Normal',
    createdAt: new Date()
  }
];

export const generateMockPatients = (): Patient[] => [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    contact: '+1-555-0123',
    email: 'john.doe@email.com',
    type: 'General',
    address: '123 Main St, City, State',
    emergencyContact: '+1-555-0124',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    contact: '+1-555-0125',
    email: 'jane.smith@email.com',
    type: 'Corporate',
    address: '456 Oak Ave, City, State',
    emergencyContact: '+1-555-0126',
    createdAt: new Date()
  }
];