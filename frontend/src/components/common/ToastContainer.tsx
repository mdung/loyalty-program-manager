import { Box } from '@mui/material'
import { useToast } from '../../context/ToastContext'
import Toast from './Toast'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </Box>
  )
}

export default ToastContainer

