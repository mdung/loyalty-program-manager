package com.company.loyalty.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TransactionAmountValidator.class)
@Documented
public @interface ValidTransactionAmount {
    String message() default "Transaction amount must be positive";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

