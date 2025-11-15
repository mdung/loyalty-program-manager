package com.company.loyalty.reward.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.common.dto.PageResponse;
import com.company.loyalty.common.enums.RedemptionStatus;
import com.company.loyalty.reward.dto.RedemptionDto;
import com.company.loyalty.reward.dto.RewardDto;
import com.company.loyalty.reward.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RewardDto>>> getAllRewards() {
        List<RewardDto> rewards = rewardService.getAllRewards();
        return ResponseEntity.ok(ApiResponse.success(rewards));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RewardDto>> getRewardById(@PathVariable Long id) {
        RewardDto reward = rewardService.getRewardById(id);
        return ResponseEntity.ok(ApiResponse.success(reward));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RewardDto>> createReward(@Valid @RequestBody RewardDto request) {
        RewardDto reward = rewardService.createReward(request);
        return ResponseEntity.ok(ApiResponse.success("Reward created successfully", reward));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RewardDto>> updateReward(
            @PathVariable Long id,
            @Valid @RequestBody RewardDto request) {
        RewardDto reward = rewardService.updateReward(id, request);
        return ResponseEntity.ok(ApiResponse.success("Reward updated successfully", reward));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok(ApiResponse.success("Reward deleted successfully", null));
    }

    @GetMapping("/redemptions")
    public ResponseEntity<ApiResponse<PageResponse<RedemptionDto>>> getAllRedemptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) RedemptionStatus status,
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        PageResponse<RedemptionDto> response = rewardService.getAllRedemptions(
                page, size, status, storeId, fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/redemptions/{id}/approve")
    public ResponseEntity<ApiResponse<RedemptionDto>> approveRedemption(@PathVariable Long id) {
        RedemptionDto redemption = rewardService.approveRedemption(id);
        return ResponseEntity.ok(ApiResponse.success("Redemption approved", redemption));
    }

    @PutMapping("/redemptions/{id}/reject")
    public ResponseEntity<ApiResponse<RedemptionDto>> rejectRedemption(@PathVariable Long id) {
        RedemptionDto redemption = rewardService.rejectRedemption(id);
        return ResponseEntity.ok(ApiResponse.success("Redemption rejected", redemption));
    }

    @PutMapping("/redemptions/{id}/complete")
    public ResponseEntity<ApiResponse<RedemptionDto>> completeRedemption(@PathVariable Long id) {
        RedemptionDto redemption = rewardService.completeRedemption(id);
        return ResponseEntity.ok(ApiResponse.success("Redemption completed", redemption));
    }
}

