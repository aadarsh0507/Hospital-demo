import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Prescription, Bill } from '../types';
import { 
  Pill, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  AlertTriangle,
  Package,
  DollarSign,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Pharmacy: React.FC = () => {
  const navigate = useNavigate();
  const { consultations, patients, medicines, addBill } = useApp();
  
  const [selectedConsultation, setSelectedConsultation] = useState<string>('');
  const [cart, setCart] = useState<{ [key: string]: { prescription: Prescription; quantity: number } }>({});
  const [showBillModal, setShowBillModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');

  // Get consultations with prescriptions
  const consultationsWithPrescriptions = consultations.filter(c => c.prescriptions.length > 0);
  
  // Filter consultations based on search and status
  const filteredConsultations = consultationsWithPrescriptions.filter(consultation => {
    const patient = patients.find(p => p.id === consultation.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    // For demo purposes, we'll consider consultations as "pending" if they don't have a corresponding bill
    const isPending = true; // In real app, check if pharmacy bill exists
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'pending' && isPending) ||
                         (filterStatus === 'completed' && !isPending);
    
    return matchesSearch && matchesStatus;
  });

  const selectedConsultationData = consultations.find(c => c.id === selectedConsultation);
  const selectedPatient = selectedConsultationData ? 
    patients.find(p => p.id === selectedConsultationData.patientId) : null;

  const addToCart = (prescription: Prescription) => {
    setCart(prev => ({
      ...prev,
      [prescription.id]: {
        prescription,
        quantity: prev[prescription.id]?.quantity || prescription.quantity || 1
      }
    }));
  };

  const updateQuantity = (prescriptionId: string, change: number) => {
    setCart(prev => {
      const current = prev[prescriptionId];
      if (!current) return prev;
      
      const newQuantity = Math.max(1, current.quantity + change);
      return {
        ...prev,
        [prescriptionId]: {
          ...current,
          quantity: newQuantity
        }
      };
    });
  };

  const removeFromCart = (prescriptionId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[prescriptionId];
      return newCart;
    });
  };

  const getMedicineStock = (medicineName: string) => {
    const medicine = medicines.find(m => m.name.toLowerCase().includes(medicineName.toLowerCase()));
    return medicine?.stock || 0;
  };

  const getMedicinePrice = (medicineName: string) => {
    const medicine = medicines.find(m => m.name.toLowerCase().includes(medicineName.toLowerCase()));
    return medicine?.price || 0;
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      const price = getMedicinePrice(item.prescription.medicineName);
      return total + (price * item.quantity);
    }, 0);
  };

  const handleGenerateBill = async () => {
    if (!selectedConsultationData || Object.keys(cart).length === 0) return;

    setLoading(true);

    try {
      const medicineCharges = calculateTotal();
      
      const bill: Bill = {
        id: Date.now().toString(),
        patientId: selectedConsultationData.patientId,
        consultationFee: 0, // Already paid during consultation
        medicineCharges,
        testCharges: 0, // Tests handled separately
        totalAmount: medicineCharges,
        paidAmount: 0,
        paymentMethod: 'Cash',
        status: 'Pending',
        createdAt: new Date()
      };

      addBill(bill);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowBillModal(true);
    } catch (error) {
      console.error('Error generating bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    setShowBillModal(false);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
        <p className="text-gray-600">Manage prescriptions and medicine dispensing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultations List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Prescriptions</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredConsultations.map((consultation) => {
                const patient = patients.find(p => p.id === consultation.patientId);
                const isSelected = selectedConsultation === consultation.id;
                
                return (
                  <div
                    key={consultation.id}
                    onClick={() => setSelectedConsultation(consultation.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {consultation.prescriptions.length} prescription(s) • 
                          {new Date(consultation.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">{consultation.diagnosis}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                        <Pill size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredConsultations.length === 0 && (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No pending prescriptions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Prescription Details */}
          {selectedConsultationData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescription Details</h3>
                <span className="text-sm text-gray-500">
                  Patient: {selectedPatient?.name}
                </span>
              </div>

              <div className="space-y-4">
                {selectedConsultationData.prescriptions.map((prescription) => {
                  const stock = getMedicineStock(prescription.medicineName);
                  const price = getMedicinePrice(prescription.medicineName);
                  const inCart = cart[prescription.id];
                  
                  return (
                    <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{prescription.medicineName}</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span> {prescription.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {prescription.duration}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {prescription.quantity}
                            </div>
                          </div>
                          {prescription.instructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Instructions:</span> {prescription.instructions}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2">
                              <DollarSign size={16} className="text-green-600" />
                              <span className="text-sm font-medium">${price.toFixed(2)} each</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                              <Package size={16} />
                              <span className="text-sm font-medium">
                                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {stock > 0 ? (
                            inCart ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(prescription.id, -1)}
                                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                                  {inCart.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(prescription.id, 1)}
                                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                >
                                  <Plus size={16} />
                                </button>
                                <button
                                  onClick={() => removeFromCart(prescription.id)}
                                  className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(prescription)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <ShoppingCart size={16} className="mr-2" />
                                Add to Cart
                              </button>
                            )
                          ) : (
                            <div className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                              <AlertTriangle size={16} className="mr-2" />
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medicine Cart</h3>
              <ShoppingCart size={20} className="text-gray-400" />
            </div>

            {Object.keys(cart).length > 0 ? (
              <div className="space-y-4">
                {Object.values(cart).map(({ prescription, quantity }) => {
                  const price = getMedicinePrice(prescription.medicineName);
                  const total = price * quantity;
                  
                  return (
                    <div key={prescription.id} className="border-b border-gray-200 pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {prescription.medicineName}
                          </h4>
                          <p className="text-xs text-gray-600">{prescription.dosage}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              ${price.toFixed(2)} × {quantity}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleGenerateBill}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Generating Bill...
                      </>
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        Generate Bill
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">Cart is empty</p>
                <p className="text-gray-400 text-xs mt-1">
                  Select a prescription and add medicines to cart
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Generation Modal */}
      <Modal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        title="Pharmacy Bill Generated"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bill Generated Successfully!
            </h3>
            <p className="text-gray-600">
              Medicine bill has been created for {selectedPatient?.name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Patient:</span>
              <span className="font-medium">{selectedPatient?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Items:</span>
              <span className="font-medium">{Object.keys(cart).length}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowBillModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Proceed to Checkout
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Pharmacy;