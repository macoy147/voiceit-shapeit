import logger from '../utils/logger.js';

class RealtimeNotificationService {
  constructor() {
    this.connections = new Map();
  }

  sendEvent(res, event, payload) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }

  removeConnection(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    clearInterval(connection.heartbeatInterval);
    this.connections.delete(connectionId);

    logger.info('Admin notification stream disconnected', {
      connectionId,
      adminLabel: connection.adminLabel,
      activeConnections: this.connections.size
    });
  }

  subscribeAdmin(req, res) {
    const adminLabel = req.adminInfo?.label || req.session?.admin?.label || 'Unknown Admin';
    const connectionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    const heartbeatInterval = setInterval(() => {
      try {
        this.sendEvent(res, 'heartbeat', { at: new Date().toISOString() });
      } catch (error) {
        this.removeConnection(connectionId);
      }
    }, 25000);

    this.connections.set(connectionId, {
      res,
      adminLabel,
      heartbeatInterval
    });

    this.sendEvent(res, 'connected', {
      connectionId,
      adminLabel,
      at: new Date().toISOString()
    });

    logger.info('Admin notification stream connected', {
      connectionId,
      adminLabel,
      activeConnections: this.connections.size
    });

    const cleanup = () => {
      this.removeConnection(connectionId);
    };

    req.on('close', cleanup);
    req.on('error', cleanup);
    res.on('close', cleanup);
  }

  broadcastNewSuggestion(suggestion) {
    if (this.connections.size === 0) return;

    const payload = {
      type: 'new_suggestion',
      suggestion,
      at: new Date().toISOString()
    };

    const failedConnectionIds = [];

    for (const [connectionId, connection] of this.connections.entries()) {
      try {
        this.sendEvent(connection.res, 'new_suggestion', payload);
      } catch (error) {
        failedConnectionIds.push(connectionId);
      }
    }

    for (const connectionId of failedConnectionIds) {
      this.removeConnection(connectionId);
    }

    logger.info('Broadcasted new suggestion notification to admins', {
      trackingCode: suggestion.trackingCode,
      recipients: this.connections.size
    });
  }
}

export default new RealtimeNotificationService();
