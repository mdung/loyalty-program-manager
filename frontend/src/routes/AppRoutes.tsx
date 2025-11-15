import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import Layout from '../components/layout/Layout'
import CustomerListPage from '../pages/Customers/CustomerListPage'
import CustomerDetailPage from '../pages/Customers/CustomerDetailPage'
import TierListPage from '../pages/Tiers/TierListPage'
import StoreListPage from '../pages/Stores/StoreListPage'
import TransactionListPage from '../pages/Transactions/TransactionListPage'
import RewardListPage from '../pages/Rewards/RewardListPage'
import RedemptionListPage from '../pages/Redemptions/RedemptionListPage'
import CampaignListPage from '../pages/Campaigns/CampaignListPage'
import UserListPage from '../pages/Users/UserListPage'
import EarningRuleListPage from '../pages/EarningRules/EarningRuleListPage'
import ProfilePage from '../pages/Profile/ProfilePage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  return isAdmin ? <>{children}</> : <Navigate to="/dashboard" />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="tiers" element={<TierListPage />} />
        <Route path="stores" element={<StoreListPage />} />
        <Route path="transactions" element={<TransactionListPage />} />
        <Route path="rewards" element={<RewardListPage />} />
        <Route path="redemptions" element={<RedemptionListPage />} />
        <Route path="campaigns" element={<CampaignListPage />} />
        <Route path="earning-rules" element={<EarningRuleListPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UserListPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes

