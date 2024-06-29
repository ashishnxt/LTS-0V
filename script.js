let indexSong = 0;
let isLocked = false;
let songsLength = null;
let selectedSong = null;
let loadingProgress = 0;
let songIsPlayed = false;
let progress_elmnt = null;
let songName_elmnt = null;
let sliderImgs_elmnt = null;
let singerName_elmnt = null;
let progressBar_elmnt = null;
let playlistSongs_elmnt = [];
let loadingProgress_elmnt = null;
let musicPlayerInfo_elmnt = null;
let progressBarIsUpdating = false;
let broadcastGuarantor_elmnt = null;
const root = document.querySelector("#root");

function App({ songs }) {
  function handleChangeMusic({ isPrev = false, playListIndex = null }) {
    if (isLocked || indexSong === playListIndex) return;

    if (playListIndex !== null) {
      indexSong = playListIndex;
    } else {
      indexSong = isPrev ? (indexSong -= 1) : (indexSong += 1);
    }

    if (indexSong < 0) {
      indexSong = 0;
      return;
    } else if (indexSong > songsLength) {
      indexSong = songsLength;
      return;
    }

    selectedSong.pause();
    selectedSong.currentTime = 0;
    progressBarIsUpdating = false;
    selectedSong = playlistSongs_elmnt[indexSong];

    if (selectedSong.paused && songIsPlayed) selectedSong.play();
    else selectedSong.pause();

    setBodyBg(songs[indexSong].bg);
    setProperty(sliderImgs_elmnt, "--index", -indexSong);
    updateInfo(singerName_elmnt, songs[indexSong].artist);
    updateInfo(songName_elmnt, songs[indexSong].songName);
  }

  setBodyBg(songs[0].bg);

  const musicPlayer = document.createElement("div");
  musicPlayer.className = "music-player flex-column";
  musicPlayer.appendChild(Slider({ slides: songs, handleChangeMusic }));
  musicPlayer.appendChild(Playlist({ list: songs, handleChangeMusic }));
  return musicPlayer;
}

function Slider({ slides, handleChangeMusic }) {
  function handleResizeSlider(event) {
    if (isLocked) return;

    const target = event.target;

    if (target.classList.contains("music-player__info")) {
      this.classList.add("resize");
      setProperty(this, "--controls-animate", "down running");
    } else if (target.classList.contains("music-player__playlist-button")) {
      this.classList.remove("resize");
      setProperty(this, "--controls-animate", "up running");
    }
  }

  function handlePlayMusic() {
    if (selectedSong.currentTime === selectedSong.duration) {
      handleChangeMusic({});
    }

    this.classList.toggle("click");
    songIsPlayed = !songIsPlayed;
    selectedSong.paused ? selectedSong.play() : selectedSong.pause();
  }

  const slider = document.createElement("div");
  slider.className = "slider center";
  slider.addEventListener("click", handleResizeSlider);

  const sliderContent = document.createElement("div");
  sliderContent.className = "slider__content center";

  const playlistButton = document.createElement("button");
  playlistButton.className = "music-player__playlist-button center button";
  const playlistIcon = document.createElement("i");
  playlistIcon.className = "icon-playlist";
  playlistButton.appendChild(playlistIcon);

  const broadcastGuarantor = document.createElement("button");
  broadcastGuarantor.className = "music-player__broadcast-guarantor center button";
  broadcastGuarantor.addEventListener("click", handlePlayMusic);
  const playIcon = document.createElement("i");
  playIcon.className = "icon-play";
  const pauseIcon = document.createElement("i");
  pauseIcon.className = "icon-pause";
  broadcastGuarantor.appendChild(playIcon);
  broadcastGuarantor.appendChild(pauseIcon);

  const sliderImgs = document.createElement("div");
  sliderImgs.className = "slider__imgs flex-row";
  slides.forEach(({ songName, files: { cover } }) => {
    const img = document.createElement("img");
    img.src = cover;
    img.className = "img";
    img.alt = songName;
    sliderImgs.appendChild(img);
  });

  sliderContent.appendChild(playlistButton);
  sliderContent.appendChild(broadcastGuarantor);
  sliderContent.appendChild(sliderImgs);
  slider.appendChild(sliderContent);

  const sliderControls = document.createElement("div");
  sliderControls.className = "slider__controls center";

  const prevButton = document.createElement("button");
  prevButton.className = "slider__switch-button flex-row button";
  prevButton.addEventListener("click", () => handleChangeMusic({ isPrev: true }));
  const prevIcon = document.createElement("i");
  prevIcon.className = "icon-back";
  prevButton.appendChild(prevIcon);

  const musicPlayerInfo = document.createElement("div");
  musicPlayerInfo.className = "music-player__info text_trsf-cap";
  const singerName = document.createElement("div");
  singerName.className = "music-player__singer-name";
  singerName.innerHTML = `<div>${slides[0].artist}</div>`;
  const songTitle = document.createElement("div");
  songTitle.className = "music-player__subtitle";
  songTitle.innerHTML = `<div>${slides[0].songName}</div>`;
  musicPlayerInfo.appendChild(singerName);
  musicPlayerInfo.appendChild(songTitle);

  const nextButton = document.createElement("button");
  nextButton.className = "slider__switch-button flex-row button";
  nextButton.addEventListener("click", () => handleChangeMusic({ isPrev: false }));
  const nextIcon = document.createElement("i");
  nextIcon.className = "icon-next";
  nextButton.appendChild(nextIcon);

  const progress = document.createElement("div");
  progress.className = "progress center";
  progress.addEventListener("pointerdown", (e) => {
    handleScrub(e);
    progressBarIsUpdating = true;
  });

  const progressWrapper = document.createElement("div");
  progressWrapper.className = "progress__wrapper";
  const progressBar = document.createElement("div");
  progressBar.className = "progress__bar center";
  progressWrapper.appendChild(progressBar);
  progress.appendChild(progressWrapper);

  sliderControls.appendChild(prevButton);
  sliderControls.appendChild(musicPlayerInfo);
  sliderControls.appendChild(nextButton);
  sliderControls.appendChild(progress);

  slider.appendChild(sliderControls);

  return slider;
}

