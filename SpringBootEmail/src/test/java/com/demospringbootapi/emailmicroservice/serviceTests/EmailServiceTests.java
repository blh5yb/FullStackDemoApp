package com.demospringbootapi.emailmicroservice.serviceTests;

import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import javax.mail.MessagingException;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.TestPropertySource;

import com.demospringbootapi.emailmicroservice.entity.Email;
import com.demospringbootapi.emailmicroservice.service.EmailService;

//@ExtendWith(MockitoExtension.class)
@SpringBootTest
@TestPropertySource(properties = {
    "emailconnection.enabled=true",
    "spring.mail.username=blhykes@gmail.com"
})
public class EmailServiceTests {
    @Autowired
    private EmailService emailService;


    @MockBean
    private JavaMailSender javaMailSender;
    
    private SimpleMailMessage message = new SimpleMailMessage();

    @BeforeEach
    void setUp(){
        message.setTo("test@email.com");
        message.setSubject("Test Subject");
        message.setText("Test Body");
        message.setFrom("blhykes@gmail.com");
    }

    @Test
    void testSendSimpleMail() throws MessagingException{
        Email email = Email.builder().recipient("test@email.com").msgBody("Test Body").subject("Test Subject").build();

        emailService.sendSimpleMail(email);
        verify(javaMailSender, times(1)).send(message);
    }

    @Test
    public void testJavaMailSenderException(){
        //when(javaMailSender.send(any(SimpleMailMessage.class))).thenThrow( new RuntimeException("Test Error"));
        Mockito.doThrow(Mockito.mock(ServiceException.class)).when(javaMailSender).send(any(SimpleMailMessage.class));
        assertThrows(ServiceException.class, () -> javaMailSender.send(message));

    }

}
