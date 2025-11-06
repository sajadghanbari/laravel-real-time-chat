# 💬 Messenger – Laravel + React

A modern, real-time messenger built with **Laravel** (API + WebSockets via **Reverb**) and **React** (SPA).  
It features Breeze authentication, user & group management, rich attachments, voice notes, emoji support, and smooth media previews.

<p align="center">
  <img src="docs/screenshot-conversations.png" alt="Conversations UI" width="85%"/>
</p>

---

## ✨ Features

- 🔌 **Realtime messaging** with **Laravel Reverb** (WebSockets)  
- 👥 **User & group CRUD** (create / read / update / delete)  
- 🖼️ **Upload** images, videos, and generic files  
- 🎙️ **Send voice messages**  
- 🙂 **Emoji picker** in the composer  
- 👀 **Preview** images & videos before sending  
- ▶️ **Inline media player** (image & video viewer)  
- 🔐 **Authentication** with **Laravel Breeze** + **Sanctum**  
- 📱 **Responsive React UI**  

<p align="center">
  <img src="docs/screenshot-attachments.png" alt="Attachments & Voice Messages" width="85%"/>
</p>

---

## 🧱 Tech Stack

### 🖥️ Backend
- **PHP 8.2+**, **Laravel 10/11**
- **Laravel Reverb** – real-time WebSocket broadcasting  
- **Laravel Breeze** (Auth) + **Sanctum**
- **MySQL**
- **Public disk storage** for media uploads

### 💻 Frontend
- **React 18** + **Vite**
- **JavaScript** 
- **Tailwind CSS** 

---

## 📨 Message Payloads

| Type | Content |
|------|----------|
| 💬 **Text / Emoji** | `{ content: string }` |
| 🎙️ **Voice Note** | Multipart form with `audio` file (e.g. `audio/webm`) |
| 🖼️ **Image / Video / File** | Multipart form with `file` and optional `caption` |

---

## 🎛️ Voice Messages

- Recorded on the client via **MediaRecorder API**  
- Uploaded as `audio/webm` or `audio/mpeg`  
- Server-side validation for **MIME type** and **duration**  
- Stored alongside other attachments  
- Rendered using a native HTML `<audio>` player  

---

## 🖼️ Media Preview & Playback

- Preview **images** and **videos** before upload  
- Use **Object URLs** for local preview  
- Replace preview with final **server URL** after upload  
- For video: `<video controls>`  
- For images: lightbox or gallery-style preview  

---

## 🙌 Acknowledgements

Special thanks to the creators of these amazing tools and frameworks:  
- **Laravel**, **Breeze**, **Sanctum**, **Reverb**  
- **React**, **Vite**, **Tailwind CSS**
- 

---
## 🪪 License

This project is released under the **MIT License** — free for personal or commercial use.
---
## ⚡ Installation

Follow the steps below to get the project running locally:

```bash
# Clone the repository
git clone https://github.com/sajadghanbari/Laravel.git

# Navigate into the project directory
cd Laravel

# Install dependencies
composer install
npm install && npm run dev

# Copy environment file
cp .env.example .env

# Configure your database in the .env file, then migrate:
php artisan migrate --seed

# Start the local server
php artisan serve
php artisan reverb:start --debug



