package group16.be;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import java.util.List;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Configuring Security Filter Chain...");
        http
            .cors(withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(req -> req.anyRequest().permitAll()) // Allow all requests
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS));
            // .cors(withDefaults())
            // .csrf(AbstractHttpConfigurer::disable)
            // .authorizeHttpRequests(req ->
            //     req.requestMatchers(
            //         "/v1/api/**",
            //         "/v2/api-docs",
            //         "/v3/api-docs",
            //         "/v3/api-docs/**",
            //         "/swagger-resources",
            //         "/swagger-resources/**",
            //         "/configuration/ui",
            //         "/configuration/security",
            //         "/swagger-ui/**",
            //         "/webjars/**",
            //         "/swagger-ui.html"
            //     ).permitAll()
            //     .anyRequest()
            //     .authenticated()
            // )
            // .sessionManagement(session -> session.sessionCreationPolicy(STATELESS));
        System.out.println("Configuring Success ...");
        return http.build();
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    //     CorsConfiguration configuration = new CorsConfiguration();
    //     configuration.setAllowedOrigins(List.of("*")); // Allow all origins (change as needed)
    //     configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //     configuration.setAllowedHeaders(List.of("*"));
    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     source.registerCorsConfiguration("/**", configuration);
    //     return source;
    // }
}