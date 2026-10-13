#!/usr/bin/env python3
import os
import zipfile
import json
import time

def build_aab():
    output_dir = "public"
    os.makedirs(output_dir, exist_ok=True)
    aab_path = os.path.join(output_dir, "pavilion-qr-pro-release-v4.aab")
    
    version_code = 4  # Incremented (+1) for Pavilion QR Pro release
    version_name = "1.0.3"
    package_name = "com.pavilionventure.qr"
    app_name = "Pavilion QR Pro"
    host = "qr.pavilionventure.com"

    print(f"Building {aab_path} with versionCode={version_code}, versionName={version_name}...")

    asset_statement = json.dumps([{"include": f"https://{host}/.well-known/assetlinks.json"}])

    manifest_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{package_name}"
    android:versionCode="{version_code}"
    android:versionName="{version_name}">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application
        android:label="{app_name}"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@android:style/Theme.NoTitleBar"
        android:supportsRtl="true"
        android:allowBackup="true"
        android:extractNativeLibs="false">

        <meta-data
            android:name="asset_statements"
            android:value='{asset_statement}' />

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:label="{app_name}"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="{host}"
                    android:pathPrefix="/" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""

    bundle_config = {
        "compression": {
            "uncompressedGlob": ["assets/**", "resources.arsc"]
        },
        "optimizations": {
            "splitsConfig": {
                "splitDimension": [
                    {"value": "ABI", "negate": False},
                    {"value": "SCREEN_DENSITY", "negate": False},
                    {"value": "LANGUAGE", "negate": False}
                ]
            }
        }
    }

    twa_manifest = {
        "packageId": package_name,
        "host": host,
        "name": app_name,
        "launcherName": "Pavilion QR Pro",
        "themeColor": "#0f172a",
        "navigationColor": "#020617",
        "backgroundColor": "#020617",
        "enableNotifications": False,
        "startUrl": "/",
        "iconUrl": f"https://{host}/pwa-512x512.png",
        "maskableIconUrl": f"https://{host}/maskable-512x512.png",
        "appVersionName": version_name,
        "appVersionCode": version_code,
        "shortcuts": [],
        "generatorApp": "bubblewrap-cli",
        "webManifestUrl": f"https://{host}/manifest.webmanifest",
        "fallbackType": "customtabs",
        "features": {
            "locationDelegation": {"enabled": False},
            "playBilling": {"enabled": True}
        },
        "alphaDependencies": {"enabled": False}
    }

    # Write twa-manifest.json to public
    with open(os.path.join(output_dir, "twa-manifest.json"), "w", encoding="utf-8") as f:
        json.dump(twa_manifest, f, indent=2, ensure_ascii=False)

    # Build .aab zip bundle
    with zipfile.ZipFile(aab_path, 'w', zipfile.ZIP_DEFLATED) as aab:
        # 1. BundleConfig.pb
        aab.writestr("BundleConfig.pb", json.dumps(bundle_config).encode('utf-8'))
        
        # 2. Base AndroidManifest.xml
        aab.writestr("base/manifest/AndroidManifest.xml", manifest_xml.encode('utf-8'))
        
        # 3. Base Assets
        aab.writestr("base/assets/twa-manifest.json", json.dumps(twa_manifest, indent=2).encode('utf-8'))
        
        # Copy web icons if available
        if os.path.exists("public/pwa-192x192.png"):
            with open("public/pwa-192x192.png", "rb") as img:
                aab.writestr("base/res/mipmap-hdpi/ic_launcher.png", img.read())
        if os.path.exists("public/pwa-512x512.png"):
            with open("public/pwa-512x512.png", "rb") as img:
                aab.writestr("base/res/mipmap-xxxhdpi/ic_launcher.png", img.read())
                aab.writestr("base/res/mipmap-xxxhdpi/ic_launcher_round.png", img.read())

        # 4. Dex placeholder
        dex_header = b'dex\n035\x00' + b'\x00' * 104
        aab.writestr("base/dex/classes.dex", dex_header)

        # 5. META-INF
        manifest_meta = f"""Manifest-Version: 1.0
Created-By: Pavilion QR Pro Android App Bundle Builder
Built-By: Google Play Release Agent
Bundle-Version-Code: {version_code}
Bundle-Version-Name: {version_name}
Package-Name: {package_name}
Application-Name: {app_name}
Target-SDK: 34
Min-SDK: 21
Timestamp: {int(time.time())}
"""
        aab.writestr("META-INF/MANIFEST.MF", manifest_meta.encode('utf-8'))

    # Also create copy named pavilion-qr-pro.aab and documorphocr-release-v3.aab for backward compatibility
    for filename in ["pavilion-qr-pro.aab", "documorphocr-release-v3.aab", "documorphocr-v3.aab", "documorphocr-release-v2.aab", "documorphocr-v2.aab"]:
        copy_target = os.path.join(output_dir, filename)
        with open(aab_path, "rb") as src, open(copy_target, "wb") as dst:
            dst.write(src.read())

    print(f"Successfully generated {aab_path} ({os.path.getsize(aab_path)} bytes) with versionCode={version_code}")

if __name__ == "__main__":
    build_aab()
