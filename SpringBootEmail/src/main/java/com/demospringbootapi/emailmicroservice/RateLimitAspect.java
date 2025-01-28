package com.demospringbootapi.emailmicroservice;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import com.demospringbootapi.emailmicroservice.exceptionHandlers.RateLimitException;
import com.demospringbootapi.emailmicroservice.repository.RateLimitProtection;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Aspect
@Component
public class RateLimitAspect {

    public static final String ERROR_MESSAGE = "To many request at endpoint %s from IP %s! Please try again after %d milliseconds!";
    private final ConcurrentHashMap<String, List<Long>> requestCounts = new ConcurrentHashMap<>();

    @Value("${app.rate.limit}")
    private int rateLimit;

    @Value("${app.rate.durationinms}")
    private long rateDuration;

    /**
     * Executed by each call of a method annotated with {@link RateLimitProtection} which should be an HTTP endpoint.
     * Counts calls per remote address. Calls older than {@link #rateDuration} milliseconds will be forgotten. If there have
     * been more than {@link #rateLimit} calls within {@link #rateDuration} milliseconds from a remote address, a {@link RateLimitException}
     * will be thrown.
     * @throws RateLimitException iff rate limit for a given remote address has been exceeded
     */

    @Before("@annotation(com.demospringbootapi.emailmicroservice.repository.RateLimitProtection)")
    public void rateLimit() {
        final ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        final String key = requestAttributes.getRequest().getRemoteAddr();
        final long currentTime = System.currentTimeMillis();
        requestCounts.putIfAbsent(key, new ArrayList<>());
        requestCounts.get(key).add(currentTime);
        cleanUpRequestCounts(currentTime);
        System.out.println("rate limit: " + rateLimit);
        if (requestCounts.get(key).size() > rateLimit) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ERROR_MESSAGE);
            //throw new RateLimitException(String.format(ERROR_MESSAGE, requestAttributes.getRequest().getRequestURI(), key, rateDuration));
        }

    }

    private void cleanUpRequestCounts(final long currentTime) {
        requestCounts.values().forEach(l -> {
            l.removeIf(t -> timeIsTooOld(currentTime, t));
        });
    }

    private boolean timeIsTooOld(final long currentTime, final long timeToCheck) {
        return currentTime - timeToCheck > rateDuration;
    }
}