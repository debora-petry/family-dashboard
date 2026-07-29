import { useEffect, useState } from "react";

interface UseCameraSnapshotOptions {
  interval?: number;
}

export function useCameraSnapshot({
  interval = 1000,
}: UseCameraSnapshotOptions = {}) {
  const [imageUrl, setSrc] = useState("");

  useEffect(() => {
    const update = () => {
      setSrc(
        `${import.meta.env.VITE_API_URL}/api/camera/snapshot?t=${Date.now()}`,
      );
    };

    update();

    const id = window.setInterval(update, interval);

    return () => clearInterval(id);
  }, [interval]);

  return imageUrl; //Retorna a url da imagem
}
