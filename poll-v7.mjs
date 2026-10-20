const id = "googleplaypackagejob:qr.pavilionventure.com:e0955f46-0c0e-43aa-8b40-020a529ba35c";
const accessToken = "i7osgCpWxtVQiMhIV6573VKa357wkU_GrxpvpWEkraI";
const fs = await import("fs");

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
    fs.writeFileSync("v7-bundle-package.zip", buffer);
    console.log("Successfully saved v7-bundle-package.zip (" + buffer.length + " bytes)");
    break;
  } else if (job.status === "Failed") {
    console.error("Job failed. Logs:", job.logs);
    break;
  }
}
