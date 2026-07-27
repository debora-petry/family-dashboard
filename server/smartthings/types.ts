export interface SmartThingsDevice {
  dvceID: string;
  usrId: string;
  modelName: string;
  modelID: string;
  deviceTypeCode: string;
}

export interface SmartThingsLocation {
  latitude: number;
  longitude: number;
  gpsDate: Date;
  gpsAccuracy?: number;
}

export interface SmartThingsOperation {
  oprnType: string;
  latitude?: string;
  longitude?: string;
  battery?: string;

  horizontalUncertainty?: string;
  verticalUncertainty?: string;

  extra?: {
    gpsUtcDt?: string;
  };

  encLocation?: unknown;
}
