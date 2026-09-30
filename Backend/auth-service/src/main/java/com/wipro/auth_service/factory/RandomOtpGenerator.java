package com.wipro.auth_service.factory;

import java.util.Random;

public class RandomOtpGenerator implements OtpGenerator {

    @Override
    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}