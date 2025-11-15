package com.company.loyalty.customer.dto;

import com.company.loyalty.common.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateCustomerRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    private String phone;
    private String email;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String city;
    private String country;
}

