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
import { tierApi, Tier } from '../../api/tierApi'

interface TierFormDialogProps {
  open: boolean
  onClose: () => void
  tier?: Tier | null
}

const TierFormDialog = ({ open, onClose, tier }: TierFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<Tier>>({
    name: '',
    minPoints: 0,
    maxPoints: 0,
    benefitsDescription: '',
    priority: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tier) {
      setFormData(tier)
    } else {
      setFormData({ name: '', minPoints: 0, maxPoints: 0, benefitsDescription: '', priority: 0 })
    }
  }, [tier, open])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (tier) {
        await tierApi.update(tier.id, formData as Tier)
      } else {
        await tierApi.create(formData as Tier)
      }
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save tier')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tier ? 'Edit Tier' : 'Add Tier'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Min Points"
              value={formData.minPoints}
              onChange={(e) => setFormData({ ...formData, minPoints: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Max Points"
              value={formData.maxPoints}
              onChange={(e) => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Benefits Description"
              multiline
              rows={3}
              value={formData.benefitsDescription}
              onChange={(e) => setFormData({ ...formData, benefitsDescription: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type="number"
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
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

export default TierFormDialog

