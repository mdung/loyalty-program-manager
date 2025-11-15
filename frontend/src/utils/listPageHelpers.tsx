import { Box, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export const createActionsColumn = (
  onEdit: (row: any) => void,
  onDelete: (id: number) => void
) => ({
  id: 'actions',
  label: 'Actions',
  format: (value: any, row: any) => (
    <Box>
      <IconButton size="small" onClick={() => onEdit(row)}>
        <EditIcon />
      </IconButton>
      <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  ),
})

