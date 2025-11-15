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
import { userApi, CreateUserRequest, UpdateUserRequest } from '../../api/userApi'
import { useToast } from '../../context/ToastContext'

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  user?: any
}

const UserFormDialog = ({ open, onClose, user }: UserFormDialogProps) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    email: '',
    role: 'STAFF',
  })
  const [updateData, setUpdateData] = useState<UpdateUserRequest>({
    role: 'STAFF',
    status: 'ACTIVE',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (user && open) {
      setUpdateData({ role: user.role, status: user.status })
    } else if (open) {
      setFormData({ username: '', password: '', email: '', role: 'STAFF' })
    }
  }, [user, open])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (user) {
        await userApi.update(user.id, updateData)
        showToast('User updated successfully', 'success')
      } else {
        await userApi.create(formData)
        showToast('User created successfully', 'success')
      }
      onClose()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save user'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!!user}
            />
          </Grid>
          {!user && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!user}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              select
              label="Role"
              value={user ? updateData.role : formData.role}
              onChange={(e) => {
                if (user) {
                  setUpdateData({ ...updateData, role: e.target.value as any })
                } else {
                  setFormData({ ...formData, role: e.target.value as any })
                }
              }}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
            </TextField>
          </Grid>
          {user && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                select
                label="Status"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as any })}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="DISABLED">Disabled</MenuItem>
              </TextField>
            </Grid>
          )}
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

export default UserFormDialog

