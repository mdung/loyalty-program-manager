import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { rewardApi, Reward } from '../../api/rewardApi'
import DataTable from '../../components/common/DataTable'
import RewardFormDialog from './RewardFormDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const RewardListPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const { showToast } = useToast()

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    setLoading(true)
    try {
      const response = await rewardApi.getAll()
      setRewards(response.data)
    } catch (error) {
      showToast('Failed to fetch rewards', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.id) {
      try {
        await rewardApi.delete(deleteDialog.id)
        showToast('Reward deleted successfully', 'success')
        fetchRewards()
      } catch (error: any) {
        showToast('Failed to delete reward', 'error')
      }
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'requiredPoints', label: 'Required Points', format: (v: number) => v.toLocaleString() },
    { id: 'type', label: 'Type' },
    { id: 'active', label: 'Active', format: (v: boolean) => v ? 'Yes' : 'No' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Reward) => (
        <Box>
          <IconButton size="small" onClick={() => { setSelectedReward(row); setOpenDialog(true) }}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: row.id })}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
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
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Reward"
        message="Are you sure you want to delete this reward?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  )
}

export default RewardListPage

