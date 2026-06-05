declare module "passport-apple" {
  import type { Request } from "express";
  import type { Strategy as PassportStrategy } from "passport";

  interface AppleStrategyOptions {
    clientID: string;
    teamID: string;
    keyID: string;
    callbackURL: string;
    privateKeyString?: string;
    privateKeyLocation?: string;
    scope?: string | string[];
    passReqToCallback?: boolean;
  }

  type AppleVerifyCallback = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: unknown,
    done: (err: Error | null, user?: unknown) => void,
  ) => void;

  class Strategy extends PassportStrategy {
    constructor(options: AppleStrategyOptions, verify: AppleVerifyCallback);
    name: string;
  }

  export { Strategy };
  export default Strategy;
}
