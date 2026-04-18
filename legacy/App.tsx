import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
import { LoginPage } from './pages/LoginPage'
import { AdminRouteGuard, LoginRouteGuard } from './components/auth/RouteGuards'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { BookingCalendarPage } from './pages/admin/BookingCalendarPage'
import { CustomersPage } from './pages/admin/CustomersPage'
import { PricingRulesPage } from './pages/admin/PricingRulesPage'
import { RoomMatrixPage } from './pages/admin/RoomMatrixPage'
import { RoomsManagePage } from './pages/admin/RoomsManagePage'
import { StaffRolesPage } from './pages/admin/StaffRolesPage'
import { AppDataProvider } from './state/AppDataContext'

function HotelSearchRoute() {
  const { key } = useLocation()
  return <HotelSearchPage key={key} />
}

function BookingWizardRoute() {
  const [searchParams] = useSearchParams()
  return <BookingWizardPage key={searchParams.toString()} />
}

const pageEase = [0.25, 0.1, 0.25, 1] as const

function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function RouteTransitionLoader() {
  const { pathname, search } = useLocation()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setVisible(true)

    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      setVisible(false)
      timerRef.current = null
    }, 320)

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [pathname, search])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[90]"
          aria-hidden
        >
          <motion.div
            initial={{ scaleX: 0.15 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="h-[3px] origin-left bg-gradient-to-r from-vio-gold via-vio-navy to-vio-gold"
          />
          <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-vio-linen bg-vio-white/96 px-3 py-1.5 text-xs font-medium text-vio-navy shadow-soft-sm backdrop-blur">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-vio-gold/30 border-t-vio-gold" />
            Loading...
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <ScrollToTopOnRouteChange />
      <RouteTransitionLoader />
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`${location.pathname}${location.search}`}
          initial={{ opacity: 0.75 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: pageEase }}
        >
          <Routes location={location}>
            <Route element={<LoginRouteGuard />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<AdminRouteGuard />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="matrix" element={<RoomMatrixPage />} />
                <Route path="calendar" element={<BookingCalendarPage />} />
                <Route path="rooms" element={<RoomsManagePage />} />
                <Route path="pricing" element={<PricingRulesPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="staff" element={<StaffRolesPage />} />
              </Route>
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
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <ToastProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppDataProvider>
  )
}
