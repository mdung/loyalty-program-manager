package com.company.loyalty.common.validation;

import com.company.loyalty.tier.dto.TierDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TierPointsValidator implements ConstraintValidator<ValidTierPoints, TierDto> {

    @Override
    public void initialize(ValidTierPoints constraintAnnotation) {
    }

    @Override
    public boolean isValid(TierDto tier, ConstraintValidatorContext context) {
        if (tier == null || tier.getMinPoints() == null || tier.getMaxPoints() == null) {
            return true; // Let @NotNull handle null checks
        }

        if (tier.getMinPoints() < 0) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Min points cannot be negative")
                    .addPropertyNode("minPoints")
                    .addConstraintViolation();
            return false;
        }

        if (tier.getMaxPoints() <= tier.getMinPoints()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Max points must be greater than min points")
                    .addPropertyNode("maxPoints")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}

