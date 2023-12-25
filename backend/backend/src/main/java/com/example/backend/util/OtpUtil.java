package com.example.backend.util;

import java.util.Random;

import org.springframework.stereotype.Component;

@Component
public class OtpUtil {
    // 3h is expired OTP
    public static final int EXPIRE_OTP = 3 * 60 * 60 * 1000;

    public String generateOtp() {
        int randomNumber = (new Random()).nextInt(999999);
        String output = Integer.toString(randomNumber);

        while (output.length() < 6) {
            output = "0" + output;
        }

        return output;
    }
}
