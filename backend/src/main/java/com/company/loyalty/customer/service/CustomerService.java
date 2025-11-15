package com.company.loyalty.customer.service;

import com.company.loyalty.common.dto.PageResponse;
import com.company.loyalty.common.exception.ResourceNotFoundException;
import com.company.loyalty.customer.dto.CreateCustomerRequest;
import com.company.loyalty.customer.dto.CustomerDto;
import com.company.loyalty.customer.dto.CustomerSummaryDto;
import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.customer.repository.CustomerRepository;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import com.company.loyalty.transaction.entity.LoyaltyTransaction;
import com.company.loyalty.transaction.repository.LoyaltyTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TierRepository tierRepository;

    @Autowired
    private LoyaltyTransactionRepository transactionRepository;

    public PageResponse<CustomerDto> getAllCustomers(int page, int size, String name, String phone, Long tierId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Customer> customerPage = customerRepository.findByFilters(name, phone, tierId, pageable);

        return PageResponse.<CustomerDto>builder()
                .content(customerPage.getContent().stream().map(this::toDto).toList())
                .page(customerPage.getNumber())
                .size(customerPage.getSize())
                .totalElements(customerPage.getTotalElements())
                .totalPages(customerPage.getTotalPages())
                .first(customerPage.isFirst())
                .last(customerPage.isLast())
                .build();
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return toDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CreateCustomerRequest request) {
        String membershipCode = generateUniqueMembershipCode();
        
        // Get default tier (lowest tier)
        Tier defaultTier = tierRepository.findFirstByOrderByPriorityAsc()
                .orElseThrow(() -> new ResourceNotFoundException("No tier found. Please create tiers first."));

        Customer customer = Customer.builder()
                .membershipCode(membershipCode)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .currentTier(defaultTier)
                .currentPointsBalance(0L)
                .build();

        customer = customerRepository.save(customer);
        return toDto(customer);
    }

    @Transactional
    public CustomerDto updateCustomer(Long id, CreateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(request.getGender());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setCountry(request.getCountry());

        customer = customerRepository.save(customer);
        return toDto(customer);
    }

    @Transactional
    public void updateCustomerTier(Customer customer) {
        Long points = customer.getCurrentPointsBalance();
        Tier newTier = tierRepository.findByMinPointsLessThanEqualAndMaxPointsGreaterThanEqual(points, points)
                .orElse(customer.getCurrentTier());

        if (!newTier.getId().equals(customer.getCurrentTier().getId())) {
            customer.setCurrentTier(newTier);
            customerRepository.save(customer);
        }
    }

    public CustomerSummaryDto getCustomerSummary(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        Long totalEarned = transactionRepository.sumPointsByCustomerAndType(id, com.company.loyalty.common.enums.TransactionType.EARN);
        Long totalRedeemed = transactionRepository.sumPointsByCustomerAndType(id, com.company.loyalty.common.enums.TransactionType.REDEEM);
        Long totalTransactions = transactionRepository.countByCustomerId(id);
        LocalDateTime lastTransaction = transactionRepository.findLastTransactionDateByCustomerId(id);

        return CustomerSummaryDto.builder()
                .totalPointsEarned(totalEarned != null ? totalEarned : 0L)
                .totalPointsRedeemed(totalRedeemed != null ? totalRedeemed : 0L)
                .currentPointsBalance(customer.getCurrentPointsBalance())
                .currentTierName(customer.getCurrentTier() != null ? customer.getCurrentTier().getName() : null)
                .lastTransactionDate(lastTransaction)
                .totalTransactions(totalTransactions)
                .build();
    }

    private String generateUniqueMembershipCode() {
        String code;
        do {
            code = "MEM" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (customerRepository.existsByMembershipCode(code));
        return code;
    }

    private CustomerDto toDto(Customer customer) {
        return CustomerDto.builder()
                .id(customer.getId())
                .membershipCode(customer.getMembershipCode())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .dateOfBirth(customer.getDateOfBirth())
                .gender(customer.getGender())
                .address(customer.getAddress())
                .city(customer.getCity())
                .country(customer.getCountry())
                .tierId(customer.getCurrentTier() != null ? customer.getCurrentTier().getId() : null)
                .tierName(customer.getCurrentTier() != null ? customer.getCurrentTier().getName() : null)
                .currentPointsBalance(customer.getCurrentPointsBalance())
                .registrationDate(customer.getRegistrationDate())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}

