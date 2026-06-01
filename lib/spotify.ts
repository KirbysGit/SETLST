import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

// ─── Config ───────────────────────────────────────────────────────────────────
export const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;

const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "user-read-private",
  "user-read-email",
].join(" ");

const STORAGE_KEY = "spotify_tokens";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix ms
}

// ─── Discovery ────────────────────────────────────────────────────────────────
export const spotifyDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

// ─── PKCE helpers ─────────────────────────────────────────────────────────────
export async function generateCodeChallenge(verifier: string) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return digest
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ─── Token storage ────────────────────────────────────────────────────────────
export async function saveSpotifyTokens(tokens: SpotifyTokens) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export async function getSpotifyTokens(): Promise<SpotifyTokens | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearSpotifyTokens() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function isTokenExpired(tokens: SpotifyTokens): boolean {
  return Date.now() >= tokens.expiresAt - 60_000; // 1 min buffer
}

// ─── Refresh ──────────────────────────────────────────────────────────────────
export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokens | null> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }).toString(),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const tokens: SpotifyTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  await saveSpotifyTokens(tokens);
  return tokens;
}

// ─── Spotify Web API fetch wrapper ────────────────────────────────────────────
export async function spotifyFetch(endpoint: string): Promise<any> {
  let tokens = await getSpotifyTokens();
  if (!tokens) throw new Error("Not connected to Spotify");

  if (isTokenExpired(tokens)) {
    tokens = await refreshSpotifyToken(tokens.refreshToken);
    if (!tokens) throw new Error("Spotify token refresh failed");
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  if (response.status === 204) return null; // No content — nothing playing
  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json();
}

// ─── Auth request hook config (used in components) ───────────────────────────
export function makeRedirectUri() {
  const uri = AuthSession.makeRedirectUri();
  console.log("🎵 Spotify redirect URI:", uri);
  return uri;
}

export { SPOTIFY_SCOPES };
