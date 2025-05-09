package com.skillshareplatform.lingocamp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/lingocamp/api/tutors/register",
                    "/lingocamp/api/tutors/login",
                    "/lingocamp/api/courses" // GET requests only
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/lingocamp/api/tutors/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/lingocamp/api/tutors/updateprofile/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/lingocamp/api/courses/create").authenticated()
                .requestMatchers(HttpMethod.POST, "/lingocamp/api/courses/enroll").permitAll()
                .requestMatchers(HttpMethod.GET, "/lingocamp/api/courses/all").permitAll()
                // .requestMatchers(HttpMethod.GET, "/lingocamp/api/tutors/public/*").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(new FirebaseAuthFilter(), UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}