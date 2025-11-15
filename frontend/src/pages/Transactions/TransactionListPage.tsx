import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, Grid, TextField, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { transactionApi, Transaction } from '../../api/transactionApi'
import { storeApi } from '../../api/storeApi'
import { customerApi } from '../../api/customerApi'
import DataTable from '../../components/common/DataTable'
import TransactionFormDialog from './TransactionFormDialog'
import { useToast } from '../../context/ToastContext'

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'earn' | 'redeem'>('earn')
  const [filters, setFilters] = useState({
    customerId: '',
    storeId: '',
    type: '',
    fromDate: '',
    toDate: '',
  })
  const [stores, setStores] = useState<any[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    fetchTransactions()
    fetchStores()
  }, [page, size, filters.customerId, filters.storeId, filters.type, filters.fromDate, filters.toDate])

  const fetchStores = async () => {
    try {
      const response = await storeApi.getAll()
      setStores(response.data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await transactionApi.getAll(
        page,
        size,
        filters.customerId ? Number(filters.customerId) : undefined,
        filters.storeId ? Number(filters.storeId) : undefined,
        filters.type || undefined,
        filters.fromDate || undefined,
        filters.toDate || undefined
      )
      setTransactions(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      showToast('Failed to fetch transactions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'createdAt', label: 'Date', format: (v: string) => new Date(v).toLocaleString() },
    { id: 'customerName', label: 'Customer' },
    { id: 'storeName', label: 'Store' },
    { id: 'type', label: 'Type' },
    { id: 'points', label: 'Points', format: (v: number) => v.toLocaleString() },
    { id: 'description', label: 'Description' },
  ]

  if (loading && transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('earn')
              setOpenDialog(true)
            }}
            sx={{ mr: 1 }}
          >
            Earn Points
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('redeem')
              setOpenDialog(true)
            }}
          >
            Redeem Points
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Customer ID"
            value={filters.customerId}
            onChange={(e) => {
              setFilters({ ...filters, customerId: e.target.value })
              setPage(0)
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Store"
            value={filters.storeId}
            onChange={(e) => {
              setFilters({ ...filters, storeId: e.target.value })
              setPage(0)
            }}
          >
            <MenuItem value="">All Stores</MenuItem>
            {stores.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            label="Type"
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value })
              setPage(0)
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="EARN">Earn</MenuItem>
            <MenuItem value="REDEEM">Redeem</MenuItem>
            <MenuItem value="ADJUSTMENT">Adjustment</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={filters.fromDate}
            onChange={(e) => {
              setFilters({ ...filters, fromDate: e.target.value })
              setPage(0)
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={filters.toDate}
            onChange={(e) => {
              setFilters({ ...filters, toDate: e.target.value })
              setPage(0)
            }}
          />
        </Grid>
      </Grid>
      <DataTable
        columns={columns}
        rows={transactions}
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(newSize) => {
          setSize(newSize)
          setPage(0)
        }}
      />
      <TransactionFormDialog
        open={openDialog}
        type={dialogType}
        onClose={() => {
          setOpenDialog(false)
          fetchTransactions()
        }}
      />
    </Box>
  )
}

export default TransactionListPage

