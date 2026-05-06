# Steam CS Mobile Demo - Android APK

A completely standalone Android app that generates AI customer service responses. **No backend server needed** - the app calls Claude API directly.

## Features

✅ **Completely Offline** - No backend server required  
✅ **Direct API Calls** - App calls Claude API directly from your phone  
✅ **Secure** - API key stored locally on your device  
✅ **Fast** - Generates responses in 3-5 seconds  
✅ **User-Friendly** - Clean mobile interface  

## What You Get

- **Installable APK** for Android phones
- Input email + constraints
- AI generates 2-3 professional response options
- Works with or without internet (needs internet for API calls only)

## Prerequisites

Before building, you need:

1. **Node.js 18+** on your computer
   - Download: https://nodejs.org
   - Check: `node --version`

2. **Expo Account** (free)
   - Sign up: https://expo.dev
   - Free tier is perfect

3. **Claude API Key**
   - Get from: https://claude.ai/settings/api
   - Free tier works fine

4. **Android Phone** to install the APK

## Build Instructions

### Step 1: Install Dependencies

```bash
cd steamcs-mobile
npm install
```

This installs all required packages (~5 minutes).

### Step 2: Create Expo Account

```bash
npm install -g eas-cli
eas login
```

Follow the prompts to create a free Expo account.

### Step 3: Build APK

```bash
eas build --platform android
```

**Choose:**
- Build type: **apk** (not app-bundle)
- This will take **5-10 minutes** depending on Expo's queue

You'll get a link to download your APK when ready.

### Step 4: Install on Phone

1. **Download the APK** from the link Expo provides
2. **Transfer to your Android phone** (email, cloud drive, etc.)
3. **Open the APK file** on your phone
4. **Tap Install**
5. **Grant permissions** when asked

## Using the App

1. **Open the app** on your Android phone
2. **Enter your Claude API key** (first time only)
   - Get it from: https://claude.ai/settings/api
   - It's stored locally on your phone, not sent to servers
3. **Enter customer email** in the first field
4. **Add constraints** (optional) - e.g., "no refund policy"
5. **Tap Generate Responses**
6. **Get 2-3 AI suggestions** in seconds

## Troubleshooting

### "eas login" doesn't work
```bash
npm install -g eas-cli
eas logout
eas login
```

### Build fails
- Check you have Node.js 18+: `node --version`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Try building again

### APK won't install
- Your phone may require "Install from unknown sources" enabled
  - Settings → Security → Unknown Sources (toggle on)
- Or try a different Android phone

### API key not working
- Check it starts with `sk-ant-api03-`
- Get new key: https://claude.ai/settings/api
- Make sure account has active credits

## File Structure

```
steamcs-mobile/
├── App.js              (Main app code)
├── app.json            (Expo configuration)
├── package.json        (Dependencies)
├── README.md           (This file)
└── .gitignore
```

## Security Notes

✅ **Your API key is stored locally** on the device  
✅ **Never transmitted** to our servers  
✅ **Only used** for Claude API calls  
✅ **Encrypted** at rest on your phone  

## How It Works

1. You enter your API key once
2. App stores it locally on your device
3. When you click "Generate", the app:
   - Takes your email + constraints
   - Sends directly to Claude API
   - Displays results on your phone
4. **No data** goes to any backend server

## Size & Performance

- **APK Size**: ~80-100 MB (includes React Native runtime)
- **Install Size**: ~150 MB on phone
- **Memory**: Uses ~100-200 MB when running
- **Network**: ~1-2 MB per API call

## Cost

- **App**: Free (this code)
- **Claude API**: $0.003 per 1K input tokens (~$0.50/month for light use)

## Support

- **Node.js issues**: https://nodejs.org/docs
- **Expo issues**: https://docs.expo.dev
- **Claude API issues**: https://docs.anthropic.com
- **Android issues**: Check your phone settings for "Unknown Sources"

## License

MIT - Use freely for personal/commercial use

---

**Built with:** React Native + Expo + Anthropic Claude API
