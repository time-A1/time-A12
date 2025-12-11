// audio.js - 音乐播放器动态功能

// 音乐数据 - 确保路径正确
const musicList = [
    {
        title: "Summer Vibe",
        artist: "25216950217邹庆伟",
        src: "MP3/music0.mp3",
        cover: "./img/record0.jpg",
        bg: "./img/bg0.png",
        video: "./video/video0.mp4"
    },
    {
        title: "Moonlight Sonata",
        artist: "贝多芬",
        src: "MP3/music1.mp3",
        cover: "./img/record1.jpg",
        bg: "./img/bg1.png",
        video: "./video/video1.mp4"
    },
    {
        title: "Jazz Night",
        artist: "Louis Armstrong",
        src: "MP3/music2.mp3",
        cover: "./img/record2.jpg",
        bg: "./img/bg2.png",
        video: "./video/video2.mp4"
    },
    {
        title: "City Lights",
        artist: "Tokyo Night",
        src: "MP4/video3.mp4",
        cover: "./img/record3.jpg",
        bg: "./img/bg3.png",
        video: "./video/video3.mp4"
    }
];

// 初始化变量
let currentMusicIndex = 0;
let isPlaying = false;
let playMode = 0;
let currentPlaybackRate = 1.0;
let isMuted = false;
let lastVolume = 70;

// 调试日志
console.log("初始化音乐播放器...");
console.log("音乐列表:", musicList);

// DOM 元素
const audioPlayer = new Audio();
const playPauseBtn = document.getElementById('playPause');
const beforeMusicBtn = document.getElementById('before-music');
const lastMusicBtn = document.getElementById('last-music');
const playModeBtn = document.getElementById('playMode');
const volumnBtn = document.getElementById('volumn');
const volumnSlider = document.getElementById('volumn-togger');
const musicTitle = document.querySelector('.music-title');
const authorName = document.querySelector('.author-name');
const recordImg = document.querySelector('.record-img');
const bodyBg = document.body;
const playedTimeSpan = document.querySelector('.played-time');
const audioTimeSpan = document.querySelector('.audio-time');
const progressBar = document.querySelector('.progress');
const speedBtn = document.getElementById('speed');
const mvBtn = document.getElementById('MV');
const listBtn = document.getElementById('list');

// 创建播放列表模态框
function createPlaylistModal() {
    const modal = document.createElement('div');
    modal.id = 'playlist-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        padding: 30px;
        border-radius: 20px;
        width: 80%;
        max-width: 500px;
        max-height: 70vh;
        overflow-y: auto;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    const title = document.createElement('h2');
    title.textContent = '播放列表';
    title.style.cssText = `
        color: white;
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
    `;
    
    const listContainer = document.createElement('div');
    listContainer.id = 'playlist-items';
    
    modalContent.appendChild(title);
    modalContent.appendChild(listContainer);
    modal.appendChild(modalContent);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.body.appendChild(modal);
    return modal;
}

