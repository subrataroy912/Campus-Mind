export async function handleOAuthFailure({ completeOAuth, errorMessage }) {
  const normalizedError =
    errorMessage && errorMessage !== "undefined"
      ? new Error(errorMessage)
      : new Error("OAuth sign-in failed.");

  try {
    await completeOAuth({
      accessToken: null,
      refreshToken: null,
      user: null,
      errorMessage: normalizedError.message,
    });
    return normalizedError;
  } catch (error) {
    return error instanceof Error ? error : normalizedError;
  }
}

/**
 * Extract the credential payload returned by the backend OAuth redirect.
 * URLSearchParams already percent-decodes values, so decoding `user` again
 * corrupts otherwise valid JSON that contains a percent character.
 */
export function parseOAuthCallback(searchParams) {
  const errorMessage =
    searchParams.get("error") || searchParams.get("error_description");

  if (errorMessage) return { errorMessage };

  const serializedUser = searchParams.get("user");
  let user = null;

  if (serializedUser) {
    try {
      user = JSON.parse(serializedUser);
    } catch {
      return { errorMessage: "The social sign-in response contained an invalid user profile." };
    }
  }

  return {
    accessToken:
      searchParams.get("accessToken") ||
      searchParams.get("access_token") ||
      searchParams.get("token"),
    refreshToken:
      searchParams.get("refreshToken") || searchParams.get("refresh_token"),
    user,
    userId: searchParams.get("userId") || searchParams.get("user_id"),
    email: searchParams.get("email"),
    displayName: searchParams.get("displayName") || searchParams.get("display_name"),
    avatarUrl: searchParams.get("avatarUrl") || searchParams.get("avatar_url"),
  };
}
