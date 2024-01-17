var $ = (__s__) => {
    return document.querySelector(__s__);
}, delay = (n) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}, _j = (__j__n__) => {
    return document.querySelector(`[jsname="${__j__n__}"]`);
}, playPause = async (s) => {
    replay.style.display = 'none';
    if (s.paused) s.play(), p.style.display = 'none', d.style.display = 'block', await delay(3), $('.setting-bar').classList.add('vjs-op-0');
    else s.pause(), d.style.display = 'none', p.style.display = 'block', $('.setting-bar').classList.remove('vjs-op-0');
}, fullscreen = (s) => {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
    var docElm = s;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        op_fs.style = "display: none;";
        cl_fs.style = "display: block;";
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        op_fs.style = "display: block;";
        cl_fs.style = "display: none;";
    }
}, skip = async (val) => {
    $('.setting-bar').classList.remove('vjs-op-0');
    (val != null) && (video1.currentTime += val);
    await delay(1);
    if (video1.paused != true) $('.setting-bar').classList.add('vjs-op-0');
}, skipper = async (per) => {
    $('.setting-bar').classList.remove('vjs-op-0');
    (per != null) && (video1.currentTime = video1.duration * per);
    await delay(1);
    if (video1.paused != true) $('.setting-bar').classList.add('vjs-op-0');
}, get = (__n) => {
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    return url.searchParams.get(__n);
}, pid = (function () {
    return document.querySelector(`[pid="${__n}"]`);
})

video1.src = `./player?v=${get('v')}`;

video1.onload = () => {
    const duration = video1.duration;
    for (let i = 0; i < video1.buffered.length; i++) {
        if (video1.buffered.start(video1.buffered.length - 1 - i) < video1.currentTime) {
            $('.p_p_loaded').style.width = `${(video1.buffered.end(video1.buffered.length - 1 - i) * 100) / duration}%`;
            break;
        }
    }
}

function compareNumbers(a, b) {
    return b - a;
}

function errorHandler() {
    $('.v-video-loading').style.visibility = 'hidden';
    $('.v-video').classList.add('v-video-err');
    $('.v-video').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="err-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg><span class="v-v-err-t">無法播放這部影片</span>';
}

video1.onerror = () => {
    var audios = {};
    var videos = {};
    var xhr = new XMLHttpRequest;
    xhr.open("get", "https://" + location.host + "/download?url=https://www.youtube.com/watch?v=" + get('v'), !0);
    xhr.send(null);
    xhr.onload = function (b) {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText) {
                var res = JSON.parse(xhr.responseText);
                res.info.forEach(video => {
                    if (video.mimeType.split("/")[0] == "audio") {
                        audios[video.container] ? null : (audios[video.container] = []);
                        audios[video.container].push(video.url);
                    } else if (video.mimeType.split("/")[0] == "video") {
                        videos[video.height] ? null : (videos[video.height] = []);
                        videos[video.height].push({
                            url: video.url,
                            type: video.container
                        })
                    }
                })
                video1.src = videos[Object.keys(videos).sort(compareNumbers)[0]][0].url;
            } else {
                errorHandler()
            }
        } else {
            errorHandler()
        }
    }
    xhr.onerror = () => {
        errorHandler();
    }
}

