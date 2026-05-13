package com.app.quantitymeasurementapp;

import com.app.quantitymeasurementapp.model.QuantityDTO;
import com.app.quantitymeasurementapp.model.QuantityMeasurementDTO;
import com.app.quantitymeasurementapp.model.QuantityMeasurementEntity;
import com.app.quantitymeasurementapp.repository.QuantityMeasurementRepository;
import com.app.quantitymeasurementapp.service.QuantityMeasurementServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class QuantityMeasurementServiceImplMockitoTest {
 
    @Mock
    private QuantityMeasurementRepository repository;
 
    @InjectMocks
    private QuantityMeasurementServiceImpl service;
 
    @Test
    void compare_returnsEqualAndSavesResult() {
        QuantityDTO q1 = new QuantityDTO(1.0, "FEET", "LengthUnit");
        QuantityDTO q2 = new QuantityDTO(12.0, "INCHES", "LengthUnit");
 
        when(repository.save(any(QuantityMeasurementEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
 
        QuantityMeasurementDTO result = service.compare(q1, q2);
 
        assertEquals("COMPARE", result.getOperation());
        assertEquals("Equal", result.getResultString());
        assertFalse(result.isError());
        verify(repository, times(1)).save(any(QuantityMeasurementEntity.class));
    }
 
    @Test
    void divide_byZero_throwsAndStoresErrorRecord() {
        QuantityDTO q1 = new QuantityDTO(1.0, "FEET", "LengthUnit");
        QuantityDTO q2 = new QuantityDTO(0.0, "INCHES", "LengthUnit");
 
        when(repository.save(any(QuantityMeasurementEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
 
        assertThrows(ArithmeticException.class, () -> service.divide(q1, q2));
        verify(repository, times(1)).save(any(QuantityMeasurementEntity.class));
    }
 
    @Test
    void getOperationHistory_returnsMappedDtosFromRepository() {
        QuantityMeasurementEntity entity = new QuantityMeasurementEntity(
                new QuantityDTO(1.0, "FEET", "LengthUnit"),
                new QuantityDTO(12.0, "INCHES", "LengthUnit"),
                "ADD",
                new QuantityDTO(24.0, "INCHES", "LengthUnit")
        );
 
        when(repository.findByOperation("ADD")).thenReturn(List.of(entity));
 
        List<QuantityMeasurementDTO> history = service.getOperationHistory("ADD");
 
        assertEquals(1, history.size());
        assertEquals("ADD", history.get(0).getOperation());
        assertEquals(24.0, history.get(0).getResultValue());
 
        verify(repository, times(1)).findByOperation("ADD");
    }
}