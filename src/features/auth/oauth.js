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
