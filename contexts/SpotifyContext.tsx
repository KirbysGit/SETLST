import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SCOPES,
  spotifyDiscovery,
  SpotifyTokens,
  getSpotifyTokens,
  saveSpotifyTokens,
  clearSpotifyTokens,
  isTokenExpired,
  refreshSpotifyToken,
  makeRedirectUri,
} from "../lib/spotify";

WebBrowser.maybeCompleteAuthSession();

// ─── Types ────────────────────────────────────────────────────────────────────
interface SpotifyContextValue {
  tokens: SpotifyTokens | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SpotifyContext = createContext<SpotifyContextValue>({
  tokens: null,
  isConnected: false,
  isLoading: true,
  connect: async () => {},
  disconnect: async () => {},
});

export function useSpotify() {
  return useContext(SpotifyContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirectUri = makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: SPOTIFY_SCOPES.split(" "),
      usePKCE: true,
      redirectUri,
    },
    spotifyDiscovery
  );

  // Load persisted tokens on mount
  useEffect(() => {
    (async () => {
      const stored = await getSpotifyTokens();
      if (stored) {
        if (isTokenExpired(stored)) {
          const refreshed = await refreshSpotifyToken(stored.refreshToken);
          setTokens(refreshed);
        } else {
          setTokens(stored);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  // Handle auth response
  useEffect(() => {
    if (response?.type !== "success") return;

    const { code } = response.params;
    const codeVerifier = request?.codeVerifier;
    if (!code || !codeVerifier) return;

    (async () => {
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: SPOTIFY_CLIENT_ID,
          code_verifier: codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) return;

      const data = await tokenResponse.json();
      const newTokens: SpotifyTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };
      await saveSpotifyTokens(newTokens);
      setTokens(newTokens);
    })();
  }, [response]);

  async function connect() {
    await promptAsync();
  }

  async function disconnect() {
    await clearSpotifyTokens();
    setTokens(null);
  }

  return (
    <SpotifyContext.Provider
      value={{
        tokens,
        isConnected: !!tokens,
        isLoading,
        connect,
        disconnect,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}
