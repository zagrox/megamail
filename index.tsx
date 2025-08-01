
import React, { useState, useEffect, useCallback, ReactNode, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';

const ELASTIC_EMAIL_API_BASE = 'https://api.elasticemail.com/v2';
const ELASTIC_EMAIL_API_V4_BASE = 'https://api.elasticemail.com/v4';
const DIRECTUS_URL = '/api/directus';

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
    CHECK: "M20 6L9 17l-5-5",
    X_CIRCLE: "M10 10l4 4m0-4l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    LOADING_SPINNER: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
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

// --- Directus API Helpers ---
const directusFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${DIRECTUS_URL}${endpoint}`;
    const token = localStorage.getItem('directus_token');
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 204) { // No Content
        return {};
    }

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.errors?.[0]?.message || 'An unknown Directus API error occurred.';
        throw new Error(errorMessage);
    }
    return data.data;
};

const directusLogin = (body: any) => directusFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
const directusRegister = (body: any) => directusFetch('/users', { method: 'POST', body: JSON.stringify(body) });
const directusFetchMe = () => directusFetch('/users/me');
const directusUpdateMe = (body: any) => directusFetch('/users/me', { method: 'PATCH', body: JSON.stringify(body) });
const directusLogout = (refreshToken: string) => directusFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) });


// --- Custom Hook for API calls (v2) ---
const useApi = (endpoint: string, apiKey: string | null, params: Record<string, any> = {}, options: { enabled?: boolean } = {}) => {
    const { enabled = true } = options;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<{ message: string, endpoint: string } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const paramsString = JSON.stringify(params);

    const refetch = useCallback(() => setRefetchIndex(i => i + 1), []);

    useEffect(() => {
        if (!enabled || !apiKey || !endpoint) {
            setLoading(false);
            if (!enabled) setData(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFetch(endpoint, apiKey, { params: JSON.parse(paramsString) });
                setData(result);
            } catch (err: any) {
                setError({ message: err.message, endpoint });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, apiKey, paramsString, enabled, refetchIndex]);

    return { data, loading, error, refetch };
};

// --- Custom Hook for API calls (v4) ---
const useApiV4 = (endpoint: string, apiKey: string | null, params: Record<string, any> = {}, options: { enabled?: boolean } = {}) => {
    const { enabled = true } = options;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<{ message: string, endpoint: string } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);
    
    const paramsString = JSON.stringify(params);
    const refetch = useCallback(() => setRefetchIndex(i => i + 1), []);

    useEffect(() => {
        if (!enabled || !apiKey || !endpoint) {
            setLoading(false);
            if (!enabled) setData(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFetchV4(endpoint, apiKey, { params: JSON.parse(paramsString) });
                setData(result);
            } catch (err: any) {
                setError({ message: err.message, endpoint });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, apiKey, paramsString, enabled, refetchIndex]);

    return { data, loading, error, refetch };
};


// --- App Context for Auth and Global State ---
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    elastic_email_api_key?: string;
    role: string;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    authLoading: boolean;
    isAuthenticated: boolean;
    apiKey: string | null;
    accountData: any | null;
    loadingAccount: boolean;
    login: (credentials: any) => Promise<void>;
    register: (details: any) => Promise<void>;
    logout: () => void;
    updateUserApiKey: (key: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('directus_token'));
    const [authLoading, setAuthLoading] = useState(true);

    const logout = useCallback(() => {
        const refreshToken = localStorage.getItem('directus_refresh_token');
        if (refreshToken) {
            directusLogout(refreshToken).catch(console.error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('directus_token');
        localStorage.removeItem('directus_refresh_token');
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const userData = await directusFetchMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session check failed:", error);
                    logout();
                }
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, [token, logout]);

    const handleAuthSuccess = async (authData: { access_token: string, refresh_token: string }) => {
        localStorage.setItem('directus_token', authData.access_token);
        localStorage.setItem('directus_refresh_token', authData.refresh_token);
        setToken(authData.access_token);
        // After setting the token, fetch the user data immediately
        const userData = await directusFetchMe();
        setUser(userData);
    };

    const login = async (credentials: any) => {
        const authData = await directusLogin(credentials);
        await handleAuthSuccess(authData);
    };

    const register = async (details: any) => {
        await directusRegister(details);
        const authData = await directusLogin({ email: details.email, password: details.password });
        await handleAuthSuccess(authData);
    };

    const updateUserApiKey = async (key: string) => {
        await directusUpdateMe({ elastic_email_api_key: key });
        setUser(prev => prev ? { ...prev, elastic_email_api_key: key } : null);
    };

    const apiKey = user?.elastic_email_api_key ?? null;
    const { data: accountData, loading: loadingAccount } = useApi('/account/load', apiKey, {}, { enabled: !!apiKey });

    const value = {
        user,
        token,
        authLoading,
        isAuthenticated: !!user,
        apiKey,
        accountData,
        loadingAccount,
        login,
        register,
        logout,
        updateUserApiKey
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// --- Reusable Components ---
const Loader = () => <div className="loader"></div>;

const ActionStatus = ({ status, onDismiss }: { status: {type: 'success' | 'error', message: ReactNode} | null, onDismiss?: () => void }) => {
    useEffect(() => {
        if (status && status.type === 'success' && onDismiss) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [status, onDismiss]);

    if (!status?.message) return null;
    return (
        <div className={`action-status ${status.type}`}>
            {status.message}
            {onDismiss && <button onClick={onDismiss} className="dismiss-btn">&times;</button>}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
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


const ErrorMessage = ({ error }: {error: {endpoint: string, message: string}}) => (
  <div className="error-message">
    <strong>API Error on <code>{error.endpoint}</code>:</strong> {error.message}
  </div>
);

const CenteredMessage = ({ children }: { children?: ReactNode }) => (
    <div className="centered-container" style={{height: '200px'}}>
        {children}
    </div>
);

const Badge = ({ text, type = 'default' }: {text: string, type?: string}) => (
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
const getPastDateByDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
const getPastDateByMonths = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
};
const formatDateForApiV4 = (date: Date) => {
    return date.toISOString().slice(0, 19);
};
const getPastDateByYears = (years: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
};
const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- View Components ---

const StatisticsView = () => {
    const { apiKey } = useAppContext();
    const [duration, setDuration] = useState('3months');

    const durationOptions: {[key: string]: {label: string, from: () => Date}} = {
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
    const { data: stats, loading, error } = useApiV4(`/statistics`, apiKey, apiParams, { enabled: !!apiKey });
    
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

const AccountView = () => {
    const { user, apiKey, accountData: data, loadingAccount: loading, updateUserApiKey } = useAppContext();
    const [newApiKey, setNewApiKey] = useState(apiKey || '');
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

    useEffect(() => {
        setNewApiKey(apiKey || '');
    }, [apiKey]);
    
    const handleSaveKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus(null);
        try {
            await updateUserApiKey(newApiKey);
            setStatus({ type: 'success', message: 'API Key updated successfully!' });
        } catch (err: any) {
            setStatus({ type: 'error', message: `Failed to update key: ${err.message}` });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <CenteredMessage><Loader /></CenteredMessage>;
    }
    
    return (
        <div className="profile-view-container">
            <div className="profile-hero">
                <div className="profile-avatar">
                    <Icon path={ICONS.ACCOUNT} />
                </div>
                <div className="profile-info">
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p className="profile-email">{user?.email}</p>
                </div>
                <div className="profile-meta">
                     <div className="meta-item">
                        <label>User Since</label>
                        <span className="monospace">{formatDateForDisplay(data?.datecreated)}</span>
                    </div>
                     <div className="meta-item">
                        <label>Reputation</label>
                         <span>
                             {data?.reputation && (
                                <span className={`reputation-score ${data.reputation > 80 ? 'good' : data.reputation > 60 ? 'medium' : 'bad'}`}>
                                    {data.reputation.toFixed(2)}%
                                </span>
                             )}
                         </span>
                    </div>
                </div>
            </div>

            <div className="form-container" style={{maxWidth: '100%'}}>
                 <form onSubmit={handleSaveKey}>
                    <div className="form-group">
                        <label htmlFor="api-key-input">Your Elastic Email API Key</label>
                        <input
                            id="api-key-input"
                            type="text"
                            value={newApiKey}
                            onChange={(e) => setNewApiKey(e.target.value)}
                            placeholder="Enter your Elastic Email API Key"
                            required
                        />
                    </div>
                    <ActionStatus status={status} onDismiss={() => setStatus(null)} />
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSaving || newApiKey === apiKey}>
                            {isSaving ? <Loader /> : 'Save API Key'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const DomainsView = () => {
    const { apiKey } = useAppContext();
    const { data: domains, loading, error, refetch } = useApiV4('/domains', apiKey, {}, { enabled: !!apiKey });
    const [newDomain, setNewDomain] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [addStatus, setAddStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain.trim()) return;
        setIsAdding(true);
        setAddStatus(null);
        try {
            await apiFetchV4('/domains', apiKey!, { method: 'POST', body: { Domain: newDomain } });
            setAddStatus({ type: 'success', message: 'Domain added successfully! Verification may take a few moments.' });
            setNewDomain('');
            refetch();
        } catch (err: any) {
            setAddStatus({ type: 'error', message: `Failed to add domain: ${err.message}` });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div>
            <div className="view-header">
                <h3>Your Sender Domains</h3>
            </div>
            <div className="form-container" style={{ maxWidth: '100%', marginBottom: '1.5rem', padding: '1.5rem' }}>
                <form onSubmit={handleAddDomain} className="add-domain-form">
                    <input 
                        type="text" 
                        value={newDomain} 
                        onChange={e => setNewDomain(e.target.value)}
                        placeholder="e.g., yourdomain.com"
                        disabled={isAdding}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={isAdding}>
                        {isAdding ? <Loader /> : <> <Icon path={ICONS.PLUS} /> Add Domain </>}
                    </button>
                </form>
                <ActionStatus status={addStatus} onDismiss={() => setAddStatus(null)} />
            </div>

            {loading ? <CenteredMessage><Loader /></CenteredMessage> : null}
            {error ? <ErrorMessage error={error} /> : null}

            {domains && (
                <div className="card-grid domain-grid">
                    {domains.map((domain: any) => <DomainCard key={domain.Domain} domain={domain} refetchDomains={refetch} />)}
                </div>
            )}
             {!loading && domains?.length === 0 && (
                <CenteredMessage>No domains found. Add one to get started.</CenteredMessage>
            )}
        </div>
    );
};

const DomainCard = ({ domain, refetchDomains }: { domain: any, refetchDomains: () => void }) => {
    const { apiKey } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${domain.Domain}? This cannot be undone.`)) return;
        setIsDeleting(true);
        try {
            await apiFetchV4(`/domains/${domain.Domain}`, apiKey!, { method: 'DELETE' });
            // Consider adding a success toast/notification here
            refetchDomains();
        } catch (err) {
            // Consider adding an error toast/notification here
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };
    
    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await apiFetchV4(`/domains/${domain.Domain}/verify`, apiKey!, { method: 'PUT' });
            // Consider adding a success toast/notification here
            refetchDomains();
        } catch (err) {
            // Consider adding an error toast/notification here
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className="card domain-card">
            <div className="domain-card-header">
                <h3>{domain.Domain}</h3>
                <div className="action-buttons">
                    <button onClick={handleVerify} className="btn-icon" title="Trigger re-verification" disabled={isVerifying}>
                        {isVerifying ? <Loader/> : <Icon path={ICONS.VERIFY}/>}
                    </button>
                    <button onClick={handleDelete} className="btn-icon btn-icon-danger" title="Delete Domain" disabled={isDeleting}>
                        {isDeleting ? <Loader/> : <Icon path={ICONS.DELETE}/>}
                    </button>
                </div>
            </div>
            <div className="domain-card-body">
                <div className="domain-card-statuses">
                    <div><span>SPF</span> <Badge text={domain.SpfStatus} type={domain.SpfStatus === 'Verified' ? 'success' : 'danger'} /></div>
                    <div><span>DKIM</span> <Badge text={domain.DkimStatus} type={domain.DkimStatus === 'Verified' ? 'success' : 'danger'} /></div>
                    <div><span>MX</span> <Badge text={domain.MxStatus} type={domain.MxStatus === 'Verified' ? 'success' : 'danger'} /></div>
                    <div><span>Tracking</span> <Badge text={domain.TrackingStatus} type={domain.TrackingStatus === 'Verified' ? 'success' : 'danger'} /></div>
                </div>
            </div>
            <div className="domain-card-footer" onClick={() => setIsExpanded(!isExpanded)}>
                <span>DNS Details</span>
                <Icon path={ICONS.CHEVRON_DOWN} className={isExpanded ? 'expanded' : ''} />
            </div>
            {isExpanded && <DomainVerificationDetails domainName={domain.Domain} />}
        </div>
    );
};

