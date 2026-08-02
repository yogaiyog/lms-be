"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseEvents = void 0;
const node_events_1 = require("node:events");
class SseEventBus extends node_events_1.EventEmitter {
    emit(event, data) {
        return super.emit(event, data);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    off(event, listener) {
        return super.off(event, listener);
    }
}
exports.sseEvents = new SseEventBus();
