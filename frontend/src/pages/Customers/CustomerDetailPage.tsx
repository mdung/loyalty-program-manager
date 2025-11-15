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
import { customerApi, Customer } from '../../api/customerApi'
import { transactionApi, Transaction } from '../../api/transactionApi'

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchCustomer()
      fetchTransactions()
    }
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await customerApi.getById(Number(id))
      setCustomer(response.data)
    } catch (error) {
      console.error('Failed to fetch customer:', error)
    } finally {
      setLoading(false)
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
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} sx={{ mb: 2 }}>
        Back
      </Button>
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
              <Typography><strong>Current Tier:</strong> {customer.tierName || 'N/A'}</Typography>
              <Typography><strong>Points Balance:</strong> {customer.currentPointsBalance.toLocaleString()}</Typography>
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
    </Box>
  )
}

export default CustomerDetailPage

