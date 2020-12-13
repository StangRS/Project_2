document.addEventListener("DOMContentLoaded", function () {
  var audio = document.getElementById("audio"),
    player = document.querySelectorAll(".player")[0],
    play = document.querySelectorAll(".btn__play")[0],
    icoPlay = document.querySelectorAll(".btn__play__arrow")[0],
    icoPause = document.querySelectorAll(".btn__play__pause")[0],
    title = document.getElementById("title"),
    artistName = document.getElementById("artist"),
    volumeProgress = document.querySelectorAll(".player__volume__progress")[0],
    volumeBar = document.querySelectorAll(".player__volume__bar")[0],
    btnVolume = document.querySelectorAll(".btn__volume")[0],
    timeline = document.querySelectorAll(".player__timeline")[0],
    timeProgress = document.querySelectorAll(".player__timeline__progress")[0],
    timeNow = document.querySelectorAll(".player__timeline__time--now")[0],
    timeEnd = document.querySelectorAll(".player__timeline__time--end")[0],
    duration,
    songs = [
      "Loser.mp3",
      "Nisakorn.mp3",
      "Someone is calling you.mp3",
      "Track.mp3",
      "ในนามของความว่างเปล่า.mp3",
      "อยากรอ.mp3",
    ],
    artists = [
      "PEVKPEVK",
      "Traders",
      "Lookmai Yanisa",
      "Enon",
      "XIIM",
      "Traders",
    ],
    songIndex = 3;

  timeProgress.style.width = "0%";
  timeNow.innerHTML = "00:00";
  timeEnd.innerHTML = "00:00";
  audio.volume = 0.7;

  loadsong(songs[songIndex], artists[songIndex]);

  function loadsong(song, artist) {
    title.innerText = song;
    artistName.innerText = artist;
    document.getElementById("audio").setAttribute("src", `/audio/${song}`);

    audio.addEventListener(
      "canplaythrough",
      function () {
        duration = audio.duration;
      },
      false
    );
  }

  function playAudio() {
    if (audio.paused) {
      audio.play();
      icoPause.style.display = "block";
      icoPlay.style.display = "none";
    } else {
      audio.pause();
      icoPause.style.display = "none";
      icoPlay.style.display = "block";
    }
  }

  document.getElementById("btnBack").addEventListener("click", prevSong);
  // Previous song
  function prevSong() {
    songIndex--;

    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }

    loadsong(songs[songIndex], artists[songIndex]);

    playAudio();
  }

  document.getElementById("btnFor").addEventListener("click", nextSong);
  // Next song
  function nextSong() {
    songIndex++;

    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }

    loadsong(songs[songIndex], artists[songIndex]);

    playAudio();
  }

  //uptadeTime
  function uptadeTime() {
    var now = 100 * (audio.currentTime / duration);
    timeProgress.style.width = now + "%";
    timeNow.innerHTML = formatTime(audio.currentTime);
    timeEnd.innerHTML = formatTime(duration - audio.currentTime);
  }

  //formatTime
  function formatTime(secs) {
    var times = new Array(60, 1);
    var time = "";
    var tmp;
    for (var i = 0; i < times.length; i++) {
      tmp = Math.floor(secs / times[i]);
      if (tmp < 10) {
        tmp = "0" + tmp;
      }
      time += tmp;
      if (i < 1) {
        time += ":";
      }
      secs = secs % times[i];
    }
    return time;
  }

  //clickPercent
  function clickPercent(e) {
    return (
      (e.pageX - timeline.offsetLeft - player.offsetLeft) / timeline.offsetWidth
    );
  }

  //updateTimeline
  function updateTimeline(e) {
    var newSize = e.pageX - timeline.offsetLeft - 9;

    if (newSize >= 0 && newSize <= timeline.offsetWidth) {
      timeProgress.style.width = newSize + "px";
    }
    if (newSize < 0) {
      timeProgress.style.width = "0px";
    }
    if (newSize > timeline.offsetWidth) {
      timeProgress.style.width = timeline.offsetWidth + "px";
    }
  }
  function updateAudio(e) {
    var percent =
      (e.pageX - volumeBar.offsetLeft - player.offsetLeft) /
      volumeBar.offsetWidth;

    if (percent >= 0 && percent <= volumeBar.offsetWidth) {
      volumeProgress.style.width = 100 * percent + "%";
      btnVolume.classList.remove("fa-volume-off");
      btnVolume.classList.add("fa-volume-up");
    }
    if (percent <= 0) {
      volumeProgress.style.width = "0";
      btnVolume.classList.remove("fa-volume-up");
      btnVolume.classList.add("fa-volume-off");
    }
    if (percent > volumeBar.offsetWidth) {
      volumeProgress.style.width = "100%";
      btnVolume.classList.remove("fa-volume-off");
      btnVolume.classList.add("fa-volume-up");
    }

    audio.volume = percent;
  }

  //autoStop
  function autoStop() {
    if (audio.paused || audio.currentTime >= duration) {
      icoPause.style.display = "none";
      icoPlay.style.display = "block";
      audio.pause();
    }
  }

  //audioVolume
  function audioVolume() {
    if (audio.volume > 0) {
      audio.volume = 0;
      btnVolume.classList.remove("fa-volume-up");
      btnVolume.classList.add("fa-volume-off");
      volumeProgress.style.width = "0%";
    } else {
      audio.volume = 0.7;
      btnVolume.classList.remove("fa-volume-off");
      btnVolume.classList.add("fa-volume-up");
      volumeProgress.style.width = "70%";
    }
  }

  //Eventos
  timeline.addEventListener(
    "click",
    function (event) {
      updateTimeline(event);
      audio.currentTime = duration * clickPercent(event);
    },
    false
  );
  //Time
  audio.addEventListener("timeupdate", uptadeTime, false);
  audio.addEventListener("timeupdate", autoStop, false);

  //Play
  play.addEventListener("click", function (e) {
    playAudio();
  });

  //Volume
  btnVolume.addEventListener("click", audioVolume, false);
  volumeBar.addEventListener("click", function (event) {
    updateAudio(event);
  });
});
