# Mini Player (Flask + Vue.js Edition)
![image](https://github.com/user-attachments/assets/ed1b1191-f526-4e41-96ae-fa1e4f54d9c3)

Welcome to the **Mini Player** project! This is a lightweight, web-based music player that combines **Flask** (a Python web framework) and **Vue.js** (a JavaScript framework) to deliver a seamless audio experience. Users can play, pause, and navigate through a collection of MP3 tracks, with metadata like track names, artist information, and album art dynamically loaded from the files themselves. If metadata is unavailable, the player falls back to default values and images.

This project is a fork of [muhammed/mini-player](https://github.com/muhammed/mini-player) by [muhammed](https://github.com/muhammed), enhanced with Flask for backend serving and Vue.js for a dynamic frontend.

## Features

- **Dynamic Track Loading**: Reads track metadata (title, artist, album art) from MP3 files using the `jsmediatags` library.
- **Fallback Support**: Uses default track names, artist names, and images from `static/img` if metadata is missing.
- **Responsive Design**: Works on desktop and mobile, with touch support for the progress bar.
- **Favorite Tracks**: Allows users to mark tracks as favorites, with state preserved in the browser.
- **Flask Backend**: Serves the Vue.js frontend and static files (MP3s, images, CSS, JS).

## Changes from the Original Project

The original [mini-player](https://github.com/muhammed/mini-player) was a static HTML/CSS/JS application. Here’s what I’ve changed in this fork:

- **Flask Integration**: Added a Flask backend to serve the application, making it extensible for future server-side features.
- **Vue.js Frontend**: Enhanced the frontend with Vue.js for better interactivity and state management.
- **Dynamic Metadata**: Replaced hardcoded track data with dynamic loading of MP3 metadata using `jsmediatags`.
- **Folder Structure**: Organized static assets (CSS, images, MP3s, scripts) under the `static` folder, aligning with Flask conventions.

These modifications make the player more flexible and maintainable, especially for managing a larger music collection.


## Installation and Usage


### Prerequisites
- **Python 3.x**: Ensure Python is installed. Download it from [python.org](https://www.python.org/downloads/).
- **Flask**: The backend requires Flask, installed via pip.
- **Web Browser**: Needed to access and interact with the player.


### Steps to Install and Run


1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kamalexandre/mini-player.git
   cd mini-player


2. **Create a Virtual Environment (optional but recommended)**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate


3. **Install Dependencies**:
   ```bash
   pip install flask


4. **Run the Application**:
   ```bash
   python app.py


6. **Access the Player: Open your browser and navigate to **:
   ```bash
   http://localhost:5000


### Adding Your Own Music


MP3 Files: Add your MP3 files to static/mp3, named sequentially (e.g., 1.mp3, 2.mp3, etc.).
Cover Images: Optionally, place corresponding images in static/img (e.g., 1.jpg, 2.jpg, etc.) for fallback artwork.
Update Track Count: In script.js, modify the trackCount variable in the loadTracks method to match the number of MP3 files.


### Technical Details

Flask: Serves index.html and static assets. Configured with static_folder="static" and template_folder=".".
Vue.js: Manages the frontend, including audio playback, track navigation, and UI updates.
jsmediatags: Extracts ID3 tags from MP3 files for dynamic metadata loading.
Error Handling: Includes basic handling for audio playback and metadata loading errors.


### Best Practices
Virtual Environment: Use a virtual environment to isolate dependencies.
Code Comments: Both app.py and script.js include detailed comments following PEP 8 (Python) and JavaScript conventions.
GitHub Standards: This README uses Markdown, provides clear instructions, and links to the original project for transparency.

### Contributing
Feel free to fork this repository and submit pull requests. Contributions are welcome!
