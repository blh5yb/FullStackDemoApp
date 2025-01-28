package com.demospringbootapi.emailmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

//import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
@EnableAsync
//@EnableSwagger2
@EnableWebMvc
public class DemoSpringbootApiApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(DemoSpringbootApiApplication.class, args);
	}

	// Lambda configuration
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(DemoSpringbootApiApplication.class);
	}

}
