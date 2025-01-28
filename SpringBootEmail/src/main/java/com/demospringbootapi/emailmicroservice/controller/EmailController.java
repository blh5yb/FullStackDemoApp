package com.demospringbootapi.emailmicroservice.controller;
import java.io.IOException;

// Importing required classes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demospringbootapi.emailmicroservice.entity.CustomApiResponse;
import com.demospringbootapi.emailmicroservice.entity.Email;
import com.demospringbootapi.emailmicroservice.repository.RateLimitProtection;
import com.demospringbootapi.emailmicroservice.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

// Annotation
@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired 
    private EmailService emailService;

    // Sending a SES Email
    @PostMapping("/sendEmail")
    @RateLimitProtection
    @Operation(summary = "Send an email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully sent email",
        content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content),
        @ApiResponse(responseCode = "429", description = "Too many requests",
        content = @Content)
    })
    @Tag(name="2. Email")
    public ResponseEntity<CustomApiResponse> sendEmail(@RequestBody Email details) throws IOException
    {
        System.out.println("starting email endpoint");
        CustomApiResponse status
            = emailService.sesSendMail(details);

        return ResponseEntity.ok(status);
    }
}