package com.company.loyalty.transaction.dto;

import com.company.loyalty.common.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String membershipCode;
    private Long storeId;
    private String storeName;
    private TransactionType type;
    private Long points;
    private BigDecimal transactionAmount;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
}

