"use client";

import { useState, useEffect, useMemo } from "react";

import Layout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";

import {
  setActiveTab,
  updateFilters,
  fetchOrders,
} from "../../store/slices/ordersSlice";
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
import { Tabs, Tab } from "@/components/tabs";
import { formatTableDate, formatDetailDate } from "../../utils/dateUtils";
export default function CompletedOrdersPage() {
 const orders = useSelector((state) => state.orders.allOrders || []);
  const activeTab = useSelector((state) => state.orders.activeTab);
  const filters = useSelector((state) => state.orders.filters);
const dispatch = useDispatch();
//   const [activeTab, setActiveTab] = useState("active");
  const [search, setSearch] = useState(filters.search);
 useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  // Filter Based on Tab + Search
  const filteredOrders = useMemo(() => {
    let data = orders?.orders || [];
    console.log(orders,'orders in completed page');
    
    // Filter by tab
    if (activeTab === "active") {
      data = data?.filter((o) => o.status !== "completed");
    } else {
      data = data?.filter((o) => o.status === "completed");
    }

    // Search filter
    if (search.trim()) {
      data = data.filter((o) =>
        o.customerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [orders, activeTab, search]);
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
  return (
    <Layout>
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">

      {/* Tabs */}
     <Tabs
  active={activeTab}
  onChange={(val) => {
    dispatch(setActiveTab(val));
  }}
>
  <Tab label="Active Orders" value="active" />
  <Tab label="Completed Orders" value="completed" />
</Tabs>
     

    
       <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.loading ? (
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
                      ) : filteredOrders.length === 0 ? (
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
                        filteredOrders.map((order) => (
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
                                <button onClick={() => handleViewDetails(order)} className="text-blue-600 hover:text-blue-900" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </button>
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
    </div>
    </Layout>
  );
} 