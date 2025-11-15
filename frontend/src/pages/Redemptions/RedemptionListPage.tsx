import { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress, Button, Chip } from '@mui/material'
import { rewardApi, Redemption } from '../../api/rewardApi'
import DataTable from '../../components/common/DataTable'

const RedemptionListPage = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRedemptions()
  }, [page, size])

  const fetchRedemptions = async () => {
    setLoading(true)
    try {
      const response = await rewardApi.getRedemptions(page, size)
      setRedemptions(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      console.error('Failed to fetch redemptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await rewardApi.approveRedemption(id)
      fetchRedemptions()
    } catch (error) {
      console.error('Failed to approve redemption:', error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rewardApi.rejectRedemption(id)
      fetchRedemptions()
    } catch (error) {
      console.error('Failed to reject redemption:', error)
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await rewardApi.completeRedemption(id)
      fetchRedemptions()
    } catch (error) {
      console.error('Failed to complete redemption:', error)
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

