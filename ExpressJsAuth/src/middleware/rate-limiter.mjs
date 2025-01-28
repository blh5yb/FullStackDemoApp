import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { rateLimitConfig } from '../config.js';

export const rateLimiter = rateLimit({
    windowMs: rateLimitConfig.duration_in_ms, // 15 minutes
    max: rateLimit.duration_in_ms, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    keyGenerator: (req) => {
      return req.body ? req.body._id : req.ip; // Use user ID if authenticated, otherwise IP
    }
  }
);

export const speedLimiter = slowDown({
    windowMs: rateLimitConfig.window_ms,
    delayAfter: rateLimitConfig.delay_after,
    delayMs: () => rateLimitConfig.delay_in_ms,
    keyGenerator: (req) => {
      return req.body ? req.body._id : req.ip;
    }
  }
);
