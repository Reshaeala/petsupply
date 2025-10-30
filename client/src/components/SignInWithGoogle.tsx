export default function SignInWithGoogle() {
  const handleGoogleSignIn = () => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    // Dynamically create the redirect URI from the current location
    const redirectUri = `${window.location.origin}/google-callback`;

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "profile email",
      prompt: "select_account",
    });
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 w-full rounded border flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        alt="Google logo"
        className="w-5 h-5"
      />
      <span>Sign in with Google</span>
    </button>
  );
}
