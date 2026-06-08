"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/services/api";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  _id: string;
  userId?: {
    name?: string;
    email?: string;
    employeeId?: string;
  };
  roomId?: {
    name?: string;
  };
  bookingType: "individual" | "team" | "family";
  checkinDate: string;
  checkoutDate: string;
  occupantCount: number;
  members?: string[];
  purpose?: string;
  status: "pending" | "approved" | "cancelled" | "rejected";
  createdAt?: string;
}

interface Room {
  _id: string;
  name: string;
  type: string;
  maxOccupancy: number;
  isAvailable?: boolean;
  images?: string[];
  amenities?: string[];
  description?: string;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TYPE_ICON: Record<string, string> = {
  individual: "👤",
  team: "👥",
  family: "👨‍👩‍👧",
};

const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "TV",
  "Kitchen",
  "Parking",
  "Washing Machine",
  "Gym Access",
  "24/7 Security",
];

export default function AdminDashboard() {
  const router = useRouter();
const [rejectModal, setRejectModal] = useState<{ open: boolean; bookingId: string | null }>({
  open: false,
  bookingId: null,
});
const [rejectReason, setRejectReason] = useState("");
  const [tab, setTab] = useState<"overview" | "requests" | "rooms">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get("/admin/bookings");
      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await api.get("/rooms");
      setRooms(res.data.rooms);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "approved" | "rejected" | "cancelled"
  ) => {
    try {
      setUpdatingBookings((prev) => new Set(prev).add(bookingId));
      await api.patch(`/admin/bookings/approve/${bookingId}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Booking ${newStatus === "approved" ? "approved" : "cancelled"}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingBookings((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  // const handleRejectUpdateStatus = async (
  //   bookingId: string,
  //   newStatus: "approved" | "rejected" | "cancelled"
  // ) => {
  //   try {
  //     setUpdatingBookings((prev) => new Set(prev).add(bookingId));
  //     await api.patch(`/admin/bookings/reject/${bookingId}`, { status: newStatus });
  //     setBookings((prev) =>
  //       prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
  //     );
  //     toast.success(`Booking ${newStatus === "approved" ? "approved" : "cancelled"}`);
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || "Failed to update booking status");
  //   } finally {
  //     setUpdatingBookings((prev) => {
  //       const next = new Set(prev);
  //       next.delete(bookingId);
  //       return next;
  //     });
  //   }
  // };


  const handleRejectUpdateStatus = async (bookingId: string, reason: string) => {
  try {
    setUpdatingBookings((prev) => new Set(prev).add(bookingId));
    await api.patch(`/admin/bookings/reject/${bookingId}`, {
      status: "cancelled",
      reason,                // ← send the message
    });
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
    );
    toast.success("Booking rejected");
    setRejectModal({ open: false, bookingId: null });
    setRejectReason("");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to reject booking");
  } finally {
    setUpdatingBookings((prev) => {
      const next = new Set(prev);
      next.delete(bookingId);
      return next;
    });
  }
};
  const handleLogout = async () => {
    await api.post("/auth/logout");
    toast.success("Logged out");
    router.replace("/admin/login");
  };

  // ── Room form state ──────────────────────────────────────────────────────────
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "",
    maxOccupancy: 2,
    description: "",
    amenities: [] as string[], 
     customType: "",  
  });
  const [roomImages, setRoomImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRoomFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setRoomForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (roomImages.length + files.length > 5) {
      toast.error("You can upload up to 5 images");
      return;
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setRoomImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setRoomImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

 const resetRoomForm = () => {
  setRoomForm({ name: "", type: "", maxOccupancy: 2, description: "", amenities: [], customType: "" });
  imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  setRoomImages([]);
  setImagePreviews([]);
};

const handleCreateRoom = async () => {
  // Resolve the actual type value to send
  const resolvedType = roomForm.type === "other" ? roomForm.customType.trim() : roomForm.type;

  if (!roomForm.name || !resolvedType || !roomForm.maxOccupancy) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    setCreatingRoom(true);
    const formData = new FormData();
    formData.append("name", roomForm.name);
    formData.append("type", resolvedType);   // ← send resolved value, not "other"
    formData.append("maxOccupancy", String(Number(roomForm.maxOccupancy)));
    formData.append("description", roomForm.description);
    roomForm.amenities.forEach((a) => formData.append("amenities[]", a));
    roomImages.forEach((img) => formData.append("images", img));

    const res = await api.post("/rooms/create", formData);
    toast.success("Room created successfully");
    setRooms((prev) => [...prev, res.data.room]);
    resetRoomForm();
    setShowAddRoom(false);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to create room");
  } finally {
    setCreatingRoom(false);
  }
};
  // ── Derived lists for requests tab ──────────────────────────────────────────
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const historyBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <div>
        <Toaster />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-[260px] bg-white border-r border-slate-200 p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              Plaxonic
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Admin Dashboard</p>
          </div>

          <div className="space-y-2">
            {(["overview", "requests", "rooms"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium capitalize ${
                  tab === t
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 cursor-pointer hover:bg-red-100 border border-red-100 text-red-600 font-medium py-3 rounded-xl transition"
        >
          Logout
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Overview */}
          {tab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-slate-800">Dashboard Overview</h2>
              <div className="grid grid-cols-4 gap-6">
                <StatCard label="Total Requests" value={bookings.length} color="text-slate-800" />
                <StatCard
                  label="Pending"
                  value={pendingBookings.length}
                  color="text-amber-500"
                />
                <StatCard
                  label="Approved"
                  value={bookings.filter((b) => b.status === "approved").length}
                  color="text-green-600"
                />
                <StatCard label="Rooms" value={rooms.length} color="text-blue-600" />
              </div>
            </motion.div>
          )}

          {/* Requests — split into Pending + History */}
          {tab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Pending */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-slate-800">Pending Requests</h2>
                  {pendingBookings.length > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {pendingBookings.length}
                    </span>
                  )}
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  {loadingBookings ? (
                    <div className="p-10 text-center text-slate-500">Loading...</div>
                  ) : pendingBookings.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                  
                   No pending requests right now.
                    </div>
                  ) : (
                    <BookingTable
                      bookings={pendingBookings}
                      updatingBookings={updatingBookings}
                      onApprove={(id) => handleUpdateStatus(id, "approved")}
                       onReject={(id) => {
    setRejectModal({ open: true, bookingId: id });  // ← open modal instead
    setRejectReason("");
  }}
                      showActions
                    />
                  )}
                </div>
              </section>

              {/* History */}
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-5">History</h2>
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  {loadingBookings ? (
                    <div className="p-10 text-center text-slate-500">Loading...</div>
                  ) : historyBookings.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No past bookings yet.</div>
                  ) : (
                    <BookingTable
                      bookings={historyBookings}
                      updatingBookings={updatingBookings}
                      onApprove={() => {}}
                      onReject={() => {}}
                      showActions={false}
                    />
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {/* Rooms */}
          {tab === "rooms" && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Rooms</h2>
                <button
                  onClick={() => setShowAddRoom(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
                >
                  <span className="text-lg leading-none">+</span>
                  Add Room
                </button>
              </div>

              {loadingRooms ? (
                <div className="text-slate-500">Loading rooms...</div>
              ) : rooms.length === 0 ? (
                <div className="text-slate-400 text-center py-20">
                  No rooms found. Add your first room!
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Add Room Modal ── */}
      <AnimatePresence>
        {showAddRoom && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddRoom(false);
                resetRoomForm();
              }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Add New Room</h3>
                  <button
                    onClick={() => {
                      setShowAddRoom(false);
                      resetRoomForm();
                    }}
                    className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Room Images{" "}
                      <span className="text-slate-400 font-normal">(up to 5)</span>
                    </label>

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative group w-20 h-20">
                            <img
                              src={src}
                              alt={`preview-${i}`}
                              className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {imagePreviews.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-xl text-sm font-medium transition w-full justify-center"
                      >
                        📷 Click to upload images
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Room Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Room Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={roomForm.name}
                      onChange={handleRoomFormChange}
                      placeholder="e.g. Suite 101"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Room Type + Max Occupancy */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Room Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={roomForm.type}
                        onChange={handleRoomFormChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Select type</option>
                        <option value="1bhk">1 BHK</option>
                        <option value="2bhk">2 BHK</option>
                        <option value="custom">other</option>

                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Max Occupancy <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="maxOccupancy"
                        min={1}
                        value={roomForm.maxOccupancy}
                        onChange={handleRoomFormChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div> */}
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
    Room Type <span className="text-red-500">*</span>
  </label>
  <select
    name="type"
    value={roomForm.type}
    onChange={handleRoomFormChange}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
  >
    <option value="">Select type</option>
    <option value="1bhk">1 BHK</option>
    <option value="2bhk">2 BHK</option>
    <option value="other">Other</option>
  </select>

  {roomForm.type === "other" && (
    <input
      type="text"
      name="customType"
      value={roomForm.customType}
      onChange={handleRoomFormChange}
      placeholder="e.g. Studio, 3BHK, Dormitory..."
      className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  )}
</div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={roomForm.description}
                      onChange={handleRoomFormChange}
                      rows={3}
                      placeholder="Brief description of the accommodation..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITY_OPTIONS.map((amenity) => {
                        const selected = roomForm.amenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              selected
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                            }`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      setShowAddRoom(false);
                      resetRoomForm();
                    }}
                    disabled={creatingRoom}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateRoom}
                    disabled={creatingRoom}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creatingRoom ? "Creating..." : "Create Room"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Reject Reason Modal ── */}
