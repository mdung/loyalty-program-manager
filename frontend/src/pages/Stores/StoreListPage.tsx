import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { storeApi, Store } from '../../api/storeApi'
import DataTable from '../../components/common/DataTable'
import StoreFormDialog from './StoreFormDialog'

const StoreListPage = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    setLoading(true)
    try {
      const response = await storeApi.getAll()
      setStores(response.data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'code', label: 'Code' },
    { id: 'city', label: 'City' },
    { id: 'country', label: 'Country' },
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
        <Typography variant="h4">Stores</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedStore(null)
          setOpenDialog(true)
        }}>
          Add Store
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={stores}
        page={0}
        rowsPerPage={10}
        totalElements={stores.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
      <StoreFormDialog
        open={openDialog}
        store={selectedStore}
        onClose={() => {
          setOpenDialog(false)
          setSelectedStore(null)
          fetchStores()
        }}
      />
    </Box>
  )
}

export default StoreListPage