const DomainVerificationDetails = ({ domainName }: { domainName: string }) => {
    const { apiKey } = useAppContext();
    const { data: details, loading, error } = useApiV4(`/domains/${domainName}/verifications`, apiKey, {}, { enabled: !!domainName });
    
    if (loading) return <div className="expanded-loader"><Loader /></div>;
    if (error) return <div className="expanded-loader"><ErrorMessage error={error} /></div>;
    if (!details) return null;

    const dnsRecords = [
        { label: "SPF Record", type: "TXT", value: details.Spf?.MailServerDomain, valid: details.Spf?.IsValid, name: '@ or your domain' },
        { label: "DKIM Record", type: "TXT", value: details.Dkim?.Value, valid: details.Dkim?.IsValid, name: details.Dkim?.Host },
        { label: "Tracking CNAME", type: "CNAME", value: details.Tracking?.Value, valid: details.Tracking?.IsValid, name: details.Tracking?.Host },
        { label: "MX Record", type: "MX", value: details.Mx?.Value, valid: details.Mx?.IsValid, name: '@ or your domain' }
    ];

    return (
        <div className="domain-card-expanded-content">
            {dnsRecords.map((record, index) => record.value && (
                <div key={index} className="dns-record">
                    <label>{record.label} ({record.valid ? "Verified" : "Not Verified"})</label>
                    <div className="dns-record-name">Type: <span>{record.type}</span> | Name: <span>{record.name}</span></div>
                    <input type="text" readOnly value={record.value} onClick={e => (e.target as HTMLInputElement).select()} />
                </div>
            ))}
        </div>
    );
};

