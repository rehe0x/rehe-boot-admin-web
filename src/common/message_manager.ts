type Listener<T = any> = (message: T) => void;

class MessageManager {
    private listeners: Record<string, Listener[]> = {};

    // 订阅消息
    subscribe<T>(type: string, listener: Listener<T>): void {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }

    // 取消订阅
    unsubscribe<T>(type: string, listener: Listener<T>): void {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(l => l !== listener);
    }

    // 发布消息
    publish<T>(type: string, message: T): void {
        if (!this.listeners[type]) return;
        this.listeners[type].forEach(listener => listener(message));
    }
}

// 单例模式
const messageManager = new MessageManager();
export default messageManager;