function Playlist({ list, handleChangeMusic }) {
  function loadedAudio() {
    const duration = this.duration;
    const target = this.parentElement.querySelector(".music-player__song-duration");

    let min = parseInt(duration / 60);
    if (min < 10) min = "0" + min;

    let sec = parseInt(duration % 60);
    if (sec < 10) sec = "0" + sec;

    target.appendChild(document.createTextNode(`${min}:${sec}`));
  }

  function updateTheProgressBar() {
    const duration = this.duration;
    const currentTime = this.currentTime;

    const progressBarWidth = (currentTime / duration) * 100;
    setProperty(progressBar_elmnt, "--width", `${progressBarWidth}%`);

    if (songIsPlayed && currentTime === duration) {
      handleChangeMusic({});
    }

    if (indexSong === songsLength && this === selectedSong && currentTime === duration) {
      songIsPlayed = false;
      broadcastGuarantor_elmnt.classList.remove("click");
    }
  }

  const playlist = document.createElement("ul");
  playlist.className = "music-player__playlist list";

  list.forEach(({ songName, artist, files: { cover, song } }, index) => {
    const listItem = document.createElement("li");
    listItem.className = "music-player__song";
    listItem.addEventListener("click", () =>
      handleChangeMusic({ isPrev: false, playListIndex: index })
    );

    const listItemContent = document.createElement("div");
    listItemContent.className = "flex-row _align_center";

    const img = document.createElement("img");
    img.src = cover;
    img.className = "img music-player__song-img";

    const playlistInfo = document.createElement("div");
    playlistInfo.className = "music-player__playlist-info text_trsf-cap";

    const songTitle = document.createElement("b");
    songTitle.className = "text_overflow";
    songTitle.textContent = songName;

    const flexRow = document.createElement("div");
    flexRow.className = "flex-row _justify_space-btwn";

    const artistSpan = document.createElement("span");
    artistSpan.className = "music-player__subtitle";
    artistSpan.textContent = artist;

    const durationSpan = document.createElement("span");
    durationSpan.className = "music-player__song-duration";

    flexRow.appendChild(artistSpan);
    flexRow.appendChild(durationSpan);
    playlistInfo.appendChild(songTitle);
    playlistInfo.appendChild(flexRow);
    listItemContent.appendChild(img);
    listItemContent.appendChild(playlistInfo);
    listItem.appendChild(listItemContent);

    const audio = document.createElement("audio");
    audio.src = song;
    audio.addEventListener("loadeddata", loadedAudio);
    audio.addEventListener("timeupdate", updateTheProgressBar);
    listItem.appendChild(audio);

    playlist.appendChild(listItem);
  });

  return playlist;
}

function Loading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading flex-row";

  const progressSpan = document.createElement("span");
  progressSpan.className = "loading__progress";
  progressSpan.textContent = "0";

  const percentSpan = document.createElement("span");
  percentSpan.textContent = "%";

  loadingDiv.appendChild(progressSpan);
  loadingDiv.appendChild(percentSpan);

  return loadingDiv;
}