// 更新播放列表显示
function updatePlaylistModal() {
    const modal = document.getElementById('playlist-modal') || createPlaylistModal();
    const listContainer = document.getElementById('playlist-items');
    listContainer.innerHTML = '';
    
    musicList.forEach((music, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 15px;
            margin: 10px 0;
            background: ${index === currentMusicIndex ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 10px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            border-left: 4px solid ${index === currentMusicIndex ? '#4CAF50' : 'transparent'};
        `;
        
        item.innerHTML = `
            <div style="width: 40px; height: 40px; border-radius: 50%; 
                      background-image: url('${music.cover}'); 
                      background-size: cover; margin-right: 15px;">
            </div>
            <div>
                <div style="font-weight: bold; font-size: 16px;">${music.title}</div>
                <div style="font-size: 14px; opacity: 0.8;">${music.artist}</div>
            </div>
            ${index === currentMusicIndex ? 
                `<div style="margin-left: auto; color: #4CAF50;">
                    ${isPlaying ? '▶ 播放中' : '⏸ 已暂停'}
                </div>` : ''}
        `;
        
        item.addEventListener('click', () => {
            loadMusic(index);
            if (isPlaying) {
                audioPlayer.play().catch(e => {
                    console.error("播放失败:", e);
                });
            }
            modal.style.display = 'none';
        });
        
        listContainer.appendChild(item);
    });
    
    return modal;
}

// 显示播放列表
function showPlaylist() {
    const modal = updatePlaylistModal();
    modal.style.display = 'flex';
}

// 加载音乐
function loadMusic(index) {
    if (index < 0 || index >= musicList.length) return;
    
    currentMusicIndex = index;
    const music = musicList[index];
    
    console.log(`加载音乐: ${music.title}, 路径: ${music.src}`);
    
    // 设置音频源
    audioPlayer.src = music.src;
    
    // 更新UI
    musicTitle.textContent = music.title;
    authorName.textContent = music.artist;
    recordImg.style.backgroundImage = `url('${music.cover}')`;
    bodyBg.style.backgroundImage = `url('${music.bg}')`;
    
    // 重置播放状态
    audioPlayer.currentTime = 0;
    updateTimeDisplay();
    
    // 预加载音频
    audioPlayer.load();
    
    // 更新播放列表显示
    updatePlaylistModal();
    
    console.log(`音乐加载完成: ${music.title}`);
}

// 播放/暂停功能
function togglePlayPause() {
    console.log("播放/暂停按钮点击, 当前状态:", isPlaying);
    
    if (!audioPlayer.src) {
        console.log("没有音乐源，加载默认音乐");
        loadMusic(0);
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        console.log("音乐已暂停");
    } else {
        audioPlayer.play()
            .then(() => {
                console.log("音乐开始播放");
                // 添加唱片旋转动画
                document.querySelector('.record-img').style.animationPlayState = 'running';
            })
            .catch(error => {
                console.error("播放失败:", error);
                console.log("尝试解决播放问题...");
                
                // 尝试修复播放问题
                if (error.name === 'NotAllowedError') {
                    console.log("浏览器阻止自动播放，需要用户交互");
                    alert("请点击播放按钮开始播放");
                }
            });
    }
    
    isPlaying = !isPlaying;
    updatePlayPauseIcon();
}

// 更新播放/暂停图标
function updatePlayPauseIcon() {
    const iconUrl = isPlaying ? "./img/暂停.png" : "./img/继续播放.png";
    console.log("更新播放图标:", iconUrl);
    playPauseBtn.style.backgroundImage = `url('${iconUrl}')`;
}

// 上一首
function playPrevious() {
    console.log("播放上一首");
    let newIndex = currentMusicIndex - 1;
    if (newIndex < 0) newIndex = musicList.length - 1;
    loadMusic(newIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => console.error("播放失败:", e));
    }
}

// 下一首
function playNext() {
    console.log("播放下一首");
    let newIndex;
    
    switch (playMode) {
        case 2: // 随机播放
            newIndex = Math.floor(Math.random() * musicList.length);
            while (newIndex === currentMusicIndex && musicList.length > 1) {
                newIndex = Math.floor(Math.random() * musicList.length);
            }
            break;
        case 1: // 单曲循环
            newIndex = currentMusicIndex;
            break;
        default: // 顺序播放
            newIndex = currentMusicIndex + 1;
            if (newIndex >= musicList.length) newIndex = 0;
            break;
    }
    
    loadMusic(newIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => console.error("播放失败:", e));
    }
}

// 切换播放模式
function togglePlayMode() {
    playMode = (playMode + 1) % 3;
    console.log("切换播放模式:", playMode);
    updatePlayModeIcon();
}

// 更新播放模式图标
function updatePlayModeIcon() {
    const modeIcons = [
        "./img/mode1.png",  // 顺序播放
        "./img/mode2.png",  // 单曲循环
        "./img/mode3.png"   // 随机播放
    ];
    playModeBtn.style.backgroundImage = `url('${modeIcons[playMode]}')`;
}

// 音量控制
function updateVolume() {
    const volume = volumnSlider.value / 100;
    console.log("更新音量:", volume);
    audioPlayer.volume = volume;
    updateVolumeIcon();
    
    if (volume > 0) {
        lastVolume = volumnSlider.value;
        isMuted = false;
    }
}

// 静音/取消静音
function toggleMute() {
    console.log("切换静音状态, 当前:", isMuted);
    if (isMuted) {
        volumnSlider.value = lastVolume;
        audioPlayer.volume = lastVolume / 100;
        isMuted = false;
        console.log("取消静音，音量:", audioPlayer.volume);
    } else {
        lastVolume = volumnSlider.value;
        volumnSlider.value = 0;
        audioPlayer.volume = 0;
        isMuted = true;
        console.log("静音");
    }
    updateVolumeIcon();
}

// 更新音量图标
function updateVolumeIcon() {
    const volume = audioPlayer.volume;
    let icon;
    
    if (volume === 0 || isMuted) {
        icon = "./img/静音.png";
    } else if (volume < 0.5) {
        icon = "./img/音量小.png";
    } else {
        icon = "./img/音量.png";
    }
    
    console.log("更新音量图标:", icon);
    volumnBtn.style.backgroundImage = `url('${icon}')`;
}

// 切换播放速度
function togglePlaybackSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(currentPlaybackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    currentPlaybackRate = speeds[nextIndex];
    audioPlayer.playbackRate = currentPlaybackRate;
    speedBtn.textContent = currentPlaybackRate.toFixed(1) + "X";
    console.log("播放速度:", currentPlaybackRate);
}

// 更新时间显示
function updateTimeDisplay() {
    const current = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration || 0);
    
    playedTimeSpan.textContent = current;
    audioTimeSpan.textContent = duration;
    
    // 更新进度条
    updateProgressBar();
    
    // 调试信息
    if (audioPlayer.currentTime > 0) {
        console.log(`时间: ${current}/${duration}`);
    }
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新进度条
function updateProgressBar() {
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;
    
    if (duration > 0 && !isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        
        let progressFill = progressBar.querySelector('.progress-fill');
        if (!progressFill) {
            progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressBar.appendChild(progressFill);
        }
        
        progressFill.style.width = `${progressPercent}%`;
        progressFill.style.height = '100%';
        progressFill.style.backgroundColor = '#4CAF50';
        progressFill.style.borderRadius = '2px';
        progressFill.style.transition = 'width 0.1s linear';
        
        // 调试信息
        if (progressPercent > 0) {
            console.log(`进度条: ${progressPercent.toFixed(1)}%`);
        }
    }
}

// 点击进度条跳转
function seekToPosition(event) {
    const progress = event.currentTarget;
    const rect = progress.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressWidth = rect.width;
    const duration = audioPlayer.duration;
    
    if (duration > 0 && !isNaN(duration)) {
        const seekTime = (clickX / progressWidth) * duration;
        audioPlayer.currentTime = seekTime;
        console.log("跳转到:", formatTime(seekTime));
    }
}

// 播放MV
function playMV() {
    const music = musicList[currentMusicIndex];
    if (music.video) {
        alert("MV功能: " + music.title + "\n视频路径: " + music.video);
        console.log("播放MV:", music.video);
    } else {
        alert("这首歌没有MV哦～");
    }
}

// 测试音乐路径
function testAudioPath() {
    console.log("测试音乐路径...");
    const testAudio = new Audio();
    testAudio.src = "./music/music0.mp3";
    
    testAudio.addEventListener('canplay', () => {
        console.log("音乐路径有效，可以播放");
    });
    
    testAudio.addEventListener('error', (e) => {
        console.error("音乐路径错误:", e);
        console.log("请确保音乐文件存在于 ./music/ 目录下");
    });
    
    testAudio.load();
}

// 绑定事件
function bindEvents() {
    console.log("绑定事件...");
    
    // 测试音乐路径
    testAudioPath();
    
    // 播放/暂停
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // 上一首/下一首
    beforeMusicBtn.addEventListener('click', playPrevious);
    lastMusicBtn.addEventListener('click', playNext);
    
    // 播放模式
    playModeBtn.addEventListener('click', togglePlayMode);
    
    // 音量控制
    volumnBtn.addEventListener('click', toggleMute);
    volumnSlider.addEventListener('input', updateVolume);
    
    // 播放速度
    speedBtn.addEventListener('click', togglePlaybackSpeed);
    
    // MV按钮
    mvBtn.addEventListener('click', playMV);
    
    // 播放列表按钮
    listBtn.addEventListener('click', showPlaylist);
    
    // 进度条点击跳转
    progressBar.addEventListener('click', seekToPosition);
    
    // 音频事件监听
    audioPlayer.addEventListener('timeupdate', updateTimeDisplay);
    audioPlayer.addEventListener('loadedmetadata', updateTimeDisplay);
    audioPlayer.addEventListener('canplay', () => {
        console.log("音频可以播放了");
    });
    
    audioPlayer.addEventListener('play', () => {
        console.log("音频开始播放");
        document.querySelector('.record-img').style.animationPlayState = 'running';
    });
    
    audioPlayer.addEventListener('pause', () => {
        console.log("音频暂停");
        document.querySelector('.record-img').style.animationPlayState = 'paused';
    });
    
    audioPlayer.addEventListener('ended', () => {
        console.log("音乐播放结束");
        if (playMode === 1) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNext();
        }
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error("音频错误:", e);
        console.log("错误代码:", audioPlayer.error?.code);
        console.log("错误信息:", audioPlayer.error?.message);
    });
    
    // 唱片点击播放/暂停
    recordImg.addEventListener('click', togglePlayPause);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                playPrevious();
                break;
            case 'ArrowRight':
                playNext();
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'KeyL':
                togglePlayMode();
                break;
            case 'KeyP':
                showPlaylist();
                break;
            case 'KeyV':
                playMV();
                break;
        }
    });
}

// 添加CSS动画
function addRecordAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes recordRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .record-img {
            animation: recordRotate 20s linear infinite;
            animation-play-state: paused;
            transition: transform 0.5s ease;
        }
        
        .record-img:hover {
            transform: scale(1.05);
            cursor: pointer;
        }
        
        .progress {
            position: relative;
            background-color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .progress:hover {
            height: 5px;
        }
        
        .progress-fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.1s linear;
        }
        
        /* 确保图标路径正确 */
        .center-icon, .bottom-icon {
            background-repeat: no-repeat;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
}

// 初始化播放器
function initPlayer() {
    console.log("初始化播放器...");
    
    // 添加动画样式
    addRecordAnimation();
    
    // 加载第一首音乐
    loadMusic(0);
    
    // 设置初始音量
    audioPlayer.volume = volumnSlider.value / 100;
    audioPlayer.playbackRate = currentPlaybackRate;
    
    // 绑定事件
    bindEvents();
    
    // 更新UI
    updatePlayModeIcon();
    updatePlayPauseIcon();
    updateVolumeIcon();
    
    // 创建播放列表模态框
    createPlaylistModal();
    
    console.log("播放器初始化完成！");
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM加载完成，开始初始化...");
    initPlayer();
    
    console.log("\n🎵 音乐播放器初始化完成！");
    console.log("🎹 快捷键：");
    console.log("  空格 - 播放/暂停");
    console.log("  ← → - 上一首/下一首");
    console.log("  M   - 静音/取消静音");
    console.log("  L   - 切换播放模式");
    console.log("  P   - 显示播放列表");
    console.log("  V   - 播放MV");
    console.log(`📀 共加载了 ${musicList.length} 首歌曲`);
});

// 导出调试函数
window.debugPlayer = function() {
    console.log("=== 播放器调试信息 ===");
    console.log("当前音乐索引:", currentMusicIndex);
    console.log("是否播放中:", isPlaying);
    console.log("播放模式:", playMode);
    console.log("音量:", audioPlayer.volume);
    console.log("当前时间:", audioPlayer.currentTime);
    console.log("总时长:", audioPlayer.duration);
    console.log("音频源:", audioPlayer.src);
    console.log("音频错误:", audioPlayer.error);
    console.log("=========================");
};