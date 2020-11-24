import { RateLimiter as Limiter } from 'limiter';

export class RateLimiter {
    private limiters: { [key: string]: Limiter } = {};

    constructor(private amount: number, private interval: number) {}

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
