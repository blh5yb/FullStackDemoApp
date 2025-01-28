package com.demospringbootapi.emailmicroservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.demospringbootapi.emailmicroservice.entity.CustomApiResponse;
import com.demospringbootapi.emailmicroservice.repository.RateLimitProtection;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/greeting")
public class HelloController {

    @GetMapping("/hello/{name}")
    @RateLimitProtection
    //@ApiOperation(value = "Create New Product", notes = "This endpoint creates a new product.\nNote: Name must be unique")
    @Operation(summary = "Simple Greeting", description = "This endpoint greets you with your name input as path variable")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully returned greeting",
        content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal server runtime error", 
        content = @Content),
    })
    @ResponseBody
    @Tag(name="1. Greeting")
    public ResponseEntity<CustomApiResponse> hello(@PathVariable(required = true) String name) {
        System.out.println("hello name " + name);
        if (name == null){
            throw new RuntimeException("Missing path variable " + name);
            //return ResponseEntity.badRequest().body("User ID is required");
        } else {
            CustomApiResponse res = new CustomApiResponse("Hello, " + name + "!", "");
            return ResponseEntity.ok(res);
        }
    }
}
