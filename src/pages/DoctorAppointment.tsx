import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Appointment, Doctor } from '../types';
import { Calendar, Clock, Star, User, ArrowRight, Search, Filter } from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, currentPatient, addAppointment, setCurrentAppointment } = useApp();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const generateTimeSlots = (doctor: Doctor) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + 30;
        const endTimeSlot = endMinute >= 60 
          ? `${(hour + 1).toString().padStart(2, '0')}:${(endMinute - 60).toString().padStart(2, '0')}`
          : `${hour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        slots.push(`${timeSlot}-${endTimeSlot}`);
      }
    }
    return slots;
  };

  const handleBookAppointment = () => {
    if (!currentPatient || !selectedDoctor || !selectedSlot) return;
    
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    if (!currentPatient || !selectedDoctor || !selectedSlot) return;
    
    setLoading(true);
    
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: currentPatient.id,
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
        status: 'Scheduled',
        priority,
        createdAt: new Date()
      };
      
      addAppointment(newAppointment);
      setCurrentAppointment(newAppointment);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowConfirmation(false);
      navigate('/doctor-visit');
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPatient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No patient selected. Please register a patient first.</p>
        <button
          onClick={() => navigate('/patient-entry')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register Patient
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600">
          Booking for: <span className="font-semibold text-blue-600">{currentPatient.name}</span>
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="md:w-48">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedDoctor?.id === doctor.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500">{doctor.qualification}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{doctor.experience} years</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Consultation Fee</span>
                <span className="font-semibold text-gray-900">${doctor.consultationFee}</span>
              </div>

              {selectedDoctor?.id === doctor.id && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Available Time Slots</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {generateTimeSlots(doctor).slice(0, 12).map((slot) => (
                      <button
                        key={slot}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlot(slot);
                        }}
                        className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Details */}
      {selectedDoctor && selectedSlot && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Describe the reason for this appointment..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleBookAppointment}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Book Appointment
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Appointment"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Appointment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{currentPatient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className={`font-medium ${
                  priority === 'Emergency' ? 'text-red-600' : 
                  priority === 'Urgent' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {priority}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-semibold text-gray-900">${selectedDoctor?.consultationFee}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmBooking}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorAppointment;