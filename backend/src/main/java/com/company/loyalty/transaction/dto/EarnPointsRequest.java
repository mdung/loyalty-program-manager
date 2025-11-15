package com.company.loyalty.transaction.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EarnPointsRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    @NotNull(message = "Transaction amount is required")
    @Positive(message = "Transaction amount must be positive")
    private BigDecimal transactionAmount;

    private String description;
}

