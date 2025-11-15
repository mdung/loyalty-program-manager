import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, TextField, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { userApi, User } from '../../api/userApi'
import DataTable from '../../components/common/DataTable'
import UserFormDialog from './UserFormDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const [search, setSearch] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [page, size, search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await userApi.getAll(page, size, search || undefined)
      setUsers(response.data.content)
      setTotalElements(response.data.totalElements)
    } catch (error) {
      showToast('Failed to fetch users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.id) {
      try {
        await userApi.delete(deleteDialog.id)
        showToast('User deleted successfully', 'success')
        fetchUsers()
      } catch (error: any) {
        showToast('Failed to delete user', 'error')
      }
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns = [
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: User) => (
        <Box>
          <IconButton size="small" onClick={() => { setSelectedUser(row); setOpenDialog(true) }}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: row.id })}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add User
        </Button>
      </Box>
      <TextField
        fullWidth
        label="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(0)
        }}
        sx={{ mb: 2 }}
      />
      <DataTable
        columns={columns}
        rows={users}
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(newSize) => {
          setSize(newSize)
          setPage(0)
        }}
      />
      <UserFormDialog
        open={openDialog}
        user={selectedUser}
        onClose={() => {
          setOpenDialog(false)
          setSelectedUser(null)
          fetchUsers()
        }}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  )
}

export default UserListPage

