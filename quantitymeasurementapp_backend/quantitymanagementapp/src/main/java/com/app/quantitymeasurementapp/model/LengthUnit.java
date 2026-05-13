package com.app.quantitymeasurementapp.model;

public enum LengthUnit implements IMeasurableUnit {
    FEET, INCHES, YARDS, CENTIMETERS;

    @Override 
    public String getMeasurementType() { 
        return "LengthUnit"; 
    }
}