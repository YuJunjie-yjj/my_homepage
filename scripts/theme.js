// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取主题切换按钮和HTML元素
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 从localStorage中获取主题状态
    let isDark = localStorage.getItem('darkMode') === 'true';
    
    // 设置初始主题
    setTheme();
    
    // 添加点击事件
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            toggleTheme();
        });
    }
    
    // 设置主题
    function setTheme() {
        // 设置data-theme属性
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // 更新按钮图标
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
        }
        
        console.log('Theme set to:', isDark ? 'dark' : 'light');
        console.log('Current data-theme attribute:', html.getAttribute('data-theme'));
    }
    
    // 切换主题
    function toggleTheme() {
        // 切换状态
        isDark = !isDark;
        
        // 保存到localStorage
        localStorage.setItem('darkMode', isDark);
        
        // 应用主题
        setTheme();
        
        console.log('Theme toggled to:', isDark ? 'dark' : 'light');
    }
}); 