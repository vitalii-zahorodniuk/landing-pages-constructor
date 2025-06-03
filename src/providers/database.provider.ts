import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { DatabaseStatus } from '../types/types';

@Injectable()
export class DatabaseProvider implements OnModuleInit {
  private readonly logger = new Logger(DatabaseProvider.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit(): void {
    this.setupEventListeners();
    this.logCurrentStatus();
  }

  /**
   * Retrieves the current status of the database connection.
   *
   * @return {DatabaseStatus}
   */
  getStatus(): DatabaseStatus {
    const readyState = this.connection.readyState;

    return {
      isConnected: readyState === ConnectionStates.connected,
      status: ConnectionStates[readyState] || 'unknown',
      host: this.connection.host,
      database: this.connection.name,
      readyState,
    };
  }

  /**
   * Pings the database to verify its availability.
   *
   * @return {Promise<boolean>}
   */
  async ping(): Promise<boolean> {
    try {
      if (!this.connection.db) {
        this.logger.error(
          '🏓 Database ping failed: connection.db is undefined',
        );
        return false;
      }
      await this.connection.db.admin().ping();
      this.logger.debug('🏓 Database ping successful');
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`🏓 Database ping failed: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Retrieves the current connection instance.
   * @return {Connection}
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Sets up event listeners for the MongoDB connection instance.
   *
   * @return {void}
   */
  private setupEventListeners(): void {
    this.connection.on('connected', () => {
      this.logger.log(`✅ MongoDB connected to: ${this.connection.name}`);
    });

    this.connection.on('error', (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ MongoDB connection error: ${errorMessage}`);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️  MongoDB disconnected');
    });

    this.connection.on('reconnected', () => {
      this.logger.log('🔄 MongoDB reconnected');
    });

    this.connection.on('close', () => {
      this.logger.warn('🔒 MongoDB connection closed');
    });
  }

  /**
   * Logs the current status of the database.
   *
   * @return {void}
   */
  private logCurrentStatus(): void {
    const status = this.getStatus();
    this.logger.log(
      `📊 Database status: ${status.status} (${status.readyState})`,
    );
  }
}
