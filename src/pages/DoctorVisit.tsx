import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Eye,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import Modal from '../components/common/Modal';

const DoctorVisit: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, patients, doctors, updateAppointment, setCurrentAppointment } = useApp();
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const todayAppointments = appointments.filter(
    appointment => appointment.date === new Date().toISOString().split('T')[0]
  ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const filteredAppointments = selectedStatus === 'all' 
    ? todayAppointments 
    : todayAppointments.filter(app => app.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'No Show': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'text-red-600';
      case 'Urgent': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled': return <Clock size={16} />;
      case 'In Progress': return <RefreshCw size={16} className="animate-spin" />;
      case 'Completed': return <CheckCircle size={16} />;
      case 'No Show': return <XCircle size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointment(appointmentId, { status: newStatus as any });
  };

  const handleStartConsultation = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    updateAppointment(appointment.id, { status: 'In Progress' });
    navigate('/consultation');
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setShowPatientModal(true);
  };

  const selectedPatientData = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;

  const statusCounts = {
    all: todayAppointments.length,
    Scheduled: todayAppointments.filter(a => a.status === 'Scheduled').length,
    'In Progress': todayAppointments.filter(a => a.status === 'In Progress').length,
    Completed: todayAppointments.filter(a => a.status === 'Completed').length,
    'No Show': todayAppointments.filter(a => a.status === 'No Show').length
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Visit Queue</h1>
          <p className="text-gray-600">Manage today's patient appointments</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Status</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All' : status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Queue */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const patient = patients.find(p => p.id === appointment.patientId);
            const doctor = doctors.find(d => d.id === appointment.doctorId);
            
            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {patient?.name || 'Unknown Patient'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
                            <span>{appointment.status}</span>
                          </div>
                        </span>
                        {appointment.priority !== 'Normal' && (
                          <div className="flex items-center space-x-1">
                            <AlertCircle size={16} className={getPriorityColor(appointment.priority)} />
                            <span className={`text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                              {appointment.priority}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Dr. {doctor?.name}</span>
                        <span>•</span>
                        <span>{appointment.timeSlot}</span>
                        <span>•</span>
                        <span>{patient?.age} years, {patient?.gender}</span>
                      </div>
                      
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewPatient(appointment.patientId)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Patient Details"
                    >
                      <Eye size={18} />
                    </button>

                    {appointment.status === 'Scheduled' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'In Progress')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        Mark In Progress
                      </button>
                    )}

                    {appointment.status === 'In Progress' && (
                      <button
                        onClick={() => handleStartConsultation(appointment)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                      >
                        Start Consultation
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    )}

                    {(appointment.status === 'Scheduled' || appointment.status === 'In Progress') && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Completed')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'No Show')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Mark No Show"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'No appointments scheduled for today.' 
                : `No appointments with status "${selectedStatus}".`}
            </p>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatientData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900 font-semibold">{selectedPatientData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="text-gray-900">{selectedPatientData.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-900">{selectedPatientData.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <p className="text-gray-900">{selectedPatientData.contact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900">{selectedPatientData.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <p className="text-gray-900">{selectedPatientData.emergencyContact || 'N/A'}</p>
              </div>
            </div>
            
            {selectedPatientData.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{selectedPatientData.address}</p>
              </div>
            )}
            
            {selectedPatientData.medicalHistory && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <p className="text-gray-900">{selectedPatientData.medicalHistory}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorVisit;