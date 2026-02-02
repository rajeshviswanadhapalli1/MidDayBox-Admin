"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchOrders } from "@/store/slices/ordersSlice";
import { schoolPaymentAPI, pricingAPI } from "@/services/apiService";
import { apiHelper } from "@/services/apiService";

const DEFAULT_SCHOOL_PAYMENT_PERCENT = 2;

const PAYMENT_METHODS = {
  UPI: "UPI",
  BANK_TRANSFER: "bank_transfer",
};

export default function PaySchoolModal({ open, setOpen, selectedOrderId }) {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.UPI);
  const [formData, setFormData] = useState({
    description: "",
    recipientName: "",
    recipientUpiId: "",
    upiTransactionId: "",
    bankReference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const schoolId = selectedOrderId?.schoolRegistrationId?._id;
  const orderIds = selectedOrderId ? [selectedOrderId._id] : [];
  const [schoolPaymentPercent, setSchoolPaymentPercent] = useState(DEFAULT_SCHOOL_PAYMENT_PERCENT);

  // Fetch schoolPaymentPercent from pricing when modal opens
  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const res = await pricingAPI.getPricing();
        const data = apiHelper.handleResponse(res);
        const pricing = data?.pricing ?? data;
        const percent = typeof pricing?.schoolPaymentPercent === "number"
          ? pricing.schoolPaymentPercent
          : DEFAULT_SCHOOL_PAYMENT_PERCENT;
        setSchoolPaymentPercent(percent);
      } catch {
        setSchoolPaymentPercent(DEFAULT_SCHOOL_PAYMENT_PERCENT);
      }
    };
    load();
  }, [open]);

  // Calculated school share of parent paid amount (read-only, disabled in UI)
  const parentPaidAmount = selectedOrderId?.totalAmount ?? selectedOrderId?.amount ?? 0;
  const calculatedAmount = useMemo(() => {
    if (!selectedOrderId) return 0;
    const fromApi = selectedOrderId?.schoolAmount ?? selectedOrderId?.amountDue;
    if (fromApi != null && fromApi !== "") return Number(fromApi);
    return Math.round((parentPaidAmount * schoolPaymentPercent) / 100 * 100) / 100;
  }, [selectedOrderId, parentPaidAmount, schoolPaymentPercent]);

  // Pre-fill from school/order when modal opens
  useEffect(() => {
    if (!open || !selectedOrderId) return;
    const school = selectedOrderId?.schoolRegistrationId;
    setFormData((prev) => ({
      ...prev,
      recipientName: school?.contactName ?? prev.recipientName,
      recipientUpiId: school?.upiId ?? prev.recipientUpiId,
    }));
    setError(null);
  }, [open, selectedOrderId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const buildPayload = () => {
    const base = {
      orderIds,
      schoolId,
      amount: calculatedAmount,
      paymentMethod,
      description: formData.description || undefined,
    };
    if (paymentMethod === PAYMENT_METHODS.UPI) {
      return {
        ...base,
        recipientName: formData.recipientName,
        recipientUpiId: formData.recipientUpiId,
        upiTransactionId: formData.upiTransactionId || undefined,
      };
    }
    return {
      ...base,
      recipientName: formData.recipientName,
      bankReference: formData.bankReference,
    };
  };

  const validate = () => {
    if (!calculatedAmount || calculatedAmount <= 0) {
      setError("No amount to pay for this order.");
      return false;
    }
    if (!schoolId || !orderIds.length) {
      setError("Missing order or school. Please close and try again.");
      return false;
    }
    if (!formData.recipientName?.trim()) {
      setError("Recipient name is required.");
      return false;
    }
    if (paymentMethod === PAYMENT_METHODS.UPI) {
      if (!formData.recipientUpiId?.trim()) {
        setError("Recipient UPI ID is required for UPI.");
        return false;
      }
    } else {
      if (!formData.bankReference?.trim()) {
        setError("Bank reference (NEFT/IMPS UTR) is required for bank transfer.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = buildPayload();
      const response = await schoolPaymentAPI.recordSchoolPayment(payload);
      const data = apiHelper.handleResponse(response);
      if (data?.success) {
        await dispatch(fetchOrders({ params: {} })).unwrap();
        setOpen(false);
      }
    } catch (err) {
      apiHelper.handleError(err);
      const message =
        err.response?.data?.message || err.message || "Failed to record school payment.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isUpi = paymentMethod === PAYMENT_METHODS.UPI;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-[fadeIn_.25s_ease-out,scaleIn_.25s_ease-out]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Record School Payment ({schoolPaymentPercent}%)
        </h2>

        {/* Payment method */}
        <div className="flex flex-col space-y-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Payment method *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === PAYMENT_METHODS.UPI}
                onChange={() => setPaymentMethod(PAYMENT_METHODS.UPI)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">UPI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === PAYMENT_METHODS.BANK_TRANSFER}
                onChange={() => setPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Bank transfer</span>
            </label>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Amount ({schoolPaymentPercent}% of parent paid) *</label>
              <input
                type="number"
                readOnly
                disabled
                value={calculatedAmount}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-500">
                Parent paid: ₹{parentPaidAmount} → {schoolPaymentPercent}% = ₹{calculatedAmount}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Recipient name *</label>
              <input
                type="text"
                placeholder="Recipient full name"
                value={formData.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 text-sm"
              />
            </div>
          </div>

          {isUpi && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Recipient UPI ID *</label>
                <input
                  type="text"
                  placeholder="example@upi"
                  value={formData.recipientUpiId}
                  onChange={(e) => handleChange("recipientUpiId", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">UPI transaction ID</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={formData.upiTransactionId}
                  onChange={(e) => handleChange("upiTransactionId", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>
            </div>
          )}

          {!isUpi && (
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Bank reference (NEFT/IMPS UTR) *</label>
              <input
                type="text"
                placeholder="e.g. NEFT123456789012"
                value={formData.bankReference}
                onChange={(e) => handleChange("bankReference", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 text-sm"
              />
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              placeholder="Optional note"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 text-sm"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-1/2 border border-gray-300 text-gray-900 rounded-lg py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-1/2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Record payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
