package com.demospringbootapi.emailmicroservice.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.demospringbootapi.emailmicroservice.controller.EmailController;
import com.demospringbootapi.emailmicroservice.entity.Email;
import com.demospringbootapi.emailmicroservice.service.EmailService;

@WebMvcTest(EmailController.class)
public class emailControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;
    private static final String TEST_RECIPIENT = "test@email.com";
    private static final String TEST_SUBJECT = "email subject";
    private static final String TEST_BODY = "test body of email";
    private Email email = Email.builder().recipient(TEST_RECIPIENT).subject(TEST_SUBJECT).msgBody(TEST_BODY).build();
    @BeforeEach
    void setUp(){
    }
    
    @Test
    public void sendSimpleMail() throws Exception {
        String emailJson = "{\"subject\": \"test Subject\", \"recipient\": \"test@email.com\", \"msgBody\": \"Msg Body\"}\"}";
        String emailRes = "Mail Sent Successfully...";
        when(emailService.sendSimpleMail(any())).thenReturn(emailRes);

        mockMvc.perform(MockMvcRequestBuilders.post("/sendMail")
            .contentType(MediaType.APPLICATION_JSON)
            .content(emailJson)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.content().string(emailRes));
    }
}
