import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Clock,
  UserCheck,
  AlertCircle,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { patients, appointments, consultations, bills } = useApp();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: <Users size={24} />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Today\'s Appointments',
      value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      icon: <Calendar size={24} />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Consultations',
      value: consultations.length,
      icon: <UserCheck size={24} />,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Revenue Today',
      value: `$${bills.reduce((sum, bill) => sum + bill.totalAmount, 0).toFixed(2)}`,
      icon: <DollarSign size={24} />,
      color: 'bg-orange-500',
      change: '+25%'
    }
  ];

  const todayAppointments = appointments
    .filter(a => a.date === new Date().toISOString().split('T')[0])
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={12} className="text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
            <Activity size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {patient?.name.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name || 'Unknown Patient'}</p>
                        <p className="text-sm text-gray-500">{appointment.timeSlot}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.priority === 'Urgent' && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Activity size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New patient registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Consultation completed</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;