<AnimatePresence>
  {rejectModal.open && (
    <>
      <motion.div
        key="reject-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setRejectModal({ open: false, bookingId: null });
          setRejectReason("");
        }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      <motion.div
        key="reject-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-800">Reject Booking</h3>
            <button
              onClick={() => {
                setRejectModal({ open: false, bookingId: null });
                setRejectReason("");
              }}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition"
            >
              ×
            </button>
          </div>

          <p className="text-slate-500 text-sm mb-5">
            Please provide a reason so the employee knows why their request was declined.
          </p>

          <textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Dates conflict with a prior booking, room under maintenance..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-none"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setRejectModal({ open: false, bookingId: null });
                setRejectReason("");
              }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              disabled={!rejectReason.trim() || updatingBookings.has(rejectModal.bookingId!)}
              onClick={() =>
                handleRejectUpdateStatus(rejectModal.bookingId!, rejectReason.trim())
              }
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md shadow-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingBookings.has(rejectModal.bookingId!) ? "Rejecting..." : "Confirm Reject"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>

  );
}

// ── Shared BookingTable component ────────────────────────────────────────────

function BookingTable({
  bookings,
  updatingBookings,
  onApprove,
  onReject,
  showActions,
}: {
  bookings: Booking[];
  updatingBookings: Set<string>;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  showActions: boolean;
}) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-xs">
        <tr>
          <th className="text-left font-semibold p-5">Employee</th>
          <th className="text-left font-semibold">Room</th>
          <th className="text-left font-semibold p-5">Type</th>
          <th className="text-left font-semibold p-5">Check-in</th>
          <th className="text-left font-semibold p-5">Check-out</th>
          <th className="text-left font-semibold p-5">Status</th>
          {showActions && <th className="text-left font-semibold p-5">Actions</th>}
        </tr>
      </thead>
      <tbody className="text-slate-700">
        {bookings.map((booking) => {
          const isUpdating = updatingBookings.has(booking._id);
          return (
            <tr
              key={booking._id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
            >
              <td className="p-5 font-medium text-slate-900">{booking.userId?.name}</td>
              <td>{booking.roomId?.name}</td>
              <td className="p-5">
                <span className="flex items-center gap-2">
                  <span>{TYPE_ICON[booking.bookingType]}</span>
                  <span className="capitalize">{booking.bookingType}</span>
                </span>
              </td>
              <td className="p-5">{fmt(booking.checkinDate)}</td>
              <td className="p-5">{fmt(booking.checkoutDate)}</td>
              <td className="p-5">
                <StatusBadge status={booking.status} />
              </td>
              {showActions && (
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isUpdating}
                      onClick={() => onApprove(booking._id)}
                      className="px-3 py-1.5 cursor-pointer rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs border border-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "..." : "✔️"}
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => onReject(booking._id)}
                      className="px-3 py-1.5 cursor-pointer rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "..." : "❌"}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── RoomCard ─────────────────────────────────────────────────────────────────

function RoomCard({ room }: { room: Room }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = room.images ?? [];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition">
      {/* Image carousel */}
      {images.length > 0 ? (
        <div className="relative h-44 bg-slate-100 group">
          <img
            src={images[imgIdx]}
            alt={`${room.name} image ${imgIdx + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ‹
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition ${
                      i === imgIdx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow ${
              room.isAvailable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {room.isAvailable ? "Available" : "Booked"}
          </span>
        </div>
      ) : (
        <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm relative">
          No images
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow ${
              room.isAvailable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {room.isAvailable ? "Available" : "Booked"}
          </span>
        </div>
      )}

      {/* Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
        </div>
        <p className="text-blue-600 font-medium text-sm capitalize mb-3">{room.type}</p>

        {room.description && (
          <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {room.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
          <span>👥</span>
          <span>Max {room.maxOccupancy} occupants</span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
      <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">{label}</p>
      <h3 className={`text-4xl font-bold mt-3 ${color}`}>{value}</h3>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-500",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] ?? "bg-slate-100 text-slate-500"}`}
    >
      {status}
    </span>
  );
}