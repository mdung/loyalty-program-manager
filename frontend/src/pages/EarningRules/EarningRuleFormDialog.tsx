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
import { earningRuleApi, EarningRule } from '../../api/earningRuleApi'
import { storeApi } from '../../api/storeApi'
import { tierApi } from '../../api/tierApi'
import { campaignApi } from '../../api/campaignApi'
import { useToast } from '../../context/ToastContext'

interface EarningRuleFormDialogProps {
  open: boolean
  onClose: () => void
  rule?: EarningRule | null
}

const EarningRuleFormDialog = ({ open, onClose, rule }: EarningRuleFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<EarningRule>>({
    name: '',
    basePointsPerCurrencyUnit: 0.01,
    active: true,
  })
  const [stores, setStores] = useState<any[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (open) {
      fetchData()
      if (rule) {
        setFormData(rule)
      } else {
        setFormData({ name: '', basePointsPerCurrencyUnit: 0.01, active: true })
      }
    }
  }, [rule, open])

  const fetchData = async () => {
    try {
      const [storesRes, tiersRes, campaignsRes] = await Promise.all([
        storeApi.getAll(),
        tierApi.getAll(),
        campaignApi.getAll(),
      ])
      setStores(storesRes.data)
      setTiers(tiersRes.data)
      setCampaigns(campaignsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (rule) {
        await earningRuleApi.update(rule.id, formData as EarningRule)
        showToast('Earning rule updated successfully', 'success')
      } else {
        await earningRuleApi.create(formData as EarningRule)
        showToast('Earning rule created successfully', 'success')
      }
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save earning rule')
      showToast('Failed to save earning rule', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{rule ? 'Edit Earning Rule' : 'Add Earning Rule'}</DialogTitle>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Points per Currency Unit"
              value={formData.basePointsPerCurrencyUnit}
              onChange={(e) => setFormData({ ...formData, basePointsPerCurrencyUnit: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Min Amount"
              value={formData.minAmount || ''}
              onChange={(e) => setFormData({ ...formData, minAmount: e.target.value ? Number(e.target.value) : undefined })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Amount"
              value={formData.maxAmount || ''}
              onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Store (Optional)"
              value={formData.storeId || ''}
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value ? Number(e.target.value) : undefined })}
            >
              <MenuItem value="">None</MenuItem>
              {stores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Tier (Optional)"
              value={formData.tierId || ''}
              onChange={(e) => setFormData({ ...formData, tierId: e.target.value ? Number(e.target.value) : undefined })}
            >
              <MenuItem value="">None</MenuItem>
              {tiers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Campaign (Optional)"
              value={formData.campaignId || ''}
              onChange={(e) => setFormData({ ...formData, campaignId: e.target.value ? Number(e.target.value) : undefined })}
            >
              <MenuItem value="">None</MenuItem>
              {campaigns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
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

export default EarningRuleFormDialog

