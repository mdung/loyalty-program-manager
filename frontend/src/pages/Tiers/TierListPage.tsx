import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { tierApi, Tier } from '../../api/tierApi'
import DataTable from '../../components/common/DataTable'
import TierFormDialog from './TierFormDialog'

const TierListPage = () => {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  useEffect(() => {
    fetchTiers()
  }, [])

  const fetchTiers = async () => {
    setLoading(true)
    try {
      const response = await tierApi.getAll()
      setTiers(response.data)
    } catch (error) {
      console.error('Failed to fetch tiers:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'minPoints', label: 'Min Points', format: (v: number) => v.toLocaleString() },
    { id: 'maxPoints', label: 'Max Points', format: (v: number) => v.toLocaleString() },
    { id: 'priority', label: 'Priority' },
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
        <Typography variant="h4">Tiers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedTier(null)
          setOpenDialog(true)
        }}>
          Add Tier
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={tiers}
        page={0}
        rowsPerPage={10}
        totalElements={tiers.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
      <TierFormDialog
        open={openDialog}
        tier={selectedTier}
        onClose={() => {
          setOpenDialog(false)
          setSelectedTier(null)
          fetchTiers()
        }}
      />
    </Box>
  )
}

export default TierListPage

