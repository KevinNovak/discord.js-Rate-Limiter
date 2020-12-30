import { RateLimiter as Limiter } from 'limiter';

export class RateLimiter {
    private limiters: { [key: string]: Limiter } = {};

    constructor(private amount: number, private interval: number) {}

    /**
     * Takes a token from the rate limiter.
     * @param key A key which identifies the entity being limited (Ex: a username or ID).
     * @returns Whether this action exceeds the rate limit.
     */
    public take(key: string): boolean {
        let limiter = this.limiters[key];
        if (!limiter) {
            limiter = new Limiter(this.amount, this.interval);
            this.limiters[key] = limiter;
        }

        if (limiter.getTokensRemaining() < 1) {
            return true;
        }

        limiter.removeTokens(1, (error: any) => {
            if (error) {
                throw error;
            }
        });

        return false;
    }
}
