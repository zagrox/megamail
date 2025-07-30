import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

const ELASTIC_EMAIL_API_BASE = 'https://api.elasticemail.com/v2';
const ELASTIC_EMAIL_API_V4_BASE = 'https://api.elasticemail.com/v4';

// --- Icon Components ---
const Icon = ({ path, className = '' }: { path: string; className?: string }) => (
  <svg className={`icon ${className}`} width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

const ICONS = {
    DASHBOARD: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    ACCOUNT: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    BOUNCED: "M9 10l-5 5 5 5M20 4v7a4 4 0 01-4 4H4",
    CALENDAR: "M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    CAMPAIGNS: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    CHEVRON_DOWN: "M6 9l6 6 6-6",
    CLICK: "M9 11.3l3.71 2.7-1.42 1.42a.5.5 0 01-.71 0l-1.58-1.58a1 1 0 00-1.42 0l-1.42 1.42a1 1 0 000 1.42l4.24 4.24a.5.5 0 00.71 0l7.07-7.07",
    COMPLAINT: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10zM12 9v2m0 4h.01",
    CONTACTS: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    CREDIT_CARD: "M22 8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8zM6 14h4v-2H6v2z",
    DEFAULT: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    DELETE: "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
    DOMAINS: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20",
    EMAIL_LIST: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    EYE: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    EYE_OFF: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
    KEY: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    LOGOUT: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    MAIL: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    MENU: "M3 12h18M3 6h18M3 18h18",
    PENCIL: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    PLUS: "M12 5v14m-7-7h14",
    PRICE_TAG: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7H7.01",
    PUZZLE: "M20.5 11H19v-2.14a2.5 2.5 0 0 0-2.5-2.5H14V4.5a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 6 4.5V6H3.5a2.5 2.5 0 0 0-2.5 2.5V11H2.5a2.5 2.5 0 0 1 0 5H1v2.14a2.5 2.5 0 0 0 2.5 2.5H6V23.5a2.5 2.5 0 0 0 2.5 2.5h3A2.5 2.5 0 0 0 14 23.5V22h2.5a2.5 2.5 0 0 0 2.5-2.5V17h1.5a2.5 2.5 0 0 1 0-5z",
    SEND_EMAIL: "m22 2-7 20-4-9-9-4 20-7Zm0 0L11 13 2 9l20-7Z",
    SERVER: "M23 12H1m22-6H1m0 12H1M6 6v12M18 6v12",
    STATS: "M2.9 12.9a9 9 0 0 1 12.7 0l4.4 4.4m-18.4 0 4.4-4.4a9 9 0 0 1 12.7 0M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1.7-.7-.7",
    TRENDING_UP: "M23 6l-9.5 9.5-5-5L1 18",
    USER_PLUS: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6M23 11h-6",
    VERIFY: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
};

// --- API Helper for v2 ---
const apiFetch = async (endpoint: string, apiKey: string, options: { method?: 'GET' | 'POST', params?: Record<string, any> } = {}) => {
  const { method = 'GET', params = {} } = options;
  
  const allParams = new URLSearchParams({
    apikey: apiKey,
    ...params
  });

  const url = `${ELASTIC_EMAIL_API_BASE}${endpoint}`;
  let response;

  if (method === 'POST') {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: allParams
    });
  } else { // GET
    response = await fetch(`${url}?${allParams.toString()}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data.data;
};

// --- API Helper for v4 ---
const apiFetchV4 = async (endpoint: string, apiKey: string, options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: Record<string, any>, body?: any } = {}) => {
    const { method = 'GET', params = {}, body = null } = options;
    const queryParams = new URLSearchParams(params).toString();
    const url = `${ELASTIC_EMAIL_API_V4_BASE}${endpoint}${queryParams ? `?${queryParams}` : ''}`;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'X-ElasticEmail-ApiKey': apiKey,
        }
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.Error || 'An unknown API error occurred.';
        } catch (e) {
            // response was not json, use default message
        }
        throw new Error(errorMessage);
    }
    
    if (response.status === 204) { // Handle No Content for DELETE
        return {};
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
};


// --- Custom Hook for API calls (v2) ---
const useApi = (endpoint, apiKey, params = {}, refetchIndex = 0) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (!apiKey || !endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFetch(endpoint, apiKey, { params: JSON.parse(paramsString) });
        setData(result);
      } catch (err) {
        setError({message: err.message, endpoint});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, apiKey, paramsString, refetchIndex]);

  return { data, loading, error };
};

// --- Custom Hook for API calls (v4) ---
const useApiV4 = (endpoint, apiKey, params = {}, refetchIndex = 0) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (!apiKey || !endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFetchV4(endpoint, apiKey, { params: JSON.parse(paramsString) });
        setData(result);
      } catch (err) {
        setError({ message: err.message, endpoint });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, apiKey, paramsString, refetchIndex]);

  return { data, loading, error };
};

// --- Reusable Components ---
const Loader = () => <div className="loader"></div>;

const ActionStatus = ({ status }) => {
    if (!status?.message) return null;
    return (
        <div className={`action-status ${status.type}`}>
            {status.message}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};


const ErrorMessage = ({ error }) => (
  <div className="error-message">
    <strong>API Error on <code>{error.endpoint}</code>:</strong> {error.message}
  </div>
);

const CenteredMessage = ({ children }: { children?: ReactNode }) => (
    <div className="centered-container" style={{height: '200px'}}>
        {children}
    </div>
);

const Badge = ({ text, type = 'default' }) => (
    <span className={`badge badge-${type}`}>{text}</span>
);

const AccountDataCard = ({ iconPath, title, children }: { iconPath: string; title: string; children?: ReactNode }) => (
    <div className="card account-card">
        <div className="card-icon-wrapper">
            <Icon path={iconPath} />
        </div>
        <div className="card-details">
            <div className="card-title">{title}</div>
            <div className="card-content">{children}</div>
        </div>
    </div>
);

// --- Helper Functions ---
const getPastDateByDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
const getPastDateByMonths = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
};
const formatDateForApiV4 = (date) => {
    return date.toISOString().slice(0, 19);
};
const getPastDateByYears = (years) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
};

// --- View Components ---

const StatisticsView = ({ apiKey }) => {
    const [duration, setDuration] = useState('3months');

    const durationOptions = {
        '7days': { label: 'Last 7 days', from: () => getPastDateByDays(7) },
        '14days': { label: 'Last 14 days', from: () => getPastDateByDays(14) },
        '30days': { label: 'Last 30 days', from: () => getPastDateByDays(30) },
        '3months': { label: 'Last 3 months', from: () => getPastDateByMonths(3) },
        '6months': { label: 'Last 6 months', from: () => getPastDateByMonths(6) },
        '1year': { label: 'Last year', from: () => getPastDateByYears(1) },
    };

    const apiParams = {
        from: formatDateForApiV4(durationOptions[duration].from()),
    };
    const { data: stats, loading, error } = useApiV4(`/statistics`, apiKey, apiParams);
    
    const filterControl = (
        <div className="view-controls">
            <label htmlFor="duration-select">Date Range:</label>
            <select id="duration-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {Object.entries(durationOptions).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
    );

    if (error) return (
        <>
            {filterControl}
            <ErrorMessage error={error} />
        </>
    );

    return (
        <>
            {filterControl}
            {loading ? (
                <CenteredMessage><Loader /></CenteredMessage>
            ) : (!stats || Object.keys(stats).length === 0) ? (
                <CenteredMessage>No statistics data found for the {durationOptions[duration].label.toLowerCase()}.</CenteredMessage>
            ) : (
                <div className="card-grid account-grid">
                    <AccountDataCard title="Total Emails" iconPath={ICONS.MAIL}>
                        {stats.EmailTotal?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Recipients" iconPath={ICONS.CONTACTS}>
                        {stats.Recipients?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Delivered" iconPath={ICONS.VERIFY}>
                        {stats.Delivered?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Opened" iconPath={ICONS.EYE}>
                        {stats.Opened?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Clicked" iconPath={ICONS.CLICK}>
                        {stats.Clicked?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Unsubscribed" iconPath={ICONS.LOGOUT}>
                        {stats.Unsubscribed?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Complaints" iconPath={ICONS.COMPLAINT}>
                        {stats.Complaints?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                     <AccountDataCard title="Bounced" iconPath={ICONS.BOUNCED}>
                        {stats.Bounced?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                </div>
            )}
        </>
    );
};

const AccountView = ({ apiKey }) => {
  const { data, loading, error } = useApi('/account/load', apiKey);

  if (loading) return <CenteredMessage><Loader /></CenteredMessage>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <CenteredMessage>No account data found.</CenteredMessage>;
    
  const getStatusType = (status) => {
    const cleanStatus = String(status || '').toLowerCase().replace(/\s/g, '');
    if (cleanStatus.includes('active')) return 'success';
    if (cleanStatus.includes('disabled') || cleanStatus.includes('abuse')) return 'danger';
    if (cleanStatus.includes('review') || cleanStatus.includes('verification')) return 'warning';
    return 'default';
  }
  
  const getReputationInfo = (reputation) => {
      const score = Number(reputation || 0);
      if (score >= 80) return { text: 'Excellent', className: 'good' };
      if (score >= 60) return { text: 'Good', className: 'good' };
      if (score >= 40) return { text: 'Average', className: 'medium' };
      if (score >= 20) return { text: 'Poor', className: 'bad' };
      return { text: 'Very Poor', className: 'bad' };
  };

  const reputation = getReputationInfo(data.reputation);

  return (
    <div className="card-grid account-grid">
        <AccountDataCard title="Email" iconPath={ICONS.MAIL}>
            {data.email}
        </AccountDataCard>
        <AccountDataCard title="Account Status" iconPath={ICONS.VERIFY}>
            <Badge text={data.status} type={getStatusType(data.status)} />
        </AccountDataCard>
        <AccountDataCard title="Reputation" iconPath={ICONS.TRENDING_UP}>
            <span className={`reputation-score ${reputation.className}`}>{data.reputation}%</span>
            <span className="reputation-text">{reputation.text}</span>
        </AccountDataCard>
        <AccountDataCard title="Daily Send Limit" iconPath={ICONS.SEND_EMAIL}>
            {data.dailysendlimit.toLocaleString()}
        </AccountDataCard>
        <AccountDataCard title="Subaccounts" iconPath={ICONS.CONTACTS}>
            {data.subaccountcount?.toLocaleString() ?? '0'}
        </AccountDataCard>
        <AccountDataCard title="API Key" iconPath={ICONS.KEY}>
            <span className="small-text">{apiKey}</span>
        </AccountDataCard>
    </div>
  );
};

const PURCHASE_WEBHOOK_URL = 'https://auto.zagrox.com/webhook-test/emailpack'; // As requested, URL is here for easy changes.

const creditPackages = [
    { credits: 10000, price: 500000 }, { credits: 20000, price: 950000 },
    { credits: 30000, price: 1350000 }, { credits: 40000, price: 1700000 },
    { credits: 50000, price: 2000000, popular: true }, { credits: 60000, price: 2340000 },
    { credits: 70000, price: 2660000 }, { credits: 80000, price: 2960000 },
    { credits: 100000, price: 3500000 }, { credits: 125000, price: 4250000 },
    { credits: 150000, price: 5000000 }, { credits: 200000, price: 6000000 },
];

const BuyCreditsView = ({ apiKey, user }) => {
    const [isSubmitting, setIsSubmitting] = useState(null); // track which package is submitting
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

    const handlePurchase = async (pkg) => {
        if (!user || !user.email) {
            setModalState({ isOpen: true, title: 'Error', message: 'User information is not available. Cannot proceed with purchase.' });
            return;
        }

        setIsSubmitting(pkg.credits);

        try {
            const response = await fetch(PURCHASE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userapikey: apiKey,
                    useremail: user.email,
                    amount: pkg.credits,
                    totalprice: pkg.price,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Webhook failed with status: ${response.status}. ${errorText}`);
            }

            setModalState({
                isOpen: true,
                title: 'Purchase Initiated',
                message: `You have selected the ${pkg.credits.toLocaleString()} credit package. You will be redirected to complete your payment.`
            });

        } catch (error) {
            console.error('Purchase webhook error:', error);
            setModalState({
                isOpen: true,
                title: 'Purchase Failed',
                message: `There was an error processing your request. Please try again later. (Error: ${error.message})`
            });
        } finally {
            setIsSubmitting(null);
        }
    };
    
    const closeModal = () => setModalState({ isOpen: false, title: '', message: '' });

    return (
        <div className="buy-credits-view">
            <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.title}>
                <p style={{whiteSpace: "pre-wrap"}}>{modalState.message}</p>
                 {modalState.title === 'Purchase Initiated' && (
                    <small style={{display: 'block', marginTop: '1rem', color: 'var(--subtle-text-color)'}}>
                        This is a test environment. No real payment will be processed.
                    </small>
                )}
            </Modal>
            <div className="packages-grid">
                {creditPackages.map((pkg) => (
                    <div key={pkg.credits} className={`card package-card ${pkg.popular ? 'popular' : ''}`}>
                        {pkg.popular && <div className="popular-badge">Most Popular</div>}
                        <div className="package-card-header">
                            <h3>{pkg.credits.toLocaleString()}</h3>
                            <span>Email Credits</span>
                        </div>
                        <div className="package-card-body">
                            <div className="package-price">
                                {pkg.price.toLocaleString()}
                                <span> IRT</span>
                            </div>
                        </div>
                        <div className="package-card-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePurchase(pkg)}
                                disabled={isSubmitting !== null}
                            >
                                {isSubmitting === pkg.credits ? <Loader /> : 'Purchase Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="webhook-info">
                <p>
                    <strong>Developer Note:</strong> To change the purchase webhook URL, edit the <code>PURCHASE_WEBHOOK_URL</code> constant at the top of the <code>BuyCreditsView</code> component in <code>index.tsx</code>.
                </p>
            </div>
        </div>
    );
};


const PlaceholderView = ({ name }) => (
    <CenteredMessage>
        <div className="info-message">
            <strong>Content Unavailable</strong>
            <p>The view for '{name}' is not yet implemented in this version.</p>
        </div>
    </CenteredMessage>
);

const DashboardView = ({ setView, apiKey, user }) => {
    const { data: statsData, loading: statsLoading, error: statsError } = useApiV4(`/statistics`, apiKey, { from: formatDateForApiV4(getPastDateByDays(30)) });

    const navItems = [
        { name: 'Statistics', icon: ICONS.STATS, desc: 'View detailed sending statistics and analytics.', view: 'Statistics' },
        { name: 'Contacts', icon: ICONS.CONTACTS, desc: 'Manage your contacts, lists, and segments.', view: 'Contacts' },
        { name: 'Send Email', icon: ICONS.SEND_EMAIL, desc: 'Compose and send a new email campaign.', view: 'Send Email' },
        { name: 'Campaigns', icon: ICONS.CAMPAIGNS, desc: 'Review your past and ongoing email campaigns.', view: 'Campaigns' },
        { name: 'Domains', icon: ICONS.DOMAINS, desc: 'Manage and verify your sending domains.', view: 'Domains' },
        { name: 'SMTP', icon: ICONS.SERVER, desc: 'Get your SMTP credentials for integration.', view: 'SMTP' },
    ];
    
    if (!user) return <CenteredMessage><Loader /></CenteredMessage>;
    if (statsError) console.warn("Could not load dashboard stats:", statsError);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Welcome, {user?.firstname || 'User'}!</h2>
                    <p>Here's a quick overview of your MegaMail account. Ready to launch your next campaign?</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn" onClick={() => setView('Contacts')}><Icon path={ICONS.USER_PLUS} /> Manage Contacts</button>
                    <button className="btn btn-primary" onClick={() => setView('Send Email')}><Icon path={ICONS.SEND_EMAIL} /> Send an Email</button>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                 <AccountDataCard title="Sending Reputation" iconPath={ICONS.TRENDING_UP}>
                    {user?.reputation ? `${user.reputation}%` : 'N/A'}
                </AccountDataCard>
                <AccountDataCard title="Emails Sent (30d)" iconPath={ICONS.MAIL}>
                    {statsLoading ? '...' : (statsData?.EmailTotal?.toLocaleString() ?? '0')}
                </AccountDataCard>
                 <AccountDataCard title="Total Contacts" iconPath={ICONS.CONTACTS}>
                    {user?.contactcount?.toLocaleString() ?? '0'}
                </AccountDataCard>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>Explore Your Tools</h3>
                    <p>Access all of MegaMail's powerful features from one place.</p>
                </div>
                <div className="dashboard-nav-grid">
                    {navItems.map(item => (
                        <div key={item.name} className="card nav-card clickable" onClick={() => setView(item.view)}>
                            <Icon path={item.icon} className="nav-card-icon" />
                            <div className="nav-card-title">{item.name}</div>
                            <div className="nav-card-description">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-branding-footer">
                <p>MegaMail by <strong>ZAGROX.com Development</strong> & <strong>Mailzila.com Email Provider</strong></p>
            </div>
        </div>
    );
};

const ContactsView = () => <PlaceholderView name="Contacts" />;
const EmailListView = () => <PlaceholderView name="Email Lists" />;
const SegmentsView = () => <PlaceholderView name="Segments" />;
const SendEmailView = () => <PlaceholderView name="Send Email" />;
const CampaignsView = () => <PlaceholderView name="Campaigns" />;
const DomainsView = () => <PlaceholderView name="Domains" />;
const SmtpView = () => <PlaceholderView name="SMTP" />;


// --- Main App & Auth Flow ---
const Auth = ({ setApiKey }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showKey, setShowKey] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!key) {
            setError('API Key cannot be empty.');
            return;
        }
        setLoading(true);
        try {
            await apiFetch('/account/load', key);
            setApiKey(key);
        } catch (err) {
            setError(err.message || 'Invalid API Key or connection issue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="logo-font">MegaMail</h1>
                <p>Enter your Elastic Email API Key to continue</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                         <input
                            type={showKey ? 'text' : 'password'}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Your API Key"
                            aria-label="API Key"
                            disabled={loading}
                        />
                        <button type="button" className="input-icon-btn" onClick={() => setShowKey(!showKey)} aria-label={showKey ? 'Hide key' : 'Show key'}>
                            <Icon path={showKey ? ICONS.EYE_OFF : ICONS.EYE} />
                        </button>
                    </div>
                    {error && <div className="action-status error" style={{textAlign:'center'}}>{error}</div>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading && <Loader />}
                        <span>{loading ? 'Verifying...' : 'Continue'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

const views = {
    Dashboard: DashboardView,
    Statistics: StatisticsView,
    Account: AccountView,
    Contacts: ContactsView,
    'Email Lists': EmailListView,
    Segments: SegmentsView,
    'Send Email': SendEmailView,
    Campaigns: CampaignsView,
    Domains: DomainsView,
    SMTP: SmtpView,
    'Buy Credits': BuyCreditsView
};

const getIconForView = (viewName) => {
    const normalizedName = viewName.toUpperCase().replace(/\s+/g, '_');
    return ICONS[normalizedName] || ICONS.DEFAULT;
};

const App = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('ee_api_key'));
    const [view, setView] = useState('Dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: accountData } = useApi('/account/load', apiKey);
    
    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('ee_api_key', apiKey);
        } else {
            localStorage.removeItem('ee_api_key');
        }
    }, [apiKey]);

    const logout = () => {
        setApiKey(null);
    };

    if (!apiKey) {
        return <Auth setApiKey={setApiKey} />;
    }

    const renderView = () => {
        const Component = views[view] || DashboardView;
        return <Component apiKey={apiKey} setView={setView} user={accountData} />;
    };

    return (
        <div className={`app-container ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <Sidebar view={view} setView={setView} logout={logout} />
            <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            <main className="main-wrapper">
                <MobileHeader
                    viewTitle={view}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />
                <div className="content">
                    <div className="content-header">
                        <h2>{view}</h2>
                    </div>
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

const Sidebar = ({ view, setView, logout }) => {
    const mainNavItems = ['Dashboard', 'Statistics', 'Account', 'Contacts', 'Email Lists', 'Segments', 'Send Email', 'Campaigns', 'Domains', 'SMTP'];

    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-header logo-font">MegaMail</div>
                <nav className="nav">
                    {mainNavItems.map(name => (
                        <button key={name} onClick={() => setView(name)} className={`nav-btn ${view === name ? 'active' : ''}`}>
                            <Icon path={getIconForView(name)} />
                            <span>{name}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                 <div className="sidebar-footer">
                    <p>Brought to you by<br/><strong>ZAGROX.com</strong> & <strong>Mailzila.com</strong></p>
                </div>
                <div className="nav-divider"></div>
                <button onClick={() => setView('Buy Credits')} className={`nav-btn ${view === 'Buy Credits' ? 'active' : ''}`}>
                    <Icon path={ICONS.CREDIT_CARD} />
                    <span>Buy Credits</span>
                </button>
                <button onClick={() => logout()} className="nav-btn logout-btn">
                    <Icon path={ICONS.LOGOUT} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}

const MobileHeader = ({ viewTitle, onMenuClick }) => {
    return (
        <header className="mobile-header">
            <button className="mobile-menu-toggle" onClick={onMenuClick} aria-label="Open menu">
                <Icon path={ICONS.MENU} />
            </button>
            <h1 className="mobile-header-title">{viewTitle}</h1>
            <div className="mobile-header-placeholder"></div>
        </header>
    );
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);