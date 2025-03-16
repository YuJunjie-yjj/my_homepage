// 留言区功能管理
class CommentManager {
    constructor() {
        this.comments = JSON.parse(localStorage.getItem('comments') || '[]');
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.userActions = JSON.parse(localStorage.getItem('userActions') || '{}');
        this.initElements();
        this.bindEvents();
        this.renderComments();
        this.initEmojiPicker();
        
        // 如果是管理员，添加删除按钮的样式
        if (this.isAdmin) {
            const style = document.createElement('style');
            style.textContent = `
                .delete-button {
                    background: none;
                    border: none;
                    color: #ff4444;
                    cursor: pointer;
                    padding: 4px 8px;
                    font-size: 14px;
                    opacity: 0.7;
                    transition: opacity 0.3s;
                }
                .delete-button:hover {
                    opacity: 1;
                }
                .admin-actions {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    initElements() {
        this.commentForm = document.querySelector('.comment-form');
        this.commentsList = document.querySelector('.comments-list');
        
        // 添加评论框样式
        const style = document.createElement('style');
        style.textContent = `
            .comment-form {
                position: relative;
                margin-bottom: 20px;
            }
            .nickname-input {
                width: 200px;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .comment-input-wrapper {
                position: relative;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                background: #fff;
            }
            .comment-input {
                width: 100%;
                min-height: 100px;
                border: none;
                outline: none;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 10px;
            }
            .comment-toolbar {
                display: flex;
                align-items: center;
                gap: 10px;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
            .toolbar-button {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: #f5f5f5;
                color: #666;
                cursor: pointer;
                transition: all 0.3s;
            }
            .toolbar-button:hover {
                background: #e8e8e8;
            }
            .toolbar-button i {
                font-size: 16px;
            }
            .submit-button {
                margin-left: auto;
                background: #007bff;
                color: white;
            }
            .submit-button:hover {
                background: #0056b3;
            }
        `;
        document.head.appendChild(style);
        
        // 重构评论框HTML
        const commentFormHtml = `
            <div class="comment-header-tip">选择你的头像</div>
            <div class="avatar-selector">
                <img src="custom_head/1.png" alt="当前头像" class="current-avatar">
                <div class="avatar-tip">点击头像更换</div>
                <div class="avatar-options" style="display: none;">
                    <div class="avatar-options-header">选择预设头像或上传自己的头像</div>
                    <div class="preset-avatars">
                        <img src="custom_head/1.png" alt="头像1">
                        <img src="custom_head/2.png" alt="头像2">
                        <img src="custom_head/3.png" alt="头像3">
                        <img src="custom_head/4.png" alt="头像4">
                        <img src="custom_head/5.png" alt="头像5">
                    </div>
                    <div class="avatar-upload">
                        <label for="avatar-upload" class="upload-label">
                            <i class="fas fa-upload"></i> 上传头像
                        </label>
                        <input type="file" id="avatar-upload" accept="image/*" style="display: none">
                    </div>
                </div>
            </div>
            <input type="text" class="nickname-input" placeholder="你的昵称（选填）">
            <div class="comment-input-wrapper">
                <div class="comment-input" contenteditable="true" placeholder="写下你的评论..."></div>
                <div class="comment-toolbar">
                    <button type="button" class="toolbar-button emoji-button">
                        <i class="far fa-smile"></i> 表情
                    </button>
                    <button type="button" class="toolbar-button upload-button">
                        <i class="far fa-image"></i> 图片
                    </button>
                    <input type="file" class="image-upload" accept="image/*" style="display: none">
                    <button type="submit" class="toolbar-button submit-button">
                        <i class="far fa-paper-plane"></i> 发送
                    </button>
                </div>
            </div>
        `;
        
        // 添加头像选择器样式
        const avatarStyle = document.createElement('style');
        avatarStyle.textContent = `
            .comment-header-tip {
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
            }
            .avatar-selector {
                position: relative;
                margin-bottom: 15px;
                display: inline-block;
                text-align: center;
            }
            .current-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #ddd;
                transition: all 0.3s;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .current-avatar:hover {
                border-color: #007bff;
                transform: scale(1.05);
            }
            .avatar-tip {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
                opacity: 0.8;
            }
            .avatar-options {
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                width: 280px;
            }
            .avatar-options::before {
                content: '';
                position: absolute;
                top: -8px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid white;
                filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.1));
            }
            .avatar-options-header {
                font-size: 13px;
                color: #666;
                margin-bottom: 12px;
                text-align: center;
            }
            .preset-avatars {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
                margin-bottom: 12px;
            }
            .preset-avatars img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .preset-avatars img:hover {
                border-color: #007bff;
                transform: scale(1.1);
            }
            .avatar-upload {
                text-align: center;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
            .upload-label {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 8px 16px;
                background: #f8f9fa;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 13px;
                color: #666;
            }
            .upload-label:hover {
                background: #e9ecef;
                color: #007bff;
            }
            .comment-card .commenter-avatar {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                margin-right: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
        `;
        document.head.appendChild(avatarStyle);
        
        this.commentForm.innerHTML = commentFormHtml;
        this.nicknameInput = this.commentForm.querySelector('.nickname-input');
        this.commentInput = this.commentForm.querySelector('.comment-input');
        this.currentAvatar = this.commentForm.querySelector('.current-avatar');
        this.avatarOptions = this.commentForm.querySelector('.avatar-options');
        
        // 绑定头像选择事件
        this.currentAvatar.addEventListener('click', () => {
            this.avatarOptions.style.display = this.avatarOptions.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭头像选择器
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.avatar-selector')) {
                this.avatarOptions.style.display = 'none';
            }
        });

        // 选择预设头像
        this.commentForm.querySelectorAll('.preset-avatars img').forEach(img => {
            img.addEventListener('click', () => {
                this.currentAvatar.src = img.src;
                this.avatarOptions.style.display = 'none';
                localStorage.setItem('userAvatar', img.src);
            });
        });

        // 上传自定义头像
        const avatarUpload = this.commentForm.querySelector('#avatar-upload');
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('头像图片不能超过2MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentAvatar.src = e.target.result;
                    localStorage.setItem('userAvatar', e.target.result);
                    this.avatarOptions.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        // 恢复用户之前选择的头像
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            this.currentAvatar.src = savedAvatar;
        }
        
        // 添加管理员登录按钮
        const adminButton = document.createElement('button');
        adminButton.textContent = this.isAdmin ? '退出管理' : '管理员登录';
        adminButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;';
        document.body.appendChild(adminButton);
        
        adminButton.addEventListener('click', () => {
            if (this.isAdmin) {
                this.logout();
                adminButton.textContent = '管理员登录';
            } else {
                const password = prompt('请输入管理员密码：');
                if (password === '3354947786@Augety') {
                    this.login();
                    adminButton.textContent = '退出管理';
                } else {
                    alert('密码错误！');
                }
            }
            this.renderComments();
        });

        // 添加 placeholder 效果
        const addPlaceholderEffect = (element) => {
            const placeholder = element.getAttribute('placeholder');
            
            element.addEventListener('focus', () => {
                if (element.innerHTML === placeholder) {
                    element.innerHTML = '';
                    element.style.color = '#000';
                }
            });

            element.addEventListener('blur', () => {
                if (element.innerHTML.trim() === '') {
                    element.innerHTML = placeholder;
                    element.style.color = '#999';
                }
            });

            // 监听内容变化
            const observer = new MutationObserver(() => {
                // 如果内容不为空，确保不显示 placeholder
                if (element.innerHTML.trim() !== '') {
                    element.style.color = '#000';
                    if (element.innerHTML === placeholder) {
                        element.innerHTML = '';
                    }
                }
            });

            observer.observe(element, { childList: true, subtree: true, characterData: true });

            // 初始化 placeholder
            if (element.innerHTML.trim() === '') {
                element.innerHTML = placeholder;
                element.style.color = '#999';
            }
        };

        // 为评论输入框添加 placeholder 效果
        addPlaceholderEffect(this.commentInput);
    }

    initEmojiPicker() {
        // 添加表情选择器样式
        const style = document.createElement('style');
        style.textContent = `
            .emoji-picker {
                position: absolute;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 12px;
                width: 320px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: none;
                bottom: 45px;
                left: 0;
            }
            .emoji-categories {
                display: flex;
                gap: 8px;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #eee;
                overflow-x: auto;
                scrollbar-width: none;
            }
            .emoji-categories::-webkit-scrollbar {
                display: none;
            }
            .emoji-category {
                padding: 4px 10px;
                border: none;
                background: none;
                cursor: pointer;
                white-space: nowrap;
                color: #666;
                border-radius: 12px;
                transition: all 0.2s;
                font-size: 13px;
            }
            .emoji-category:hover {
                background: #f0f0f0;
            }
            .emoji-category.active {
                color: #007bff;
                background: #e6f2ff;
            }
            .emoji-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                max-height: 200px;
                overflow-y: auto;
                padding: 5px;
            }
            .emoji-grid::-webkit-scrollbar {
                width: 4px;
            }
            .emoji-grid::-webkit-scrollbar-thumb {
                background: #ddd;
                border-radius: 2px;
            }
            .emoji-item {
                cursor: pointer;
                text-align: center;
                padding: 3px;
                transition: transform 0.2s;
                border-radius: 4px;
            }
            .emoji-item img {
                width: 32px;
                height: 32px;
                object-fit: contain;
            }
            .emoji-item:hover {
                background: #f5f5f5;
                transform: scale(1.1);
            }
            .emoji-item:hover::after {
                content: attr(title);
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 12px;
                white-space: nowrap;
            }
            .toolbar-button.emoji-button {
                position: relative;
            }
        `;
        document.head.appendChild(style);

        // 创建表情选择器
        const createEmojiPicker = (container) => {
            const emojiPicker = document.createElement('div');
            emojiPicker.className = 'emoji-picker';

            // 表情分类
            const categories = {
                '笑脸': ['😄大笑', '😁嘻嘻', '😂笑哭了', '🤣笑得满地打滚', '😆斜眼笑', '🥰喜笑颜开', '😍花痴', '😎墨镜笑脸', '☺微笑', '😉眨眼', '😇微笑天使', '🙃倒脸', '🤩好崇拜哦'],
                '难过': ['😢哭', '😭放声大哭', '😩累死了', '😱吓死了', '🥺恳求的脸', '😳脸红', '☹不满', '😯缄默'],
                '搞怪': ['🤪滑稽', '😜单眼吐舌', '🤓书呆子脸', '🧐带单片眼镜的脸', '🥳聚会笑脸', '🤠牛仔帽脸', '😏得意', '😒不高兴', '🙄翻白眼'],
                '动作': ['👍拇指向上', '👎拇指向下', '👏鼓掌', '🤝握手', '👋挥手', '✍写字', '💪肌肉', '👊出拳', '🤟爱你的手势', '🤞交叉的手指'],
                '状态': ['😴睡着了', '🤤流口水', '🤒发烧', '🤕受伤', '🤮呕吐', '🤧打喷嚏', '🥴头昏眼花', '🥵脸发烧', '🥶冷脸', '🤯爆炸头'],
                '符号': ['💗搏动的心', '💔心碎', '💖闪亮的心', '💘心中箭了', '💞舞动的心', '💯一百分', '💥爆炸', '💣炸弹'],
                '其他': ['👻鬼', '👽外星人', '🤖机器人', '💩大便', '🙈非礼勿视', '🙉非礼勿听', '🙊非礼勿言', '💋唇印']
            };

            // 创建分类标签
            const categoriesHtml = Object.keys(categories).map((category, index) => 
                `<button class="emoji-category${index === 0 ? ' active' : ''}" data-category="${category}">${category}</button>`
            ).join('');

            // 创建表情网格
            const createEmojiGrid = (emojis) => {
                return `<div class="emoji-grid">
                    ${emojis.map(emoji => {
                        const [emojiIcon, emojiName] = emoji.match(/^(.*?)((?=[A-Za-z])|$)/).slice(1);
                        const fileName = `${emoji}(128 x 128).gif`;
                        return `<span class="emoji-item" title="${emojiName || emoji}">
                            <img src="emojis/${fileName}" alt="${emojiName || emoji}" data-emoji="${fileName}">
                        </span>`;
                    }).join('')}
                </div>`;
            };

            emojiPicker.innerHTML = `
                <div class="emoji-categories">${categoriesHtml}</div>
                ${createEmojiGrid(categories['笑脸'])}
            `;

            // 切换表情分类
            emojiPicker.addEventListener('click', (e) => {
                if (e.target.classList.contains('emoji-category')) {
                    const category = e.target.dataset.category;
                    emojiPicker.querySelectorAll('.emoji-category').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    emojiPicker.querySelector('.emoji-grid').outerHTML = createEmojiGrid(categories[category]);
                }
            });

            // 选择表情
            emojiPicker.addEventListener('click', (e) => {
                const emojiItem = e.target.closest('.emoji-item');
                if (emojiItem) {
                    const img = emojiItem.querySelector('img');
                    const input = container.querySelector('.comment-input, .reply-input');
                    if (input) {
                        // 如果当前内容是 placeholder，先清空
                        if (input.innerHTML === input.getAttribute('placeholder')) {
                            input.innerHTML = '';
                        }
                        
                        const imgElement = document.createElement('img');
                        imgElement.src = img.src;
                        imgElement.style.width = '24px';
                        imgElement.style.height = '24px';
                        imgElement.style.verticalAlign = 'middle';
                        
                        const selection = window.getSelection();
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(imgElement);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        // 确保输入框获得焦点并设置正确的文字颜色
                        input.focus();
                        input.style.color = '#000';
                    }
                }
            });

            return emojiPicker;
        };

        // 为每个表情按钮添加悬停事件
        const bindEmojiEvents = (container) => {
            const emojiButton = container.querySelector('.emoji-button');
            if (!emojiButton) return;

            let emojiPicker = null;
            let hideTimeout = null;

            emojiButton.addEventListener('mouseenter', () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }
                if (!emojiPicker) {
                    emojiPicker = createEmojiPicker(container);
                    emojiButton.appendChild(emojiPicker);
                }
                emojiPicker.style.display = 'block';
            });

            emojiButton.addEventListener('mouseleave', (e) => {
                hideTimeout = setTimeout(() => {
                    if (emojiPicker && !emojiPicker.matches(':hover')) {
                        emojiPicker.style.display = 'none';
                    }
                }, 300);
            });

            if (emojiPicker) {
                emojiPicker.addEventListener('mouseenter', () => {
                    if (hideTimeout) {
                        clearTimeout(hideTimeout);
                    }
                });

                emojiPicker.addEventListener('mouseleave', () => {
                    hideTimeout = setTimeout(() => {
                        emojiPicker.style.display = 'none';
                    }, 300);
                });
            }
        };

        // 为主评论区绑定表情事件
        bindEmojiEvents(this.commentForm);

        // 为回复区域绑定表情事件
        this.commentsList.addEventListener('click', (e) => {
            if (e.target.closest('.reply-form')) {
                bindEmojiEvents(e.target.closest('.reply-form'));
            }
        });
    }

    login() {
        this.isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
    }

    logout() {
        this.isAdmin = false;
        localStorage.setItem('isAdmin', 'false');
    }

    bindEvents() {
        // 提交留言
        this.commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addComment();
        });

        // 为发送按钮添加点击事件
        const submitButton = this.commentForm.querySelector('.submit-button');
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.addComment();
        });

        // 图片上传
        const imageUpload = document.querySelector('.image-upload');
        const uploadButton = document.querySelector('.upload-button');
        
        uploadButton.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, this.commentInput);
            }
        });

        // 点赞、点踩、回复等操作
        this.commentsList.addEventListener('click', (e) => {
            const target = e.target;
            
            // 删除评论（仅管理员可见和使用）
            if (target.closest('.delete-button') && this.isAdmin) {
                const commentCard = target.closest('.comment-card');
                const commentId = commentCard.dataset.commentId;
                if (confirm('确定要删除这条评论吗？')) {
                    this.deleteComment(commentId);
                }
            }
            
            // 点赞
            if (target.closest('.like-button')) {
                const commentCard = target.closest('.comment-card');
                const commentId = commentCard.dataset.commentId;
                this.handleLike(commentId, commentCard);
            }
            
            // 点踩
            if (target.closest('.dislike-button')) {
                const commentCard = target.closest('.comment-card');
                const commentId = commentCard.dataset.commentId;
                this.handleDislike(commentId, commentCard);
            }
            
            // 显示回复框
            if (target.closest('.reply-button')) {
                const commentCard = target.closest('.comment-card');
                this.showReplyForm(commentCard);
            }
            
            // 提交回复
            if (target.closest('.submit-reply')) {
                const commentCard = target.closest('.comment-card');
                this.handleReplySubmit(commentCard);
            }
            
            // 取消回复
            if (target.closest('.cancel-reply')) {
                const replyForm = target.closest('.reply-form');
                replyForm.style.display = 'none';
            }
        });
    }

    handleImageUpload(file, targetInput) {
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            targetInput.appendChild(img);
        };
        reader.readAsDataURL(file);
    }

    handleLike(commentId, commentCard) {
        const actionKey = `like_${commentId}`;
        const dislikeKey = `dislike_${commentId}`;

        // 如果已经点过赞，则取消点赞
        if (this.userActions[actionKey]) {
            const likeCount = commentCard.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            this.userActions[actionKey] = false;
            commentCard.querySelector('.like-button').classList.remove('active');
        } 
        // 如果已经点过踩，不允许点赞
        else if (this.userActions[dislikeKey]) {
            alert('您已经点过踩了，不能再点赞');
            return;
        }
        // 未点过赞，可以点赞
        else {
            const likeCount = commentCard.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            this.userActions[actionKey] = true;
            commentCard.querySelector('.like-button').classList.add('active');
        }
        
        this.saveUserActions();
        this.updateCommentLikes(commentId, parseInt(commentCard.querySelector('.like-count').textContent));
    }

    handleDislike(commentId, commentCard) {
        const actionKey = `dislike_${commentId}`;
        const likeKey = `like_${commentId}`;

        // 如果已经点过踩，则取消点踩
        if (this.userActions[actionKey]) {
            const dislikeCount = commentCard.querySelector('.dislike-count');
            dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
            this.userActions[actionKey] = false;
            commentCard.querySelector('.dislike-button').classList.remove('active');
        }
        // 如果已经点过赞，不允许点踩
        else if (this.userActions[likeKey]) {
            alert('您已经点过赞了，不能再点踩');
            return;
        }
        // 未点过踩，可以点踩
        else {
            const dislikeCount = commentCard.querySelector('.dislike-count');
            dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
            this.userActions[actionKey] = true;
            commentCard.querySelector('.dislike-button').classList.add('active');
        }
        
        this.saveUserActions();
        this.updateCommentDislikes(commentId, parseInt(commentCard.querySelector('.dislike-count').textContent));
    }

    saveUserActions() {
        localStorage.setItem('userActions', JSON.stringify(this.userActions));
    }

    updateCommentLikes(commentId, likes) {
        this.updateCommentData(commentId, { likes });
    }

    updateCommentDislikes(commentId, dislikes) {
        this.updateCommentData(commentId, { dislikes });
    }

    updateCommentData(commentId, data) {
        const updateComment = (comments) => {
            for (let comment of comments) {
                if (comment.id === commentId) {
                    Object.assign(comment, data);
                    return true;
                }
                if (comment.replies) {
                    const found = updateComment(comment.replies);
                    if (found) return true;
                }
            }
            return false;
        };

        updateComment(this.comments);
        this.saveComments();
    }

    showReplyForm(commentCard) {
        const replyForm = commentCard.querySelector('.reply-form');
        if (!replyForm.querySelector('.reply-toolbar')) {
            // 添加表情和图片上传按钮
            const toolbarHtml = `
                <div class="reply-toolbar" style="margin-top: 10px; display: flex; gap: 10px;">
                    <button type="button" class="toolbar-button emoji-button">
                        <i class="far fa-smile"></i> 表情
                    </button>
                    <input type="file" class="image-upload" accept="image/*" style="display: none">
                    <button type="button" class="toolbar-button upload-button">
                        <i class="far fa-image"></i> 图片
                    </button>
                </div>
            `;
            replyForm.insertAdjacentHTML('beforeend', toolbarHtml);

            // 绑定图片上传事件
            const imageUpload = replyForm.querySelector('.image-upload');
            const uploadButton = replyForm.querySelector('.upload-button');
            const replyInput = replyForm.querySelector('.reply-input');

            uploadButton.addEventListener('click', () => {
                imageUpload.click();
            });

            imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageUpload(file, replyInput);
                }
            });
        }
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    }

    handleReplySubmit(commentCard) {
        const replyForm = commentCard.querySelector('.reply-form');
        const nickname = replyForm.querySelector('.reply-nickname-input').value.trim() || '访客';
        const content = replyForm.querySelector('.reply-input').innerHTML.trim();
        const avatar = this.currentAvatar.src;
        
        if (content) {
            this.addReply(commentCard, nickname, content, avatar);
            replyForm.querySelector('.reply-input').innerHTML = '';
            replyForm.querySelector('.reply-nickname-input').value = '';
            replyForm.style.display = 'none';
        }
    }

    deleteComment(commentId) {
        const deleteFromComments = (comments) => {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].id === commentId) {
                    comments.splice(i, 1);
                    return true;
                }
                if (comments[i].replies) {
                    const found = deleteFromComments(comments[i].replies);
                    if (found) return true;
                }
            }
            return false;
        };

        deleteFromComments(this.comments);
        this.saveComments();
        this.renderComments();
    }

    addComment() {
        const nickname = this.nicknameInput.value.trim() || '访客';
        const content = this.commentInput.innerHTML.trim();
        const avatar = this.currentAvatar.src;
        
        if (!content) return;
        
        const comment = {
            id: Date.now().toString(),
            nickname,
            content,
            avatar,
            time: new Date().toLocaleString(),
            likes: 0,
            dislikes: 0,
            replies: []
        };
        
        this.comments.unshift(comment);
        this.saveComments();
        this.renderComments();
        
        this.nicknameInput.value = '';
        this.commentInput.innerHTML = '';
    }

    addReply(commentCard, nickname, content, avatar) {
        const commentId = commentCard.dataset.commentId;
        const reply = {
            id: Date.now().toString(),
            nickname,
            content,
            avatar,
            time: new Date().toLocaleString(),
            likes: 0,
            dislikes: 0,
            replies: []
        };
        
        const addReplyToComment = (comments) => {
            for (let comment of comments) {
                if (comment.id === commentId) {
                    comment.replies = comment.replies || [];
                    comment.replies.push(reply);
                    return true;
                }
                if (comment.replies) {
                    const found = addReplyToComment(comment.replies);
                    if (found) return true;
                }
            }
            return false;
        };

        addReplyToComment(this.comments);
        this.saveComments();
        this.renderComments();
    }

    saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }

    renderComments() {
        const renderComment = (comment, level = 0) => `
            <div class="comment-card${level > 0 ? ' reply-card' : ''}" data-comment-id="${comment.id}" style="margin-left: ${level * 20}px">
                <div class="comment-header">
                    <div class="commenter-info">
                        <img src="${comment.avatar || 'custom_head/1.png'}" alt="访客头像" class="commenter-avatar">
                        <div class="commenter-meta">
                            <h4>${comment.nickname}</h4>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                    </div>
                    ${this.isAdmin ? `
                        <div class="admin-actions">
                            <button class="delete-button" title="删除">
                                <i class="fas fa-trash"></i> 删除
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="comment-content">
                    <div>${comment.content}</div>
                </div>
                <div class="comment-footer">
                    <div class="interaction-buttons">
                        <button class="like-button${this.userActions[`like_${comment.id}`] ? ' active' : ''}" title="点赞">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="like-count">${comment.likes}</span>
                        </button>
                        <button class="dislike-button${this.userActions[`dislike_${comment.id}`] ? ' active' : ''}" title="点踩">
                            <i class="fas fa-thumbs-down"></i>
                            <span class="dislike-count">${comment.dislikes}</span>
                        </button>
                        <button class="reply-button" title="回复">
                            <i class="fas fa-reply"></i>
                            回复
                        </button>
                    </div>
                </div>
                <div class="replies-section">
                    <div class="reply-form" style="display: none;">
                        <input type="text" placeholder="你的昵称（选填）" class="reply-nickname-input">
                        <div class="reply-input" contenteditable="true" placeholder="写下你的回复..."></div>
                        <div class="reply-form-footer">
                            <button class="submit-reply">发送回复</button>
                            <button class="cancel-reply">取消</button>
                        </div>
                    </div>
                    <div class="replies-list">
                        ${comment.replies ? comment.replies.map(reply => renderComment(reply, level + 1)).join('') : ''}
                    </div>
                </div>
            </div>
        `;

        this.commentsList.innerHTML = this.comments.map(comment => renderComment(comment)).join('');
    }
}

// 初始化留言管理器
document.addEventListener('DOMContentLoaded', () => {
    new CommentManager();
}); 