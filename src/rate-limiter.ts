import { RateLimiter as Limiter } from 'limiter';

export class RateLimiter {
    private limiters: { [key: string]: Limiter } = {};

    /**
     * Creates a new RateLimiter object to control rate limiting.
     *
     * @param amount - Amount of times an action can be done within an interval. Ex: `2` would mean 2 times.
     * @param interval - Length of an interval in milliseconds. Ex: `5000` would mean 5 seconds.
     *
     * @returns RateLimiter object.
     */
    constructor(public amount: number, public interval: number) {}

    /**
     * Takes a token from the rate limiter.
     *
     * @param key Key which identifies the entity being limited (Ex: a username or ID).
     *
     * @returns Whether this action exceeds the rate limit.
     */
    public take(key: string): boolean {
        let limiter = this.limiters[key];
        if (!limiter) {
            limiter = new Limiter({
                tokensPerInterval: this.amount,
                interval: this.interval,
            });
            this.limiters[key] = limiter;
        }

        if (limiter.getTokensRemaining() < 1) {
            return true;
        }

        limiter.removeTokens(1);

        return false;
    }
}
