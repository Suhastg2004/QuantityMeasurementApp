package com.app.quantitymeasurementapp.model;

public enum VolumeUnit implements IMeasurableUnit {
    LITRE, MILLILITER, GALLON;

    @Override 
    public String getMeasurementType() { 
        return "VolumeUnit"; 
    }
}