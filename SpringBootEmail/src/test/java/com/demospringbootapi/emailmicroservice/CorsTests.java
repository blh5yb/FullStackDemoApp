package com.demospringbootapi.emailmicroservice;

import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CorsTest {

    @LocalServerPort
    private int port;

    private TestRestTemplate restTemplate = new TestRestTemplate();

    @Test
    void testCorsPolicy() {
        HttpHeaders headers = new HttpHeaders();
        headers.setOrigin("http://localhost:4200"); // Replace with your frontend URL

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "http://localhost:" + port + "/your-api-endpoint", 
                HttpMethod.GET, 
                entity, 
                String.class);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertTrue(response.getHeaders().getAccessControlAllowOrigin().contains("http://localhost:4200"));
        //assertTrue(response.getHeaders().getAccessControlAllowMethods().contains("GET", "POST", "PUT", "DELETE"));
    }
}