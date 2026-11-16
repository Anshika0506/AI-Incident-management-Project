export const INITIAL_MOCK_INCIDENTS = [
  {
    id: 1,
    title: 'Payment Gateway Timeout Outage (HTTP 504)',
    description: 'Users experiencing persistent 504 Gateway Timeout on checkout page during peak transaction window.',
    severity: 'CRITICAL',
    status: 'OPEN',
    rootCause: 'HikariCP database connection pool exhausted on payment-db-primary. Max pool size (20) saturated due to slow unindexed query on transaction_ledger table.',
    suggestedPlaybook: '1. Scale Hikari connection pool size from 20 to 50 via spring.datasource.hikari.maximum-pool-size=50.\n2. Terminate long-running lock queries using pg_terminate_backend / kill query.\n3. Add missing composite index on transaction_ledger (user_id, status, created_at).\n4. Restart payment-service instances in rolling deployment.',
    confidenceScore: '94%',
    createdAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Auth Service JWT Validation Spike (HTTP 401)',
    description: 'Elevated rate of 401 Unauthorized responses across all microservices following cache cluster failover.',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    rootCause: 'Redis Master-Replica split-brain prevented session token cache sync. Token validation falling back to cold database lookups causing timeout cascading.',
    suggestedPlaybook: '1. Force Redis Sentinel failover reconciliation.\n2. Invalidate corrupted token cache keys via FLUSHDB on node-replica-02.\n3. Verify auth-service reconnection to active Redis master.',
    confidenceScore: '89%',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Order Processing Kafka Consumer Lag Accumulation',
    description: 'Kafka partition lag on topic order.events exceeded 150,000 records. Delivery notifications delayed by 25 minutes.',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    rootCause: 'Deadlock in inventory-reservation consumer group caused by duplicate order IDs emitted during retry storm.',
    suggestedPlaybook: '1. Increase consumer concurrency from 4 to 16.\n2. Enable idempotent consumer processing with deduplication cache in Redis.\n3. Replay dead letter queue (DLQ) messages with exponential backoff.',
    confidenceScore: '96%',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_MOCK_LOGS = {
  1: [
    {
      id: 101,
      incidentId: 1,
      logLevel: 'ERROR',
      sourceService: 'payment-service',
      message: 'Connection to MySQL DB timed out after 30000ms. HikariPool-1 exhausted. Active connections: 20/20.',
      stackTrace: 'java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:100)\n  at org.hibernate.engine.jdbc.connections.internal.DatasourceConnectionProviderImpl.getConnection(DatasourceConnectionProviderImpl.java:122)',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
    {
      id: 102,
      incidentId: 1,
      logLevel: 'FATAL',
      sourceService: 'checkout-api-gateway',
      message: 'HTTP 504 Gateway Timeout returned to client for POST /api/v2/orders/checkout. Upstream payment-service unresponsive.',
      stackTrace: 'org.springframework.web.reactive.function.client.WebClientRequestException: Request to http://payment-service:8080/charge failed: Connection reset by peer',
      timestamp: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
    },
    {
      id: 103,
      incidentId: 1,
      logLevel: 'WARN',
      sourceService: 'monitoring-agent',
      message: 'CircuitBreaker [PaymentClient] status changed from CLOSED to OPEN. Error rate threshold exceeded: 82% failures in last 60s.',
      stackTrace: null,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  2: [
    {
      id: 201,
      incidentId: 2,
      logLevel: 'ERROR',
      sourceService: 'auth-service',
      message: 'RedisConnectionFailureException: Unable to connect to redis-cluster-node-1:6379. Read timed out.',
      stackTrace: 'io.lettuce.core.RedisCommandTimeoutException: Command timed out after 500ms',
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
  ],
  3: [
    {
      id: 301,
      incidentId: 3,
      logLevel: 'WARN',
      sourceService: 'inventory-worker',
      message: 'Kafka consumer partition lag high: Topic order.events, Partition 2 lag = 48,291 records.',
      stackTrace: null,
      timestamp: new Date(Date.now() - 280 * 60 * 1000).toISOString(),
    },
  ]
};

// Preset scenarios for the Quick Log Injector
export const SAMPLE_LOG_PRESETS = [
  {
    label: 'DB Connection Pool Exhaustion (HikariCP)',
    logLevel: 'ERROR',
    sourceService: 'order-service',
    message: 'HikariPool-1 - Connection is not available, request timed out after 30000ms. Active: 20/20, Pending: 87',
    stackTrace: 'java.sql.SQLTransientConnectionException: Connection is not available\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at org.springframework.orm.jpa.vendor.HibernateJpaDialect.beginTransaction(HibernateJpaDialect.java:181)',
  },
  {
    label: 'Redis Cache Cluster Split-Brain / Timeout',
    logLevel: 'FATAL',
    sourceService: 'session-cache',
    message: 'RedisCommandTimeoutException: Command GET session:token:9f8a timed out after 1000ms. Cluster state: FAIL',
    stackTrace: 'io.lettuce.core.RedisCommandTimeoutException: Command timed out after 1000ms\n  at io.lettuce.core.ExceptionFactory.createTimeoutException(ExceptionFactory.java:51)',
  },
  {
    label: 'Out of Memory / GC Pause Spikes',
    logLevel: 'FATAL',
    sourceService: 'analytics-engine',
    message: 'java.lang.OutOfMemoryError: Java heap space. Concurrent GC failed to reclaim sufficient memory in 3 consecutive cycles.',
    stackTrace: 'java.lang.OutOfMemoryError: Java heap space\n  at java.base/java.util.Arrays.copyOf(Arrays.java:3537)\n  at java.base/java.io.ByteArrayOutputStream.grow(ByteArrayOutputStream.java:115)',
  },
  {
    label: 'Third-party Payment Gateway 502 Bad Gateway',
    logLevel: 'ERROR',
    sourceService: 'stripe-client',
    message: 'Failed to complete charge request. Upstream returned HTTP 502 Bad Gateway with Cloudflare error code 522.',
    stackTrace: 'feign.FeignException$BadGateway: [502 Bad Gateway] during [POST] to [https://api.stripe.com/v1/charges]',
  },
];
