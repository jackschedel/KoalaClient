<h1 align="center"><b>KoalaClient</b></h1>

<p align="center">
    <a href="https://client.koaladev.io" target="_blank"><img src="public/apple-touch-icon.png" alt="KoalaClient Icon" width="100" /></a>
</p>

<h4 align="center"><b>OpenAI API user interface allowing seamless integration of generative AI into your workflow</b></h4>

<p align="center">
<a href="https://github.com/jackschedel/KoalaClient/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/jackschedel/KoalaClient?style=flat-square" alt="licence" />
</a>

<a href="https://github.com/jackschedel/KoalaClient/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/jackschedel/KoalaClient?style=flat-square" alt="issues"/>
</a>

<a href="https://github.com/jackschedel/KoalaClient/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/jackschedel/KoalaClient?style=flat-square" alt="pull-requests"/>
</a>

<a href="https://github.com/prettier/prettier" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"/>
</a>
</p>

## 🔥 Features

- Speech transcription using OpenAI's Whisper
- Searchable prompt pallete to instantly insert frequently used prompts from
  user-defined prompt library
- Directly tweak model settings, including Max Tokens and Max Context (change default settings or change it per chat)
- Minimal whitespace, designed to be used maximized or in a small window
- Keyboard shortcuts intended to allow for workflow-optimization hotkeys (using AHK or Karabiner)
- Beautiful UI with consistent styling

<p align="center">
    <img src="https://schedel.io/koalaclientss.d0f3213a.png" alt="landing" width=800 />
</p>

## 📡 Multi-Endpoint focus
- Use any OpenAI-compliant endpoint (or an adapter service like https://openrouter.ai/)
- Setup up multiple models, using multiple endpoints for each
- Fully customizable prompt pricing calculation for each model (uses OpenAI's tokenizer only)

<p align="center">
    <img src="https://github.com/user-attachments/assets/59ee54e1-694b-4339-8509-9d16fbcf9e9a" alt="landing" width=800 />
</p>

## 🌐 Website version

- Access KoalaClient from the web, or via the desktop app.
- https://client.koaladev.io is updated automatically with every commit
- Enable Google Sync to sync your chats across devices
- Android/iOS mobile app via web-wrapper: https://median.co/share/exnwbx

## 🖥️ Better on desktop
- Open links in browser
- Right click context menu
- Spellcheck
- Nerd Font icon support (only works if `Noto Sans Nerd Font` is installed,
currently all models see glyphs as unknown characters)
- Various desktop-only and mac-only keybinds (browser version has some, but other conflict with native binds)
