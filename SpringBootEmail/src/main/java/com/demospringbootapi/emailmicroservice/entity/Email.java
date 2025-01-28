package com.demospringbootapi.emailmicroservice.entity;

// Java Program to Illustrate EmailDetails Class

// Importing required classes
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
//import lombok.NoArgsConstructor;

// Annotations
@Data
@AllArgsConstructor
//@NoArgsConstructor
// Lombok annotation to generate a builder pattern for creating instances
@Builder
// Class
public class Email {

    // Class data members
    private String recipient;
    private String msgBody;
    private String subject;
    private String attachment;

    public Email(){}

    public Email(String subject, String msgBody, String recipient){
        this.subject = subject;
        this.msgBody = msgBody;
        this.recipient = recipient;
    }

    public void setSubject(String subject){
        this.subject = subject;
    }

    public String getSubject(){
        return subject;
    }

    public void setRecipient(String recipient){
        this.recipient = recipient;
    }

    public String getRecipient(){
        return recipient;
    }

    public void setMsgBody(String msgBody){
        this.msgBody = msgBody;
    }

    public String getMsgBody(){
        return msgBody;
    }
}