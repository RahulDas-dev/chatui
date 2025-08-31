import './index.css';
import { v4 as uuidv4 } from 'uuid';
import { createIcons, Moon, Sun, Send } from 'lucide';

// Types
interface Message {
    id: string;
    text: string;
    timestamp: Date;
    sender: 'user' | 'bot';
}

interface ChatState {
    messages: Message[];
    isTyping: boolean;
}

// Chat Class
class ChatUI {
    private state: ChatState;
    private messagesContainer: HTMLElement;
    private messageInput: HTMLTextAreaElement;
    private sendButton: HTMLButtonElement;
    private themeToggle: HTMLButtonElement;
    private themeIcon: HTMLElement;

    constructor() {
        this.state = {
            messages: [],
            isTyping: false,
        };

        // Get DOM elements
        this.messagesContainer = document.getElementById('messages-container') as HTMLElement;
        this.messageInput = document.getElementById('message-input') as HTMLTextAreaElement;
        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
        this.themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
        this.themeIcon = document.getElementById('theme-icon') as HTMLElement;

        this.init();
    }

    private init(): void {
        // Initialize all Lucide icons
        createIcons({
            icons: {
                Moon,
                Sun,
                Send,
            },
        });

        this.setupEventListeners();
        this.setupTheme();
        this.addWelcomeMessage();
    }

    private setupEventListeners(): void {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key press (Send message, Shift+Enter for new line)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default new line behavior
                this.sendMessage();
            }
        });

        // Input change to enable/disable send button
        this.messageInput.addEventListener('input', () => {
            if (!this.state.isTyping && !this.messageInput.disabled) {
                this.sendButton.disabled = this.messageInput.value.trim() === '';
            }
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    private setupTheme(): void {
        // Check for saved theme or default to light
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            this.updateThemeIcon('sun');
        } else {
            document.documentElement.classList.remove('dark');
            this.updateThemeIcon('moon');
        }
    }

    private toggleTheme(): void {
        const isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            this.updateThemeIcon('moon');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            this.updateThemeIcon('sun');
        }
    }

    private updateThemeIcon(iconName: 'moon' | 'sun'): void {
        // Update the data-lucide attribute
        this.themeIcon.setAttribute('data-lucide', iconName);
        
        // Re-scan and replace all icons in the document
        createIcons({
            icons: {
                Moon,
                Sun,
                Send,
            },
        });
    }

    private addWelcomeMessage(): void {
        const welcomeMessage: Message = {
            id: uuidv4(),
            text: 'Welcome to Chat UI! Start typing to begin a conversation.',
            timestamp: new Date(),
            sender: 'bot',
        };

        this.addMessage(welcomeMessage);
    }

    private sendMessage(): void {
        const text = this.messageInput.value.trim();
        if (!text || this.state.isTyping) return;

        // Disable input while processing
        this.setInputDisabled(true);

        // Add user message
        const userMessage: Message = {
            id: uuidv4(),
            text,
            timestamp: new Date(),
            sender: 'user',
        };

        this.addMessage(userMessage);
        this.messageInput.value = '';

        // Simulate bot response
        this.simulateBotResponse(text);
    }

    private simulateBotResponse(userText: string): void {
        this.state.isTyping = true;
        this.showTypingIndicator();

        // Simple bot responses
        const responses = [
            `I received your message: "${userText}"`,
            "That's interesting! Tell me more.",
            "I understand what you're saying.",
            'Thanks for sharing that with me.',
            'How can I help you with that?',
            'That sounds great!',
            'I see what you mean.',
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Simulate typing delay
        setTimeout(
            () => {
                this.hideTypingIndicator();

                const botMessage: Message = {
                    id: uuidv4(),
                    text: randomResponse,
                    timestamp: new Date(),
                    sender: 'bot',
                };

                this.addMessage(botMessage);
                this.state.isTyping = false;
                this.setInputDisabled(false); // Re-enable input after bot responds
            },
            1000 + Math.random() * 2000
        ); // Random delay between 1-3 seconds
    }

    private setInputDisabled(disabled: boolean): void {
        this.messageInput.disabled = disabled;
        this.sendButton.disabled = disabled || this.messageInput.value.trim() === '';
    }

    private addMessage(message: Message): void {
        this.state.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    private renderMessage(message: Message): void {
        const messageElement = document.createElement('div');
        messageElement.className = `message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`;
        messageElement.innerHTML = `
      <div class="flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                ? 'bg-zinc-900 dark:bg-zinc-700 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
            }">
          <p class="text-sm">${this.escapeHtml(message.text)}</p>
          <p class="text-xs opacity-70 mt-1">${this.formatTime(message.timestamp)}</p>
        </div>
      </div>
    `;

        this.messagesContainer.appendChild(messageElement);
    }

    private showTypingIndicator(): void {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'flex justify-start';
        typingElement.innerHTML = `
      <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    `;

        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    private hideTypingIndicator(): void {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    private scrollToBottom(): void {
        const messagesArea = document.getElementById('messages-area') as HTMLElement;
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    private formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});
