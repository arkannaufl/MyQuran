const url = 'https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json';
const murotal = document.getElementById('murotal');
const audio = document.getElementById('audio');
const searchBar = document.getElementById('searchBar');

let track_index = 0;
let isPlaying = false;
let updateTimer;
let currentTrackIndex = null;
let surahData = [];

const playpause_btn = document.querySelector(".playpause-track");
const seek_slider = document.querySelector(".seek_slider");
const volume_slider = document.querySelector(".volume_slider");
const curr_time = document.querySelector(".current-time");
const total_duration = document.querySelector(".total-duration");

fetch(url)
    .then(response => response.json())
    .then(data => {
        surahData = data;
        displaySurahs(data);
    });

searchBar.addEventListener('input', () => {
    const searchText = searchBar.value.toLowerCase();
    const filteredSurahs = surahData.filter(surah =>
        surah.name.toLowerCase().includes(searchText) ||
        surah.name_translations.id.toLowerCase().includes(searchText) ||
        surah.number_of_surah.toString().includes(searchText)
    );
    displaySurahs(filteredSurahs);
});

function displaySurahs(surahs) {
    murotal.innerHTML = '';
    surahs.forEach((surah, index) => {
        const murotalCard = document.createElement('div');
        murotalCard.className =
            'card bg-white bg-[#F6F5F4] w-auto h-auto p-5 rounded-xl flex justify-between items-center hover:border-[#4f4f4f]';
        murotalCard.classList.add('murotal');
        murotalCard.innerHTML = `
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-[#E8E8E8] transform rotate-45 flex justify-center items-center">
                    <h1 class="text-xl text-[#4f4f4f] font-bold transform -rotate-45">${surah.number_of_surah}</h1>
                </div>
                <div class="ml-5">
                    <h1 class="font-bold text-xl text-[#4F4F4F]">${surah.name}</h1>
                    <p class="font-normal text-sm text-[#9F9F9F]">${surah.name_translations.id}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div class="text-right flex flex-col justify-end items-end mr-5">
                    <h1 class="font-semibold text-2xl text-[#7F7F7F]">${surah.name_translations.ar}</h1>
                    <p class="font-normal text-sm text-[#9F9F9F]">${surah.number_of_ayah} Ayah</p>
                </div>
                <div class="flex justify-center items-center">
                    <button class="play-pause-btn bg-[#4f4f4f] text-white rounded-full w-10 h-10 flex justify-center items-center" onclick="playSurah(${surahData.indexOf(surah)}, this)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 play-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-7.2 4.8A1 1 0 016 15V9a1 1 0 011.552-.832l7.2 4.8a1 1 0 010 1.664z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 pause-icon hidden">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        murotal.appendChild(murotalCard);
    });
}

function playSurah(index, btn) {
    if (currentTrackIndex === index && isPlaying) {
        pauseTrack();
        updateCardButton(btn, false);
        return;
    }

    if (currentTrackIndex !== null) {
        const previousButton = murotal.children[currentTrackIndex].querySelector('.play-pause-btn');
        updateCardButton(previousButton, false);
    }

    currentTrackIndex = index;
    const surah = surahData[index];
    audio.src = surah.recitation ? surah.recitation :
        `https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json/${surah.number_of_surah}.mp3`;
    playTrack();
    updateCardButton(btn, true);

    // Update audio control info
    document.getElementById('currentSurahNumber').querySelector('h1').textContent = surah.number_of_surah;
    document.getElementById('currentSurahName').textContent = surah.name;
    document.getElementById('currentSurahTranslation').textContent = surah.name_translations.id;
}

function updateCardButton(btn, isPlaying) {
    const playIcon = btn.querySelector('.play-icon');
    const pauseIcon = btn.querySelector('.pause-icon');

    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    audio.play();
    isPlaying = true;
    updatePlayPauseIcon();
    updateTimer = setInterval(seekUpdate, 1000);
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    updatePlayPauseIcon();
    clearInterval(updateTimer);
}

function updatePlayPauseIcon() {
    if (isPlaying) {
        playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-2x"></i>';
    } else {
        playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-2x"></i>';
    }
}

function seekTo() {
    let seekto = audio.duration * (seek_slider.value / 100);
    audio.currentTime = seekto;
}

function seekUpdate() {
    let seekPosition = 0;
    if (!isNaN(audio.duration)) {
        seekPosition = audio.currentTime * (100 / audio.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

function prevTrack() {
    if (track_index > 0) track_index -= 1;
    else track_index = surahData.length - 1;
    playSurah(track_index, murotal.children[track_index].querySelector('.play-pause-btn'));
}

function nextTrack() {
    if (track_index < surahData.length - 1) track_index += 1;
    else track_index = 0;
    playSurah(track_index, murotal.children[track_index].querySelector('.play-pause-btn'));
}

function setVolume() {
    audio.volume = volume_slider.value / 100;
}

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio');
    const seekSlider = document.querySelector('.seek_slider');
    const volumeSlider = document.querySelector('.volume_slider');

    const updateSliderBackground = (slider) => {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--before-width', `${value}%`);
    };

    seekSlider.addEventListener('input', function() {
        updateSliderBackground(seekSlider);
        audio.currentTime = audio.duration * (seekSlider.value / 100);
    });

    volumeSlider.addEventListener('input', function() {
        updateSliderBackground(volumeSlider);
        audio.volume = volumeSlider.value / 100;
    });

    audio.addEventListener('timeupdate', function() {
        const value = (audio.currentTime / audio.duration) * 100;
        seekSlider.value = value;
        updateSliderBackground(seekSlider);
    });

    // Initialize the slider backgrounds on page load
    updateSliderBackground(seekSlider);
    updateSliderBackground(volumeSlider);
});


