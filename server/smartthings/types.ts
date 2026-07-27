export interface SmartThingsDevice {
  deviceId: string;
  name: string;
  label: string;
  type: string;
  roomId?: string;
  locationId: string;
  presentationId?: string;
  manufacturerName?: string;
}
