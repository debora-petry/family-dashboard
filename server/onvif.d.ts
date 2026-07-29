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
