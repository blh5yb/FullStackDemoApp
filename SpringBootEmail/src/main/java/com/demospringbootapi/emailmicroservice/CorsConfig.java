package com.demospringbootapi.emailmicroservice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${APP_ALLOWED_HOSTS}")
    private String[] hosts;

    @Override
    public void addCorsMappings(CorsRegistry registry){
        System.out.println(" allowed hosts - " + hosts );
        registry.addMapping("/**")
            .allowedOrigins(hosts)
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(false);
    }
}
