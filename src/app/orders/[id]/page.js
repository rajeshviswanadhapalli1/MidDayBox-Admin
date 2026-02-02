"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  User, 
  School, 
  Truck, 
  Calendar, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Navigation,
  Plus,
  Search,
  CreditCard,
  Building2
} from "lucide-react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { formatDetailDate, formatTableDate } from "../../../utils/dateUtils";

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params.id) {
      fetchOrderDetails();
    }
  }, [mounted, params.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`https://api.middaybox.com/api/admin/orders/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
      
      // Fallback to mock data if API fails
      setOrder({
        _id: params.id,
        orderNumber: "LUNCH202508010001",
        parentId: {
          _id: "688c9e945e395fc242319d69",
          name: "Rajesh Parent",
          email: "rajesh6v6@gmail.com",
          mobile: "9966305528"
        },
        parentAddressId: {
          _id: "688c9eee5e395fc242319d6f",
          parentName: "Rajesh Parent",
          studentName: "Sashmith",
          areaName: "Sanath nagar",
          cityName: "Hyderabad"
        },
        schoolId: {
          _id: "688c9f425e395fc242319d74",
          schoolName: "Gautami Vidya Dhamam School",
          areaName: "S. R. Nagar",
          cityName: "Hyderabad"
        },
        orderType: "30_days",
        startDate: "2025-08-01T00:00:00.000Z",
        endDate: "2025-08-31T00:00:00.000Z",
        deliveryTime: "12:30",
        distance: 1.1,
        basePrice: 1028,
        distanceCharge: 0,
        totalAmount: 21588,
        status: "active",
        paymentStatus: "pending",
        dailyDeliveries: [
          {
            date: "2025-08-01T00:00:00.000Z",
            status: "pending",
            _id: "688c9f4f5e395fc242319d7b"
          },
          {
            date: "2025-08-04T00:00:00.000Z",
            status: "pending",
            _id: "688c9f4f5e395fc242319d7c"
          }
        ],
        trackingHistory: [
          {
            action: "order_created",
            timestamp: "2025-08-01T11:04:47.638Z",
            notes: "Lunch box delivery order created successfully",
            _id: "688c9f4f5e395fc242319d92"
          }
        ],
        createdAt: "2025-08-01T11:04:47.573Z",
        updatedAt: "2025-08-01T11:04:47.641Z"
      });
    } finally {
      setLoading(false);
    }
  };

  // const fetchDeliveryBoys = async () => {
  //   try {
  //     const token = localStorage.getItem('adminToken');
  //     const response = await axios.get(`https://api.middaybox.com/api/admin/users?userType=deliveryboy&page=1&limit=50`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     setDeliveryBoys(response.data.data.deliveryBoys || []);
  //   } catch (error) {
  //     console.error('Error fetching delivery boys:', error);
  //     // Fallback to mock data
  //     setDeliveryBoys([
  //       {
  //         _id: "1",
  //         name: "Rahul Kumar",
  //         mobile: "9876543211",
  //         vehicleType: "2 wheeler",
  //         vehicleNo: "MH01AB1234",
  //         isActive: true
  //       },
  //       {
  //         _id: "2",
  //         name: "Amit Singh",
  //         mobile: "9876543212",
  //         vehicleType: "3 wheeler",
  //         vehicleNo: "MH01CD5678",
  //         isActive: true
  //       }
  //     ]);
  //   }
  // };

  const handleAssignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy) {
      alert('Please select a delivery boy');
      return;
    }

    try {
      setAssigning(true);
      const token = localStorage.getItem('adminToken');
      
      await axios.post(`https://api.middaybox.com/api/admin/orders/${params.id}/assign-delivery-boy`, {
        deliveryBoyId: selectedDeliveryBoy
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh order details
      await fetchOrderDetails();
      setShowAssignModal(false);
      setSelectedDeliveryBoy("");
      alert('Delivery boy assigned successfully!');
    } catch (error) {
      console.error('Error assigning delivery boy:', error);
      alert('Failed to assign delivery boy. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'paused':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayForSchoolColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600';
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const schoolPayment = order?.schoolPayment ?? {};
  const schoolAmount = order?.schoolPaymentAmount ?? schoolPayment?.amount ?? 0;
  const schoolPercent = order?.schoolPaymentPercent ?? schoolPayment?.percent;
  const payForSchoolStatus = order?.payForSchool ?? schoolPayment?.status;

  const filteredDeliveryBoys = deliveryBoys.filter(boy => 
    boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.mobile.includes(searchTerm) ||
    boy.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Order</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600">The requested order could not be found.</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="space-y-3">
        {/* Header with inline status badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-500">#{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {order.paymentStatus}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getPayForSchoolColor(payForSchoolStatus)}`}>
              {payForSchoolStatus === 'completed' ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              School {payForSchoolStatus || '—'}
              {(schoolAmount > 0 || schoolPercent != null) && (
                <span className="font-semibold">₹{Number(schoolAmount).toFixed(2)} ({schoolPercent}%)</span>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Order Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.orderType.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">
                      {formatTableDate(order.startDate)} - {formatTableDate(order.endDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">Delivery: {order.deliveryTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">Distance: {order.distance} km</span>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-700 mb-1.5">Payment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="text-gray-900">₹{order.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-gray-900">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    {(schoolAmount > 0 || schoolPercent != null) && (
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-600">School Share ({schoolPercent ?? '—'}%):</span>
                        <span className="text-gray-900 font-medium">₹{Number(schoolAmount).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customer</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order?.parentId?.name}</p>
                    <p className="text-sm text-gray-500">{order?.parentId?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{order?.parentId?.mobile}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-900">
                      {order.parentAddressId.areaName}, {order.parentAddressId.cityName}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 ml-7">
                    Student: {order.parentAddressId.studentName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School & Delivery Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-2">School & Delivery</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <School className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order?.schoolRegistrationId?.schoolName}</p>
                    <p className="text-sm text-gray-500">{order?.schoolRegistrationId?.address?.houseNo},{order?.schoolRegistrationId?.address?.landmark}</p>
                      <p className="text-sm text-gray-500">Unique Id : {order?.schoolUniqueId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {order?.schoolRegistrationId?.address?.areaName}, {order?.schoolRegistrationId?.address?.city}
                    </span>
                  </div>
                </div>

                {/* Delivery Boy */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Delivery Boy</h4>
                  {order.deliveryBoyId ? (
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.deliveryBoyId.name}</p>
                        <p className="text-sm text-gray-500">{order.deliveryBoyId.vehicleType} • {order.deliveryBoyId.vehicleNo}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Truck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No delivery boy assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Deliveries & Tracking - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Daily Deliveries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(order.dailyDeliveries || []).map((delivery, index) => (
                    <tr key={delivery._id || index}>
                      <td className="px-3 py-1.5 whitespace-nowrap text-gray-900 text-sm">
                        {formatTableDate(delivery.date)}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-gray-600 hidden sm:table-cell max-w-[140px] truncate text-sm" title={delivery.notes}>
                        {delivery.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Tracking History</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {(order.trackingHistory || []).map((tracking, index) => (
                <div key={tracking._id || index} className="flex items-start gap-2 py-0.5">
                  <div className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {tracking.action.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{tracking.notes}</p>
                    <p className="text-xs text-gray-400">{formatDetailDate(tracking.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Delivery Boy</h3>
            <p className="text-sm text-gray-500">Assign delivery boy modal (functionality disabled)</p>
          </div>
        </div>
      )}
    </Layout>
  );
} 