import { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material'
import { dashboardApi, DashboardOverview, TopCustomer } from '../api/dashboardApi'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useToast } from '../context/ToastContext'

const DashboardPage = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [newMembersData, setNewMembersData] = useState<any[]>([])
  const [pointsByStoreData, setPointsByStoreData] = useState<any[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, topCustomersRes] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getTopCustomers(10),
        ])
        setOverview(overviewRes.data)
        setTopCustomers(topCustomersRes.data)
        
        // Mock data for new members per month (in real app, fetch from API)
        const last6Months = []
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          last6Months.push({
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            members: Math.floor(Math.random() * 50) + 10,
          })
        }
        setNewMembersData(last6Months)
        
        // Mock data for points by store (in real app, fetch from API)
        setPointsByStoreData([
          { store: 'Store A', points: 50000 },
          { store: 'Store B', points: 35000 },
          { store: 'Store C', points: 28000 },
        ])
      } catch (error) {
        showToast('Failed to fetch dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h4">{overview?.totalCustomers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Customers
              </Typography>
              <Typography variant="h4">{overview?.activeCustomers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Points Issued
              </Typography>
              <Typography variant="h4">{overview?.totalPointsIssued?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Points Redeemed
              </Typography>
              <Typography variant="h4">{overview?.totalPointsRedeemed?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Outstanding Balance
              </Typography>
              <Typography variant="h4">{overview?.outstandingPointsBalance?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Points Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Issued', value: overview?.totalPointsIssued || 0 },
                  { name: 'Redeemed', value: overview?.totalPointsRedeemed || 0 },
                  { name: 'Outstanding', value: overview?.outstandingPointsBalance || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Customers
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {topCustomers.map((customer, index) => (
                  <Box key={customer.customerId} sx={{ mb: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {index + 1}. {customer.customerName} ({customer.membershipCode})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Points: {customer.currentPointsBalance.toLocaleString()} | Tier: {customer.tierName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                New Members Per Month
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={newMembersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="members" stroke="#8884d8" name="New Members" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Points by Store
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsByStoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="points" fill="#82ca9d" name="Points" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage

