import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { storeApi, Store } from '../../api/storeApi'
import DataTable from '../../components/common/DataTable'
import StoreFormDialog from './StoreFormDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const StoreListPage = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const { showToast } = useToast()

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    setLoading(true)
    try {
      const response = await storeApi.getAll()
      setStores(response.data)
    } catch (error) {
      showToast('Failed to fetch stores', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.id) {
      try {
        await storeApi.delete(deleteDialog.id)
        showToast('Store deleted successfully', 'success')
        fetchStores()
      } catch (error: any) {
        showToast('Failed to delete store', 'error')
      }
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'code', label: 'Code' },
    { id: 'city', label: 'City' },
    { id: 'country', label: 'Country' },
    { id: 'active', label: 'Active', format: (v: boolean) => v ? 'Yes' : 'No' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Store) => (
        <Box>
          <IconButton size="small" onClick={() => { setSelectedStore(row); setOpenDialog(true) }}>
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
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Store"
        message="Are you sure you want to delete this store?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  )
}

export default StoreListPage

