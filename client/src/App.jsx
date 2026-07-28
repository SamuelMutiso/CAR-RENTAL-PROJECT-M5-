import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DriverProtectedRoute from "./components/DriverProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const VehiclesBrowse = lazy(() => import("./pages/VehiclesBrowse"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const Compare = lazy(() => import("./pages/Compare"));
const VehicleNew = lazy(() => import("./pages/VehicleNew"));
const VehicleEdit = lazy(() => import("./pages/VehicleEdit"));
const BookingNew = lazy(() => import("./pages/BookingNew"));
const EventBooking = lazy(() => import("./pages/EventBooking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminVehicles = lazy(() => import("./pages/AdminVehicles"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const BecomeDriver = lazy(() => import("./pages/BecomeDriver"));
const AdminDriverApplications = lazy(() => import("./pages/AdminDriverApplications"));
const DriverLogin = lazy(() => import("./pages/DriverLogin"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactMessages"));
const Terms = lazy(() => import("./pages/Terms"));
const DataProtection = lazy(() => import("./pages/DataProtection"));
const NotFound = lazy(() => import("./pages/NotFound"));
export default function App() {
  return <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner label="Loading..." />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/vehicles" element={<VehiclesBrowse />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/become-a-driver" element={<BecomeDriver />} />
            <Route path="/driver-login" element={<DriverLogin />} />

            <Route path="/driver-portal" element={<DriverProtectedRoute><DriverPortal /></DriverProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/vehicles/new" element={<ProtectedRoute><VehicleNew /></ProtectedRoute>} />
            <Route path="/vehicles/:id/edit" element={<ProtectedRoute><VehicleEdit /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute><BookingNew /></ProtectedRoute>} />
            <Route path="/events/new" element={<ProtectedRoute><EventBooking /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/vehicles" element={<ProtectedRoute requiredRole="admin"><AdminVehicles /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="admin"><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/driver-applications" element={<ProtectedRoute requiredRole="admin"><AdminDriverApplications /></ProtectedRoute>} />
            <Route path="/admin/contact-messages" element={<ProtectedRoute requiredRole="admin"><AdminContactMessages /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>;
}