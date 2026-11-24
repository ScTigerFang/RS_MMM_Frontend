import { useEffect, useRef, useState } from "react";
import { useOwnerAuth } from "./OwnerAuthContext";

let googleScriptPromise;

function loadGoogleSignIn() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google?.accounts?.id) resolve(window.google.accounts.id);
      else {
        script.remove();
        googleScriptPromise = undefined;
        reject(new Error("Google sign-in did not load."));
      }
    };
    script.onerror = () => {
      script.remove();
      googleScriptPromise = undefined;
      reject(new Error("Google sign-in did not load."));
    };
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

// Mount only after the visitor chooses Owner sign in. No automatic login prompt.
export default function GoogleSignInButton() {
  const { clientId, isConfigured, signIn } = useOwnerAuth();
  const buttonRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isConfigured) return undefined;
    let active = true;
    const container = buttonRef.current;
    setLoadError(false);
    loadGoogleSignIn()
      .then((googleIdentity) => {
        if (!active) return;
        googleIdentity.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response) => {
            if (active) signIn(response.credential);
          },
        });
        googleIdentity.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
        });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
      container?.replaceChildren();
    };
  }, [clientId, isConfigured, signIn, attempt]);

  if (!isConfigured) return null;
  return (
    <div>
      <div ref={buttonRef} />
      {loadError ? (
        <div>
          <p role="alert">Google sign-in couldn't load. Please try again.</p>
          <button className="button button--outline" onClick={() => setAttempt(attempt + 1)}>
            Retry sign-in
          </button>
        </div>
      ) : null}
    </div>
  );
}
