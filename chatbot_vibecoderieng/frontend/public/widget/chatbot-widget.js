/**
 * chatbot-widget.js — Self-contained floating chat widget.
 * Usage: <script src="/widget/chatbot-widget.js"
 *           data-bot-name="Chatbot"
 *           data-color="#6366f1"
 *           data-position="bottom-right"
 *           data-api-url="/api/v1/chat">
 *        </script>
 */
(function () {
    'use strict';

    // --- Config from data-* attributes ---
    var script = document.currentScript || document.querySelector('script[src*="chatbot-widget.js"]');
    var config = {
        botName: (script && script.getAttribute('data-bot-name')) || 'Chatbot',
        color: (script && script.getAttribute('data-color')) || '#6366f1',
        position: (script && script.getAttribute('data-position')) || 'bottom-right',
        apiUrl: (script && script.getAttribute('data-api-url')) || '/api/v1/chat',
    };

    // --- UUID helper ---
    function generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // --- State ---
    var isOpen = false;
    var isLoading = false;
    var sessionId = localStorage.getItem('chatbot_widget_session_id') || (function () {
        var id = generateUUID();
        localStorage.setItem('chatbot_widget_session_id', id);
        return id;
    })();

    // --- Position styles ---
    var posRight = config.position !== 'bottom-left';
    var posStyle = posRight
        ? 'right:24px;bottom:24px;'
        : 'left:24px;bottom:24px;';
    var panelPosStyle = posRight
        ? 'right:24px;bottom:90px;'
        : 'left:24px;bottom:90px;';

    // --- Inject CSS ---
    var style = document.createElement('style');
    style.textContent = [
        '#cw-btn{position:fixed;' + posStyle + 'width:56px;height:56px;border-radius:50%;background:' + config.color + ';',
        'border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;',
        'z-index:99999;transition:transform 0.2s;}',
        '#cw-btn:hover{transform:scale(1.08);}',
        '#cw-panel{position:fixed;' + panelPosStyle + 'width:360px;max-width:calc(100vw - 32px);',
        'height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;',
        'box-shadow:0 8px 32px rgba(0,0,0,0.18);display:flex;flex-direction:column;z-index:99998;',
        'transform:scale(0.95) translateY(16px);opacity:0;pointer-events:none;',
        'transition:opacity 0.2s,transform 0.2s;}',
        '#cw-panel.cw-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}',
        '#cw-header{background:' + config.color + ';color:#fff;padding:14px 16px;border-radius:16px 16px 0 0;',
        'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
        '#cw-header span{font-weight:600;font-size:15px;}',
        '#cw-hbtns{display:flex;gap:6px;}',
        '#cw-clear,#cw-close{background:rgba(255,255,255,0.2);border:none;color:#fff;',
        'cursor:pointer;border-radius:8px;padding:4px 8px;font-size:12px;transition:background 0.15s;}',
        '#cw-clear:hover,#cw-close:hover{background:rgba(255,255,255,0.35);}',
        '#cw-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}',
        '.cw-bubble{max-width:82%;padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;word-break:break-word;}',
        '.cw-user{align-self:flex-end;background:' + config.color + ';color:#fff;border-bottom-right-radius:4px;}',
        '.cw-bot{align-self:flex-start;background:#f3f4f6;color:#1f2937;border-bottom-left-radius:4px;}',
        '.cw-typing{align-self:flex-start;background:#f3f4f6;color:#9ca3af;padding:9px 14px;border-radius:14px;',
        'border-bottom-left-radius:4px;font-size:13px;font-style:italic;}',
        '#cw-input-row{display:flex;gap:8px;padding:12px;border-top:1px solid #f0f0f0;flex-shrink:0;}',
        '#cw-input{flex:1;border:1.5px solid #e5e7eb;border-radius:10px;padding:9px 12px;font-size:13.5px;',
        'outline:none;transition:border-color 0.15s;}',
        '#cw-input:focus{border-color:' + config.color + ';}',
        '#cw-send{background:' + config.color + ';color:#fff;border:none;border-radius:10px;',
        'padding:9px 14px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity 0.15s;}',
        '#cw-send:disabled{opacity:0.5;cursor:not-allowed;}',
        '@media(max-width:480px){#cw-panel{width:calc(100vw - 16px);' + (posRight ? 'right:8px;' : 'left:8px;') + '}}'
    ].join('');
    document.head.appendChild(style);

    // --- Build DOM ---
    // Floating button
    var btn = document.createElement('button');
    btn.id = 'cw-btn';
    btn.title = config.botName;
    btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    // Panel
    var panel = document.createElement('div');
    panel.id = 'cw-panel';
    panel.innerHTML = [
        '<div id="cw-header">',
        '  <span>' + escapeHtml(config.botName) + '</span>',
        '  <div id="cw-hbtns">',
        '    <button id="cw-clear">Xoá</button>',
        '    <button id="cw-close">✕</button>',
        '  </div>',
        '</div>',
        '<div id="cw-msgs"></div>',
        '<div id="cw-input-row">',
        '  <input id="cw-input" type="text" placeholder="Nhập tin nhắn..." autocomplete="off"/>',
        '  <button id="cw-send">Gửi</button>',
        '</div>'
    ].join('');

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var msgsEl = document.getElementById('cw-msgs');
    var inputEl = document.getElementById('cw-input');
    var sendBtn = document.getElementById('cw-send');

    // --- Helpers ---
    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function scrollBottom() {
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function addBubble(role, text) {
        var div = document.createElement('div');
        div.className = 'cw-bubble ' + (role === 'user' ? 'cw-user' : 'cw-bot');
        div.textContent = text;
        msgsEl.appendChild(div);
        scrollBottom();
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'cw-typing';
        div.id = 'cw-typing-indicator';
        div.textContent = 'Đang trả lời...';
        msgsEl.appendChild(div);
        scrollBottom();
        return div;
    }

    function removeTyping() {
        var el = document.getElementById('cw-typing-indicator');
        if (el) el.remove();
    }

    // --- Toggle open/close ---
    function openPanel() {
        isOpen = true;
        panel.classList.add('cw-open');
        inputEl.focus();
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('cw-open');
    }

    btn.addEventListener('click', function () {
        isOpen ? closePanel() : openPanel();
    });

    document.getElementById('cw-close').addEventListener('click', closePanel);

    // --- Clear conversation ---
    document.getElementById('cw-clear').addEventListener('click', function () {
        msgsEl.innerHTML = '';
        sessionId = generateUUID();
        localStorage.setItem('chatbot_widget_session_id', sessionId);
    });

    // --- Send message ---
    async function sendMessage() {
        var text = inputEl.value.trim();
        if (!text || isLoading) return;

        isLoading = true;
        inputEl.value = '';
        sendBtn.disabled = true;

        addBubble('user', text);
        var typingEl = showTyping();

        try {
            var resp = await fetch(config.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, session_id: sessionId }),
            });

            removeTyping();

            if (!resp.ok) {
                addBubble('bot', 'Lỗi kết nối. Vui lòng thử lại.');
                return;
            }

            // Handle streaming response (text/plain chunks)
            var reader = resp.body.getReader();
            var decoder = new TextDecoder();
            var fullText = '';
            var botDiv = document.createElement('div');
            botDiv.className = 'cw-bubble cw-bot';
            msgsEl.appendChild(botDiv);

            while (true) {
                var result = await reader.read();
                if (result.done) break;
                fullText += decoder.decode(result.value, { stream: true });
                // Strip internal tags before displaying
                botDiv.textContent = fullText
                    .replace(/\[\[STAGE:\w+\]\]/g, '')
                    .replace(/\[\[OPEN_REGISTER\]\]/g, '')
                    .replace(/\[\[REGISTER_BTN\]\]/g, '')
                    .trim();
                scrollBottom();
            }
        } catch (e) {
            removeTyping();
            addBubble('bot', 'Không thể kết nối đến server.');
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            inputEl.focus();
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
})();
