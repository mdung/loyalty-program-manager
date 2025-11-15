package com.company.loyalty.transaction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdjustPointsRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    @NotNull(message = "Points is required")
    private Long points; // Can be positive or negative

    private String description;
}