var vl = null;
video1.addEventListener('loadstart', () => {
    $('.v-video-loading').style.visibility = 'visible';
    const duration = video1.duration;
    for (let i = 0; i < video1.buffered.length; i++) {
        if (video1.buffered.start(video1.buffered.length - 1 - i) < video1.currentTime) {
            $('.p_p_loaded').style.width = `${(video1.buffered.end(video1.buffered.length - 1 - i) * 100) / duration}%`;
            break;
        }
    }
})
video1.addEventListener('click', (() => playPause(video1)));
video1.addEventListener('loadedmetadata', () => {
    $('.v-video-loading').style.visibility = 'hidden';
    vl = video1.duration;
    if (localStorage.getItem(get('v')) != null) {
        var time = localStorage.getItem(get('v'));
        video1.currentTime = time;
    }
});
var setTimeFlag, move = false;
$('.v-player').addEventListener('mousemove', async () => {
    if (move == true) return;
    move = true;
    $('.setting-bar').classList.remove('vjs-op-0');
    await delay(3);
    if (video1.paused) return move = false;
    $('.setting-bar').classList.add('vjs-op-0');
    move = false;
})
function formatt(t) {
    var time = t;
    var sec_num = parseInt(time, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var rt = '';
    (seconds < 10) && (seconds = '0' + seconds);
    (time < 3600) && (rt = minutes + ':' + seconds);
    (minutes < 10) && (minutes = '0' + minutes);
    (time >= 3600) && (rt = hours + ':' + minutes + ':' + seconds);
    return rt;
}
function progressUpdate() {
    const duration = video1.duration;
    if (duration > 0) {
        for (let i = 0; i < video1.buffered.length; i++) {
            if (video1.buffered.start(video1.buffered.length - 1 - i) < video1.currentTime) {
                $('.p_p_loaded').style.width = `${(video1.buffered.end(video1.buffered.length - 1 - i) * 100) / duration}%`;
                break;
            }
        }
    }
    _j('p_t').innerHTML = `${formatt(Math.floor(video1.currentTime))} / ${formatt(Math.floor(video1.duration))}`;
    if (video1.currentTime != video1.duration) {
        replay.style.display = 'none';
        (video1.paused) ? (d.style.display = 'none', p.style.display = 'block') : (p.style.display = 'none', d.style.display = 'block')
    }
    if (setTimeFlag == 1) {
        if (localStorage.getItem(get('v')) != null) {
            var time = localStorage.getItem(get('v'));
            video1.currentTime = time;
        }
        setTimeFlag = 2;
    }
    var currentTime = video1.currentTime;
    localStorage.setItem(get('v'), currentTime);
    $('.v-video-loading').style.visibility = 'hidden';
    const precent = (video1.currentTime / video1.duration) * 100;
    $('.p_p_played').style.width = `${precent}%`;
    $('.play_s').style.left = `${precent}%`;
    _j('p_t').innerHTML = `${formatt(Math.floor(video1.currentTime))} / ${formatt(Math.floor(video1.duration))}`;
}
video1.addEventListener('waiting', () => {
    $('.v-video-loading').style.visibility = 'visible';
})
video1.addEventListener('timeupdate', progressUpdate);
var videoend;
video1.addEventListener('ended', () => {
    videoend = true;
    p.style.display = 'none';
    d.style.display = 'none';
    replay.style.display = 'block';
    $('.setting-bar').classList.remove('vjs-op-0');
    replay.addEventListener('click', () => {
        video1.pause();
        replay.style.display = 'none';
        video1.currentTime = '0';
        playPause(video1);
    })
})
video1.addEventListener('play', () => {
    videoend = false;
    d.style.display = 'block';
    p.style.display = 'none';
    replay.style.display = 'none';
})
video1.addEventListener('pause', () => {
    if (videoend == true) return;
    videoend = false;
    d.style.display = 'none';
    p.style.display = 'block';
    replay.style.display = 'none';
    $('.setting-bar').classList.remove('vjs-op-0');
})
video1.addEventListener('progress', () => {
    const duration = video1.duration;
    if (duration > 0) {
        for (let i = 0; i < video1.buffered.length; i++) {
            if (video1.buffered.start(video1.buffered.length - 1 - i) < video1.currentTime) {
                $('.p_p_loaded').style.width = `${(video1.buffered.end(video1.buffered.length - 1 - i) * 100) / duration}%`;
                break;
            }
        }
    }
})
const progress = document.querySelector('.p_p');
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video1.duration;
    video1.currentTime = scrubTime;
    if (video1.currentTime != video1.duration) {
        replay.style.display = 'none';
        (video1.paused) ? (d.style.display = 'none', p.style.display = 'block') : (p.style.display = 'none', d.style.display = 'block')
    }
}
let mousedown = false;
progress.addEventListener('click', scrub);
function eventKeydown(e) {
    switch (e.keyCode) {
        case 32:
            e.preventDefault()
            playPause(video1);
            break;
        case 37:
            skip(-5, null);
            break;
        case 39:
            skip(5, null)
            break;
        case 48: case 96:
            skipper(0);
            break;
        case 49: case 97:
            skipper(0.1);
            break;
        case 50: case 98:
            skipper(0.2);
            break;
        case 51: case 99:
            skipper(0.3);
            break;
        case 52: case 100:
            skipper(0.4);
            break;
        case 53: case 101:
            skipper(0.5);
            break;
        case 54: case 102:
            skipper(0.6);
            break;
        case 55: case 103:
            skipper(0.7);
            break;
        case 56: case 104:
            skipper(0.8);
            break;
        case 57: case 105:
            skipper(0.9);
            break;
    }
}
document.addEventListener('keydown', eventKeydown);

video1.addEventListener("loadeddata", function () {
    $('.v-video-loading').style.visibility = 'hidden';
}, false);
video1.addEventListener("playing", () => {
    $('.v-video-loading').style.visibility = 'visible';
})
video1.oncontextmenu = function () { return false; };