import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Agent, AgentDocument } from "../schemas/agent.schema";

export interface LogEntry {
  matchId: string;
  agentId?: string;
  level: "info" | "warn" | "error" | "debug";
  category:
    | "match_setup"
    | "live_tracking"
    | "data_validation"
    | "post_match"
    | "admin_command"
    | "error_handling"
    | "status_report";
  message: string;
  data?: any;
  timestamp: Date;
  userId?: string;
}

export interface StatusReport {
  matchId: string;
  agentId: string;
  timestamp: Date;
  matchStatus: string;
  agentStatus: string;
  uptime: number;
  stats: {
    processedBalls: number;
    oddsUpdates: number;
    alertsGenerated: number;
    validationErrors: number;
    retryCount: number;
  };
  validationErrors: string[];
  performance: {
    avgResponseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

@Injectable()
export class AgentLoggingService {
  private readonly logger = new Logger(AgentLoggingService.name);
  private readonly logBuffer: LogEntry[] = [];
  private readonly bufferSize = 100;
  private readonly flushInterval = 30000; // 30 seconds

  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>
  ) {
    // Set up periodic log flushing
    setInterval(() => {
      this.flushLogBuffer();
    }, this.flushInterval);
  }

  async log(entry: Omit<LogEntry, "timestamp">): Promise<void> {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    // Add to buffer
    this.logBuffer.push(logEntry);

    // Log to console for immediate visibility
    this.logToConsole(logEntry);

    // Flush buffer if it's full
    if (this.logBuffer.length >= this.bufferSize) {
      await this.flushLogBuffer();
    }
  }

  async logMatchSetup(
    matchId: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "info",
      category: "match_setup",
      message,
      data,
    });
  }

  async logLiveTracking(
    matchId: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "info",
      category: "live_tracking",
      message,
      data,
    });
  }

  async logDataValidation(
    matchId: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "warn",
      category: "data_validation",
      message,
      data,
    });
  }

  async logPostMatch(
    matchId: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "info",
      category: "post_match",
      message,
      data,
    });
  }

  async logAdminCommand(
    matchId: string,
    command: string,
    result: any,
    userId?: string
  ): Promise<void> {
    await this.log({
      matchId,
      level: "info",
      category: "admin_command",
      message: `Admin command executed: ${command}`,
      data: { command, result, userId },
      userId,
    });
  }

  async logError(matchId: string, error: Error, context?: any): Promise<void> {
    await this.log({
      matchId,
      level: "error",
      category: "error_handling",
      message: error.message,
      data: {
        error: error.stack,
        context,
      },
    });
  }

  async logStatusReport(report: StatusReport): Promise<void> {
    await this.log({
      matchId: report.matchId,
      agentId: report.agentId,
      level: "info",
      category: "status_report",
      message: "Hourly status report generated",
      data: report,
    });

    // Also log to console for immediate visibility
    this.logger.log(
      `Status Report for Match ${report.matchId}:`,
      JSON.stringify(report, null, 2)
    );
  }

  async getLogs(
    matchId: string,
    options?: {
      level?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<LogEntry[]> {
    // In a real implementation, this would query a logs collection
    // For now, return logs from the agent's stats
    const agent = await this.agentModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .exec();

    if (!agent) {
      return [];
    }

    // Return mock logs based on agent stats
    const logs: LogEntry[] = [];

    if (agent.stats?.ballsProcessed) {
      logs.push({
        matchId,
        agentId: agent._id.toString(),
        level: "info",
        category: "live_tracking",
        message: `Processed ${agent.stats.ballsProcessed} balls`,
        timestamp: agent.lastActivityAt || new Date(),
      });
    }

    if (agent.stats?.oddsUpdates) {
      logs.push({
        matchId,
        agentId: agent._id.toString(),
        level: "info",
        category: "live_tracking",
        message: `Updated odds ${agent.stats.oddsUpdates} times`,
        timestamp: agent.lastActivityAt || new Date(),
      });
    }

    if (agent.stats?.alertsGenerated) {
      logs.push({
        matchId,
        agentId: agent._id.toString(),
        level: "warn",
        category: "live_tracking",
        message: `Generated ${agent.stats.alertsGenerated} alerts`,
        timestamp: agent.lastActivityAt || new Date(),
      });
    }

    if (agent.errorMessage) {
      logs.push({
        matchId,
        agentId: agent._id.toString(),
        level: "error",
        category: "error_handling",
        message: agent.errorMessage,
        timestamp: agent.stoppedAt || new Date(),
      });
    }

    return logs;
  }

  async getStatusReports(
    matchId: string,
    hours: number = 24
  ): Promise<StatusReport[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000);

    // In a real implementation, this would query a status_reports collection
    // For now, return mock data
    const agent = await this.agentModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .exec();

    if (!agent) {
      return [];
    }

    const reports: StatusReport[] = [];
    const now = new Date();

    // Generate hourly reports for the specified period
    for (let i = 0; i < hours; i++) {
      const reportTime = new Date(now.getTime() - i * 60 * 60 * 1000);

      reports.push({
        matchId,
        agentId: agent._id.toString(),
        timestamp: reportTime,
        matchStatus: agent.status,
        agentStatus: agent.status,
        uptime: agent.startedAt
          ? reportTime.getTime() - agent.startedAt.getTime()
          : 0,
        stats: {
          processedBalls: agent.stats?.ballsProcessed || 0,
          oddsUpdates: agent.stats?.oddsUpdates || 0,
          alertsGenerated: agent.stats?.alertsGenerated || 0,
          validationErrors: 0,
          retryCount: 0,
        },
        validationErrors: [],
        performance: {
          avgResponseTime: 150,
          memoryUsage: 45.2,
          cpuUsage: 12.8,
        },
      });
    }

    return reports.reverse();
  }

  async generateAuditTrail(matchId: string): Promise<any> {
    const agent = await this.agentModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .exec();

    if (!agent) {
      return { error: "Agent not found" };
    }

    const logs = await this.getLogs(matchId);
    const statusReports = await this.getStatusReports(matchId);

    const auditTrail = {
      matchId,
      agentId: agent._id.toString(),
      agentStatus: agent.status,
      startTime: agent.startedAt,
      endTime: agent.stoppedAt,
      totalUptime:
        agent.startedAt && agent.stoppedAt
          ? agent.stoppedAt.getTime() - agent.startedAt.getTime()
          : agent.startedAt
          ? new Date().getTime() - agent.startedAt.getTime()
          : 0,
      stats: agent.stats,
      config: agent.config,
      logs: logs.length,
      statusReports: statusReports.length,
      errorCount: logs.filter((log) => log.level === "error").length,
      warningCount: logs.filter((log) => log.level === "warn").length,
      infoCount: logs.filter((log) => log.level === "info").length,
      lastActivity: agent.lastActivityAt,
      errorMessage: agent.errorMessage,
    };

    return auditTrail;
  }

  async exportLogs(
    matchId: string,
    format: "json" | "csv" = "json"
  ): Promise<string> {
    const logs = await this.getLogs(matchId);
    const statusReports = await this.getStatusReports(matchId);
    const auditTrail = await this.generateAuditTrail(matchId);

    const exportData = {
      matchId,
      exportDate: new Date(),
      logs,
      statusReports,
      auditTrail,
    };

    if (format === "csv") {
      return this.convertToCSV(exportData);
    }

    return JSON.stringify(exportData, null, 2);
  }

  private async flushLogBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    try {
      // In a real implementation, this would save logs to a database
      // For now, just clear the buffer
      this.logBuffer.length = 0;
      this.logger.debug("Log buffer flushed");
    } catch (error) {
      this.logger.error("Failed to flush log buffer:", error);
    }
  }

  private logToConsole(logEntry: LogEntry): void {
    const { level, category, message, data } = logEntry;
    const logMessage = `[${category.toUpperCase()}] ${message}`;

    switch (level) {
      case "error":
        this.logger.error(logMessage, data);
        break;
      case "warn":
        this.logger.warn(logMessage, data);
        break;
      case "debug":
        this.logger.debug(logMessage, data);
        break;
      default:
        this.logger.log(logMessage, data);
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion for logs
    const headers = ["timestamp", "level", "category", "message", "data"];
    const csvRows = [headers.join(",")];

    for (const log of data.logs) {
      const row = [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        `"${JSON.stringify(log.data || {}).replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    }

    return csvRows.join("\n");
  }

  // Performance monitoring methods
  async logPerformance(
    matchId: string,
    metrics: {
      responseTime: number;
      memoryUsage: number;
      cpuUsage: number;
    }
  ): Promise<void> {
    await this.log({
      matchId,
      level: "debug",
      category: "live_tracking",
      message: "Performance metrics recorded",
      data: metrics,
    });
  }

  async logValidationError(
    matchId: string,
    error: string,
    details?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "warn",
      category: "data_validation",
      message: `Data validation error: ${error}`,
      data: details,
    });
  }

  async logRetryAttempt(
    matchId: string,
    attempt: number,
    maxAttempts: number,
    error: string
  ): Promise<void> {
    await this.log({
      matchId,
      level: "warn",
      category: "error_handling",
      message: `Retry attempt ${attempt}/${maxAttempts}`,
      data: { error, attempt, maxAttempts },
    });
  }

  async logMatchLifecycle(
    matchId: string,
    event: string,
    data?: any
  ): Promise<void> {
    await this.log({
      matchId,
      level: "info",
      category: "live_tracking",
      message: `Match lifecycle event: ${event}`,
      data,
    });
  }
}
