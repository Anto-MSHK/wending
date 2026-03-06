/**
 * Simple in-memory rate limiter for Server Actions.
 * Prevents form spam — limits requests per key (e.g., guestId) within a time window.
 * 
 * For a wedding site with ~100 guests this is sufficient.
 * For production at scale, use Redis-based rate limiting.
 */

const requestMap = new Map<string, number[]>();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requestMap.entries()) {
        const fresh = timestamps.filter(t => now - t < 60_000);
        if (fresh.length === 0) {
            requestMap.delete(key);
        } else {
            requestMap.set(key, fresh);
        }
    }
}, CLEANUP_INTERVAL);

/**
 * Check if a request should be rate-limited.
 * @param key - Unique identifier (e.g., guestId or householdId)
 * @param maxRequests - Maximum requests allowed in the window (default: 30)
 * @param windowMs - Time window in ms (default: 60s)
 * @returns true if the request should be BLOCKED
 */
export function isRateLimited(
    key: string,
    maxRequests = 30,
    windowMs = 60_000
): boolean {
    const now = Date.now();
    const timestamps = requestMap.get(key) || [];

    // Filter to only recent requests
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
        return true; // blocked
    }

    recent.push(now);
    requestMap.set(key, recent);
    return false; // allowed
}
