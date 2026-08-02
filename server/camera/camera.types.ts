// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../onvif.d.ts" />
import { Cam } from "onvif";
import type { EventEmitter } from "events";

export type CameraConnection = InstanceType<typeof Cam> & EventEmitter;

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

export interface PullPointSubscriptionResult {
  subscriptionReference: {
    address: { href: string };
    referenceParameters?: {
      subscriptionId?: string;
    };
  };
}

export type XmCameraConnection = CameraConnection & {
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

  createPullPointSubscription(
    callback: (err: Error | null, result: PullPointSubscriptionResult) => void,
  ): void;

  pullMessages(
    options: { timeout: number; messageLimit: number },
    callback: (err: Error | null, result: unknown) => void,
  ): void;

  on(
    event: "event",
    listener: (notification: unknown, xml: string) => void,
  ): CameraConnection;
  on(event: "eventsError", listener: (error: Error) => void): CameraConnection;
  on(event: string, listener: (...args: unknown[]) => void): CameraConnection;
};
