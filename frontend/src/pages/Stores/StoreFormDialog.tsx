import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material'
import { storeApi, Store } from '../../api/storeApi'
import { useToast } from '../../context/ToastContext'

interface StoreFormDialogProps {
  open: boolean
  onClose: () => void
  store?: Store | null
}

const StoreFormDialog = ({ open, onClose, store }: StoreFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    code: '',
    address: '',
    city: '',
    country: '',
    active: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (store) {
      setFormData(store)
    } else {
      setFormData({ name: '', code: '', address: '', city: '', country: '', active: true })
    }
  }, [store, open])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (store) {
        await storeApi.update(store.id, formData as Store)
        showToast('Store updated successfully', 'success')
      } else {
        await storeApi.create(formData as Store)
        showToast('Store created successfully', 'success')
      }
      onClose()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save store'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{store ? 'Edit Store' : 'Add Store'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StoreFormDialog

