package com.demospringbootapi.emailmicroservice.service;

import com.demospringbootapi.emailmicroservice.entity.CustomApiResponse;
import com.demospringbootapi.emailmicroservice.entity.Email;

//import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.Body;
import com.amazonaws.services.simpleemail.model.Content;
import com.amazonaws.services.simpleemail.model.Destination;
import com.amazonaws.services.simpleemail.model.Message;
import com.amazonaws.services.simpleemail.model.SendEmailRequest; 

// Importing required classes
@Service
@ConditionalOnProperty( prefix = "emailconnection", value = "enabled", havingValue = "true", matchIfMissing = false)
public class EmailService {

    @Value("${SPRING_MAIL_USERNAME}") 
    private String sender;

    @Value("${AWS_DEFAULT_REGION}")
    private String AWS_REGION;

    public CustomApiResponse sesSendMail(Email details) throws IOException {
        try {
            System.out.println("Starting SES: ");
            AmazonSimpleEmailService client = 
                AmazonSimpleEmailServiceClientBuilder.standard()
                    .withCredentials(new EnvironmentVariableCredentialsProvider())
                    .withRegion(Regions.fromName(AWS_REGION))
                    .build();
            System.out.println("Client set up: ");
            SendEmailRequest request = new SendEmailRequest()
                .withDestination(
                    new Destination().withToAddresses(details.getRecipient()))
                .withMessage(new Message()
                    .withBody(new Body()
                        .withHtml(new Content()
                            .withCharset("UTF-8").withData(details.getMsgBody()))
                        .withText(new Content()
                            .withCharset("UTF-8").withData("")))
                    .withSubject(new Content()
                        .withCharset("UTF-8").withData(details.getSubject())))
                .withSource(sender);
                // Comment or remove the next line if you are not using a
                // configuration set
                //.withConfigurationSetName(CONFIGSET);
            System.out.println("Attempt to send email ");
            String id = client.sendEmail(request).getMessageId();
            System.out.println("success: " + id);
            return new CustomApiResponse("Mail Sent Successfully. success id: " + id, details);
        } catch (Exception ex) {
            System.out.println("The email was not sent. Error message: " 
              + ex.getMessage());
              String message = "Error while sending mail: " + ex.getMessage();
            System.out.println(message);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, message);
            //return new CustomApiResponse("Email error", message);
        }
    }
}