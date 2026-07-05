export function registerPwa() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("PWA registration failed:", error);
    });
  });
}

export async function requestAppNotification() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return { ok: false, reason: "unsupported" };
  }

  const permission = Notification.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();

  if (permission !== "granted") {
    return { ok: false, reason: permission };
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification("The BrandHelper alerts are on", {
    body: "You can now receive app-style updates on this device.",
    icon: "/tbh-app-icon-192.png",
    badge: "/tbh-app-icon-192.png",
    data: { url: "/contact" }
  });

  return { ok: true };
}
