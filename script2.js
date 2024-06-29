function checkLogin() {
    const year1 = document.getElementById('year1').value;
    const year2 = document.getElementById('year2').value;
    const errorMessage = document.getElementById('error-message');

    if (year1 === '2001627' && year2 === '20001211') {
        document.getElementById('login-popup').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('login-popup').style.display = 'none';
            const videoPlayer = document.getElementById('video-player');
            videoPlayer.style.display = 'block';
            setTimeout(() => {
                videoPlayer.classList.add('fade-in');
                setTimeout(() => {
                    videoPlayer.play();
                }, 1500); // Wait for the full fade-in transition before playing video
            }, 50); // Start fade-in transition after a brief delay
        }, 6000); // Match duration with CSS transition time
    } else {
        errorMessage.style.display = 'block';
    }
}

window.onload = function() {
    const loginPopup = document.getElementById('login-popup');
    loginPopup.style.display = 'flex';
    setTimeout(() => {
        loginPopup.classList.add('fade-in');
    }, 50); // Start transition after a brief delay
    createStars();
    createTulips();
};

function createStars() {
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 10 + 5}s`;
        document.body.appendChild(star);
    }
}

function createTulips() {
    const numTulips = 10;
    for (let i = 0; i < numTulips; i++) {
        const tulip = document.createElement('div');
        tulip.className = 'tulip';
        tulip.style.left = `${i * 10}%`;
        document.body.appendChild(tulip);
    }
}
