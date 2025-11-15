import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { rewardApi, Reward } from '../../api/rewardApi'
import DataTable from '../../components/common/DataTable'
import RewardFormDialog from './RewardFormDialog'

const RewardListPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    setLoading(true)
    try {
      const response = await rewardApi.getAll()
      setRewards(response.data)
    } catch (error) {
      console.error('Failed to fetch rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'requiredPoints', label: 'Required Points', format: (v: number) => v.toLocaleString() },
    { id: 'type', label: 'Type' },
    { id: 'active', label: 'Active', format: (v: boolean) => v ? 'Yes' : 'No' },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Rewards</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedReward(null)
          setOpenDialog(true)
        }}>
          Add Reward
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={rewards}
        page={0}
        rowsPerPage={10}
        totalElements={rewards.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
      <RewardFormDialog
        open={openDialog}
        reward={selectedReward}
        onClose={() => {
          setOpenDialog(false)
          setSelectedReward(null)
          fetchRewards()
        }}
      />
    </Box>
  )
}

export default RewardListPage

