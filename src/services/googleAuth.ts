declare global {
  interface Window {
    google: any;
  }
}

let tokenClient: any;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export function initializeGoogleAuth(
  clientId: string,
  onSuccess: (tokenResponse: TokenResponse) => void
) {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    prompt: "consent",

    callback: (response: any) => {
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
    throw new Error('Token client not initialized');
  }
  tokenClient.requestAccessToken();
}