package com.app.quantitymeasurementapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity for storing quantity operations in DB
 */
@Entity
@Table(name = "quantity_measurement_entity")
public class QuantityMeasurementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double thisValue;
    private String thisUnit;
    private String thisMeasurementType;

    private double thatValue;
    private String thatUnit;
    private String thatMeasurementType;

    private String operation;

    private double resultValue;
    private String resultUnit;
    private String resultMeasurementType;
    private String resultString;

    private boolean isError;
    private String errorMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QuantityMeasurementEntity() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors (kept exactly as your original logic)

    public QuantityMeasurementEntity(QuantityDTO q1, QuantityDTO q2, String operation, Object result) {
        this.thisValue = q1.getValue();
        this.thisUnit = q1.getUnit();
        this.thisMeasurementType = q1.getMeasurementType();

        if (q2 != null) {
            this.thatValue = q2.getValue();
            this.thatUnit = q2.getUnit();
            this.thatMeasurementType = q2.getMeasurementType();
        }

        this.operation = operation;

        if (result instanceof String) this.resultString = (String) result;
        else if (result instanceof Double) this.resultValue = (Double) result;

        this.isError = false;
    }

    public QuantityMeasurementEntity(QuantityDTO q1, QuantityDTO q2, String operation, QuantityDTO result) {
        this.thisValue = q1.getValue();
        this.thisUnit = q1.getUnit();
        this.thisMeasurementType = q1.getMeasurementType();

        this.thatValue = q2.getValue();
        this.thatUnit = q2.getUnit();
        this.thatMeasurementType = q2.getMeasurementType();

        this.operation = operation;

        if (result != null) {
            this.resultValue = result.getValue();
            this.resultUnit = result.getUnit();
            this.resultMeasurementType = result.getMeasurementType();
        }

        this.isError = false;
    }

    public QuantityMeasurementEntity(QuantityDTO q1, QuantityDTO q2, String operation, String errorMessage, boolean isError) {
        if (q1 != null) {
            this.thisValue = q1.getValue();
            this.thisUnit = q1.getUnit();
            this.thisMeasurementType = q1.getMeasurementType();
        }

        if (q2 != null) {
            this.thatValue = q2.getValue();
            this.thatUnit = q2.getUnit();
            this.thatMeasurementType = q2.getMeasurementType();
        }

        this.operation = operation;
        this.errorMessage = errorMessage;
        this.isError = isError;
    }

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getThisValue() { return thisValue; }
    public void setThisValue(double thisValue) { this.thisValue = thisValue; }

    public String getThisUnit() { return thisUnit; }
    public void setThisUnit(String thisUnit) { this.thisUnit = thisUnit; }

    public String getThisMeasurementType() { return thisMeasurementType; }
    public void setThisMeasurementType(String thisMeasurementType) { this.thisMeasurementType = thisMeasurementType; }

    public double getThatValue() { return thatValue; }
    public void setThatValue(double thatValue) { this.thatValue = thatValue; }

    public String getThatUnit() { return thatUnit; }
    public void setThatUnit(String thatUnit) { this.thatUnit = thatUnit; }

    public String getThatMeasurementType() { return thatMeasurementType; }
    public void setThatMeasurementType(String thatMeasurementType) { this.thatMeasurementType = thatMeasurementType; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }

    public double getResultValue() { return resultValue; }
    public void setResultValue(double resultValue) { this.resultValue = resultValue; }

    public String getResultUnit() { return resultUnit; }
    public void setResultUnit(String resultUnit) { this.resultUnit = resultUnit; }

    public String getResultMeasurementType() { return resultMeasurementType; }
    public void setResultMeasurementType(String resultMeasurementType) { this.resultMeasurementType = resultMeasurementType; }

    public String getResultString() { return resultString; }
    public void setResultString(String resultString) { this.resultString = resultString; }

    public boolean isError() { return isError; }
    public void setError(boolean error) { isError = error; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}