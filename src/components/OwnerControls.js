import { useState } from "react";
import { useOwnerAuth } from "../auth/OwnerAuthContext";
import GoogleSignInButton from "../auth/GoogleSignInButton";

export default function OwnerControls() {
  const { canEdit, isConfigured, isChecking, error, signOut } = useOwnerAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  if (!isConfigured) return null;

  return (
    <div className="owner-controls">
      {canEdit ? (
        <>
          <span>Owner editing enabled</span>
          <button className="button button--outline" onClick={signOut}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <button
            className="button button--outline"
            aria-expanded={showSignIn}
            aria-controls="owner-sign-in"
            onClick={() => setShowSignIn((shown) => !shown)}
          >
            Owner sign in
          </button>
          {showSignIn ? (
            <div id="owner-sign-in" className="owner-sign-in">
              <p>Editing is reserved for the site owner.</p>
              <GoogleSignInButton />
            </div>
          ) : null}
        </>
      )}
      {isChecking ? <p role="status">Checking editor access…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
