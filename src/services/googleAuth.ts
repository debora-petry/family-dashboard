interface GoogleWindow extends Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: TokenClientConfig) => TokenClient;
      };
    };
  };
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  prompt: string;
  callback: (response: TokenResponse) => void;
}

interface TokenClient {
  requestAccessToken: () => void;
}

declare global {
  interface Window extends GoogleWindow {}
}

let tokenClient: TokenClient | undefined;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export function initializeGoogleAuth(
  clientId: string,
  onSuccess: (tokenResponse: TokenResponse) => void,
) {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    prompt: "consent",

    callback: (response: TokenResponse) => {
      if (response.access_token) {
        onSuccess({
          access_token: response.access_token,
          expires_in: response.expires_in || 3600,
        });
      }
    },
  });
}

export function requestToken() {
  if (!tokenClient) {
    throw new Error("Token client not initialized");
  }
  tokenClient.requestAccessToken();
}
