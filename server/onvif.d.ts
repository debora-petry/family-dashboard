declare module "onvif" {
  export interface CamOptions {
    hostname: string;
    username?: string;
    password?: string;
    port?: number;
    path?: string;
    timeout?: number;
    useSecure?: boolean;
    secureOpts?: unknown;
    agent?: unknown;
  }

  export interface PullPointSubscriptionResult {
    currentTime?: string;
    terminationTime?: string;
    subscriptionReference?: unknown;
    pullPoint?: unknown;
    [key: string]: unknown;
  }

  export interface PullMessagesResult {
    notificationMessage?: unknown[];
    notificationMessages?: unknown[];
    messages?: unknown[];
    [key: string]: unknown;
  }

  export class Cam {
    constructor(options: CamOptions, callback?: (err: Error | null) => void);
    getDeviceInformation(
      callback: (err: Error | null, info: unknown) => void,
    ): void;
    defaultProfile: Profile;

    getSnapshotUri(
      options: { profileToken: string },
      callback: (err: Error | null, result: SnapshotUriResult) => void,
    ): void;

    getStreamUri(
      options: { profileToken: string },
      callback: (err: Error | null, result: StreamUriResult) => void,
    ): void;

    createPullPointSubscription(
      callback: (
        err: Error | null,
        result: PullPointSubscriptionResult,
      ) => void,
    ): void;

    pullMessages(
      options: { timeout: number; messageLimit: number },
      callback: (err: Error | null, result: PullMessagesResult) => void,
    ): void;

    on(event: "event", listener: (message: unknown, xml: string) => void): this;
    on(event: "eventsError", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
  }

  export interface Profile {
    $: {
      token: string;
    };
  }

  export interface SnapshotUriResult {
    uri: string;
  }

  export interface StreamUriResult {
    uri: string;
  }
}
