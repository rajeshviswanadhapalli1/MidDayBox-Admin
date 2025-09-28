"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Save, Plus, Trash2, IndianRupee, Percent, Tag } from "lucide-react";
import Layout from "../../components/Layout";
import { pricingAPI, apiHelper } from "../../services/apiService";
import toast from 'react-hot-toast';

const DEFAULT_TIERS = [
  { label: "0-2 km", price: 25 },
  { label: "2-3 km", price: 30 },
  { label: "3-4 km", price: 35 },
  { label: "4-6 km", price: 45 },
];

const schema = yup
  .object({
    gstPercent: yup
      .number()
      .typeError("GST must be a number")
      .min(0, "GST cannot be negative")
      .max(100, "GST cannot exceed 100%")
      .required("GST is required"),
    boxPrice: yup
      .number()
      .typeError("Price for one box must be a number")
      .min(0, "Price for one box cannot be negative")
      .required("Price for one box is required"),
    tiers: yup
      .array()
      .of(
        yup.object({
          label: yup.string().trim().required("Label is required"),
          price: yup
            .number()
            .typeError("Price must be a number")
            .min(0, "Price cannot be negative")
            .required("Price is required"),
        })
      )
      .min(1, "At least one tier is required"),
  })
  .required();

export default function PricesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { gstPercent: 3, boxPrice: 25, tiers: DEFAULT_TIERS },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tiers" });

  const formValues = watch();

  useEffect(() => {
    let isMounted = true;
    const fetchPricing = async () => {
      try {
        setIsFetching(true);
        const response = await pricingAPI.getPricing();
        console.log('API Response:', response);
        const data = apiHelper.handleResponse(response);
        console.log('Processed data:', data);
        
        if (!isMounted) return;

        // More flexible data handling - check for different possible structures
        let normalized = {
          gstPercent: 3,
          boxPrice: 25,
          tiers: DEFAULT_TIERS,
        };

        // Try to extract data from different possible response structures
        if (data) {
          // Check if data has the expected structure
          if (typeof data.gstPercent === "number") {
            normalized.gstPercent = data.gstPercent;
          }
          if (typeof data.boxPrice === "number") {
            normalized.boxPrice = data.boxPrice;
          }
          if (Array.isArray(data.tiers) && data.tiers.length > 0) {
            normalized.tiers = data.tiers;
          }
          
          // Check if data is directly the pricing object
          if (data.pricing) {
            if (typeof data.pricing.gstPercent === "number") {
              normalized.gstPercent = data.pricing.gstPercent;
            }
            if (typeof data.pricing.boxPrice === "number") {
              normalized.boxPrice = data.pricing.boxPrice;
            }
            if (Array.isArray(data.pricing.tiers) && data.pricing.tiers.length > 0) {
              normalized.tiers = data.pricing.tiers;
            }
          }
          
          // Check if data has individual fields at root level
          if (data.gst && typeof data.gst === "number") {
            normalized.gstPercent = data.gst;
          }
          if (data.price && typeof data.price === "number") {
            normalized.boxPrice = data.price;
          }
          if (data.distanceTiers && Array.isArray(data.distanceTiers)) {
            normalized.tiers = data.distanceTiers;
          }
        }

        console.log('Normalized data:', normalized);
        reset(normalized);
      } catch (err) {
        console.error('Error fetching pricing:', err);
        // Fallback to defaults already set
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };
    fetchPricing();
    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const saved = await pricingAPI.updatePricing(values).then(apiHelper.handleResponse);
      toast.success("Pricing updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to update pricing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const gstMultiplier = useMemo(() => 1 + (Number(formValues.gstPercent || 0) / 100), [formValues.gstPercent]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
            <p className="text-gray-600">Define distance-based price tiers, per box, and GST</p>
          </div>
          <button
            type="button"
            onClick={() => reset({ gstPercent: 3, boxPrice: 25, tiers: DEFAULT_TIERS })}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset to defaults
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tiers Editor */}
            <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">Distance-based Tiers</h3>
                {/* <p className="text-sm text-gray-500">Add labels like "0-2 km" and set the price per box in ₹</p> */}
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-12 text-xs font-medium text-gray-500">
                  <div className="col-span-6">Label</div>
                  {/* <div className="col-span-4">Price per box (₹)</div> */}
                  {/* <div className="col-span-2 text-right">Actions</div> */}
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-6">
                        <div className="relative">
                          <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            {...register(`tiers.${index}.label`)}
                            type="text"
                            disabled
                            placeholder="e.g. 0-2 km"
                            className="pl-9 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                          />
                        </div>
                        {errors.tiers?.[index]?.label && (
                          <p className="mt-1 text-xs text-red-600">{errors.tiers[index].label.message}</p>
                        )}
                      </div>

                      <div className="col-span-4">
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            {...register(`tiers.${index}.price`)}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="25"
                            className="pl-9 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                          />
                        </div>
                        {errors.tiers?.[index]?.price && (
                          <p className="mt-1 text-xs text-red-600">{errors.tiers[index].price.message}</p>
                        )}
                      </div>

                      {/* <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="inline-flex items-center px-2.5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          aria-label="Remove tier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => append({ label: "", price: 0 })}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add tier
                  </button>
                </div>

                {typeof errors.tiers?.message === "string" && (
                  <p className="text-sm text-red-600">{errors.tiers.message}</p>
                )}
              </div>
            </div>

            {/* GST and One Box */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900">GST</h3>
                  <p className="text-sm text-gray-500">Set GST as a percentage</p>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      {...register("gstPercent")}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="3"
                      className="pl-9 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                    />
                  </div>
                  {errors.gstPercent && (
                    <p className="mt-1 text-sm text-red-600">{errors.gstPercent.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900">Price for one box</h3>
                  <p className="text-sm text-gray-500">Set the default price per box</p>
                </div>
                <div className="p-6 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">One box (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      {...register("boxPrice")}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25"
                      className="pl-9 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                    />
                  </div>
                  {errors.boxPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.boxPrice.message}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500">With GST:</span>
                    <span className="font-semibold text-gray-900">₹{(Number(formValues.boxPrice || 0) * gstMultiplier).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900">Preview</h3>
                  <p className="text-sm text-gray-500">Prices per box with GST applied</p>
                </div>
                <div className="p-4 sm:p-6 divide-y divide-gray-100">
                  {formValues?.tiers?.length ? (
                    formValues.tiers.map((t, i) => {
                      const base = Number(t.price || 0);
                      const withGst = base * gstMultiplier;
                      return (
                        <div key={`${t.label}-${i}`} className="flex items-center justify-between py-3">
                          <div className="text-sm text-gray-700">{t.label || "Untitled"}</div>
                          <div className="flex items-baseline gap-3">
                            <div className="text-sm text-gray-500 line-through">₹{base.toFixed(2)}</div>
                            <div className="text-base font-semibold text-gray-900">₹{withGst.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No tiers configured</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Pricing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}