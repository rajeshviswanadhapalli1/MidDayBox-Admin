"use client";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import Layout from "@/components/Layout";

const AdminFeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
   
    fetchFeedbacks();
  }, []);

   const fetchFeedbacks = async () => {
    
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get("https://api.middaybox.com/api/feedback//getAllFeedback", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setFeedbacks(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching feedbacks", error);
      }
    };
//   const renderStars = (rating) => {
//     return (
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <Star
//             key={i}
//             className={`w-4 h-4 ${
//               i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };
console.log(feedbacks,'feedbacks');

  return (
    <Layout>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">All Feedbacks</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        {/* <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3 border-b text-gray-500">User</th>
              <th className="px-4 py-3 border-b text-gray-500">User Type</th>
              <th className="px-4 py-3 border-b text-gray-500">Feedback</th>
              <th className="px-4 py-3 border-b text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <tr key={fb._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b text-gray-900">
                    {fb.userId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-900">{fb.userType}</td>
                  <td className="px-4 py-3 border-b max-w-xs truncate text-gray-900">
                    {fb.message}
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-gray-500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No feedbacks yet
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
      </div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
               
                </tr>
                
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap truncate"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                      
                    </tr>
                  ))
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No FeedBacks found
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                       
                            <div className="text-sm font-medium text-gray-900">{s.userId?.name || "N/A"}</div>
                            
                         
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center"> {s.userType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center"> {s.message}</div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center"> {new Date(s.createdAt).toLocaleDateString()}</div>
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
};

export default AdminFeedbackTable;
