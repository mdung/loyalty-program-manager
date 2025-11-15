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
import { transactionApi } from '../../api/transactionApi'
import { customerApi } from '../../api/customerApi'
import { storeApi } from '../../api/storeApi'
import { rewardApi } from '../../api/rewardApi'
import { useToast } from '../../context/ToastContext'

interface TransactionFormDialogProps {
  open: boolean
  onClose: () => void
  type: 'earn' | 'redeem'
}

const TransactionFormDialog = ({ open, onClose, type }: TransactionFormDialogProps) => {
  const [formData, setFormData] = useState({
    customerId: '',
    storeId: '',
    transactionAmount: '',
    rewardId: '',
    pointsUsed: '',
    description: '',
  })
  const [customers, setCustomers] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    try {
      const [customersRes, storesRes, rewardsRes] = await Promise.all([
        customerApi.getAll(0, 100),
        storeApi.getAll(),
        rewardApi.getAll(),
      ])
      setCustomers(customersRes.data.content)
      setStores(storesRes.data)
      setRewards(rewardsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (type === 'earn') {
        await transactionApi.earn({
          customerId: Number(formData.customerId),
          storeId: Number(formData.storeId),
          transactionAmount: Number(formData.transactionAmount),
          description: formData.description,
        })
        showToast('Points earned successfully', 'success')
      } else {
        await transactionApi.redeem({
          customerId: Number(formData.customerId),
          storeId: Number(formData.storeId),
          rewardId: Number(formData.rewardId),
          pointsUsed: Number(formData.pointsUsed),
          description: formData.description,
        })
        showToast('Points redeemed successfully', 'success')
      }
      onClose()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to process transaction'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{type === 'earn' ? 'Earn Points' : 'Redeem Points'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              select
              label="Customer"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.fullName} ({c.membershipCode})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              select
              label="Store"
              value={formData.storeId}
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
            >
              {stores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {type === 'earn' ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="Transaction Amount"
                value={formData.transactionAmount}
                onChange={(e) => setFormData({ ...formData, transactionAmount: e.target.value })}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Reward"
                  value={formData.rewardId}
                  onChange={(e) => {
                    const reward = rewards.find((r) => r.id === Number(e.target.value))
                    setFormData({
                      ...formData,
                      rewardId: e.target.value,
                      pointsUsed: reward?.requiredPoints?.toString() || '',
                    })
                  }}
                >
                  {rewards.filter((r) => r.active).map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name} ({r.requiredPoints} points)
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Points Used"
                  value={formData.pointsUsed}
                  onChange={(e) => setFormData({ ...formData, pointsUsed: e.target.value })}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionFormDialog

