export async function handleOAuthFailure({ completeOAuth, errorMessage }) {
  const normalizedError =
    errorMessage && errorMessage !== "undefined"
      ? new Error(errorMessage)
      : new Error("OAuth sign-in failed.");

  try {
    await completeOAuth({
      accessToken: null,
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
  const oauthError = searchParams.get("error");
  const errorMessage =
    oauthError === "oauth_failed"
      ? "OAuth sign-in failed."
      : oauthError === "unverified_email"
      ? "Your social account email is missing or unverified by the provider. Please verify your email with the provider and try again."
      : oauthError;

  if (errorMessage) return { errorMessage };

  const serializedUser = searchParams.get("user");
  let user = null;

  if (serializedUser) {
    try {
      user = JSON.parse(serializedUser);
    } catch {
      return {
        errorMessage:
          "The social sign-in response contained an invalid user profile.",
      };
    }
  }

  return {
    accessToken:
      searchParams.get("accessToken") ||
      searchParams.get("access_token") ||
      searchParams.get("token"),
    user,
    userId: searchParams.get("userId") || searchParams.get("user_id"),
    email: searchParams.get("email"),
    displayName:
      searchParams.get("displayName") || searchParams.get("display_name"),
    avatarUrl: searchParams.get("avatarUrl") || searchParams.get("avatar_url"),
  };
}
