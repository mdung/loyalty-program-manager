package com.company.loyalty.tier.service;

import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.tier.dto.TierDto;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TierServiceTest {

    @Mock
    private TierRepository tierRepository;

    @InjectMocks
    private TierService tierService;

    private Tier tier;
    private TierDto tierDto;

    @BeforeEach
    void setUp() {
        tier = Tier.builder()
                .id(1L)
                .name("Gold")
                .minPoints(1000L)
                .maxPoints(5000L)
                .priority(1)
                .build();

        tierDto = TierDto.builder()
                .id(1L)
                .name("Gold")
                .minPoints(1000L)
                .maxPoints(5000L)
                .priority(1)
                .build();
    }

    @Test
    void getAllTiers_ShouldReturnAllTiers() {
        when(tierRepository.findAll()).thenReturn(Arrays.asList(tier));

        List<TierDto> result = tierService.getAllTiers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Gold", result.get(0).getName());
    }

    @Test
    void getTierById_WhenExists_ShouldReturnTier() {
        when(tierRepository.findById(1L)).thenReturn(Optional.of(tier));

        TierDto result = tierService.getTierById(1L);

        assertNotNull(result);
        assertEquals("Gold", result.getName());
    }

    @Test
    void getTierById_WhenNotExists_ShouldThrowException() {
        when(tierRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tierService.getTierById(1L));
    }

    @Test
    void createTier_ShouldSaveAndReturnTier() {
        when(tierRepository.save(any(Tier.class))).thenReturn(tier);

        TierDto result = tierService.createTier(tierDto);

        assertNotNull(result);
        verify(tierRepository, times(1)).save(any(Tier.class));
    }

    @Test
    void updateTier_WhenExists_ShouldUpdateAndReturnTier() {
        when(tierRepository.findById(1L)).thenReturn(Optional.of(tier));
        when(tierRepository.save(any(Tier.class))).thenReturn(tier);

        TierDto result = tierService.updateTier(1L, tierDto);

        assertNotNull(result);
        verify(tierRepository, times(1)).save(any(Tier.class));
    }

    @Test
    void deleteTier_WhenExists_ShouldDeleteTier() {
        when(tierRepository.findById(1L)).thenReturn(Optional.of(tier));

        tierService.deleteTier(1L);

        verify(tierRepository, times(1)).delete(tier);
    }
}

