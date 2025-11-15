package com.company.loyalty.customer.service;

import com.company.loyalty.common.enums.Gender;
import com.company.loyalty.customer.dto.CreateCustomerRequest;
import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.customer.repository.CustomerRepository;
import com.company.loyalty.tier.entity.Tier;
import com.company.loyalty.tier.repository.TierRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerImportService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TierRepository tierRepository;

    @Transactional
    public List<String> importFromCsv(MultipartFile file) throws IOException, CsvException {
        List<String> errors = new ArrayList<>();
        List<Customer> customersToSave = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();
            
            if (rows.isEmpty()) {
                errors.add("CSV file is empty");
                return errors;
            }

            // Skip header row
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    if (row.length < 3) {
                        errors.add("Row " + (i + 1) + ": Insufficient columns");
                        continue;
                    }

                    String fullName = row[0].trim();
                    String phone = row.length > 1 ? row[1].trim() : "";
                    String email = row.length > 2 ? row[2].trim() : "";
                    String dateOfBirthStr = row.length > 3 ? row[3].trim() : "";
                    String genderStr = row.length > 4 ? row[4].trim() : "";
                    String address = row.length > 5 ? row[5].trim() : "";
                    String city = row.length > 6 ? row[6].trim() : "";
                    String country = row.length > 7 ? row[7].trim() : "";

                    if (fullName.isEmpty()) {
                        errors.add("Row " + (i + 1) + ": Full name is required");
                        continue;
                    }

                    LocalDate dateOfBirth = null;
                    if (!dateOfBirthStr.isEmpty()) {
                        try {
                            dateOfBirth = LocalDate.parse(dateOfBirthStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                        } catch (Exception e) {
                            errors.add("Row " + (i + 1) + ": Invalid date format (expected yyyy-MM-dd)");
                        }
                    }

                    Gender gender = null;
                    if (!genderStr.isEmpty()) {
                        try {
                            gender = Gender.valueOf(genderStr.toUpperCase());
                        } catch (Exception e) {
                            errors.add("Row " + (i + 1) + ": Invalid gender (MALE/FEMALE/OTHER)");
                        }
                    }

                    String membershipCode = generateUniqueMembershipCode();
                    Tier defaultTier = tierRepository.findFirstByOrderByPriorityAsc()
                            .orElseThrow(() -> new RuntimeException("No tier found"));

                    Customer customer = Customer.builder()
                            .membershipCode(membershipCode)
                            .fullName(fullName)
                            .phone(phone.isEmpty() ? null : phone)
                            .email(email.isEmpty() ? null : email)
                            .dateOfBirth(dateOfBirth)
                            .gender(gender)
                            .address(address.isEmpty() ? null : address)
                            .city(city.isEmpty() ? null : city)
                            .country(country.isEmpty() ? null : country)
                            .currentTier(defaultTier)
                            .currentPointsBalance(0L)
                            .build();

                    customersToSave.add(customer);
                } catch (Exception e) {
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                }
            }
        }

        if (errors.isEmpty() || customersToSave.size() > 0) {
            customerRepository.saveAll(customersToSave);
        }

        return errors;
    }

    private String generateUniqueMembershipCode() {
        String code;
        do {
            code = "MEM" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (customerRepository.existsByMembershipCode(code));
        return code;
    }
}

