package com.company.loyalty.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TierPointsValidator.class)
@Documented
public @interface ValidTierPoints {
    String message() default "Invalid tier points range";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

