// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../onvif.d.ts" />
import { Cam } from "onvif";
import type { XmCameraConnection } from "./camera.types.ts";

export interface MotionAlert {
  /**
   * Nome ou categoria do evento fornecido pela câmera, quando disponível.
   * Pode vir de campos como Topic ou topic na notificação ONVIF.
   */
  topic: string;

  /**
   * Texto descritivo do evento. Usa a mensagem extraída da notificação
   * ou um fallback como "motion event detected".
   */
  message: string;

  /**
   * Timestamp gerado no momento em que o alerta foi construído.
   */
  timestamp: string;

  /**
   * Indica se o alerta menciona uma pessoa/humano no texto do evento.
   */
  isPerson: boolean;

  /**
   * Indica se a notificação representa um evento de movimento real
   * interpretado pela câmera (start/stop de movimento).
   */
  isMotion: boolean;

  /**
   * Operação detectada na notificação ONVIF, como "Changed".
   */
  operation?: string;

  /**
   * Estado do evento ONVIF interpretado como booleano, por exemplo
   * true para início de movimento e false para fim do movimento.
   */
  state?: boolean;

  /**
   * Payload bruto original recebido da câmera, preservado para inspeção
   * e possíveis regras de parse adicionais.
   */
  raw: unknown;
}

export class CameraService {
  private readonly host = "192.168.0.3";
  private readonly port = 8899;
  private readonly username = "xfbr";
  private readonly password = "XrMlauYC";

  async connect(): Promise<XmCameraConnection> {
    return new Promise((resolve, reject) => {
      const cam = new Cam(
        {
          hostname: this.host,
          username: this.username,
          password: this.password,
          port: this.port,
        },
        (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(cam as XmCameraConnection);
        },
      );
    });
  }

  async getSnapshotUri(): Promise<string> {
    const cam = await this.connect();

    return new Promise((resolve, reject) => {
      cam.getSnapshotUri(
        {
          profileToken: cam.defaultProfile.$.token,
        },
        (err: Error | null, result: { uri: string }) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result.uri.trim());
        },
      );
    });
  }

  async startMotionDetectionListener(
    onAlert: (alert: MotionAlert) => void,
  ): Promise<void> {
    const cam = await this.connect();

    cam.on("event", (notification: unknown) => {
      console.dir(notification, {
        depth: null,
        colors: true,
      });
      const notifications = this.extractNotifications(notification);

      for (const item of notifications) {
        const alert = this.buildMotionAlert(item);
        if (alert?.isMotion) {
          onAlert(alert);
          console.log("Motion alert received:", alert);
        }
      }
    });

    cam.on("eventsError", (error: Error) => {
      console.error("Camera event error:", error);
    });
  }

  private extractNotifications(result: unknown): unknown[] {
    if (!result) {
      return [];
    }

    if (Array.isArray(result)) {
      return result;
    }

    const candidates = [
      (result as unknown as Record<string, unknown>)[
        "wsnt:NotificationMessageHolderType"
      ],
      (result as unknown as Record<string, unknown>).notificationMessage,
      (result as unknown as Record<string, unknown>).notificationMessages,
      (result as unknown as Record<string, unknown>).messages,
      result,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      if (Array.isArray(candidate)) {
        return candidate;
      }
      return [candidate];
    }

    return [];
  }

  private extractText(value: unknown): string {
    if (value == null) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => this.extractText(item))
        .filter(Boolean)
        .join(" ");
    }

    if (typeof value === "object") {
      return Object.values(value as Record<string, unknown>)
        .map((item) => this.extractText(item))
        .filter(Boolean)
        .join(" ");
    }

    return "";
  }

  private buildMotionAlert(notification: unknown): MotionAlert | null {
    const notificationObj = notification as Record<string, unknown>;

    const msg = (
      notificationObj?.message as Record<string, unknown> | undefined
    )?.message as Record<string, unknown> | undefined;

    const operation = (msg?.$ as Record<string, unknown> | undefined)
      ?.PropertyOperation as string | undefined;
    const stateRaw = (
      (msg?.data as Record<string, unknown> | undefined)?.simpleItem as
        | Record<string, unknown>
        | undefined
    )?.$ as Record<string, unknown> | undefined;
    const stateValue = stateRaw?.Value;

    const state =
      stateValue === true ||
      stateValue === "true" ||
      stateValue === "1" ||
      stateValue === 1
        ? true
        : stateValue === false ||
            stateValue === "false" ||
            stateValue === "0" ||
            stateValue === 0
          ? false
          : undefined;

    const isMotionOn = operation === "Changed" && state === true;
    const isMotionOff = operation === "Changed" && state === false;

    const topic =
      this.extractText(notificationObj.Topic) ||
      this.extractText(notificationObj.topic) ||
      this.extractText(notificationObj);
    const message =
      this.extractText(notificationObj.Message) ||
      this.extractText(notificationObj.message) ||
      this.extractText(notificationObj.Data) ||
      this.extractText(notificationObj);

    const combined = `${topic} ${message}`.trim();

    if (
      !isMotionOn &&
      !isMotionOff &&
      !/(motion|move|moving|people|person|human|alarm|detected|object)/i.test(
        combined.toLowerCase(),
      )
    ) {
      return null;
    }

    return {
      topic: topic || "unknown",
      message:
        message ||
        combined ||
        (isMotionOn
          ? "motion event detected"
          : isMotionOff
            ? "motion stopped"
            : "camera event received"),
      timestamp: new Date().toISOString(),
      isPerson: /person|people|human/i.test(combined.toLowerCase()),
      isMotion: isMotionOn,
      operation,
      state,
      raw: notification,
    };
  }
}
