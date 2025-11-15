import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { userApi, User } from '../../api/userApi'
import DataTable from '../../components/common/DataTable'
import UserFormDialog from './UserFormDialog'

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [search, setSearch] = useState('')

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
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
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
        onClose={() => {
          setOpenDialog(false)
          fetchUsers()
        }}
      />
    </Box>
  )
}

export default UserListPage

