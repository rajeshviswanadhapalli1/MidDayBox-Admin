"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Truck, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  CreditCard,
  Car,
  MapPin,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import Layout from "../../../../components/Layout";
import axios from "axios";
import { formatDetailDate } from "../../../../utils/dateUtils";

export default function DeliveryBoyDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params.id) {
      loadDeliveryBoyData();
    }
  }, [mounted, params.id]);

  const loadDeliveryBoyData = () => {
    try {
      setLoading(true);
      setError(null);

      // Get data from URL parameters
      const userDataParam = searchParams.get('data');
      
      if (userDataParam) {
        // Decode and parse the user data from URL
        const decodedData = decodeURIComponent(userDataParam);
        const userData = JSON.parse(decodedData);
        console.log(userData,'userData');
        
        setDeliveryBoy(userData);
      } else {
        // Fallback to mock data if no data in URL
        setDeliveryBoy({
          _id: params.id,
          name: "Rahul Kumar",
          email: "rahul.kumar@example.com",
          mobile: "9876543215",
          altMobile: "9876543216",
          vehicleType: "2 wheeler",
          vehicleNo: "MH01AB1234",
          drivingLicenceNumber: "DL1234567890123",
          adharNumber: "123456789012",
          adharFrontUrl: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Aadhaar+Front",
          adharBackUrl: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Aadhaar+Back",
          drivingLicenceFrontUrl: "https://via.placeholder.com/400x250/059669/FFFFFF?text=DL+Front",
          drivingLicenceBackUrl: "https://via.placeholder.com/400x250/059669/FFFFFF?text=DL+Back",
          isActive: true,
          isApproved: false,
          createdAt: "2025-01-15T11:15:00.000Z",
          updatedAt: "2025-01-15T11:15:00.000Z"
        });
      }
    } catch (error) {
      console.error('Error loading delivery boy data:', error);
      setError('Failed to load delivery boy data');
      
      // Fallback to mock data if parsing fails
      setDeliveryBoy({
        _id: params.id,
        name: "Rahul Kumar",
        email: "rahul.kumar@example.com",
        mobile: "9876543215",
        altMobile: "9876543216",
        vehicleType: "2 wheeler",
        vehicleNo: "MH01AB1234",
        drivingLicenceNumber: "DL1234567890123",
        adharNumber: "123456789012",
        adharFrontUrl: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Aadhaar+Front",
        adharBackUrl: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Aadhaar+Back",
        drivingLicenceFrontUrl: "https://via.placeholder.com/400x250/059669/FFFFFF?text=DL+Front",
        drivingLicenceBackUrl: "https://via.placeholder.com/400x250/059669/FFFFFF?text=DL+Back",
        isActive: true,
        isApproved: false,
        createdAt: "2025-01-15T11:15:00.000Z",
        updatedAt: "2025-01-15T11:15:00.000Z"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const token = localStorage.getItem('adminToken');
      
      await axios.patch(`https://api.middaybox.com/api/admin/delivery-boys/${params.id}/status`, {
        status: 'approved'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state
      setDeliveryBoy(prev => ({
        ...prev,
        isApproved: true,
        isActive: true
      }));

      alert('Delivery boy approved successfully!');
    } catch (error) {
      console.error('Error approving delivery boy:', error);
      alert('Failed to approve delivery boy');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setApproving(true);
      const token = localStorage.getItem('adminToken');
      
      await axios.patch(`https://api.middaybox.com/api/admin/delivery-boys/${params.id}/status`, {
        status: 'rejected'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state
      setDeliveryBoy(prev => ({
        ...prev,
        isApproved: false,
        isActive: false
      }));

      alert('Delivery boy rejected');
    } catch (error) {
      console.error('Error rejecting delivery boy:', error);
      alert('Failed to reject delivery boy');
    } finally {
      setApproving(false);
    }
  };

  const openImageInNewTab = (url) => {
    window.open(url, '_blank');
  };

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!deliveryBoy) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Boy Not Found</h3>
          <p className="text-gray-600">The requested delivery boy could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delivery Boy Details</h1>
              <p className="text-gray-600">View and manage delivery boy information</p>
            </div>
          </div>
          
          {/* Approval Actions */}
          <div className="flex items-center space-x-3">
            {deliveryBoy.approvalStatus === 'pending' ? (
              <>
                <button
                  onClick={handleReject}
                  disabled={approving}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {approving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </button>
              </>
            ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                deliveryBoy.approvalStatus === 'approved' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {deliveryBoy.approvalStatus === 'approved' ? "Approved" : "Rejected"}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{deliveryBoy.name}</h4>
                    <p className="text-sm text-gray-500">ID: {deliveryBoy._id}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{deliveryBoy.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{deliveryBoy.mobile}</span>
                  </div>
                  
                  {deliveryBoy.altMobile && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{deliveryBoy.altMobile} (Alt)</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Joined: {formatDetailDate(deliveryBoy.createdAt)}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deliveryBoy.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {deliveryBoy.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{deliveryBoy.vehicleType}</p>
                    <p className="text-sm text-gray-500">{deliveryBoy.vehicleNo}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">DL: {deliveryBoy.drivingLicenceNumber}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Aadhaar: {deliveryBoy.adharNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Aadhaar Card</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openImageInNewTab(deliveryBoy.adharFrontUrl)}
                      className="relative group"
                    >
                      <img
                        src={deliveryBoy.adharFrontUrl}
                        alt="Aadhaar Front"
                        className="w-full h-24 object-cover rounded border border-gray-200 group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                    <button
                      onClick={() => openImageInNewTab(deliveryBoy.adharBackUrl)}
                      className="relative group"
                    >
                      <img
                        src={deliveryBoy.adharBackUrl}
                        alt="Aadhaar Back"
                        className="w-full h-24 object-cover rounded border border-gray-200 group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Driving License</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openImageInNewTab(deliveryBoy.drivingLicenceFrontUrl)}
                      className="relative group"
                    >
                      <img
                        src={deliveryBoy.drivingLicenceFrontUrl}
                        alt="DL Front"
                        className="w-full h-24 object-cover rounded border border-gray-200 group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                    <button
                      onClick={() => openImageInNewTab(deliveryBoy.drivingLicenceBackUrl)}
                      className="relative group"
                    >
                      <img
                        src={deliveryBoy.drivingLicenceBackUrl}
                        alt="DL Back"
                        className="w-full h-24 object-cover rounded border border-gray-200 group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Registration Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Created:</strong> {formatDetailDate(deliveryBoy.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDetailDate(deliveryBoy.updatedAt)}</p>
                <p><strong>Approval Status:</strong> {deliveryBoy.isApproved ? "Approved" : "Pending"}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <Download className="inline h-4 w-4 mr-2" />
                  Download Documents
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Send Message
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <FileText className="inline h-4 w-4 mr-2" />
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 