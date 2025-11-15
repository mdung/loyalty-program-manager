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
  MenuItem,
} from '@mui/material'
import { rewardApi, Reward } from '../../api/rewardApi'
import { useToast } from '../../context/ToastContext'

interface RewardFormDialogProps {
  open: boolean
  onClose: () => void
  reward?: Reward | null
}

const RewardFormDialog = ({ open, onClose, reward }: RewardFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<Reward>>({
    name: '',
    description: '',
    requiredPoints: 0,
    type: 'VOUCHER',
    active: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (reward) {
      setFormData(reward)
    } else {
      setFormData({ name: '', description: '', requiredPoints: 0, type: 'VOUCHER', active: true })
    }
  }, [reward, open])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (reward) {
        await rewardApi.update(reward.id, formData as Reward)
        showToast('Reward updated successfully', 'success')
      } else {
        await rewardApi.create(formData as Reward)
        showToast('Reward created successfully', 'success')
      }
      onClose()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save reward'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{reward ? 'Edit Reward' : 'Add Reward'}</DialogTitle>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Required Points"
              value={formData.requiredPoints}
              onChange={(e) => setFormData({ ...formData, requiredPoints: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <MenuItem value="VOUCHER">Voucher</MenuItem>
              <MenuItem value="DISCOUNT">Discount</MenuItem>
              <MenuItem value="GIFT">Gift</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
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

export default RewardFormDialog

