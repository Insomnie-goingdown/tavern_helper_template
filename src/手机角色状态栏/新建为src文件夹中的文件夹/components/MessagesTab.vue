<template>
  <div class="messages-tab">
    <!-- 短信列表 -->
    <div v-if="!selectedMessage" class="messages-list">
      <div v-for="(message, index) in messages" :key="index" class="message-item" @click="selectMessage(index)">
        <div class="message-avatar">
          <img v-if="message.avatar" :src="message.avatar" :alt="message.sender" />
          <div v-else class="avatar-placeholder">{{ message.sender[0] }}</div>
        </div>
        <div class="message-info">
          <div class="message-header">
            <span class="message-sender">{{ message.sender }}</span>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <p class="message-preview">{{ message.preview }}</p>
        </div>
        <div v-if="message.unread" class="unread-badge"></div>
      </div>
    </div>

    <!-- 对话界面 -->
    <div v-else class="conversation-view">
      <div class="conversation-header">
        <button class="back-button" @click="selectedMessage = null">
          <i class="fa fa-arrow-left"></i>
        </button>
        <div class="conversation-avatar">
          <img v-if="currentConversation.avatar" :src="currentConversation.avatar" :alt="currentConversation.sender" />
          <div v-else class="avatar-placeholder">{{ currentConversation.sender[0] }}</div>
        </div>
        <span class="conversation-name">{{ currentConversation.sender }}</span>
      </div>

      <div class="conversation-messages">
        <div
          v-for="(msg, index) in currentConversation.history"
          :key="index"
          class="message-bubble"
          :class="{ sent: msg.sent, received: !msg.sent }"
        >
          <p class="message-text">{{ msg.content }}</p>
          <span class="message-timestamp">{{ msg.time }}</span>
        </div>
      </div>

      <div class="conversation-input">
        <input v-model="replyText" type="text" placeholder="输入回复..." @keyup.enter="sendReply" />
        <button class="send-button" @click="sendReply">
          <i class="fa fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface MessageItem {
  sender: string;
  avatar?: string;
  preview: string;
  time: string;
  unread: boolean;
  history: Array<{
    content: string;
    time: string;
    sent: boolean;
  }>;
}

const messages = ref<MessageItem[]>([]);
const selectedMessage = ref<number | null>(null);
const replyText = ref('');

const currentConversation = computed(() => {
  if (selectedMessage.value === null) {
    return { sender: '', avatar: '', history: [] };
  }
  return messages.value[selectedMessage.value];
});

function selectMessage(index: number) {
  selectedMessage.value = index;
  if (messages.value[index].unread) {
    messages.value[index].unread = false;
  }
}

async function sendReply() {
  if (!replyText.value.trim() || selectedMessage.value === null) {
    return;
  }

  const message = messages.value[selectedMessage.value];
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // 添加到历史记录
  message.history.push({
    content: replyText.value,
    time: timeStr,
    sent: true,
  });
  // 仅保留最近 10 条记录
  if (message.history.length > 10) {
    message.history = message.history.slice(-10);
  }

  // 更新预览
  message.preview = replyText.value;
  message.time = timeStr;
  message.unread = false;

  // 推送到酒馆输入窗口
  try {
    // 转义特殊字符，使用引号包裹
    const escapedText = replyText.value.replace(/"/g, '\\"');
    await triggerSlash(`/setinput "${escapedText}"`);
  } catch (error) {
    console.error('推送消息到输入窗口失败:', error);
  }

  replyText.value = '';
}

function generateMessagesFromWorldbook() {
  const variables = getVariables({ type: 'message', message_id: getCurrentMessageId() });

  // 尝试从变量中获取NPC信息
  const npcs = variables['NPC列表'] || variables['npcs'] || [];

  // 生成示例短信
  messages.value = [
    {
      sender: '朋友A',
      preview: '今天有空一起出来吗？',
      time: '14:30',
      unread: true,
      history: [{ content: '今天有空一起出来吗？', time: '14:30', sent: false }],
    },
    {
      sender: '同事B',
      preview: '明天的会议记得参加',
      time: '13:15',
      unread: false,
      history: [
        { content: '明天的会议记得参加', time: '13:15', sent: false },
        { content: '好的，我会准时到的', time: '13:20', sent: true },
      ],
    },
    {
      sender: '家人C',
      preview: '晚上回家吃饭吗？',
      time: '12:00',
      unread: true,
      history: [{ content: '晚上回家吃饭吗？', time: '12:00', sent: false }],
    },
  ];

  // 如果有NPC信息，可以添加更多短信
  if (Array.isArray(npcs) && npcs.length > 0) {
    npcs.slice(0, 5).forEach((npc: any) => {
      if (typeof npc === 'string') {
        messages.value.push({
          sender: npc,
          preview: '最近怎么样？',
          time: '10:00',
          unread: false,
          history: [{ content: '最近怎么样？', time: '10:00', sent: false }],
        });
      } else if (npc.name) {
        messages.value.push({
          sender: npc.name,
          avatar: npc.avatar,
          preview: npc.lastMessage || '你好',
          time: '09:00',
          unread: false,
          history: [{ content: npc.lastMessage || '你好', time: '09:00', sent: false }],
        });
      }
    });
  }

  // 限制最多10条
  messages.value = messages.value.slice(0, 10);
}

// 初始化时生成短信
generateMessagesFromWorldbook();
</script>

<style lang="scss" scoped>
.messages-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #f8f8f8;
  }
}

.message-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-sender {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-preview {
  margin: 0;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  width: 10px;
  height: 10px;
  background: #ff3b30;
  border-radius: 50%;
  margin-left: 8px;
  flex-shrink: 0;
}

.conversation-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.conversation-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.back-button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #667eea;
  font-size: 18px;
  cursor: pointer;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }
}

.conversation-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.conversation-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.conversation-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  word-wrap: break-word;

  &.sent {
    align-self: flex-end;
    background: #007aff;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  &.received {
    align-self: flex-start;
    background: #e5e5ea;
    color: #000;
    border-bottom-left-radius: 4px;
  }
}

.message-text {
  margin: 0 0 4px 0;
  font-size: 15px;
  line-height: 1.4;
}

.message-timestamp {
  font-size: 11px;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.conversation-input {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  gap: 8px;

  input {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #667eea;
    }
  }

  .send-button {
    width: 40px;
    height: 40px;
    border: none;
    background: #007aff;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: #0056b3;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
