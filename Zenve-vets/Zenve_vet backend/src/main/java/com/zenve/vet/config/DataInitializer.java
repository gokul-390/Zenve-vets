package com.zenve.vet.config;

import com.zenve.vet.model.Role;
import com.zenve.vet.model.User;
import com.zenve.vet.model.UserStatus;
import com.zenve.vet.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@zenve.vet")) {
                User admin = new User(
                        "admin@zenve.vet",
                        passwordEncoder.encode("Admin@12345"),
                        Role.ROLE_ADMIN,
                        UserStatus.ACTIVE
                );
                userRepository.save(admin);
                logger.info("Default ADMIN user initialized: admin@zenve.vet / Admin@12345");
            }

            if (!userRepository.existsByEmail("doctor.sarah@zenve.vet")) {
                User vet = new User(
                        "doctor.sarah@zenve.vet",
                        passwordEncoder.encode("Vet@12345"),
                        Role.ROLE_VET,
                        UserStatus.ACTIVE
                );
                userRepository.save(vet);
                logger.info("Default VET user initialized: doctor.sarah@zenve.vet / Vet@12345");
            }
        };
    }
}
