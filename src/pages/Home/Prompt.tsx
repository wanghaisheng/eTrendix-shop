import { useEffect, useState } from "react";

// Explicitly type the deferredPrompt as BeforeInstallPromptEvent or null
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const Prompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent); // Cast the event to BeforeInstallPromptEvent
      setShowPrompt(true); // Show the custom prompt
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the native prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null); // Reset the deferred prompt
        setShowPrompt(false); // Hide the custom prompt
      });
    }
  };

  if (!showPrompt) {
    return null; // Don't render the prompt if it shouldn't be shown
  }

  return (
    <div
      className="offcanvas offcanvas-bottom addtohome-popup show"
      id="offcanvasPWA"
    >
      <button
        type="button"
        className="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        onClick={() => setShowPrompt(false)}
      ></button>
      <div className="offcanvas-body small">
        <div className="app-info">
          <img src="/icons/favicon.ico" className="img-fluid" alt="App Icon" />
          <div className="content">
            <h3>eTrendix App</h3>
            <p>
              Add this app directly to your home screen for quick access. No
              download needed from the Play Store/App Store.
            </p>
          </div>
        </div>
        <button
          className="btn btn-solid install-app"
          onClick={handleAddToHomeScreen}
        >
          Add to Home Screen
        </button>
      </div>
    </div>
  );
};

export default Prompt;