const EmailListsView = () => {
    const { apiKey } = useAppContext();
    const { data: lists, loading, error, refetch } = useApiV4('/lists', apiKey, {}, { enabled: !!apiKey });
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div>
            <div className="view-header">
                <h3>Your Contact Lists</h3>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Icon path={ICONS.PLUS} /> Create New List
                </button>
            </div>

            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}

            {!loading && lists && lists.length > 0 && (
                <div className="card-grid list-grid">
                    {lists.map((list: any) => (
                        <ListCard key={list.ListName} list={list} refetchLists={refetch} />
                    ))}
                </div>
            )}

            {!loading && (!lists || lists.length === 0) && (
                <CenteredMessage>
                    You haven't created any contact lists yet.
                </CenteredMessage>
            )}

            <CreateListModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onListCreated={() => {
                    refetch();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

const ListCard = ({ list, refetchLists }: { list: any; refetchLists: () => void }) => {
    const { apiKey } = useAppContext();
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the list "${list.ListName}"? All contacts in this list will be removed.`)) return;
        setIsDeleting(true);
        try {
            await apiFetchV4(`/lists/${list.ListName}`, apiKey!, { method: 'DELETE' });
            refetchLists();
        } catch (err: any) {
            alert(`Failed to delete list: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="card list-card">
            <div className="list-card-header">
                <h3>{list.ListName}</h3>
            </div>
            <div className="list-card-body">
                <div className="list-card-stat">
                    <span>Contacts</span>
                    <strong>{list.ContactsCount?.toLocaleString() ?? 0}</strong>
                </div>
            </div>
            <div className="list-card-footer">
                <span>Created: {formatDateForDisplay(list.DateAdded)}</span>
                <div className="action-buttons">
                    <button onClick={handleDelete} className="btn-icon btn-icon-danger" title="Delete List" disabled={isDeleting}>
                        {isDeleting ? <Loader/> : <Icon path={ICONS.DELETE}/>}
                    </button>
                </div>
            </div>
        </div>
    );
};


const CreateListModal = ({ isOpen, onClose, onListCreated }: { isOpen: boolean; onClose: () => void; onListCreated: () => void; }) => {
    const { apiKey } = useAppContext();
    const [listName, setListName] = useState('');
    const [allowUnsubscribe, setAllowUnsubscribe] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setError(null);
        try {
            const newList = {
                ListName: listName,
                AllowUnsubscribe: allowUnsubscribe
            };
            await apiFetchV4('/lists', apiKey!, { method: 'POST', body: newList });
            onListCreated();
            setListName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsCreating(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Contact List">
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                    <label htmlFor="listName">List Name</label>
                    <input
                        id="listName"
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        placeholder="e.g., 'Monthly Newsletter Subscribers'"
                        required
                    />
                </div>
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={allowUnsubscribe}
                            onChange={(e) => setAllowUnsubscribe(e.target.checked)}
                        />
                        Allow contacts to unsubscribe from this list
                    </label>
                </div>
                {error && <div className="action-status error">{error}</div>}
                <button type="submit" className="btn btn-primary full-width" disabled={isCreating}>
                    {isCreating ? <Loader /> : 'Create List'}
                </button>
            </form>
        </Modal>
    );
};


// Main App Structure
const App = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

const AppContent = () => {
    const { isAuthenticated, authLoading, apiKey } = useAppContext();

    if (authLoading) {
        return (
            <div className="auth-container">
                <Loader />
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <AuthView />;
    }

    if (!apiKey) {
        return <ApiKeySetupView />;
    }

    return <MainLayout />;
};

const AuthView = () => {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h1>
                <p>{isLogin ? 'Sign in to manage your email marketing.' : 'Get started in just a few clicks.'}</p>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-btn">
                    {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
            </div>
        </div>
    );
};

const handleAuthError = (err: any): ReactNode => {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
        return (
            <>
                Network error: Failed to connect to the authentication server. 
                <small>This is often a CORS issue. Please ensure the server at <code>{DIRECTUS_URL}</code> is running and configured to accept requests from this origin.</small>
            </>
        );
    }
    return err.message;
};

const LoginForm = () => {
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ReactNode | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login({ email, password });
        } catch (err: any) {
            setError(handleAuthError(err));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <ActionStatus status={{type: 'error', message: error}} onDismiss={() => setError(null)} />}
            <div className="form-group">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
            </div>
            <div className="form-group">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader /> : 'Sign In'}
            </button>
        </form>
    );
};

