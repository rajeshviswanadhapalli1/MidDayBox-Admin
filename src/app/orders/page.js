"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Eye, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Calendar,
  User,
  Truck,
  DollarSign,
  MapPin,
  School
} from "lucide-react";
import Layout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import {
  setOrders,
  setOrdersLoading,
  setOrdersError,
  clearOrdersError,
} from "../../store/slices/apiSlice";
import { fetchOrders,setActiveTab } from "@/store/slices/ordersSlice";
import { formatTableDate } from "../../utils/dateUtils";
import { Tabs, Tab } from "@/components/tabs";
import PaySchoolModal from "@/components/PaySchoolModal";
export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders?.allOrders);
const {loading} = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
 const activeTab = useSelector((state) => state.orders.activeTab);
  const filters = useSelector((state) => state.orders.filters);
  const [search, setSearch] = useState(filters.search);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) loadOrders();
  }, [
    mounted,
    currentPage,
    statusFilter,
    paymentStatusFilter,
    orderTypeFilter,
    startDate,
    endDate,
    activeTab 
  ]);

  const loadOrders = async () => {
    try {
      dispatch(setOrdersLoading(true));
      dispatch(clearOrdersError());

      const params = {
        page: currentPage,
        limit: ordersPerPage,
        search: searchTerm || undefined,
        // status: statusFilter !== "all" ? statusFilter : undefined,
        status: activeTab === "active" ? "active" : "completed",
        paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
        orderType: orderTypeFilter !== "all" ? orderTypeFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        schoolOpened: true,
      };

      const result = await dispatch(fetchOrders(params)).unwrap();

      dispatch(
        setOrders({
          orders: result.orders,
          pagination: result.pagination,
        })
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      dispatch(setOrdersError("Failed to load orders"));

      // fallback mock
      const mockData = {
        orders: [
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

      dispatch(setOrders(mockData));
    } finally {
      dispatch(setOrdersLoading(false));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
// const orders?.orders = useMemo(() => {
//     let data = orders?.orders || [];
//     console.log(orders,'orders in completed page');
    
//     // Filter by tab
//     if (activeTab === "active") {
//       data = data?.filter((o) => o.status !== "completed");
//     } else {
//       data = data?.filter((o) => o.status === "completed");
//     }

//     // Search filter
//     if (search.trim()) {
//       data = data.filter((o) =>
//         o.customerName?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     return data;
//   }, [orders, activeTab, search]);
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setOrderTypeFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleViewDetails = (order) => {
    router.push(`/orders/${order._id}`);
  };

 const StatusBadge = ({ status }) => {
    const statusConfig = {
      "active": { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Active" },
      "completed": { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
      "cancelled": { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
      "paused": { color: "bg-yellow-100 text-yellow-800", icon: Package, label: "Paused" },
    };

    const config = statusConfig[status] || statusConfig["active"];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    );
  };
   const PayForSchoolStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending"
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Completed"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </span>
  );
};
const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
      "paid": { color: "bg-green-100 text-green-800", label: "Paid" },
      "pending": { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "failed": { color: "bg-red-100 text-red-800", label: "Failed" },
    };

    const config = statusConfig[status] || statusConfig["pending"];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const OrderTypeBadge = ({ type }) => {
    const typeConfig = {
      "today": { color: "bg-green-100 text-green-800", label: "Today" },
      "15_days": { color: "bg-blue-100 text-blue-800", label: "15 Days" },
      "30_days": { color: "bg-purple-100 text-purple-800", label: "30 Days" },
      "7_days": { color: "bg-orange-100 text-orange-800", label: "7 Days" },
    };

    const config = typeConfig[type] || typeConfig["15_days"];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
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
  const handlePayForSchool = async(order) => {
    await setOpen(true)
    await setSelectedOrder(order)
  }
console.log(orders, 'orders.pagination');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage all delivery orders</p>
        </div>
    <div>
   
    </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders by order number, parent name, or school..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div> */}
               
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  showFilters
                    ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Payment Status
                  </label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  >
                    <option value="all">All Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Order Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline h-4 w-4 mr-1" />
                    Order Type
                  </label>
                  <select
                    value={orderTypeFilter}
                    onChange={(e) => handleFilterChange('orderType', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  >
                    <option value="all">All Types</option>
                    <option value="7_days">7 Days</option>
                    <option value="15_days">15 Days</option>
                    <option value="30_days">30 Days</option>
                  </select>
                </div>

                {/* School Filter */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="inline h-4 w-4 mr-1" />
                    School
                  </label>
                  <input
                    type="text"
                    placeholder="Search by school name..."
                    value={schoolFilter}
                    onChange={(e) => handleFilterChange('school', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  />
                </div> */}

                {/* Parent Filter */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Parent
                  </label>
                  <input
                    type="text"
                    placeholder="Search by parent name..."
                    value={parentFilter}
                    onChange={(e) => handleFilterChange('parent', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  />
                </div> */}

                {/* Date Range */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {/* {orders.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-red-400">⚠️</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{orders.error}</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Orders Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden pt-2">
          <Tabs
                active={activeTab}
                onChange={(val) => {
                  setCurrentPage(1);
                  dispatch(setActiveTab(val));
                }}
              >
                <Tab label="Active Orders" value="active" />
                <Tab label="Completed Orders" value="completed" />
              </Tabs>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay For School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
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
                ) : orders?.orders?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your search criteria or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders?.orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">
                              <OrderTypeBadge type={order.orderType} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order?.parentId?.name}</div>
                        <div className="text-sm text-gray-500">{order?.parentId?.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.schoolRegistrationId?.schoolName}</div>
                        <div className="text-sm text-gray-500">{order.schoolRegistrationId?.schoolUniqueId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.deliveryBoyId ? order.deliveryBoyId.name : "Unassigned"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.deliveryTime} • {order.distance}km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{order.totalAmount}</div>
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="text-sm font-medium text-gray-900">{order.payForSchool}</div> */}
                        <PayForSchoolStatusBadge status={order.payForSchool} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTableDate(order.createdAt)}</div>
                        <div className="text-sm text-gray-500">
                          {formatTableDate(order.startDate)} - {formatTableDate(order.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleViewDetails(order)} className="bg-blue-600 text-xs text-white p-2 rounded-md hover:text-white" title="View Details">
                            View Details
                          </button>
                          {order.status === 'completed' && order.payForSchool === 'pending' &&
                          <button onClick={() => handlePayForSchool(order)} className="bg-green-600 text-xs text-white p-2 rounded-md hover:text-white" title="Pay for School">
                            Pay for School
                          </button>}
                          
                          {/* <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button> */}
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
        {!orders.loading && orders?.orders?.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={!orders.pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(orders.pagination.totalPages, currentPage + 1))}
                disabled={!orders.pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{orders.pagination.showingFrom}</span> to{" "}
                  <span className="font-medium">{orders.pagination.showingTo}</span> of{" "}
                  <span className="font-medium">{orders.pagination.totalOrders}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={!orders.pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: orders.pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => handlePageChange(Math.min(orders.pagination.totalPages, currentPage + 1))}
                    disabled={!orders.pagination.hasNextPage}
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
      <PaySchoolModal
        open={open}
        setOpen={setOpen}
        selectedOrderId={selectedOrder}
      />
    </Layout>
  );
}
