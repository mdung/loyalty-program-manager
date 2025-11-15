import { useState, useEffect } from 'react'
import { Box, Typography, Button, TextField, Grid, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { customerApi, Customer } from '../../api/customerApi'
import DataTable from '../../components/common/DataTable'
import CustomerFormDialog from './CustomerFormDialog'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

const CustomerListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [page, size, searchName, searchPhone])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerApi.getAll(page, size, searchName || undefined, searchPhone || undefined)
      setCustomers(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      showToast('Failed to fetch customers', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'membershipCode', label: 'Membership Code' },
    { id: 'fullName', label: 'Full Name' },
    { id: 'phone', label: 'Phone' },
    { id: 'email', label: 'Email' },
    { id: 'tierName', label: 'Tier' },
    { id: 'currentPointsBalance', label: 'Points', format: (value: number) => value.toLocaleString() },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Customer) => (
        <Box>
          <IconButton size="small" onClick={() => navigate(`/customers/${row.id}`)}>
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loading && customers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Customers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add Customer
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
        </Grid>
      </Grid>
      <DataTable
        columns={columns}
        rows={customers}
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(newSize) => {
          setSize(newSize)
          setPage(0)
        }}
      />
      <CustomerFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          fetchCustomers()
        }}
      />
    </Box>
  )
}

export default CustomerListPage

