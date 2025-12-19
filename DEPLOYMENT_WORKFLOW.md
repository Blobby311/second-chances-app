# Deployment Workflow Guide

## Quick Reference

### Development Testing (Fast - Use This During Development)
```bash
cd "Second Chances"
npx expo start
```
- Use Expo Go app on your phone/tablet
- Scan QR code to connect
- **Changes appear instantly** (hot reload)
- No rebuild needed!

### Production APK (When Ready to Share/Test)
```bash
cd "Second Chances"
npx eas build --platform android --profile preview
```
- Rebuilds entire APK with latest code
- Takes 10-20 minutes
- Download APK from EAS dashboard
- Install on devices
- **Only needed when you want to test actual APK or share with others**

---

## When Do You Need to Rebuild APK?

### ✅ Rebuild APK Required:
- Changed React Native/Expo code in `Second Chances/` folder
- Updated UI components
- Modified app configuration (`app.json`, `eas.json`)
- Added new screens or features
- Changed app version number

### ❌ APK Rebuild NOT Required:
- Backend code changes (in `backend/` folder)
- Database changes
- Backend API updates
- Environment variable changes (backend only)

---

## Recommended Workflow

1. **Make Code Changes**
   - Edit files in `Second Chances/app/` or other frontend code

2. **Test Immediately (Fast)**
   ```bash
   npx expo start
   ```
   - Use Expo Go to test changes instantly
   - Make sure everything works

3. **Build APK (When Ready)**
   ```bash
   npx eas build --platform android --profile preview
   ```
   - Only when you want to test actual APK
   - Or when ready to share with others
   - Takes 10-20 minutes

4. **Install APK**
   - Download from EAS dashboard
   - Transfer to device and install
   - Test on real APK

---

## Backend Deployment

Backend is separate and auto-deploys:
- Push code to GitHub → Render auto-deploys
- Or manually trigger deploy on Render dashboard
- **No APK rebuild needed** for backend changes

---

## Version Management

Update version in `Second Chances/app.json`:
```json
{
  "version": "1.0.1"  // Increment for each release
}
```

Then rebuild APK to apply new version.

