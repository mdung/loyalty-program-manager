package com.company.loyalty.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.math.BigDecimal;

public class TransactionAmountValidator implements ConstraintValidator<ValidTransactionAmount, BigDecimal> {

    @Override
    public void initialize(ValidTransactionAmount constraintAnnotation) {
    }

    @Override
    public boolean isValid(BigDecimal amount, ConstraintValidatorContext context) {
        if (amount == null) {
            return true; // Let @NotNull handle null checks
        }
        return amount.compareTo(BigDecimal.ZERO) > 0;
    }
}

