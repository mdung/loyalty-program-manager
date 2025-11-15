package com.company.loyalty.customer.service;

import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.customer.dto.CreateCustomerRequest;
import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.customer.repository.CustomerRepository;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import com.company.loyalty.transaction.repository.LoyaltyTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private TierRepository tierRepository;

    @Mock
    private LoyaltyTransactionRepository transactionRepository;

    @InjectMocks
    private CustomerService customerService;

    private Tier defaultTier;
    private Customer customer;
    private CreateCustomerRequest createRequest;

    @BeforeEach
    void setUp() {
        defaultTier = Tier.builder()
                .id(1L)
                .name("Bronze")
                .minPoints(0L)
                .maxPoints(999L)
                .build();

        customer = Customer.builder()
                .id(1L)
                .membershipCode("MEM123456")
                .fullName("John Doe")
                .phone("1234567890")
                .currentTier(defaultTier)
                .currentPointsBalance(0L)
                .build();

        createRequest = new CreateCustomerRequest();
        createRequest.setFullName("John Doe");
        createRequest.setPhone("1234567890");
    }

    @Test
    void createCustomer_ShouldGenerateMembershipCode() {
        when(tierRepository.findFirstByOrderByPriorityAsc()).thenReturn(Optional.of(defaultTier));
        when(customerRepository.existsByMembershipCode(anyString())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        var result = customerService.createCustomer(createRequest);

        assertNotNull(result);
        assertNotNull(result.getMembershipCode());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_WhenNoTierExists_ShouldThrowException() {
        when(tierRepository.findFirstByOrderByPriorityAsc()).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.createCustomer(createRequest));
    }

    @Test
    void getCustomerById_WhenExists_ShouldReturnCustomer() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        var result = customerService.getCustomerById(1L);

        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    void getCustomerById_WhenNotExists_ShouldThrowException() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomerById(1L));
    }
}

