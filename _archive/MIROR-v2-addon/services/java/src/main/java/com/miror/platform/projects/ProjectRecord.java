package com.miror.platform.projects;

import java.util.List;

/**
 * Optional enterprise integration DTO.
 * The Next.js application remains the primary web runtime.
 */
public record ProjectRecord(
        String slug,
        String title,
        String category,
        String location,
        String status,
        String mirorRole,
        List<String> scope,
        String sourceDocument,
        boolean permissionToPublish
) {}
