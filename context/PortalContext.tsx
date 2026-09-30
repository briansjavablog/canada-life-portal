import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Customer,
  NextBestAction,
  Notification,
  Policy,
  Projection,
  ProjectionRequest,
  ProjectionScenarioId,
} from '@/models';
import { config, type DataSource } from '@/services/config';
import { createRepositories } from '@/services/repositories/createRepositories';
import { presentLocalNotification } from '@/services/notifications/presentLocalNotification';
import type { LocalNotificationResult } from '@/services/notifications/presentLocalNotification';
import { findScenario } from '@/data/scenarios';

type Banner = {
  title: string;
  body: string;
  href: string;
};

type PortalContextValue = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  customer: Customer | null;
  policies: Policy[];
  notifications: Notification[];
  actions: NextBestAction[];
  retirementProjection: Projection | null;
  scenarioId: ProjectionScenarioId;
  setScenario: (id: ProjectionScenarioId) => void;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  unreadCount: number;
  banner: Banner | null;
  dismissBanner: () => void;
  markNotificationRead: (id: string) => void;
  triggerDemoNotification: (input: {
    title: string;
    body: string;
    href: string;
    kind: Notification['kind'];
  }) => Promise<LocalNotificationResult>;
  resetDemo: () => void;
  reload: () => void;
  project: (request: ProjectionRequest) => Promise<Projection>;
};

const PortalContext = createContext<PortalContextValue | null>(null);

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong while loading your policies.';
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState<PortalContextValue['status']>('idle');
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [baseNotifications, setBaseNotifications] = useState<Notification[]>([]);
  const [extraNotifications, setExtraNotifications] = useState<Notification[]>([]);
  const [actions, setActions] = useState<NextBestAction[]>([]);
  const [retirementProjection, setRetirementProjection] = useState<Projection | null>(null);
  const [scenarioId, setScenarioId] = useState<ProjectionScenarioId>('balanced');
  const [dataSource, setDataSourceState] = useState<DataSource>(config.dataSource);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(async (source: DataSource, scenario: ProjectionScenarioId) => {
    setStatus('loading');
    setError(null);
    try {
      const repos = createRepositories(source);
      const nextCustomer = await repos.customers.getCurrentCustomer();
      const nextPolicies = await repos.policies.listPolicies(nextCustomer.id);
      const nextNotifications = await repos.notifications.list(nextCustomer.id);
      const nextScenario = await repos.projections.getScenario(scenario);
      const retirement = nextPolicies.find((policy) => policy.supportsProjection && policy.monthlyContribution != null);
      const projection = retirement
        ? await repos.projections.project({
            currentValue: retirement.currentValue,
            monthlyContribution: retirement.monthlyContribution ?? 0,
            currentAge: nextCustomer.age,
            retirementAge: nextCustomer.retirementAge,
            annualGrowthRate: nextScenario.annualGrowthRate,
          })
        : null;
      const nextActions = await repos.actions.list(nextCustomer.id, nextScenario);

      setCustomer(nextCustomer);
      setPolicies(nextPolicies);
      setBaseNotifications(nextNotifications);
      setExtraNotifications([]);
      setActions(nextActions);
      setRetirementProjection(projection);
      setStatus('ready');
    } catch (caught) {
      setStatus('error');
      setError(errorMessage(caught));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus('idle');
      return;
    }
    void load(dataSource, scenarioId);
  }, [isAuthenticated, dataSource, reloadToken, load]);

  const refreshOutlook = useCallback(
    async (scenario: ProjectionScenarioId) => {
      if (!customer) return;
      try {
        const repos = createRepositories(dataSource);
        const nextScenario = await repos.projections.getScenario(scenario);
        const retirement = policies.find((policy) => policy.supportsProjection && policy.monthlyContribution != null);
        const projection = retirement
          ? await repos.projections.project({
              currentValue: retirement.currentValue,
              monthlyContribution: retirement.monthlyContribution ?? 0,
              currentAge: customer.age,
              retirementAge: customer.retirementAge,
              annualGrowthRate: nextScenario.annualGrowthRate,
            })
          : null;
        const nextActions = await repos.actions.list(customer.id, nextScenario);
        setRetirementProjection(projection);
        setActions(nextActions);
        setError(null);
      } catch (caught) {
        setError(errorMessage(caught));
      }
    },
    [customer, dataSource, policies],
  );

  const setScenario = useCallback(
    (id: ProjectionScenarioId) => {
      setScenarioId(id);
      void refreshOutlook(id);
    },
    [refreshOutlook],
  );

  const notifications = useMemo(
    () => [...extraNotifications, ...baseNotifications],
    [extraNotifications, baseNotifications],
  );

  const markNotificationRead = useCallback((id: string) => {
    const mark = (items: Notification[]) => items.map((item) => (item.id === id ? { ...item, read: true } : item));
    setBaseNotifications(mark);
    setExtraNotifications(mark);
  }, []);

  const triggerDemoNotification = useCallback(
    async (input: { title: string; body: string; href: string; kind: Notification['kind'] }) => {
      const item: Notification = {
        id: `demo-${Date.now()}`,
        title: input.title,
        body: input.body,
        createdAt: new Date().toISOString(),
        read: false,
        href: input.href,
        kind: input.kind,
      };
      setExtraNotifications((current) => [item, ...current]);
      setBanner({ title: input.title, body: input.body, href: input.href });
      return presentLocalNotification(input);
    },
    [],
  );

  const project = useCallback(
    (request: ProjectionRequest) => createRepositories(dataSource).projections.project(request),
    [dataSource],
  );

  const resetDemo = useCallback(() => {
    setScenarioId('balanced');
    setDataSourceState(config.dataSource);
    setBanner(null);
    setReloadToken((value) => value + 1);
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      isAuthenticated,
      login: () => setAuthenticated(true),
      logout: () => {
        setAuthenticated(false);
        setBanner(null);
      },
      status,
      error,
      customer,
      policies,
      notifications,
      actions,
      retirementProjection,
      scenarioId,
      setScenario,
      dataSource,
      setDataSource: setDataSourceState,
      unreadCount: notifications.filter((item) => !item.read).length,
      banner,
      dismissBanner: () => setBanner(null),
      markNotificationRead,
      triggerDemoNotification,
      resetDemo,
      reload: () => setReloadToken((token) => token + 1),
      project,
    }),
    [
      isAuthenticated,
      status,
      error,
      customer,
      policies,
      notifications,
      actions,
      retirementProjection,
      scenarioId,
      setScenario,
      dataSource,
      banner,
      markNotificationRead,
      triggerDemoNotification,
      resetDemo,
      project,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal(): PortalContextValue {
  const value = useContext(PortalContext);
  if (!value) {
    throw new Error('usePortal must be used within PortalProvider');
  }
  return value;
}

export function useScenario() {
  const { scenarioId } = usePortal();
  return findScenario(scenarioId);
}