const RegisterForm = () => {
    const { register } = useAppContext();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ReactNode | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register({ first_name: firstName, last_name: lastName, email, password, role: 'YOUR_DEFAULT_USER_ROLE_ID' });
        } catch (err: any) {
             setError(handleAuthError(err));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <ActionStatus status={{type: 'error', message: error}} onDismiss={() => setError(null)} />}
             <div className="form-group">
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
            </div>
             <div className="form-group">
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
            </div>
            <div className="form-group">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
            </div>
            <div className="form-group">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader /> : 'Create Account'}
            </button>
        </form>
    );
};


const ApiKeySetupView = () => {
    const { updateUserApiKey } = useAppContext();
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateUserApiKey(apiKey);
        } catch (err: any) {
            setError(`Failed to save key: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>One Last Step</h1>
                <p>Please provide your Elastic Email API key to continue.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <ActionStatus status={{type: 'error', message: error}} onDismiss={() => setError(null)} />}
                    <div className="form-group">
                        <input 
                            type="text" 
                            value={apiKey} 
                            onChange={e => setApiKey(e.target.value)} 
                            placeholder="Your Elastic Email API Key" 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader /> : 'Save and Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};


const MainLayout = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const views: { [key: string]: { component: ReactNode; title: string; description: string, icon: string } } = {
        dashboard: { component: <DashboardView setActiveView={setActiveView} />, title: 'Dashboard', description: 'Overview of your email marketing performance.', icon: ICONS.DASHBOARD },
        account: { component: <AccountView />, title: 'My Profile & Settings', description: 'View and manage your account details.', icon: ICONS.ACCOUNT },
        domains: { component: <DomainsView />, title: 'Sender Domains', description: 'Manage and verify your sending domains.', icon: ICONS.DOMAINS },
        lists: { component: <EmailListsView />, title: 'Contact Lists', description: 'Manage your audience with contact lists.', icon: ICONS.EMAIL_LIST },
        statistics: { component: <StatisticsView />, title: 'Statistics', description: 'Analyze your email campaign statistics.', icon: ICONS.STATS },
    };

    const currentView = views[activeView] || views.dashboard;
    
    return (
        <div className={`app-container ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
            {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
            <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setIsMenuOpen(false); }} views={views} />
            <div className="main-wrapper">
                 <MobileHeader onMenuClick={() => setIsMenuOpen(!isMenuOpen)} title={currentView.title} />
                <main className="content">
                    <div className="content-header">
                        <h2>{currentView.title}</h2>
                        <p>{currentView.description}</p>
                    </div>
                     {currentView.component}
                </main>
            </div>
        </div>
    );
};

