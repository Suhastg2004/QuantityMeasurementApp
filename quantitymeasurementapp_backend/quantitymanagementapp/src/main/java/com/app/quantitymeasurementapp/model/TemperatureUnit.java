package com.app.quantitymeasurementapp.model;

public enum TemperatureUnit implements IMeasurableUnit {
    CELSIUS, FAHRENHEIT;

    @Override 
    public String getMeasurementType() { 
        return "TemperatureUnit"; 
    }
}
