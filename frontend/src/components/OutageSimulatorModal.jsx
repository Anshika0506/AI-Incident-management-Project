import React from 'react';
import { 
  X, 
  Zap, 
  Database, 
  Cpu, 
  Layers, 
  Flame, 
  ArrowRight
} from 'lucide-react';

export const OUTAGE_SCENARIOS = [
  {
    id: 'hikaricp',
    title: 'HikariCP DB Connection Pool Starvation',
    service: 'payment-service',
    severity: 'CRITICAL',
    description: 'Connection pool exhausted (max 20 reached) due to unindexed query locks on transaction_ledger.',
    rootCause: 'HikariCP database connection pool exhausted on payment-db-primary. Max pool size (20) saturated due to slow unindexed query on transaction_ledger table.',
    suggestedPlaybook: '1. Scale Hikari connection pool size from 20 to 50 via spring.datasource.hikari.maximum-pool-size=50 in application.properties.\n2. Terminate long-running lock queries using pg_terminate_backend / kill query.\n3. Add composite index on transaction_ledger (user_id, status, created_at).\n4. Restart payment-service instances in rolling deployment.',
    confidenceScore: '94%',
    icon: Database,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
    sampleLog: 'Connection to MySQL DB timed out after 30000ms. HikariPool-1 exhausted. Active connections: 20/20.',
  },
  {
    id: 'redis',
    title: 'Redis Cluster Split-Brain Token Outage',
    service: 'auth-service',
    severity: 'HIGH',
    description: 'Master-replica split-brain causing 401 Unauthorized errors as token validation falls back to cold DB.',
    rootCause: 'Redis Master-Replica split-brain prevented session token cache sync. Token validation falling back to cold database lookups causing timeout cascading.',
    suggestedPlaybook: '1. Force Redis Sentinel failover reconciliation.\n2. Invalidate corrupted token cache keys via FLUSHDB on node-replica-02.\n3. Verify auth-service reconnection to active Redis master.',
    confidenceScore: '89%',
    icon: Cpu,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    sampleLog: 'RedisConnectionFailureException: Unable to connect to redis-cluster-node-1:6379. Read timed out.',
  },
  {
    id: 'kafka',
    title: 'Kafka Consumer Partition Lag Overload',
    service: 'order-service',
    severity: 'MEDIUM',
    description: 'Partition lag on topic order.events exceeded 150k records; order delivery notifications delayed 25m.',
    rootCause: 'Deadlock in inventory-reservation consumer group caused by duplicate order IDs emitted during retry storm.',
    suggestedPlaybook: '1. Increase consumer concurrency from 4 to 16.\n2. Enable idempotent consumer processing with deduplication cache in Redis.\n3. Replay dead letter queue (DLQ) messages with exponential backoff.',
    confidenceScore: '96%',
    icon: Layers,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    sampleLog: 'KafkaConsumerException: CommitFailedException: The consumer was assigned partitions but poll timed out after 30000ms.',
  },
  {
    id: 'oom',
    title: 'JVM Heap Exhaustion & Stop-The-World GC',
    service: 'catalog-service',
    severity: 'CRITICAL',
    description: 'OutOfMemoryError: Java heap space during batch PDF generation causing Kubernetes liveness probe drops.',
    rootCause: 'Memory leak in PDF invoice generator holding uncollected byte buffers in JVM Old Gen space. Major GC paused threads for 14.2s.',
    suggestedPlaybook: '1. Increase container JVM memory limit: -Xmx2g to -Xmx4g.\n2. Stream PDF byte arrays directly to S3 without holding full file in memory buffer.\n3. Trigger rolling restart of catalog-service deployment.',
    confidenceScore: '92%',
    icon: Flame,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
    sampleLog: 'java.lang.OutOfMemoryError: Java heap space. ConcurrentMarkSweep GC unable to reclaim OldGen memory.',
  },
];

export default function OutageSimulatorModal({ isOpen, onClose, onInjectScenario }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                Inject Production Outage Scenario
              </h3>
              <p className="text-xs text-slate-500">
                Simulate microservice failure telemetry and verify RAG root cause diagnosis
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 space-y-3 max-h-[520px] overflow-y-auto">
          {OUTAGE_SCENARIOS.map((sc) => {
            const Icon = sc.icon;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onInjectScenario(sc);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition-all cursor-pointer group shadow-2xs flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-lg border flex-shrink-0 mt-0.5 ${sc.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {sc.title}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                        {sc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {sc.description}
                    </p>
                    <div className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 line-clamp-1">
                      &gt; {sc.sampleLog}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap self-center">
                  <span>Inject</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          Scenarios populate both active incidents and associated error logs into Spring Boot & RAM Cache.
        </div>

      </div>
    </div>
  );
}
