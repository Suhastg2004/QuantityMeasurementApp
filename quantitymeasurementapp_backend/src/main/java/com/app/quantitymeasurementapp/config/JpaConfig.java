package com.app.quantitymeasurementapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.app.quantitymeasurementapp.repository")
public class JpaConfig {
}
