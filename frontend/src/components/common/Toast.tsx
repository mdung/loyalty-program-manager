import { Snackbar, Alert, AlertColor } from '@mui/material'
import { Toast as ToastType } from '../../hooks/useToast'

interface ToastProps {
  toast: ToastType
  onClose: () => void
}

const Toast = ({ toast, onClose }: ToastProps) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={toast.type as AlertColor} sx={{ width: '100%' }}>
        {toast.message}
      </Alert>
    </Snackbar>
  )
}

export default Toast

