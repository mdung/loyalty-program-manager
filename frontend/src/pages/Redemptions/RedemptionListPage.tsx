import { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress, Button, Chip, Grid, TextField, MenuItem } from '@mui/material'
import { rewardApi, Redemption } from '../../api/rewardApi'
import { storeApi } from '../../api/storeApi'
import DataTable from '../../components/common/DataTable'
import { useToast } from '../../context/ToastContext'

const RedemptionListPage = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    storeId: '',
    fromDate: '',
    toDate: '',
  })
  const [stores, setStores] = useState<any[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    fetchRedemptions()
    fetchStores()
  }, [page, size, filters.status, filters.storeId, filters.fromDate, filters.toDate])

  const fetchStores = async () => {
    try {
      const response = await storeApi.getAll()
      setStores(response.data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    }
  }

  const fetchRedemptions = async () => {
    setLoading(true)
    try {
      const response = await rewardApi.getRedemptions(
        page,
        size,
        filters.status || undefined,
        filters.storeId ? Number(filters.storeId) : undefined,
        filters.fromDate || undefined,
        filters.toDate || undefined
      )
      setRedemptions(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      showToast('Failed to fetch redemptions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await rewardApi.approveRedemption(id)
      showToast('Redemption approved successfully', 'success')
      fetchRedemptions()
    } catch (error: any) {
      showToast('Failed to approve redemption', 'error')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rewardApi.rejectRedemption(id)
      showToast('Redemption rejected successfully', 'success')
      fetchRedemptions()
    } catch (error: any) {
      showToast('Failed to reject redemption', 'error')
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await rewardApi.completeRedemption(id)
      showToast('Redemption completed successfully', 'success')
      fetchRedemptions()
    } catch (error: any) {
      showToast('Failed to complete redemption', 'error')
    }
  }

  const columns = [
    { id: 'redeemedAt', label: 'Date', format: (v: string) => new Date(v).toLocaleString() },
    { id: 'customerName', label: 'Customer' },
    { id: 'rewardName', label: 'Reward' },
    { id: 'pointsUsed', label: 'Points', format: (v: number) => v.toLocaleString() },
    { id: 'status', label: 'Status', format: (v: string) => <Chip label={v} size="small" /> },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Redemption) => (
        <Box>
          {row.status === 'PENDING' && (
            <>
              <Button size="small" color="success" onClick={() => handleApprove(row.id)}>
                Approve
              </Button>
              <Button size="small" color="error" onClick={() => handleReject(row.id)}>
                Reject
              </Button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <Button size="small" color="primary" onClick={() => handleComplete(row.id)}>
              Complete
            </Button>
          )}
        </Box>
      ),
    },
  ]

  if (loading && redemptions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Redemptions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Status"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value })
              setPage(0)
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </TextField>
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
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
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
        rows={redemptions}
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(newSize) => {
          setSize(newSize)
          setPage(0)
        }}
      />
    </Box>
  )
}

export default RedemptionListPage

