import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import StarIcon from '@mui/icons-material/Star'
import StoreIcon from '@mui/icons-material/Store'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import CampaignIcon from '@mui/icons-material/Campaign'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Tiers', icon: <StarIcon />, path: '/tiers' },
  { text: 'Stores', icon: <StoreIcon />, path: '/stores' },
  { text: 'Transactions', icon: <SwapHorizIcon />, path: '/transactions' },
  { text: 'Rewards', icon: <CardGiftcardIcon />, path: '/rewards' },
  { text: 'Redemptions', icon: <CardGiftcardIcon />, path: '/redemptions' },
  { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
  { text: 'Users', icon: <AdminPanelSettingsIcon />, path: '/users', adminOnly: true },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  )
}

export default Sidebar

