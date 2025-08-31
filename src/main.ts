import './index.css';
import { v4 as uuidv4 } from 'uuid';
import { createIcons, Moon, Sun, Send, Menu, X, Plus } from 'lucide';
import { chatService } from './services/chatService';
import type { Message, ChatSession, ChatState, ChatRequest } from './types';

// Chat Class
class ChatUI {
    private state: ChatState;
    private messagesContainer: HTMLElement;
    private messageInput: HTMLTextAreaElement;
    private sendButton: HTMLButtonElement;
    private themeToggle: HTMLButtonElement;
    private themeIcon: HTMLElement;
    private burgerMenu: HTMLButtonElement;
    private closeSidebarBtn: HTMLButtonElement;
    private newChatBtn: HTMLButtonElement;
    private sidebar: HTMLElement;
    private mainContent: HTMLElement;
    private inputArea: HTMLElement;
    private chatHistory: HTMLElement;

    constructor() {
        this.state = {
            sessions: [],
            currentSessionId: null,
            isTyping: false,
        };

        // Get DOM elements
        this.messagesContainer = document.getElementById('messages-container') as HTMLElement;
        this.messageInput = document.getElementById('message-input') as HTMLTextAreaElement;
        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
        this.themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
        this.themeIcon = document.getElementById('theme-icon') as HTMLElement;
        this.burgerMenu = document.getElementById('burger-menu') as HTMLButtonElement;
        this.closeSidebarBtn = document.getElementById('close-sidebar') as HTMLButtonElement;
        this.newChatBtn = document.getElementById('new-chat-btn') as HTMLButtonElement;
        this.sidebar = document.getElementById('sidebar') as HTMLElement;
        this.mainContent = document.getElementById('main-content') as HTMLElement;
        this.inputArea = document.getElementById('input-area') as HTMLElement;
        this.chatHistory = document.getElementById('chat-history') as HTMLElement;

        this.init();
    }

    private async init(): Promise<void> {
        // Initialize all Lucide icons
        createIcons({
            icons: {
                Moon,
                Sun,
                Send,
                Menu,
                X,
                Plus,
            },
        });

        this.loadSessionsFromStorage();
        this.setupEventListeners();
        this.setupTheme();
        this.updateChatHistory();
        
        // Check API health
        this.checkApiHealth();
        
        // Load current session or create new one
        if (this.state.currentSessionId && this.getCurrentSession()) {
            this.loadChatSession(this.state.currentSessionId);
        } else {
            this.addWelcomeMessage();
        }
    }

