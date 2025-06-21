import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bill } from '../types';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Download, 
  Check, 
  Smartphone,
  Banknote,
  Receipt,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { bills, patients, updateBill } = useApp();
  
  const [selectedBill, setSelectedBill] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Insurance'>('Cash');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  // Get pending bills
  const pendingBills = bills.filter(bill => bill.status === 'Pending');
  const selectedBillData = bills.find(bill => bill.id === selectedBill);
  const selectedPatient = selectedBillData ? 
    patients.find(p => p.id === selectedBillData.patientId) : null;

  const calculateBalance = () => {
    if (!selectedBillData) return 0;
    const paid = parseFloat(amountPaid) || 0;
    return selectedBillData.totalAmount - paid;
  };

  const handlePayment = () => {
    if (!selectedBillData || !amountPaid) return;
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedBillData) return;

    setLoading(true);

    try {
      const paidAmount = parseFloat(amountPaid);
      const newStatus = paidAmount >= selectedBillData.totalAmount ? 'Paid' : 'Partial';
      
      updateBill(selectedBillData.id, {
        paidAmount: selectedBillData.paidAmount + paidAmount,
        paymentMethod,
        status: newStatus
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setShowPaymentModal(false);
      setShowReceiptModal(true);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = () => {
    // In a real application, this would generate and download a PDF
    console.log('Generating PDF invoice for bill:', selectedBillData?.id);
    alert('PDF invoice would be generated and downloaded in a real application');
  };

  const handleNewPatient = () => {
    setShowReceiptModal(false);
    navigate('/patient-entry');
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <Banknote size={20} />;
      case 'Card': return <CreditCard size={20} />;
      case 'UPI': return <Smartphone size={20} />;
      case 'Insurance': return <FileText size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Checkout</h1>
        <p className="text-gray-600">Process payments and generate invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Bills */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Bills</h2>
            
            <div className="space-y-3">
              {pendingBills.map((bill) => {
                const patient = patients.find(p => p.id === bill.patientId);
                const isSelected = selectedBill === bill.id;
                
                return (
                  <div
                    key={bill.id}
                    onClick={() => setSelectedBill(bill.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Bill #{bill.id.slice(-6)}</span>
                          <span>•</span>
                          <span>{new Date(bill.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm mt-2">
                          {bill.consultationFee > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              Consultation: ${bill.consultationFee}
                            </span>
                          )}
                          {bill.medicineCharges > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              Medicine: ${bill.medicineCharges}
                            </span>
                          )}
                          {bill.testCharges > 0 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              Tests: ${bill.testCharges}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${bill.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {bill.status === 'Partial' && (
                            <span className="text-orange-600">
                              Paid: ${bill.paidAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          bill.status === 'Pending' ? 'bg-red-100 text-red-800' :
                          bill.status === 'Partial' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {pendingBills.length === 0 && (
                <div className="text-center py-8">
                  <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No pending bills</p>
                </div>
              )}
            </div>
          </div>

          {/* Bill Details */}
          {selectedBillData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Details</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedPatient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient?.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{selectedPatient?.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedPatient?.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bill Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bill ID:</span>
                      <span className="font-medium">#{selectedBillData.id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedBillData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedBillData.status === 'Pending' ? 'text-red-600' :
                        selectedBillData.status === 'Partial' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {selectedBillData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Charges Breakdown</h4>
                <div className="space-y-2">
                  {selectedBillData.consultationFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-medium">${selectedBillData.consultationFee.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedBillData.medicineCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Medicine Charges</span>
                      <span className="font-medium">${selectedBillData.medicineCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedBillData.testCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Test Charges</span>
                      <span className="font-medium">${selectedBillData.testCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-lg text-gray-900">
                        ${selectedBillData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {selectedBillData.paidAmount > 0 && (
                      <>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Amount Paid</span>
                          <span>-${selectedBillData.paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-red-600">
                          <span>Balance Due</span>
                          <span>${(selectedBillData.totalAmount - selectedBillData.paidAmount).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>

            {selectedBillData ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Cash', 'Card', 'UPI', 'Insurance'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {getPaymentMethodIcon(method)}
                        <span className="ml-2">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Pay
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="0.00"
                      min="0"
                      max={selectedBillData.totalAmount - selectedBillData.paidAmount}
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Balance Due:</span>
                    <span>${(selectedBillData.totalAmount - selectedBillData.paidAmount).toFixed(2)}</span>
                  </div>
                </div>

                {amountPaid && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Amount Paying:</span>
                      <span className="font-medium">${parseFloat(amountPaid).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining Balance:</span>
                      <span className={`font-medium ${calculateBalance() === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${calculateBalance().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!amountPaid || parseFloat(amountPaid) <= 0}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CreditCard size={16} className="mr-2" />
                  Process Payment
                </button>

                <button
                  onClick={generateInvoicePDF}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Download Invoice
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">Select a bill to process payment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`${paymentMethod} Payment`}
        size="md"
      >
        <div className="space-y-4">
          {paymentMethod === 'Card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'UPI' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@paytm"
              />
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount to Pay:</span>
              <span className="text-lg font-bold text-blue-600">
                ${parseFloat(amountPaid || '0').toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Payment Successful"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Processed Successfully!
            </h3>
            <p className="text-gray-600">
              Receipt has been generated for {selectedPatient?.name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">${parseFloat(amountPaid || '0').toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">
                {calculateBalance() === 0 ? 'Fully Paid' : 'Partially Paid'}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={generateInvoicePDF}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Download size={16} className="mr-2" />
              Download Receipt
            </button>
            <button
              onClick={handleNewPatient}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <User size={16} className="mr-2" />
              New Patient
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;