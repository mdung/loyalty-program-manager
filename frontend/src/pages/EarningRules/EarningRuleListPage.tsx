import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { earningRuleApi, EarningRule } from '../../api/earningRuleApi'
import DataTable from '../../components/common/DataTable'
import EarningRuleFormDialog from './EarningRuleFormDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const EarningRuleListPage = () => {
  const [rules, setRules] = useState<EarningRule[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRule, setSelectedRule] = useState<EarningRule | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const { showToast } = useToast()

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    setLoading(true)
    try {
      const response = await earningRuleApi.getAll()
      setRules(response.data)
    } catch (error: any) {
      showToast('Failed to fetch earning rules', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.id) {
      try {
        await earningRuleApi.delete(deleteDialog.id)
        showToast('Earning rule deleted successfully', 'success')
        fetchRules()
      } catch (error: any) {
        showToast('Failed to delete earning rule', 'error')
      }
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'basePointsPerCurrencyUnit', label: 'Points per Unit', format: (v: number) => v.toFixed(2) },
    { id: 'storeName', label: 'Store' },
    { id: 'tierName', label: 'Tier' },
    { id: 'active', label: 'Active', format: (v: boolean) => v ? 'Yes' : 'No' },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: EarningRule) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedRule(row)
              setOpenDialog(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteDialog({ open: true, id: row.id })}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Earning Rules</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setSelectedRule(null)
          setOpenDialog(true)
        }}>
          Add Earning Rule
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={rules}
        page={0}
        rowsPerPage={10}
        totalElements={rules.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
      <EarningRuleFormDialog
        open={openDialog}
        rule={selectedRule}
        onClose={() => {
          setOpenDialog(false)
          setSelectedRule(null)
          fetchRules()
        }}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Earning Rule"
        message="Are you sure you want to delete this earning rule?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  )
}

export default EarningRuleListPage

