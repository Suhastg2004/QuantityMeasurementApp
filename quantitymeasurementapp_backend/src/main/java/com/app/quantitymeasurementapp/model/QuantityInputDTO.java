package com.app.quantitymeasurementapp.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for taking input of two quantities and optional target quantity
 */
@Schema(example = """
        {
          "thisQuantityDTO":   { "value": 1.0,  "unit": "FEET",   "measurementType": "LengthUnit" },
          "thatQuantityDTO":   { "value": 12.0, "unit": "INCHES", "measurementType": "LengthUnit" },
          "targetQuantityDTO": { "value": 0.0,  "unit": "INCHES", "measurementType": "LengthUnit" }
        }
        """)
public class QuantityInputDTO {

    @Valid
    @NotNull(message = "First quantity cannot be null")
    private QuantityDTO thisQuantityDTO;

    @Valid
    @NotNull(message = "Second quantity cannot be null")
    private QuantityDTO thatQuantityDTO;

    @Valid
    @Schema(nullable = true)
    private QuantityDTO targetQuantityDTO;

    // Getters and setters

    public QuantityDTO getThisQuantityDTO() {
        return thisQuantityDTO;
    }

    public void setThisQuantityDTO(QuantityDTO thisQuantityDTO) {
        this.thisQuantityDTO = thisQuantityDTO;
    }

    public QuantityDTO getThatQuantityDTO() {
        return thatQuantityDTO;
    }

    public void setThatQuantityDTO(QuantityDTO thatQuantityDTO) {
        this.thatQuantityDTO = thatQuantityDTO;
    }

    public QuantityDTO getTargetQuantityDTO() {
        return targetQuantityDTO;
    }

    public void setTargetQuantityDTO(QuantityDTO targetQuantityDTO) {
        this.targetQuantityDTO = targetQuantityDTO;
    }
}