package com.company.loyalty.transaction.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.common.dto.PageResponse;
import com.company.loyalty.common.enums.TransactionType;
import com.company.loyalty.transaction.dto.AdjustPointsRequest;
import com.company.loyalty.transaction.dto.EarnPointsRequest;
import com.company.loyalty.transaction.dto.RedeemPointsRequest;
import com.company.loyalty.transaction.dto.TransactionDto;
import com.company.loyalty.transaction.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/earn")
    public ResponseEntity<ApiResponse<TransactionDto>> earnPoints(@Valid @RequestBody EarnPointsRequest request) {
        TransactionDto transaction = transactionService.earnPoints(request);
        return ResponseEntity.ok(ApiResponse.success("Points earned successfully", transaction));
    }

    @PostMapping("/redeem")
    public ResponseEntity<ApiResponse<TransactionDto>> redeemPoints(@Valid @RequestBody RedeemPointsRequest request) {
        TransactionDto transaction = transactionService.redeemPoints(request);
        return ResponseEntity.ok(ApiResponse.success("Points redeemed successfully", transaction));
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<TransactionDto>> adjustPoints(@Valid @RequestBody AdjustPointsRequest request) {
        TransactionDto transaction = transactionService.adjustPoints(request);
        return ResponseEntity.ok(ApiResponse.success("Points adjusted successfully", transaction));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TransactionDto>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        PageResponse<TransactionDto> response = transactionService.getAllTransactions(
                page, size, customerId, storeId, type, fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getCustomerTransactions(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<TransactionDto> transactions = transactionService.getCustomerTransactions(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}

