

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCustomizedRequests, updateRequestStatus } from "../../Services/customized-api-service"
import { toast } from "react-toastify"
import StatusUpdateModal from "./StatusUpdateModal"
import {
  Calendar,
  Users,
  Utensils,
  Wallet,
  FileText,
  ArrowLeft,
  Camera,
  MapPin,
  Sparkles,
  Coffee,
  CheckCircle,
  XCircle,
} from "lucide-react"

const GetCustomizedRequest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [requestData, setRequestData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getCustomizedRequests()
        const matchedItem = data.find((item) => item._id === id)
        if (matchedItem) {
          setRequestData(matchedItem)
        } else {
          setError("Request not found")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [id])

  const handleUpdateStatus = async (requestId, updateData) => {
    try {
      const updatedRequest = await updateRequestStatus(requestId, updateData);
      
      // Update the local state
      setRequestData(updatedRequest)
      
      return updatedRequest;
    } catch (error) {
      throw error;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-center text-gray-900">Error</h3>
          <p className="mt-2 text-center text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Go Back
          </button>
        </div>
      </div>
    )

  const {
    name,
    email,
    phone_number,
    event_date,
    guest_count,
    food_preference,
    budget_range,
    special_requirements,
    status,
    final_price,
    requestedIdName,
    requestedEventImage,
    package_customizations,
  } = requestData

  // Status mapping with colors and badges
  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-800",
      icon: <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>,
    },
    approved: {
      color: "bg-blue-100 text-blue-800",
      icon: <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>,
    },
    confirmed: {
      color: "bg-purple-100 text-purple-800",
      icon: <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>,
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>,
    },
  }

  const statusDisplay = statusConfig[status] || statusConfig.pending

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Requests
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">Request Details</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className=" bg-purple-600  p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{requestedIdName}</h1>
                <div className="flex items-center mt-2 text-purple-100">
                  <span className="text-sm">Request ID:</span>
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-mono">{id.slice(0, 8)}</span>
                </div>
              </div>
              <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full flex items-center ${statusDisplay.color}`}>
                {statusDisplay.icon}
                <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* User Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           

            {/* Final Price Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
  <div className="p-6 space-y-6">
    <div>
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        💰 Amount Status
      </h3>
      <p className="text-sm text-gray-500 mt-1">Overview of your budget and final pricing.</p>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
      <p className="text-xs text-gray-500">Requested Budget Range</p>
      <p className="font-medium text-gray-800">{budget_range}</p>
    </div>

    <div className="flex items-center justify-between px-2">
      <span className="text-sm text-gray-500 font-medium">Final Price</span>
      <span className="text-2xl font-bold text-purple-700">
        ₹{final_price?.toLocaleString("en-IN") || "N/A"}
      </span>
    </div>

    <button
      onClick={() => setIsModalOpen(true)}
      disabled={isProcessing}
      className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
        isProcessing
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 text-white"
      }`}
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Update Status
        </>
      )}
    </button>
  </div>
</div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Guest Count</p>
                        <p className="font-medium text-gray-900">{guest_count} people</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Utensils className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Food Preference</p>
                        <p className="font-medium text-gray-900">{food_preference}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Budget Range</p>
                        <p className="font-medium text-gray-900">{budget_range}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Special Requirements</p>
                        <p className="font-medium text-gray-900">{special_requirements || "None specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Customizations Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Customizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(package_customizations).map(([key, val]) => {
                    // Map service types to appropriate icons
                    let Icon
                    switch (key.toLowerCase()) {
                      case "catering":
                        Icon = Coffee
                        break
                      case "decoration":
                        Icon = Sparkles
                        break
                      case "photography":
                        Icon = Camera
                        break
                      case "venue":
                        Icon = MapPin
                        break
                      default:
                        Icon = CheckCircle
                    }

                    return (
                      <div key={key} className="flex items-center p-3 rounded-lg border border-gray-100">
                        <div
                          className={`w-10 h-10 rounded-full ${val ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-5 h-5 ${val ? "text-green-600" : "text-gray-400"}`} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          <p className={`text-sm ${val ? "text-green-600" : "text-gray-500"}`}>
                            {val ? "Included" : "Not Included"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            
          </div>
        </div>
      </div>

      {/* Modal for status update */}
      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={status || "pending"}
        currentBudgetStatus={budget_range}
        onUpdateStatus={handleUpdateStatus}
        requestId={id}
      />
    </div>
  )
}

export default GetCustomizedRequest
