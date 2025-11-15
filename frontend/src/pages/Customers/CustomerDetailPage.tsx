import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { customerApi, Customer, CustomerSummary } from '../../api/customerApi'
import { transactionApi, Transaction } from '../../api/transactionApi'
import CustomerFormDialog from './CustomerFormDialog'
import { useToast } from '../../context/ToastContext'

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [summary, setSummary] = useState<CustomerSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (id) {
      fetchCustomer()
      fetchSummary()
      fetchTransactions()
    }
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await customerApi.getById(Number(id))
      setCustomer(response.data)
    } catch (error) {
      showToast('Failed to fetch customer', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await customerApi.getSummary(Number(id))
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await customerApi.getTransactions(Number(id), 0, 20)
      setTransactions(response.data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!customer) {
    return <Typography>Customer not found</Typography>
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')}>
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setOpenEditDialog(true)}
        >
          Edit Customer
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography><strong>Membership Code:</strong> {customer.membershipCode}</Typography>
              <Typography><strong>Full Name:</strong> {customer.fullName}</Typography>
              <Typography><strong>Phone:</strong> {customer.phone || 'N/A'}</Typography>
              <Typography><strong>Email:</strong> {customer.email || 'N/A'}</Typography>
              <Typography><strong>Date of Birth:</strong> {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
              <Typography><strong>Gender:</strong> {customer.gender || 'N/A'}</Typography>
              <Typography><strong>Address:</strong> {customer.address || 'N/A'}</Typography>
              <Typography><strong>City:</strong> {customer.city || 'N/A'}</Typography>
              <Typography><strong>Country:</strong> {customer.country || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loyalty Summary
              </Typography>
              <Typography><strong>Current Tier:</strong> {customer.tierName || 'N/A'}</Typography>
              <Typography><strong>Points Balance:</strong> {customer.currentPointsBalance.toLocaleString()}</Typography>
              {summary && (
                <>
                  <Typography><strong>Total Points Earned:</strong> {summary.totalPointsEarned?.toLocaleString() || 0}</Typography>
                  <Typography><strong>Total Points Used:</strong> {summary.totalPointsUsed?.toLocaleString() || 0}</Typography>
                  <Typography><strong>Last Visit:</strong> {summary.lastVisit ? new Date(summary.lastVisit).toLocaleDateString() : 'N/A'}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.points.toLocaleString()}</TableCell>
                    <TableCell>{tx.storeName}</TableCell>
                    <TableCell>{tx.description || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
      <CustomerFormDialog
        open={openEditDialog}
        customer={customer}
        onClose={() => {
          setOpenEditDialog(false)
          fetchCustomer()
          fetchSummary()
        }}
      />
    </Box>
  )
}

export default CustomerDetailPage

