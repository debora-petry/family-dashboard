/* type CameraConnection = InstanceType<typeof Cam>;

type XmCameraConnection = CameraConnection & {
  defaultProfile: {
    $: {
      token: string;
    };
  };

  getSnapshotUri(
    options: { profileToken: string },
    callback: (err: Error | null, result: { uri: string }) => void,
  ): void;

  getStreamUri(
    options: { profileToken: string },
    callback: (err: Error | null, result: { uri: string }) => void,
  ): void;
};
 */
