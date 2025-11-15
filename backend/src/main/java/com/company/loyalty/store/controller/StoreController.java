package com.company.loyalty.store.controller;

import com.company.loyalty.common.dto.ApiResponse;
import com.company.loyalty.store.dto.StoreDto;
import com.company.loyalty.store.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreDto>>> getAllStores() {
        List<StoreDto> stores = storeService.getAllStores();
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreDto>> getStoreById(@PathVariable Long id) {
        StoreDto store = storeService.getStoreById(id);
        return ResponseEntity.ok(ApiResponse.success(store));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StoreDto>> createStore(@Valid @RequestBody StoreDto request) {
        StoreDto store = storeService.createStore(request);
        return ResponseEntity.ok(ApiResponse.success("Store created successfully", store));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreDto>> updateStore(
            @PathVariable Long id,
            @Valid @RequestBody StoreDto request) {
        StoreDto store = storeService.updateStore(id, request);
        return ResponseEntity.ok(ApiResponse.success("Store updated successfully", store));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok(ApiResponse.success("Store deleted successfully", null));
    }
}

