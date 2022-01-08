import { RateLimiter as Limiter } from 'limiter';

type LimitResult = {
    /**
     * Whether this action exceeds the rate limit.
     */
    limited: boolean;
    /**
     * Current interval start time in milliseconds.
     */
    start: number;
    /**
     * Current interval end time in milliseconds.
     */
    end: number;
};

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
     * @returns Result of performing this action.
     */
    public take(key: string): LimitResult {
        let limiter = this.limiters[key];
        if (!limiter) {
            limiter = new Limiter({
                tokensPerInterval: this.amount,
                interval: this.interval,
            });
            this.limiters[key] = limiter;
        }

        let result: LimitResult = {
            limited: false,
            start: limiter.curIntervalStart,
            end: limiter.curIntervalStart + this.interval,
        };

        if (limiter.getTokensRemaining() < 1) {
            result.limited = true;
            return result;
        }

        limiter.removeTokens(1);
        return result;
    }
}
