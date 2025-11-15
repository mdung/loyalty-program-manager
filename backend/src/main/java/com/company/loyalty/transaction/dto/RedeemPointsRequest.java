package com.company.loyalty.transaction.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RedeemPointsRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    @NotNull(message = "Reward ID is required")
    private Long rewardId;

    @NotNull(message = "Points used is required")
    @Positive(message = "Points used must be positive")
    private Long pointsUsed;

    private String description;
}

