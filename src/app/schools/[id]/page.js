"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Layout from "../../../components/Layout";
import { ArrowLeft, CheckCircle, XCircle, Eye, Mail, Phone, MapPin, IdCard, User, Calendar } from "lucide-react";
import axios from "axios";
import toast from 'react-hot-toast';
import { formatDetailDate } from "../../../utils/dateUtils";

export default function SchoolDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params.id) {
      loadSchool();
    }
  }, [mounted, params.id]);

  const loadSchool = async() => {
    try {
      setLoading(true);
     
        try {
          const token = localStorage.getItem('adminToken');
          const res = await axios.get(`https://api.middaybox.com/api/admin/school-registrations/${params.id}`,{ headers: { Authorization: `Bearer ${token}` }});
          setSchool(res.data?.registration || res.data);
        } catch (e) {
          console.error('Failed to fetch school by id', e);
        } finally {
          setLoading(false);
        }
      
    } catch (e) {
      console.error('Failed to parse school data from URL', e);
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      await axios.patch(`https://api.middaybox.com/api/admin/school-registrations/${params.id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchool(prev => ({ ...prev, status }));
      toast.success(`School ${status}`);
    } catch (e) {
      console.error('Failed to update status', e);
      toast.error('Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  const openInNew = (url) => window.open(url, '_blank');

  if (!mounted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (loading || !school) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
            <div className="animate-pulse h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Details</h1>
              <p className="text-gray-600">View and manage school registration</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {school.status === 'pending' ? (
              <>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </button>
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {processing ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Processing...</>) : (<><CheckCircle className="mr-2 h-4 w-4" /> Approve</>)}
                </button>
              </>
            ) : (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${school.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {school.status}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">School</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><User className="h-4 w-4 text-gray-600" /> {school.contactName}</div>
                <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4 text-gray-600" /> {school.email}</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4 text-gray-600" /> {school.mobile}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4 text-gray-600" /> Created: {formatDetailDate(school.createdAt)}</div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2 text-sm">
                <div><span className="text-gray-500">School Name:</span> <span className="text-gray-900">{school.schoolName}</span></div>
                <div><span className="text-gray-500">Unique ID:</span> <span className="text-gray-900">{school.schoolUniqueId}</span></div>
                <div><span className="text-gray-500">Recognise ID:</span> <span className="text-gray-900">{school.recogniseId}</span></div>
                <div><span className="text-gray-500">Branch No:</span> <span className="text-gray-900">{school.branchNumber}</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button onClick={() => openInNew(school.aadharFrontUrl)} className="relative group">
                  <img src={school.aadharFrontUrl} alt="Aadhaar Front" className="w-full h-32 object-cover rounded border border-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-10 group-hover:bg-opacity-30 transition"><Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" /></div>
                </button>
                <button onClick={() => openInNew(school.aadharBackUrl)} className="relative group">
                  <img src={school.aadharBackUrl} alt="Aadhaar Back" className="w-full h-32 object-cover rounded border border-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-10 group-hover:bg-opacity-30 transition"><Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" /></div>
                </button>
                <button onClick={() => openInNew(school.schoolIdImageUrl)} className="relative group">
                  <img src={school.schoolIdImageUrl} alt="School ID" className="w-full h-32 object-cover rounded border border-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-10 group-hover:bg-opacity-30 transition"><Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" /></div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {school.address?.houseNo}, {school.address?.areaName}</div>
                <div className="ml-6">{school.address?.landmark}</div>
                <div className="ml-6">{school.address?.city} - {school.address?.pincode}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


