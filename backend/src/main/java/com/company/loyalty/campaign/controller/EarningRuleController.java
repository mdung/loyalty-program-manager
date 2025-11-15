package com.company.loyalty.campaign.controller;

import com.company.loyalty.campaign.dto.EarningRuleDto;
import com.company.loyalty.campaign.service.EarningRuleService;
import com.company.loyalty.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/earning-rules")
public class EarningRuleController {

    @Autowired
    private EarningRuleService earningRuleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EarningRuleDto>>> getAllEarningRules() {
        List<EarningRuleDto> rules = earningRuleService.getAllEarningRules();
        return ResponseEntity.ok(ApiResponse.success(rules));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EarningRuleDto>> getEarningRuleById(@PathVariable Long id) {
        EarningRuleDto rule = earningRuleService.getEarningRuleById(id);
        return ResponseEntity.ok(ApiResponse.success(rule));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EarningRuleDto>> createEarningRule(@Valid @RequestBody EarningRuleDto request) {
        EarningRuleDto rule = earningRuleService.createEarningRule(request);
        return ResponseEntity.ok(ApiResponse.success("Earning rule created successfully", rule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EarningRuleDto>> updateEarningRule(
            @PathVariable Long id,
            @Valid @RequestBody EarningRuleDto request) {
        EarningRuleDto rule = earningRuleService.updateEarningRule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Earning rule updated successfully", rule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteEarningRule(@PathVariable Long id) {
        earningRuleService.deleteEarningRule(id);
        return ResponseEntity.ok(ApiResponse.success("Earning rule deleted successfully", null));
    }
}

