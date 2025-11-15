package com.company.loyalty.store.service;

import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.store.dto.StoreDto;
import com.company.loyalty.store.entity.Store;
import com.company.loyalty.store.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    public List<StoreDto> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StoreDto getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));
        return toDto(store);
    }

    @Transactional
    public StoreDto createStore(StoreDto dto) {
        if (storeRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Store code already exists");
        }

        Store store = Store.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .address(dto.getAddress())
                .city(dto.getCity())
                .country(dto.getCountry())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        store = storeRepository.save(store);
        return toDto(store);
    }

    @Transactional
    public StoreDto updateStore(Long id, StoreDto dto) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));

        store.setName(dto.getName());
        store.setCode(dto.getCode());
        store.setAddress(dto.getAddress());
        store.setCity(dto.getCity());
        store.setCountry(dto.getCountry());
        if (dto.getActive() != null) {
            store.setActive(dto.getActive());
        }

        store = storeRepository.save(store);
        return toDto(store);
    }

    @Transactional
    public void deleteStore(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + id));
        store.setActive(false);
        storeRepository.save(store);
    }

    private StoreDto toDto(Store store) {
        return StoreDto.builder()
                .id(store.getId())
                .name(store.getName())
                .code(store.getCode())
                .address(store.getAddress())
                .city(store.getCity())
                .country(store.getCountry())
                .active(store.getActive())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .build();
    }
}

