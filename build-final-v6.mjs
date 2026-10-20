const fs = await import("fs");

const options = {
  additionalTrustedOrigins: [],
  appVersion: "1.0.5",
  appVersionCode: 6,
  backgroundColor: "#020617",
  display: "standalone",
  enableSiteSettingsShortcut: true,
  enableNotifications: false,
  includeSourceCode: false,
  fallbackType: "customtabs",
  features: {
    locationDelegation: { enabled: false },
    playBilling: { enabled: true }
  },
  host: "https://qr.pavilionventure.com",
  pwaUrl: "https://qr.pavilionventure.com",
  webManifestUrl: "https://qr.pavilionventure.com/manifest.webmanifest",
  iconUrl: "https://qr.pavilionventure.com/pwa-512x512.png",
  maskableIconUrl: "https://qr.pavilionventure.com/maskable-512x512.png",
  launcherName: "Pavilion QR Pro",
  name: "Pavilion QR Pro",
  navigationColor: "#020617",
  navigationColorDark: "#020617",
  navigationDividerColor: "#020617",
  navigationDividerColorDark: "#020617",
  orientation: "default",
  packageId: "com.pavilionventure.qrpro",
  shortcuts: [],
  signingMode: "new",
  signing: {
    alias: "pavilion-qrpro-key",
    fullName: "Pavilion Venture",
    organization: "Pavilion Venture",
    organizationalUnit: "Engineering",
    countryCode: "US",
    keyPassword: "PavilionQR2026!",
    storePassword: "PavilionQR2026!"
  },
  splashScreenFadeOutDuration: 300,
  startUrl: "/",
  themeColor: "#0f172a",
  themeColorDark: "#020617"
};

console.log("Enqueuing job for v1.0.5 (code 6)...");
const res = await fetch("https://pwabuilder-cloudapk.azurewebsites.net/enqueuePackageJob", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "platform-identifier": "ServerUI",
    "platform-identifier-version": "1.0.0"
  },
  body: JSON.stringify(options)
});

if (!res.ok) {
  console.error("Error enqueuing:", res.status, await res.text());
  process.exit(1);
}

const { id, accessToken } = await res.json();
console.log("Job ID:", id);

while (true) {
  await new Promise(r => setTimeout(r, 3000));
  const jobRes = await fetch(`https://pwabuilder-cloudapk.azurewebsites.net/getPackageJob?id=${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!jobRes.ok) {
    console.error("Error polling:", jobRes.status, await jobRes.text());
    break;
  }
  const job = await jobRes.json();
  console.log("Job status:", job.status);
  if (job.status === "Completed") {
    console.log("Completed! Downloading zip...");
    const zipRes = await fetch(`https://pwabuilder-cloudapk.azurewebsites.net/downloadPackageZip?id=${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const buffer = Buffer.from(await zipRes.arrayBuffer());
    fs.writeFileSync("v6-bundle-package.zip", buffer);
    console.log("Successfully saved v6-bundle-package.zip (" + buffer.length + " bytes)");
    break;
  } else if (job.status === "Failed") {
    console.error("Job failed. Logs:", job.logs);
    break;
  }
}
