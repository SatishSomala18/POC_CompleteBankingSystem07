package com.wipro.auth_service.factory;

public class OtpFactory {

    public static OtpGenerator getOtpGenerator(String type) {
        if ("RANDOM".equalsIgnoreCase(type)) {
            return new RandomOtpGenerator();
        }
        return new FixedOtpGenerator();
    }
}