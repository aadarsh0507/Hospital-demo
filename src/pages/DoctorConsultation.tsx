import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Consultation, Prescription, Test } from '../types';
import { 
  User, 
  FileText, 
  Plus, 
  X, 
  Save, 
  Send,
  Stethoscope,
  Pill,
  TestTube,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentAppointment, 
    patients, 
    doctors, 
    addConsultation, 
    updateAppointment,
    medicines
  } = useApp();
  
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [followUp, setFollowUp] = useState('');
  const [loading, setLoading] = useState(false);

  const patient = currentAppointment ? patients.find(p => p.id === currentAppointment.patientId) : null;
  const doctor = currentAppointment ? doctors.find(d => d.id === currentAppointment.doctorId) : null;

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const updateSymptom = (index: number, value: string) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index] = value;
    setSymptoms(updatedSymptoms);
  };

  const removeSymptom = (index: number) => {
    if (symptoms.length > 1) {
      setSymptoms(symptoms.filter((_, i) => i !== index));
    }
  };

  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 1,
      price: 0
    };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: any) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index] = { ...updatedPrescriptions[index], [field]: value };
    setPrescriptions(updatedPrescriptions);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const addTest = () => {
    const newTest: Test = {
      id: Date.now().toString(),
      testName: '',
      category: '',
      price: 0,
      instructions: ''
    };
    setTests([...tests, newTest]);
  };

  const updateTest = (index: number, field: keyof Test, value: any) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setTests(updatedTests);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async () => {
    if (!currentAppointment || !patient || !doctor) return;

    setLoading(true);

    try {
      const consultation: Consultation = {
        id: Date.now().toString(),
        appointmentId: currentAppointment.id,
        patientId: patient.id,
        doctorId: doctor.id,
        diagnosis,
        symptoms: symptoms.filter(s => s.trim() !== ''),
        notes,
        prescriptions,
        tests,
        followUp: followUp || undefined,
        consultationFee: doctor.consultationFee,
        createdAt: new Date()
      };

      addConsultation(consultation);
      updateAppointment(currentAppointment.id, { status: 'Completed' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      navigate('/pharmacy');
    } catch (error) {
      console.error('Error saving consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentAppointment || !patient || !doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No active consultation. Please select a patient from the visit queue.</p>
        <button
          onClick={() => navigate('/doctor-visit')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Visit Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Consultation</h1>
        <p className="text-gray-600">
          Consultation for: <span className="font-semibold text-blue-600">{patient.name}</span> 
          with <span className="font-semibold text-green-600">Dr. {doctor.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">Contact:</label>
                <p className="text-gray-600">{patient.contact}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Type:</label>
                <p className="text-gray-600">{patient.type}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Appointment Time:</label>
                <p className="text-gray-600">{currentAppointment.timeSlot}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Reason for Visit:</label>
                <p className="text-gray-600">{currentAppointment.reason || 'Not specified'}</p>
              </div>

              {patient.medicalHistory && (
                <div>
                  <label className="font-medium text-gray-700">Medical History:</label>
                  <p className="text-gray-600 text-xs mt-1">{patient.medicalHistory}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnosis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Diagnosis</h3>
            </div>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter primary diagnosis..."
            />
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Symptoms</h3>
              </div>
              <button
                onClick={addSymptom}
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Symptom
              </button>
            </div>
            
            <div className="space-y-3">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => updateSymptom(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter symptom..."
                  />
                  {symptoms.length > 1 && (
                    <button
                      onClick={() => removeSymptom(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pill size={20} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
              </div>
              <button
                onClick={addPrescription}
                className="flex items-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Medicine #{index + 1}</h4>
                    <button
                      onClick={() => removePrescription(index)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                      <select
                        value={prescription.medicineName}
                        onChange={(e) => updatePrescription(index, 'medicineName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      >
                        <option value="">Select medicine...</option>
                        {medicines.map(medicine => (
                          <option key={medicine.id} value={medicine.name}>
                            {medicine.name} - ${medicine.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={prescription.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <select
                        value={prescription.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      >
                        <option value="">Select frequency...</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Four times daily">Four times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={prescription.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      value={prescription.instructions}
                      onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      placeholder="Special instructions for taking this medicine..."
                    />
                  </div>
                </div>
              ))}
              
              {prescriptions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No prescriptions added yet.</p>
              )}
            </div>
          </div>

          {/* Tests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TestTube size={20} className="text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recommended Tests</h3>
              </div>
              <button
                onClick={addTest}
                className="flex items-center px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Test
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={test.testName}
                      onChange={(e) => updateTest(index, 'testName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      placeholder="Test name..."
                    />
                    <input
                      type="text"
                      value={test.category}
                      onChange={(e) => updateTest(index, 'category', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      placeholder="Category..."
                    />
                    <input
                      type="number"
                      value={test.price}
                      onChange={(e) => updateTest(index, 'price', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      placeholder="Price..."
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    onClick={() => removeTest(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {tests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tests recommended yet.</p>
              )}
            </div>
          </div>

          {/* Notes and Follow-up */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes & Follow-up</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Additional observations, clinical notes, patient response..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Instructions</label>
                <textarea
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Next appointment recommendations, when to return if symptoms persist..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/doctor-visit')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConsultation}
              disabled={loading || !diagnosis.trim()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Complete Consultation
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultation;