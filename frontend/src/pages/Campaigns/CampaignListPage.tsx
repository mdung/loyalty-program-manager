import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { campaignApi, Campaign } from '../../api/campaignApi'
import DataTable from '../../components/common/DataTable'
import CampaignFormDialog from './CampaignFormDialog'

const CampaignListPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const response = await campaignApi.getAll()
      setCampaigns(response.data)
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'startDate', label: 'Start Date', format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'endDate', label: 'End Date', format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'earningMultiplier', label: 'Multiplier', format: (v: number) => `${v}x` },
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
    </Box>
  )
}

export default CampaignListPage