function dom(tag, props, ...children) {
  if (typeof tag === "function") return tag(props, ...children);

  function addChild(parent, child) {
    if (Array.isArray(child)) {
      child.forEach((nestedChild) => addChild(parent, nestedChild));
    } else {
      parent.appendChild(
        child.nodeType ? child : document.createTextNode(child.toString())
      );
    }
  }

  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element[name.toLowerCase()] = value;
    } else if (name === "style") {
      Object.entries(value).forEach(([styleProp, styleValue]) => {
        element.style[styleProp] = styleValue;
      });
    } else {
      element.setAttribute(name, value.toString());
    }
  });

  children.forEach((child) => {
    addChild(element, child);
  });

  return element;
}

fetch(
  "https://gist.githubusercontent.com/ashishnxt/5f5c8c806e001973b916119d2d76e0f6/raw/c553dc573658ec039372860f3f2e1a0baf2af8cd/music-file2.json"
)
  .then((respone) => respone)
  .then((data) => data.json())
  .then((result) => {
    const songs = result.songs;

    function downloadTheFiles(media, input) {
      return Promise.all(
        input.map((song) => {
          const promise = new Promise((resolve) => {
            const url = song.files[media];
            const req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.responseType = "blob";
            req.send();
            req.onreadystatechange = () => {
              if (req.readyState === 4 && req.status === 200) {
                const blob = req.response;
                const file = URL.createObjectURL(blob);
                song.files[media] = file;
                resolve(song);
              }
            };
          });

          promise.then(() => {
            loadingProgress++;
            const progress = Math.round(
              (loadingProgress / (songs.length * 2)) * 100
            );
            loadingProgress_elmnt.innerHTML = progress;
          });

          return promise;
        })
      );
    }

    root.appendChild(Loading());
    loadingProgress_elmnt = document.querySelector(".loading__progress");

    downloadTheFiles("cover", songs).then((response) => {
      downloadTheFiles("song", response).then((data) => {
        root.removeChild(document.querySelector(".loading"));
        root.appendChild(App({ songs: data }));

        songsLength = data.length - 1;
        progress_elmnt = document.querySelector(".progress");
        playlistSongs_elmnt = document.querySelectorAll("audio");
        sliderImgs_elmnt = document.querySelector(".slider__imgs");
        songName_elmnt = document.querySelector(".music-player__subtitle");
        musicPlayerInfo_elmnt = document.querySelector(".music-player__info");
        singerName_elmnt = document.querySelector(".music-player__singer-name");
        selectedSong = playlistSongs_elmnt[indexSong];
        progressBar_elmnt = document.querySelector(".progress__bar");
        broadcastGuarantor_elmnt = document.querySelector(
          ".music-player__broadcast-guarantor"
        );

        controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
        controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);
      });
    });
  });

function controlSubtitleAnimation(parent, child) {
  if (child.classList.contains("animate")) return;

  const element = child.firstChild;

  if (child.clientWidth > parent.clientWidth) {
    child.appendChild(element.cloneNode(true));
    child.classList.add("animate");
  }

  setProperty(child.parentElement, "width", `${element.clientWidth}px`);
}

function handleResize() {
  const vH = window.innerHeight * 0.01;
  setProperty(document.documentElement, "--vH", `${vH}px`);
}

function setProperty(target, prop, value = "") {
  target.style.setProperty(prop, value);
}

function setBodyBg(color) {
  setProperty(document.body, "--body-bg", color);
}

function updateInfo(target, value) {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  const targetChild_elmnt = document.createElement("div");
  targetChild_elmnt.appendChild(document.createTextNode(value));
  target.appendChild(targetChild_elmnt);
  target.classList.remove("animate");
  controlSubtitleAnimation(musicPlayerInfo_elmnt, target);
}

function handleScrub(e) {
  const progressOffsetLeft = progress_elmnt.getBoundingClientRect().left;
  const progressWidth = progress_elmnt.offsetWidth;
  const duration = selectedSong.duration;
  const currentTime = (e.clientX - progressOffsetLeft) / progressWidth;

  selectedSong.currentTime = currentTime * duration;
}

handleResize();

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);
window.addEventListener("transitionstart", ({ target }) => {
  if (target === sliderImgs_elmnt) {
    isLocked = true;
    setProperty(sliderImgs_elmnt, "will-change", "transform");
  }
});
window.addEventListener("transitionend", ({ target, propertyName }) => {
  if (target === sliderImgs_elmnt) {
    isLocked = false;
    setProperty(sliderImgs_elmnt, "will-change", "auto");
  }
  if (target.classList.contains("slider") && propertyName === "height") {
    controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
    controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);
  }
});
window.addEventListener("pointerup", () => {
  if (progressBarIsUpdating) {
    selectedSong.muted = false;
    progressBarIsUpdating = false;
  }
});
window.addEventListener("pointermove", (e) => {
  if (progressBarIsUpdating) {
    handleScrub(e, this);
    selectedSong.muted = true;
  }
});
