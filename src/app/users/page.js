"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye, User, Truck, Phone, Mail, Calendar } from "lucide-react";
import Layout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { setUsers, setUsersLoading, setUsersError, clearUsersError } from "../../store/slices/apiSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatTableDate } from "../../utils/dateUtils";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("delivery-boys");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector((state) => state.api);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchUsers();
    }
  }, [mounted, activeTab, currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      dispatch(setUsersLoading(true));
      dispatch(clearUsersError());

      const token = localStorage.getItem('adminToken');
      const userType = activeTab === "delivery-boys" ? "deliveryboy" : "parent";
      
      const response = await axios.get(`https://middaybox-backend.onrender.com/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userType,
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm || undefined
        }
      });

      const { data, pagination } = response.data;
      
      dispatch(setUsers({
        parents: userType === "parent" ? data.parents : [],
        deliveryBoys: userType === "deliveryboy" ? data.deliveryBoys : [],
        totalParents: data.totalParents,
        totalDeliveryBoys: data.totalDeliveryBoys,
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          totalItems: pagination.totalItems,
          itemsPerPage: pagination.itemsPerPage,
          showingFrom: pagination.showingFrom,
          showingTo: pagination.showingTo,
        }
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(setUsersError('Failed to load users'));
      
      // Fallback to mock data if API fails
      const mockData = {
        parents: [
          { _id: 1, name: "John Doe", email: "john@example.com", mobile: "9876543210", createdAt: "2025-01-15T10:30:00.000Z" },
          { _id: 2, name: "Jane Smith", email: "jane@example.com", mobile: "9876543211", createdAt: "2025-01-14T15:45:00.000Z" },
        ],
        deliveryBoys: [
          { _id: 1, name: "Rahul Kumar", email: "rahul@example.com", mobile: "9876543212", vehicleType: "2 wheeler", isActive: true, createdAt: "2025-01-15T11:15:00.000Z" },
          { _id: 2, name: "Amit Singh", email: "amit@example.com", mobile: "9876543213", vehicleType: "3 wheeler", isActive: true, createdAt: "2025-01-14T16:30:00.000Z" },
        ],
        totalParents: 25,
        totalDeliveryBoys: 10,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalItems: 35,
          itemsPerPage: 10,
          showingFrom: 1,
          showingTo: 10,
        }
      };
      
      dispatch(setUsers(mockData));
    } finally {
      dispatch(setUsersLoading(false));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (user) => {
    if (activeTab === "delivery-boys") {
      // Encode the user data and pass it as a URL parameter
      const userData = encodeURIComponent(JSON.stringify(user));
      router.push(`/users/delivery-boy/${user._id}?data=${userData}`);
    }
  };

  const currentUsers = activeTab === "delivery-boys" ? users.deliveryBoys : users.parents;
  const totalPages = users.pagination.totalPages;

  const StatusBadge = ({ status, isActive }) => {
    if (activeTab === "delivery-boys") {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    }
    return null;
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage delivery boys and parents</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("delivery-boys")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "delivery-boys"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Delivery Boys ({users.totalDeliveryBoys})
            </button>
            <button
              onClick={() => handleTabChange("parents")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "parents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Parents ({users.totalParents})
            </button>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab === "delivery-boys" ? "delivery boys" : "parents"}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
         
        </div>

        {/* Error Message */}
        {users.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-red-400">⚠️</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{users.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  {activeTab === "delivery-boys" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      {activeTab === "delivery-boys" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                    </tr>
                  ))
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "delivery-boys" ? 7 : 6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">No {activeTab === "delivery-boys" ? "delivery boys" : "parents"} found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    console.log(user),
                    
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.mobile}
                        </div>
                      </td>
                      {activeTab === "delivery-boys" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Truck className="h-4 w-4 mr-2 text-gray-400" />
                            {user.vehicleType} • {user.vehicleNo}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} isActive={user.isActive} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatTableDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {activeTab === "delivery-boys" && (
                            <button 
                              onClick={() => handleViewDetails(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!users.loading && currentUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={!users.pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={!users.pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{users.pagination.showingFrom}</span> to{" "}
                  <span className="font-medium">{users.pagination.showingTo}</span> of{" "}
                  <span className="font-medium">{users.pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={!users.pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={!users.pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 