const MobileHeader = ({ onMenuClick, title }: { onMenuClick: () => void, title: string }) => {
    return (
        <header className="mobile-header">
            <button onClick={onMenuClick} className="mobile-menu-toggle" aria-label="Open menu">
                <Icon path={ICONS.MENU} />
            </button>
            <h1 className="mobile-header-title">{title}</h1>
            <div className="mobile-header-placeholder"></div>
        </header>
    );
};

const Sidebar = ({ activeView, setActiveView, views }: { activeView: string; setActiveView: (view: string) => void; views: { [key: string]: { icon: string; title: string; } } }) => {
    const { logout } = useAppContext();
    
    return (
        <aside className="sidebar">
            <div>
                <h1 className="sidebar-header logo-font">MegaMail</h1>
                <nav className="nav">
                    {Object.entries(views).map(([key, view]) => (
                        <button
                            key={key}
                            className={`nav-btn ${activeView === key ? 'active' : ''}`}
                            onClick={() => setActiveView(key)}
                        >
                            <Icon path={view.icon} />
                            {view.title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="sidebar-footer-nav">
                <button onClick={logout} className="nav-btn logout-btn">
                     <Icon path={ICONS.LOGOUT} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

const DashboardView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, accountData, loadingAccount } = useAppContext();
    
    const navItems = [
        { id: 'statistics', title: 'View Statistics', description: 'Dive deep into your email performance metrics.', icon: ICONS.STATS },
        { id: 'domains', title: 'Manage Domains', description: 'Add, verify, and track your sending domains.', icon: ICONS.DOMAINS },
        { id: 'lists', title: 'Organize Contacts', description: 'Create and manage your audience lists.', icon: ICONS.EMAIL_LIST },
        { id: 'account', title: 'Update Profile', description: 'Check your account status and settings.', icon: ICONS.ACCOUNT },
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h2>Welcome back, {user?.first_name}!</h2>
                    <p>Here's a quick overview of your account. What would you like to do today?</p>
                </div>
            </header>

            {loadingAccount ? <CenteredMessage><Loader/></CenteredMessage> :
                <div className="dashboard-stats-grid">
                     <AccountDataCard title="Email Credits" iconPath={ICONS.CREDIT_CARD}>
                        {accountData?.emailcredits?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Reputation" iconPath={ICONS.TRENDING_UP}>
                         {accountData?.reputation ? (
                            <>
                                <span className={`reputation-score ${accountData.reputation > 80 ? 'good' : accountData.reputation > 60 ? 'medium' : 'bad'}`}>
                                    {accountData.reputation.toFixed(2)}%
                                </span>
                                <span className="reputation-text">{accountData.reputation > 80 ? 'Excellent' : accountData.reputation > 60 ? 'Good' : 'Needs Improvement'}</span>
                            </>
                        ) : 'N/A'}
                    </AccountDataCard>
                     <AccountDataCard title="Contacts" iconPath={ICONS.CONTACTS}>
                        {accountData?.contactscount?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                </div>
            }

            <section>
                 <div className="dashboard-section-header">
                    <h3>Quick Actions</h3>
                 </div>
                 <div className="dashboard-nav-grid" style={{marginTop: '1.5rem'}}>
                    {navItems.map(item => (
                        <div key={item.id} className="card nav-card" onClick={() => setActiveView(item.id)}>
                             <Icon path={item.icon} className="nav-card-icon" />
                             <h4 className="nav-card-title">{item.title}</h4>
                             <p className="nav-card-description">{item.description}</p>
                        </div>
                    ))}
                 </div>
            </section>
            
            <footer className="dashboard-branding-footer">
                <p>Powered by <strong>MegaMail</strong></p>
            </footer>
        </div>
    );
}


const root = createRoot(document.getElementById('root')!);
root.render(<App />);