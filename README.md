ChannelDetox - YouTube Bulk Unsubscriber Chrome Extension

---

## 📌 Project Overview

ChannelDetox is a Chrome Extension that allows users to unsubscribe from multiple YouTube channels at once.

Since YouTube does not provide a bulk unsubscribe feature, this tool enhances the subscriptions page by adding multi-select functionality and automating the unsubscribe process.

---

## 🚀 Features

* Add checkboxes to each subscribed channel
* Select multiple channels at once
* Bulk unsubscribe with one click
* Simulates real user actions (safe automation)
* Works directly on YouTube subscriptions page

---

## ⚙️ How It Works

1. User opens YouTube subscriptions page:
   https://www.youtube.com/feed/channels

2. Extension injects a script into the page

3. Script:

   * Detects all channel elements
   * Adds checkboxes next to each channel
   * Adds a control panel (buttons)

4. User selects channels

5. On clicking "Unsubscribe Selected":

   * Script clicks "Subscribed" button
   * Confirms unsubscribe popup
   * Adds delay between actions
   * Repeats for all selected channels

---

## 🛠️ Tech Stack

* JavaScript (DOM Manipulation)
* Chrome Extension (Manifest v3)
* HTML/CSS (Injected UI)

---

## 📂 Project Structure

unsubify-extension/
│
├── manifest.json   (extension configuration)
├── content.js      (main logic)
└── style.css       (UI styling)

---

## ⚠️ Limitations

* Relies on YouTube page structure (may break if UI changes)
* No official API used (DOM-based automation)
* Requires user to be logged into YouTube

---

## 💡 Future Improvements

* Select All feature
* Progress indicator
* Inactive channel detection
* Smart recommendations (AI-based cleanup)

---

## 📦 Installation Steps

1. Open Chrome
2. Go to: chrome://extensions/
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select project folder
6. Open YouTube subscriptions page
7. Start using the extension

---

## 🧠 Author

Built as a practical automation project to solve a real-world problem and demonstrate DOM manipulation and browser extension development skills.
