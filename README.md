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

- OpenAI Whisper Speech Transcription (desktop-only)
- Searchable prompt pallete to instantly insert frequently used prompts (from
  user-defined prompt library)
- Directly tweak model settings, including Max Tokens and Max Context (change
  default settings or change it per chat)

## 🛠️ UI Tweaks

- Massive color scheme and styling changes
- Reduced empty whitespace to increase text screen real-estate
- Model select dropdown menu within individual chats
- **Many** minor style and QoL changes

<p align="center">
    <img src="https://cdn.discordapp.com/attachments/446426925209092098/1192293382920351744/Screenshot_2024-01-03_at_9.27.06_PM.png?ex=65a88cbe&is=659617be&hm=5d60622b900e4c834ef11a62423045edca40075655cc5597ee1bbda7b2eb2bb4&" alt="landing" width=800 />
</p>

## 🖥️ Electron-focused development philosophy

- Automatically generated desktop builds for every commit
- Minimize to tray on close setting
- Speech transcription with OpenAI Whisper
- Electron-only tweaks
  - Open links in browser
  - Right click context menu
  - Spellcheck
  - Nerd Font icon support (only works if `Noto Sans Nerd Font` is installed,
    currently all models see glyphs as unknown characters)
