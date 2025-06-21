import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  User,
  DollarSign,
  Activity,
  TrendingUp,
  Eye,
  BarChart3,
  PieChart
} from 'lucide-react';
import Modal from '../components/common/Modal';

const Reports: React.FC = () => {
  const { patients, appointments, consultations, bills, doctors } = useApp();
  const { hasPermission } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'consultations' | 'financial' | 'appointments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Calculate statistics
  const stats = {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    totalConsultations: consultations.length,
    totalRevenue: bills.reduce((sum, bill) => sum + bill.totalAmount, 0),
    averageConsultationFee: consultations.length > 0 
      ? consultations.reduce((sum, c) => sum + c.consultationFee, 0) / consultations.length 
      : 0,
    pendingBills: bills.filter(b => b.status === 'Pending').length
  };

  // Filter data based on date range
  const filterByDateRange = (items: any[], dateField: string) => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const filteredConsultations = filterByDateRange(consultations, 'createdAt').filter(consultation => {
    const patient = patients.find(p => p.id === consultation.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
  });

  const filteredBills = filterByDateRange(bills, 'createdAt').filter(bill => {
    const patient = patients.find(p => p.id === bill.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
  });

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);
    
    const patient = patients.find(p => p.id === appointment.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesDate = appointmentDate >= startDate && appointmentDate <= endDate;
    
    return matchesSearch && matchesDate;
  });

  const handleViewDetails = (record: any, type: string) => {
    setSelectedRecord({ ...record, type });
    setShowDetailModal(true);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!hasPermission('reports') && !hasPermission('all')) {
      alert('You do not have permission to export reports');
      return;
    }
    
    // In a real application, this would generate and download a CSV file
    console.log('Exporting to CSV:', filename, data);
    alert(`${filename} would be exported to CSV in a real application`);
  };

  const generatePDF = (data: any[], title: string) => {
    if (!hasPermission('reports') && !hasPermission('all')) {
      alert('You do not have permission to generate PDF reports');
      return;
    }
    
    // In a real application, this would generate and download a PDF
    console.log('Generating PDF:', title, data);
    alert(`${title} PDF report would be generated in a real application`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'patients', label: 'Patients', icon: <User size={16} /> },
    { id: 'consultations', label: 'Consultations', icon: <FileText size={16} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={16} /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign size={16} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive reporting and data analysis</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Patients</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalPatients}</p>
                    </div>
                    <User size={24} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Consultations</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalConsultations}</p>
                    </div>
                    <Activity size={24} className="text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Avg. Consultation</p>
                      <p className="text-2xl font-bold text-orange-900">${stats.averageConsultationFee.toFixed(2)}</p>
                    </div>
                    <TrendingUp size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <PieChart size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Demographics</h3>
                  <p className="text-gray-600">Chart visualization would be implemented here</p>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Trends</h3>
                  <p className="text-gray-600">Chart visualization would be implemented here</p>
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToCSV(filteredPatients, 'patients')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => generatePDF(filteredPatients, 'Patient Records')}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Age</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Gender</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Registered</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{patient.name}</td>
                        <td className="py-3 px-4 text-gray-600">{patient.age}</td>
                        <td className="py-3 px-4 text-gray-600">{patient.gender}</td>
                        <td className="py-3 px-4 text-gray-600">{patient.contact}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.type === 'Corporate' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewDetails(patient, 'patient')}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Consultation Records</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToCSV(filteredConsultations, 'consultations')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => generatePDF(filteredConsultations, 'Consultation Records')}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Doctor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Diagnosis</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Fee</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map((consultation) => {
                      const patient = patients.find(p => p.id === consultation.patientId);
                      const doctor = doctors.find(d => d.id === consultation.doctorId);
                      
                      return (
                        <tr key={consultation.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{patient?.name}</td>
                          <td className="py-3 px-4 text-gray-600">Dr. {doctor?.name}</td>
                          <td className="py-3 px-4 text-gray-600">{consultation.diagnosis}</td>
                          <td className="py-3 px-4 text-gray-600">${consultation.consultationFee}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(consultation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewDetails(consultation, 'consultation')}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Records</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToCSV(filteredAppointments, 'appointments')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => generatePDF(filteredAppointments, 'Appointment Records')}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Doctor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      const doctor = doctors.find(d => d.id === appointment.doctorId);
                      
                      return (
                        <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{patient?.name}</td>
                          <td className="py-3 px-4 text-gray-600">Dr. {doctor?.name}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{appointment.timeSlot}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                              appointment.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewDetails(appointment, 'appointment')}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Financial Records</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToCSV(filteredBills, 'financial')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => generatePDF(filteredBills, 'Financial Records')}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Bill ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Paid</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Balance</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => {
                      const patient = patients.find(p => p.id === bill.patientId);
                      
                      return (
                        <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{patient?.name}</td>
                          <td className="py-3 px-4 text-gray-600">#{bill.id.slice(-6)}</td>
                          <td className="py-3 px-4 text-gray-600">${bill.totalAmount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">${bill.paidAmount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">
                            ${(bill.totalAmount - bill.paidAmount).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              bill.status === 'Partial' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewDetails(bill, 'bill')}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`${selectedRecord?.type?.charAt(0).toUpperCase() + selectedRecord?.type?.slice(1)} Details`}
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            {selectedRecord.type === 'patient' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedRecord.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <p className="text-gray-900">{selectedRecord.age} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-gray-900">{selectedRecord.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="text-gray-900">{selectedRecord.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedRecord.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registered</label>
                  <p className="text-gray-900">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedRecord.address && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{selectedRecord.address}</p>
                  </div>
                )}
                {selectedRecord.medicalHistory && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Medical History</label>
                    <p className="text-gray-900">{selectedRecord.medicalHistory}</p>
                  </div>
                )}
              </div>
            )}

            {selectedRecord.type === 'consultation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient</label>
                    <p className="text-gray-900">
                      {patients.find(p => p.id === selectedRecord.patientId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                    <p className="text-gray-900">
                      Dr. {doctors.find(d => d.id === selectedRecord.doctorId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-gray-900">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fee</label>
                    <p className="text-gray-900">${selectedRecord.consultationFee}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <p className="text-gray-900">{selectedRecord.diagnosis}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                  <p className="text-gray-900">{selectedRecord.symptoms.join(', ')}</p>
                </div>
                {selectedRecord.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Add similar detail views for other record types */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;