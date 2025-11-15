package com.company.loyalty.customer.service;

import com.company.loyalty.common.util.ExportUtil;
import com.company.loyalty.customer.entity.Customer;
import com.company.loyalty.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerExportService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ExportUtil exportUtil;

    public byte[] exportToExcel() throws IOException {
        List<Customer> customers = customerRepository.findAll(PageRequest.of(0, Integer.MAX_VALUE)).getContent();

        String[] headers = {"ID", "Membership Code", "Full Name", "Phone", "Email", "Date of Birth", "Gender", 
                           "Address", "City", "Country", "Tier", "Points Balance", "Registration Date"};
        List<Object[]> data = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Customer customer : customers) {
            data.add(new Object[]{
                    customer.getId(),
                    customer.getMembershipCode(),
                    customer.getFullName(),
                    customer.getPhone() != null ? customer.getPhone() : "",
                    customer.getEmail() != null ? customer.getEmail() : "",
                    customer.getDateOfBirth() != null ? customer.getDateOfBirth().format(formatter) : "",
                    customer.getGender() != null ? customer.getGender().name() : "",
                    customer.getAddress() != null ? customer.getAddress() : "",
                    customer.getCity() != null ? customer.getCity() : "",
                    customer.getCountry() != null ? customer.getCountry() : "",
                    customer.getCurrentTier() != null ? customer.getCurrentTier().getName() : "",
                    customer.getCurrentPointsBalance(),
                    customer.getRegistrationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            });
        }

        return exportUtil.exportToExcel("Customers", headers, data);
    }

    public String exportToCsv() {
        List<Customer> customers = customerRepository.findAll(PageRequest.of(0, Integer.MAX_VALUE)).getContent();

        String[] headers = {"ID", "Membership Code", "Full Name", "Phone", "Email", "Date of Birth", "Gender", 
                           "Address", "City", "Country", "Tier", "Points Balance", "Registration Date"};
        List<Object[]> data = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Customer customer : customers) {
            data.add(new Object[]{
                    customer.getId(),
                    customer.getMembershipCode(),
                    customer.getFullName(),
                    customer.getPhone() != null ? customer.getPhone() : "",
                    customer.getEmail() != null ? customer.getEmail() : "",
                    customer.getDateOfBirth() != null ? customer.getDateOfBirth().format(formatter) : "",
                    customer.getGender() != null ? customer.getGender().name() : "",
                    customer.getAddress() != null ? customer.getAddress() : "",
                    customer.getCity() != null ? customer.getCity() : "",
                    customer.getCountry() != null ? customer.getCountry() : "",
                    customer.getCurrentTier() != null ? customer.getCurrentTier().getName() : "",
                    customer.getCurrentPointsBalance(),
                    customer.getRegistrationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            });
        }

        return exportUtil.exportToCsv(headers, data);
    }
}

