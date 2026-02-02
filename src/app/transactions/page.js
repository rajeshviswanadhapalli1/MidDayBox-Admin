"use client";

import { useState, useEffect } from "react";
import {
  Receipt,
  Package,
  User,
  School,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../../components/Layout";
import { Tabs, Tab } from "@/components/tabs";
import { transactionsAPI, pricingAPI } from "@/services/apiService";
import { apiHelper } from "@/services/apiService";
import { formatTableDate } from "../../utils/dateUtils";

const TRANSACTION_TYPES = {
  PARENT: "parent",
  SCHOOL: "school",
};

function StatusBadge({ status }) {
  const styles = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  const cls = styles[status] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}
    >
      {status || "—"}
    </span>
  );
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState(TRANSACTION_TYPES.PARENT);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [schoolPaymentPercent, setSchoolPaymentPercent] = useState(2);
  const limit = 10;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const load = async () => {
      try {
        const res = await pricingAPI.getPricing();
        const data = apiHelper.handleResponse(res);
        const pricing = data?.pricing ?? data;
        if (typeof pricing?.schoolPaymentPercent === "number") {
          setSchoolPaymentPercent(pricing.schoolPaymentPercent);
        }
      } catch {
        /* keep default 2 */
      }
    };
    load();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    loadTransactions();
  }, [mounted, activeTab, pagination.currentPage]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit,
        transactionType: activeTab,
      };
      const res = await transactionsAPI.getTransactions(params);
      const data = res.data;
      if (data?.success && data?.transactions) {
        setTransactions(data.transactions);
        setPagination((prev) => ({
          ...prev,
          ...(data.pagination || {}),
        }));
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Transactions load error:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const isParent = activeTab === TRANSACTION_TYPES.PARENT;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            View parent payments and school ({schoolPaymentPercent}%) payments.
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden pt-2">
          <Tabs active={activeTab} onChange={handleTabChange}>
            <Tab label="Parent Transactions" value={TRANSACTION_TYPES.PARENT} />
            <Tab label="School Transactions" value={TRANSACTION_TYPES.SCHOOL} />
          </Tabs>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isParent ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order(s)
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment method
                  </th>
                  {!isParent && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank reference
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </td>
                      {!isParent && (
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-28" />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isParent ? 6 : 7}
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-gray-500">
                        <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">No transactions found</p>
                        <p className="text-sm">
                          {isParent
                            ? "No parent payment transactions yet."
                            : "No school payment transactions yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-gray-50">
                      {isParent ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {txn.orderId?.orderNumber ?? "—"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {txn.orderId?.orderType ?? ""}{" "}
                                  {txn.orderId?.totalAmount != null &&
                                    `₹${txn.orderId.totalAmount}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {txn.parentId?.name ?? "—"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {txn.parentId?.mobile ?? txn.parentId?.email ?? ""}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <School className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {txn.schoolId?.schoolName ?? "—"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {txn.schoolId?.contactName ?? ""}{" "}
                                  {txn.schoolId?.mobile ?? ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Array.isArray(txn.orderIds) && txn.orderIds.length > 0
                                ? txn.orderIds
                                    .map((o) => o?.orderNumber ?? o)
                                    .join(", ")
                                : txn.orderId?.orderNumber ?? "—"}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{txn.amount ?? "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 capitalize">
                          {txn.paymentMethod?.replace("_", " ") ?? "—"}
                        </span>
                      </td>
                      {!isParent && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {txn.bankReference ?? "—"}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTableDate(txn.completedAt ?? txn.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && transactions.length > 0 && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page{" "}
                    <span className="font-medium">{pagination.currentPage}</span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalPages}</span>{" "}
                    (
                    <span className="font-medium">
                      {pagination.totalTransactions}
                    </span>{" "}
                    transactions)
                  </p>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
