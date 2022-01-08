import { RateLimiter as Limiter } from 'limiter';

type LimitResult = {
    /**
     * Whether this action exceeds the rate limit.
     */
    limited: boolean;
    /**
     * The current interval start time.
     */
    start: number;
    /**
     * The current interval end time.
     */
    end: number;
};

export class RateLimiter {
    private limiters: { [key: string]: Limiter } = {};

    constructor(public amount: number, public interval: number) {}

    /**
     * Takes a token from the rate limiter.
     * @param key A key which identifies the entity being limited (Ex: a username or ID).
     * @returns The result of performing this action.
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
