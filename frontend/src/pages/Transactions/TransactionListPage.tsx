import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { transactionApi, Transaction } from '../../api/transactionApi'
import DataTable from '../../components/common/DataTable'
import TransactionFormDialog from './TransactionFormDialog'

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'earn' | 'redeem'>('earn')

  useEffect(() => {
    fetchTransactions()
  }, [page, size])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await transactionApi.getAll(page, size)
      setTransactions(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
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

