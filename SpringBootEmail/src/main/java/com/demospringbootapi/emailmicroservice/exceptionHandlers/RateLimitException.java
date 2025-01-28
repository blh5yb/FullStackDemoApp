package com.demospringbootapi.emailmicroservice.exceptionHandlers;
import org.springframework.http.HttpStatus;
//import org.springframework.web.server.ResponseStatusException;

import com.demospringbootapi.emailmicroservice.entity.ApiErrorMessage;

public class RateLimitException extends RuntimeException {
    public RateLimitException(final String message) {
        super(message);
    }
    
    public ApiErrorMessage toApiErrorMessage(final String path) {
        //throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, this.getMessage());
        return new ApiErrorMessage(HttpStatus.TOO_MANY_REQUESTS.value(), HttpStatus.TOO_MANY_REQUESTS.name(), this.getMessage(), path);
    }
}
