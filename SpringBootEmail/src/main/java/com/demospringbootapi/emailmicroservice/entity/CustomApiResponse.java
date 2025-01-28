package com.demospringbootapi.emailmicroservice.entity;

import lombok.Data;

// Annotations
@Data
public class CustomApiResponse {
    private String message;
    private Object data;
    
    public CustomApiResponse(String message, Object data){
        this.message = message;
        this.data = data;
    }

    public CustomApiResponse(){

    }
}
