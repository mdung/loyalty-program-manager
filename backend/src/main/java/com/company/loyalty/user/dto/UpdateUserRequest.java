package com.company.loyalty.user.dto;

import com.company.loyalty.common.enums.UserRole;
import com.company.loyalty.common.enums.UserStatus;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private UserRole role;
    private UserStatus status;
}

