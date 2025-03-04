// Initialize a Vue instance to manage the Mini Player UI and logic
new Vue({
  el: "#app", // Bind Vue to the DOM element with id="app"
  data() {
    // Reactive data properties for the player
    return {
      audio: null, // Audio element for playback
      circleLeft: null, // Unused in this version (placeholder for progress circle)
      barWidth: null, // Progress bar width (in percentage)
      duration: "00:00", // Total track duration
      currentTime: "00:00", // Current playback position
      isTimerPlaying: false, // Tracks play/pause state
      tracks: [], // Array of track objects
      currentTrack: null, // Current track object
      currentTrackIndex: 0, // Index of the current track
      transitionName: null, // Transition effect for track changes
      audioError: null // Stores audio-related error messages
    };
  },
  methods: {
    // Toggle play/pause state of the audio
    play() {
      if (this.audio.paused) {
        this.audio.play().catch((e) => {
          console.error("Playback failed:", e);
          this.audioError = "Failed to play audio.";
        });
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    // Convert seconds to MM:SS format
    formatTime(seconds) {
      if (isNaN(seconds)) return "00:00";
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
    },
    // Update duration and current time displays
    generateTime() {
      this.duration = this.formatTime(this.audio.duration);
      this.currentTime = this.formatTime(this.audio.currentTime);
      const width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
    },
    // Update playback position based on progress bar interaction
    updateBar(x) {
      const progress = this.$refs.progress;
      const maxDuration = this.audio.duration;
      const position = x - progress.offsetLeft;
      const percentage = (100 * position) / progress.offsetWidth;
      const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
      this.barWidth = clampedPercentage + "%";
      this.circleLeft = clampedPercentage + "%";
      this.audio.currentTime = (maxDuration * clampedPercentage) / 100;
      this.audio.play();
    },
    // Handle progress bar click or touch events
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      const x = e.type === "touchstart" ? e.touches[0].pageX : e.pageX;
      this.updateBar(x);
    },
    // Switch to the previous track
    prevTrack() {
      this.transitionName = "scale-in";
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    // Switch to the next track
    nextTrack() {
      this.transitionName = "scale-out";
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    // Reset player state for the current track
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      this.audio.load();
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play().catch((e) => {
            console.error("Playback failed:", e);
            this.audioError = "Failed to play audio.";
          });
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    // Toggle favorite status of the current track
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[this.currentTrackIndex].favorited;
    },
    // Load tracks from the static/mp3 folder
    async loadTracks() {
      const trackCount = 9; // Hardcoded number of tracks (adjust as needed)
      for (let i = 1; i <= trackCount; i++) {
        const source = `/static/mp3/${i}.mp3`; // Path to MP3 file
        const cover = `/static/img/${i}.jpg`; // Default cover image
        const track = {
          name: `Track ${i}`,
          artist: `Artist ${i}`,
          cover: cover,
          source: source,
          favorited: false
        };

        try {
          const tags = await this.readMetadata(source);
          if (tags) {
            track.name = tags.title || track.name;
            track.artist = tags.artist || track.artist;
            if (tags.picture) {
              const blob = new Blob([new Uint8Array(tags.picture.data)], { type: tags.picture.format });
              track.cover = URL.createObjectURL(blob);
            }
          }
        } catch (error) {
          console.error(`Failed to load metadata for ${source}:`, error);
        }

        this.tracks.push(track);
      }
      this.currentTrack = this.tracks[0];
      this.audio.src = this.currentTrack.source;
    },
    // Fetch metadata from an MP3 file using jsmediatags
    readMetadata(url) {
      return new Promise((resolve, reject) => {
        jsmediatags.read(url, {
          onSuccess: (tag) => resolve(tag.tags),
          onError: (error) => reject(error)
        });
      });
    }
  },
  // Lifecycle hook: runs when the instance is created
  created() {
    this.audio = new Audio();
    this.audio.ontimeupdate = () => this.generateTime();
    this.audio.onloadedmetadata = () => this.generateTime();
    this.audio.onended = () => {
      this.nextTrack();
      this.isTimerPlaying = true;
    };
    this.audio.onerror = () => {
      this.audioError = "Failed to load audio.";
    };
    this.loadTracks();
  },
  // Lifecycle hook: runs after the instance is mounted to the DOM
  mounted() {
    this.$refs.progress.addEventListener("touchstart", this.clickProgress);
  }
});
