package com.miror.integration;

/** Minimal placeholder for a future enterprise integration module. */
public final class HealthCheck {
    private HealthCheck() {}

    public static String status() {
        return "ok";
    }

    public static void main(String[] args) {
        System.out.println(status());
    }
}
