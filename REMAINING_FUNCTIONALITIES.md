# Remaining Functionalities

## Backend (BE) - Missing Features

### 1. Earning Rules Management API
- **Status**: Entity exists, but no CRUD API
- **Missing**:
  - `GET /api/earning-rules` - List all earning rules
  - `GET /api/earning-rules/{id}` - Get earning rule by ID
  - `POST /api/earning-rules` - Create earning rule
  - `PUT /api/earning-rules/{id}` - Update earning rule
  - `DELETE /api/earning-rules/{id}` - Delete earning rule
- **Files to create**:
  - `backend/src/main/java/com/company/loyalty/campaign/controller/EarningRuleController.java`
  - `backend/src/main/java/com/company/loyalty/campaign/dto/EarningRuleDto.java`
  - `backend/src/main/java/com/company/loyalty/campaign/service/EarningRuleService.java`

### 2. Dashboard Reports - Additional Endpoints
- **Status**: Basic overview exists, missing detailed reports
- **Missing**:
  - `GET /api/dashboard/points-by-store?from=...&to=...` - Points issued/redeemed by store
  - `GET /api/dashboard/new-customers?from=...&to=...` - New customers by date range
  - `GET /api/dashboard/points-trend?from=...&to=...` - Points trend over time
  - `GET /api/dashboard/redemption-trend?from=...&to=...` - Redemption trend
- **Files to update**:
  - `backend/src/main/java/com/company/loyalty/dashboard/controller/DashboardController.java`
  - `backend/src/main/java/com/company/loyalty/dashboard/service/DashboardService.java`
  - `backend/src/main/java/com/company/loyalty/dashboard/dto/` - New DTOs for reports

### 3. User Profile Management
- **Status**: Missing
- **Missing**:
  - `GET /api/auth/profile` - Get current user profile
  - `PUT /api/auth/profile` - Update current user profile
  - `PUT /api/auth/change-password` - Change password
- **Files to create/update**:
  - `backend/src/main/java/com/company/loyalty/auth/controller/AuthController.java` (add endpoints)
  - `backend/src/main/java/com/company/loyalty/auth/dto/ChangePasswordRequest.java`
  - `backend/src/main/java/com/company/loyalty/auth/dto/UpdateProfileRequest.java`

### 4. Enhanced Transaction Features
- **Status**: Basic functionality exists
- **Missing**:
  - Transaction export (CSV/Excel)
  - Bulk transaction processing
  - Transaction reversal/cancellation
- **Files to update**:
  - `backend/src/main/java/com/company/loyalty/transaction/controller/TransactionController.java`
  - `backend/src/main/java/com/company/loyalty/transaction/service/TransactionService.java`

### 5. Advanced Campaign Features
- **Status**: Basic CRUD exists
- **Missing**:
  - Campaign activation/deactivation
  - Campaign performance metrics
  - Campaign conditions validation
- **Files to update**:
  - `backend/src/main/java/com/company/loyalty/campaign/service/CampaignService.java`

### 6. Customer Advanced Features
- **Status**: Basic CRUD exists
- **Missing**:
  - Customer import (CSV/Excel)
  - Customer export
  - Customer merge/duplicate detection
  - Customer activity timeline
- **Files to update**:
  - `backend/src/main/java/com/company/loyalty/customer/controller/CustomerController.java`
  - `backend/src/main/java/com/company/loyalty/customer/service/CustomerService.java`

### 7. Unit Tests
- **Status**: Missing
- **Missing**:
  - Service layer unit tests
  - Controller unit tests
  - Repository integration tests
- **Files to create**:
  - `backend/src/test/java/com/company/loyalty/**/*Test.java`

### 8. Additional Validations
- **Status**: Basic validation exists
- **Missing**:
  - Business rule validations (e.g., tier points range validation)
  - Custom validators
  - Transaction amount validations

---

## Frontend (FE) - Missing Features

### 1. Earning Rules Management Page
- **Status**: Missing completely
- **Missing**:
  - Earning Rules list page
  - Create/Edit/Delete earning rule form
  - Earning rule API integration
- **Files to create**:
  - `frontend/src/pages/EarningRules/EarningRuleListPage.tsx`
  - `frontend/src/pages/EarningRules/EarningRuleFormDialog.tsx`
  - `frontend/src/api/earningRuleApi.ts`
  - Update `frontend/src/routes/AppRoutes.tsx` to add route
  - Update `frontend/src/components/layout/Sidebar.tsx` to add menu item

### 2. Edit/Delete Functionality in List Pages
- **Status**: Create exists, but Edit/Delete missing in UI
- **Missing**:
  - Edit button in Tiers list page
  - Delete button in Tiers list page
  - Edit button in Stores list page
  - Delete button in Stores list page
  - Edit button in Rewards list page
  - Delete button in Rewards list page
  - Edit button in Campaigns list page
  - Delete button in Campaigns list page
  - Edit button in Customers list page
  - Edit button in Users list page
