package com.demospringbootapi.emailmicroservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;

//import springfox.documentation.builders.PathSelectors;
//import springfox.documentation.builders.RequestHandlerSelectors;
//import springfox.documentation.spi.DocumentationType;
//import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Components components = new Components();
        return new OpenAPI().components(components)
            .info(new Info()
                .title("Demo Spring API")
                .version("1.0.0")
                .description("Sample Spring API with Relational DB")
                .contact(new Contact()
                    .name("Barry Hykes Jr")
                    .email("blhykes@gmail.com")
                )
            );
    }
    //public Docket api() {
    //    return new Docket(DocumentationType.SWAGGER_2)
    //            .select()
    //            .apis(RequestHandlerSelectors.any())
    //            //.apis(RequestHandlerSelectors.basePackage("com.demospringbootapi.emailmicroservice.controllers")) // Replace with your controller package
    //            .paths(PathSelectors.any())
    //            .build();
    //}
}