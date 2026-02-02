"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, Users, Package, School, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "../../components/Layout";
import { setStats } from "../../store/slices/apiSlice";
import axios from "axios";
import { formatRelativeDate } from "../../utils/dateUtils";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.api);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('https://api.middaybox.com/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { stats: dashboardStats, recentOrders: orders } = response.data;
        
        // Update Redux store with stats
        dispatch(setStats({
          orders: dashboardStats.totalOrders,
          users: dashboardStats.totalParents + dashboardStats.totalDeliveryBoys,
          schools: dashboardStats.totalSchools,
          activeOrders: dashboardStats.activeOrders,
          completedOrders: dashboardStats.completedOrders,
          todayOrders: dashboardStats.todayOrders,
        }));

        // Set recent orders
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        
        // Fallback to mock data if API fails
        dispatch(setStats({
          orders: 150,
          users: 35,
          schools: 15,
          activeOrders: 45,
          completedOrders: 95,
          todayOrders: 8,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "..." : value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'paused':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your delivery system</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={stats.orders || 0}
            icon={Package}
            color="bg-blue-500"
            subtitle={`${stats.activeOrders || 0} active`}
          />
          <StatCard
            title="Total Users"
            value={stats.users || 0}
            icon={Users}
            color="bg-green-500"
            subtitle="Parents & Delivery Boys"
          />
          <StatCard
            title="Schools"
            value={stats.schools || 0}
            icon={School}
            color="bg-purple-500"
          />
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders || 0}
            icon={TrendingUp}
            color="bg-orange-500"
            subtitle="New orders today"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        order.status === 'active' ? 'bg-blue-400' : 
                        order.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order?.parentId?.name} • {order?.schoolId?.schoolName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View All Orders</p>
                    <p className="text-xs text-gray-500">Manage and track orders</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Manage Users</p>
                    <p className="text-xs text-gray-500">Parents and delivery boys</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <School className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">School Settings</p>
                    <p className="text-xs text-gray-500">Configure school information</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 