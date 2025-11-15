import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { campaignApi, Campaign } from '../../api/campaignApi'
import DataTable from '../../components/common/DataTable'
import CampaignFormDialog from './CampaignFormDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const CampaignListPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const { showToast } = useToast()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const response = await campaignApi.getAll()
      setCampaigns(response.data)
    } catch (error) {
      showToast('Failed to fetch campaigns', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.id) {
      try {
        await campaignApi.delete(deleteDialog.id)
        showToast('Campaign deleted successfully', 'success')
        fetchCampaigns()
      } catch (error: any) {
        showToast('Failed to delete campaign', 'error')
      }
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'startDate', label: 'Start Date', format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'endDate', label: 'End Date', format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'earningMultiplier', label: 'Multiplier', format: (v: number) => `${v}x` },
    { id: 'active', label: 'Active', format: (v: boolean) => v ? 'Yes' : 'No' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Campaign) => (
        <Box>
          <IconButton size="small" onClick={() => { setSelectedCampaign(row); setOpenDialog(true) }}>
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
        <Typography variant="h4">Campaigns</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedCampaign(null)
          setOpenDialog(true)
        }}>
          Add Campaign
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={campaigns}
        page={0}
        rowsPerPage={10}
        totalElements={campaigns.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
      <CampaignFormDialog
        open={openDialog}
        campaign={selectedCampaign}
        onClose={() => {
          setOpenDialog(false)
          setSelectedCampaign(null)
          fetchCampaigns()
        }}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  )
}

export default CampaignListPage

