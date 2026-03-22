import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { GuestLayout } from './components/guest/GuestLayout'
import { HomePage } from './pages/HomePage'
import { HotelSearchPage } from './pages/HotelSearchPage'
import { BookingHistoryPage } from './pages/BookingHistoryPage'
import { BookingWizardPage } from './pages/BookingWizardPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { RoomListPage } from './pages/RoomListPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { BookingCalendarPage } from './pages/admin/BookingCalendarPage'
import { CustomersPage } from './pages/admin/CustomersPage'
import { PricingRulesPage } from './pages/admin/PricingRulesPage'
import { RoomMatrixPage } from './pages/admin/RoomMatrixPage'
import { RoomsManagePage } from './pages/admin/RoomsManagePage'
import { StaffRolesPage } from './pages/admin/StaffRolesPage'

function HotelSearchRoute() {
  const { key } = useLocation()
  return <HotelSearchPage key={key} />
}

function BookingWizardRoute() {
  const [searchParams] = useSearchParams()
  return <BookingWizardPage key={searchParams.toString()} />
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="matrix" element={<RoomMatrixPage />} />
            <Route path="calendar" element={<BookingCalendarPage />} />
            <Route path="rooms" element={<RoomsManagePage />} />
            <Route path="pricing" element={<PricingRulesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="staff" element={<StaffRolesPage />} />
          </Route>
          <Route element={<GuestLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<HotelSearchRoute />} />
            <Route path="/rooms" element={<RoomListPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/book" element={<BookingWizardRoute />} />
            <Route path="/bookings" element={<BookingHistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