- **Files to update**:
  - `frontend/src/pages/Tiers/TierListPage.tsx`
  - `frontend/src/pages/Stores/StoreListPage.tsx`
  - `frontend/src/pages/Rewards/RewardListPage.tsx`
  - `frontend/src/pages/Campaigns/CampaignListPage.tsx`
  - `frontend/src/pages/Customers/CustomerListPage.tsx`
  - `frontend/src/pages/Users/UserListPage.tsx`

### 3. Transaction Filters UI
- **Status**: Backend supports filters, but UI doesn't use them
- **Missing**:
  - Date range picker for filtering transactions
  - Store filter dropdown
  - Transaction type filter (EARN/REDEEM/ADJUSTMENT)
  - Customer filter/search
- **Files to update**:
  - `frontend/src/pages/Transactions/TransactionListPage.tsx`

### 4. Dashboard Enhanced Charts
- **Status**: Basic charts exist
- **Missing**:
  - New members per month chart (line chart)
  - Points by store chart (bar chart)
  - Points trend over time (line chart)
  - Redemption trend chart
  - Date range selector for dashboard
- **Files to update**:
  - `frontend/src/pages/DashboardPage.tsx`
  - `frontend/src/api/dashboardApi.ts` (add new endpoints)

### 5. Profile/Settings Page
- **Status**: Missing completely
- **Missing**:
  - User profile page
  - Change password form
  - Update profile information
- **Files to create**:
  - `frontend/src/pages/Profile/ProfilePage.tsx`
  - `frontend/src/pages/Profile/ChangePasswordDialog.tsx`
  - Update `frontend/src/routes/AppRoutes.tsx`
  - Update `frontend/src/components/layout/Navbar.tsx` to add profile link

### 6. Toast Notifications
- **Status**: Missing
- **Missing**:
  - Success notifications (e.g., "Customer created successfully")
  - Error notifications (e.g., "Failed to save")
  - Info notifications
- **Files to create**:
  - `frontend/src/components/common/Toast.tsx` or use react-toastify
  - Update all form dialogs to show notifications

### 7. Delete Confirmation Dialogs
- **Status**: Missing
- **Missing**:
  - Confirmation dialog before deleting
  - "Are you sure?" prompts
- **Files to create**:
  - `frontend/src/components/common/ConfirmDialog.tsx`
  - Update all delete operations to use confirmation

### 8. Customer Detail Page Enhancements
- **Status**: Basic page exists
- **Missing**:
  - Edit customer button
  - Customer summary card
  - Transaction history pagination
  - Points history chart
- **Files to update**:
  - `frontend/src/pages/Customers/CustomerDetailPage.tsx`

### 9. Redemption List Enhancements
- **Status**: Basic list exists
- **Missing**:
  - Filters (status, store, date range)
  - Bulk approve/reject
  - Redemption details view
- **Files to update**:
  - `frontend/src/pages/Redemptions/RedemptionListPage.tsx`

### 10. Error Handling & Loading States
- **Status**: Basic exists
- **Missing**:
  - Better error messages
  - Loading skeletons
  - Retry mechanisms
  - Network error handling
- **Files to update**:
  - All pages and components

### 11. Search and Filter Enhancements
- **Status**: Basic search exists
- **Missing**:
  - Advanced search in customers
  - Multi-criteria filtering
  - Saved filters
  - Export filtered results

### 12. Responsive Design Improvements
- **Status**: Basic responsive exists
- **Missing**:
  - Mobile-optimized forms
  - Better mobile navigation
  - Touch-friendly buttons
  - Responsive tables

### 13. Data Export Features
- **Status**: Missing
- **Missing**:
  - Export customers to CSV/Excel
  - Export transactions to CSV/Excel
  - Export reports to PDF
- **Files to create**:
  - `frontend/src/utils/exportUtils.ts`
  - Add export buttons to relevant pages

### 14. Bulk Operations
- **Status**: Missing
- **Missing**:
  - Bulk customer import
  - Bulk transaction processing
  - Bulk tier assignment
- **Files to create**:
  - `frontend/src/pages/Customers/CustomerImportDialog.tsx`
  - `frontend/src/pages/Transactions/BulkTransactionDialog.tsx`

### 15. Real-time Updates (Optional Enhancement)
- **Status**: Missing
- **Missing**:
  - WebSocket integration for real-time dashboard updates
  - Real-time notifications
- **Files to create**:
  - `frontend/src/hooks/useWebSocket.ts`
  - `frontend/src/context/NotificationContext.tsx`

---

## Summary

### High Priority (Core Features)
1. ✅ Earning Rules Management (Backend + Frontend)
2. ✅ Edit/Delete buttons in all list pages
3. ✅ Transaction filters UI
4. ✅ Profile/Settings page
5. ✅ Toast notifications
6. ✅ Delete confirmation dialogs

### Medium Priority (Enhanced Features)
7. Dashboard enhanced charts (new members, points by store)
8. Customer detail page enhancements
9. Redemption list filters
10. Better error handling

### Low Priority (Nice to Have)
11. Data export features
12. Bulk operations
13. Real-time updates
14. Advanced search
15. Unit tests

---

## Estimated Implementation Time

- **High Priority**: ~2-3 days
- **Medium Priority**: ~2-3 days
- **Low Priority**: ~3-5 days
- **Total**: ~7-11 days of development

