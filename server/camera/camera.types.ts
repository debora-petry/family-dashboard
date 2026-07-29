import { Cam } from "onvif";

export type CameraConnection = InstanceType<typeof Cam>;

export interface CameraProfile {
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

export interface XmCameraConnection extends CameraConnection {
  defaultProfile: CameraProfile;

  getSnapshotUri(
    options: {
      profileToken: string;
    },
    callback: (err: Error | null, result: SnapshotUriResult) => void,
  ): void;

  getStreamUri(
    options: {
      profileToken: string;
    },
    callback: (err: Error | null, result: StreamUriResult) => void,
  ): void;
}
