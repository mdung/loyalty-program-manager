package com.company.loyalty.auth.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Email(message = "Email should be valid")
    private String email;
}

