package com.company.loyalty.tier.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.tier.dto.TierDto;
import com.company.loyalty.tier.service.TierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tiers")
public class TierController {

    @Autowired
    private TierService tierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TierDto>>> getAllTiers() {
        List<TierDto> tiers = tierService.getAllTiers();
        return ResponseEntity.ok(ApiResponse.success(tiers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TierDto>> getTierById(@PathVariable Long id) {
        TierDto tier = tierService.getTierById(id);
        return ResponseEntity.ok(ApiResponse.success(tier));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TierDto>> createTier(@Valid @RequestBody TierDto request) {
        TierDto tier = tierService.createTier(request);
        return ResponseEntity.ok(ApiResponse.success("Tier created successfully", tier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TierDto>> updateTier(
            @PathVariable Long id,
            @Valid @RequestBody TierDto request) {
        TierDto tier = tierService.updateTier(id, request);
        return ResponseEntity.ok(ApiResponse.success("Tier updated successfully", tier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteTier(@PathVariable Long id) {
        tierService.deleteTier(id);
        return ResponseEntity.ok(ApiResponse.success("Tier deleted successfully", null));
    }
}

