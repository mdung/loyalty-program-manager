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
import { campaignApi, Campaign } from '../../api/campaignApi'

interface CampaignFormDialogProps {
  open: boolean
  onClose: () => void
  campaign?: Campaign | null
}

const CampaignFormDialog = ({ open, onClose, campaign }: CampaignFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    earningMultiplier: 1.0,
    conditions: '',
    active: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (campaign) {
      setFormData({
        ...campaign,
        startDate: campaign.startDate.split('T')[0],
        endDate: campaign.endDate.split('T')[0],
      })
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        earningMultiplier: 1.0,
        conditions: '',
        active: true,
      })
    }
  }, [campaign, open])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (campaign) {
        await campaignApi.update(campaign.id, formData as Campaign)
      } else {
        await campaignApi.create(formData as Campaign)
      }
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{campaign ? 'Edit Campaign' : 'Add Campaign'}</DialogTitle>
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
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type="number"
              label="Earning Multiplier"
              value={formData.earningMultiplier}
              onChange={(e) => setFormData({ ...formData, earningMultiplier: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conditions (JSON)"
              multiline
              rows={2}
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
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

export default CampaignFormDialog

