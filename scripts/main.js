// 粒子背景配置
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#6c5ce7'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6c5ce7',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// 照片轮播功能
class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.track = document.querySelector('.carousel-track');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentIndex = 0;
        this.images = [
            'https://picsum.photos/800/400?random=1',
            'https://picsum.photos/800/400?random=2',
            'https://picsum.photos/800/400?random=3'
        ];

        this.init();
        this.bindEvents();
    }

    init() {
        // 创建图片元素
        this.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            this.track.appendChild(img);
        });

        // 设置轨道宽度
        this.track.style.width = `${this.images.length * 100}%`;
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.slide('prev'));
        this.nextBtn.addEventListener('click', () => this.slide('next'));

        // 触摸滑动支持
        let startX, moveX;
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', () => {
            if (startX - moveX > 50) {
                this.slide('next');
            } else if (moveX - startX > 50) {
                this.slide('prev');
            }
        });
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        }
        this.track.style.transform = `translateX(-${this.currentIndex * 100 / this.images.length}%)`;
    }
}

// AI助手功能
class AIAssistant {
    constructor() {
        this.chatMessages = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input input');
        this.sendBtn = document.querySelector('.send-message');
        this.voiceBtn = document.querySelector('.voice-input');

        this.bindEvents();
    }

    bindEvents() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        this.input.value = '';

        // 模拟AI响应
        setTimeout(() => {
            this.addMessage('这是一个AI助手的示例回复。在实际应用中，这里将连接到真实的AI服务。', 'ai');
        }, 1000);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    toggleVoiceInput() {
        // 这里添加语音输入功能
        alert('语音输入功能即将推出！');
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new AIAssistant();
});

// 光标特效
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
    document.body.appendChild(cursor);

    setTimeout(() => {
        cursor.remove();
    }, 1000);
}); 