    private async checkApiHealth(): Promise<void> {
        try {
            const isHealthy = await chatService.healthCheck();
            if (isHealthy) {
                console.log('✅ Chat API is available');
            } else {
                console.warn('⚠️ Chat API is not available, using fallback responses');
            }
        } catch {
            console.warn('⚠️ Unable to check API health, using fallback responses');
        }
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

        // Sidebar toggle
        this.burgerMenu.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        this.newChatBtn.addEventListener('click', () => this.startNewChat());

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    private handleResize(): void {
        // Handle responsive behavior for sidebar
        if (window.innerWidth < 768) {
            this.mainContent.classList.remove('md:ml-64');
        } else if (this.sidebar.classList.contains('translate-x-0')) {
            // Reapply sidebar offset on desktop if sidebar is open
            this.mainContent.classList.add('md:ml-64');
        }
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
        // Update the data-lucide attribute for theme icon
        this.themeIcon.setAttribute('data-lucide', iconName);
        
        // Re-scan and replace all icons in the document
        createIcons({
            icons: {
                Moon,
                Sun,
                Send,
                Menu,
                X,
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

        // Get bot response from API
        this.getBotResponse(text);
    }

    private async getBotResponse(userText: string): Promise<void> {
        this.state.isTyping = true;
        this.showTypingIndicator();

        try {
            const request: ChatRequest = {
                message: userText,
                sessionId: this.state.currentSessionId || undefined,
            };

            const response = await chatService.sendMessage(request);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            const botMessage: Message = {
                id: uuidv4(),
                text: response.message,
                timestamp: new Date(response.timestamp),
                sender: 'bot',
            };

            this.addMessage(botMessage);
            this.state.isTyping = false;
            this.setInputDisabled(false);
            
        } catch (error) {
            console.error('Failed to get bot response:', error);
            
            // Hide typing indicator and show error message
            this.hideTypingIndicator();
            
            const errorMessage: Message = {
                id: uuidv4(),
                text: 'Sorry, I\'m having trouble responding right now. Please try again.',
                timestamp: new Date(),
                sender: 'bot',
            };

            this.addMessage(errorMessage);
            this.state.isTyping = false;
            this.setInputDisabled(false);
        }
    }

    private setInputDisabled(disabled: boolean): void {
        this.messageInput.disabled = disabled;
        this.sendButton.disabled = disabled || this.messageInput.value.trim() === '';
    }

    private getCurrentSession(): ChatSession | null {
        if (!this.state.currentSessionId) return null;
        return this.state.sessions.find(session => session.id === this.state.currentSessionId) || null;
    }

    private createNewSession(): ChatSession {
        const session: ChatSession = {
            id: uuidv4(),
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.state.sessions.push(session);
        this.state.currentSessionId = session.id;
        this.saveSessionsToStorage();
        return session;
    }

    private saveSessionsToStorage(): void {
        localStorage.setItem('chatSessions', JSON.stringify(this.state.sessions));
        localStorage.setItem('currentSessionId', this.state.currentSessionId || '');
    }

    private loadSessionsFromStorage(): void {
        const savedSessions = localStorage.getItem('chatSessions');
        const savedCurrentId = localStorage.getItem('currentSessionId');
        
        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions) as ChatSession[];
            this.state.sessions = parsedSessions.map((session) => ({
                ...session,
                createdAt: new Date(session.createdAt),
                updatedAt: new Date(session.updatedAt),
                messages: session.messages.map((msg) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
        }
        
        if (savedCurrentId && this.state.sessions.find(s => s.id === savedCurrentId)) {
            this.state.currentSessionId = savedCurrentId;
        }
    }

    private addMessage(message: Message): void {
        let currentSession = this.getCurrentSession();
        if (!currentSession) {
            currentSession = this.createNewSession();
        }
        
        currentSession.messages.push(message);
        currentSession.updatedAt = new Date();
        this.saveSessionsToStorage();
        this.renderMessage(message);
        this.scrollToBottom();
        
        // Update chat history display
        this.updateChatHistory();
    }

    private updateChatHistory(): void {
        this.chatHistory.innerHTML = '';
        
        // Sort sessions by most recent first
        const sortedSessions = [...this.state.sessions].sort((a, b) => 
            b.updatedAt.getTime() - a.updatedAt.getTime()
        );

        sortedSessions.forEach(session => {
            const historyItem = document.createElement('div');
            historyItem.className = `p-3 rounded-lg cursor-pointer transition-colors ${
                session.id === this.state.currentSessionId 
                    ? 'bg-zinc-200 dark:bg-zinc-600 border-l-4 border-zinc-500' 
                    : 'bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-600'
            }`;
            
            // Get topic name or first user message preview
            const topicName = this.getSessionTopicName(session);
            const timeStr = this.formatTime(session.updatedAt);
            const messageCount = session.messages.length;
            
            historyItem.innerHTML = `
                <div class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">${this.escapeHtml(topicName)}</div>
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex justify-between">
                    <span>${timeStr}</span>
                    <span>${messageCount} messages</span>
                </div>
            `;

            // Add click handler to load this conversation
            historyItem.addEventListener('click', () => {
                this.loadChatSession(session.id);
            });

            this.chatHistory.appendChild(historyItem);
        });
    }

    private getSessionTopicName(session: ChatSession): string {
        // Return custom name if set
        if (session.name) {
            return session.name;
        }
        
        // Find first user message and use first 30 characters
        const firstUserMessage = session.messages.find(msg => msg.sender === 'user');
        if (firstUserMessage) {
            return firstUserMessage.text.length > 30 
                ? firstUserMessage.text.substring(0, 30) + '...' 
                : firstUserMessage.text;
        }
        
        return 'New Chat';
    }

    private loadChatSession(sessionId: string): void {
        const session = this.state.sessions.find(s => s.id === sessionId);
        if (!session) return;

        // Set as current session
        this.state.currentSessionId = sessionId;
        this.saveSessionsToStorage();

        // Clear current messages display
        this.messagesContainer.innerHTML = '';

        // Render all messages from the session
        session.messages.forEach(message => {
            this.renderMessage(message);
        });

        this.scrollToBottom();
        this.updateChatHistory(); // Refresh to show current session highlight
        
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            this.closeSidebar();
        }
    }

    private startNewChat(): void {
        this.createNewSession();
        this.messagesContainer.innerHTML = '';
        this.updateChatHistory();
    }

    private renderMessage(message: Message): void {
        const messageElement = document.createElement('div');
        messageElement.className = `message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`;
        messageElement.innerHTML = `
      <div class="flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.sender === 'user'
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
      <div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-zinc-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    `;

        this.messagesContainer.appendChild(typingElement);
        
        // Scroll this typing indicator into view
        setTimeout(() => {
            typingElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    }

    private hideTypingIndicator(): void {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    private scrollToBottom(): void {
    // Get the messages area container that has overflow-y-auto
        const messagesArea = document.getElementById('messages-area');
        if (messagesArea) {
            // Use requestAnimationFrame for smooth scrolling after DOM updates
            requestAnimationFrame(() => {
                messagesArea.scrollTop = messagesArea.scrollHeight + 100; // Extra padding
                // Also try scrollIntoView as backup
                const lastMessage = this.messagesContainer.lastElementChild;
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            });
        }
    }

    private formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private toggleSidebar(): void {
        const isOpen = this.sidebar.classList.contains('translate-x-0');
        
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    private openSidebar(): void {
        console.log('Opening sidebar...');
        this.sidebar.classList.remove('-translate-x-full');
        this.sidebar.classList.add('translate-x-0');
        // Add margin to push main content and input area to the right
        this.mainContent.classList.add('ml-64');
        this.inputArea.classList.add('ml-64');
        console.log('Sidebar classes:', this.sidebar.className);
    }

    private closeSidebar(): void {
        console.log('Closing sidebar...');
        this.sidebar.classList.remove('translate-x-0');
        this.sidebar.classList.add('-translate-x-full');
        this.mainContent.classList.remove('ml-64');
        this.inputArea.classList.remove('ml-64');
    }
}

// Initialize the chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});
