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
      if (score >= 90) return { className: 'good', text: 'Excellent' };
      if (score >= 70) return { className: 'medium', text: 'Good' };
      return { className: 'bad', text: 'Needs Improvement' };
  }
  
  const reputationInfo = getReputationInfo(data.reputation);

  return (
    <div className="card-grid account-grid">
      <AccountDataCard title="Reputation" iconPath={ICONS.TRENDING_UP}>
        <span className={`reputation-score ${reputationInfo.className}`}>
            {data.reputation ? `${Number(data.reputation).toFixed(2)}%` : 'N/A'}
        </span>
        <span className="reputation-text">{reputationInfo.text}</span>
      </AccountDataCard>
      
      <AccountDataCard title="Remaining Email Credits" iconPath={ICONS.CREDIT_CARD}>
        {data.emailcredits?.toLocaleString() ?? 'N/A'}
      </AccountDataCard>

      <AccountDataCard title="Total Emails Sent" iconPath={ICONS.SEND_EMAIL}>
        {data.totalemailssent?.toLocaleString() ?? '0'}
      </AccountDataCard>

      <AccountDataCard title="Total Contacts" iconPath={ICONS.CONTACTS}>
        {data.contactscount?.toLocaleString() ?? '0'}
      </AccountDataCard>
      
      <AccountDataCard title="Account Status" iconPath={ICONS.ACCOUNT}>
        <Badge text={String(data.accountstatus || 'N/A')} type={getStatusType(data.accountstatus)} />
      </AccountDataCard>
      
      <AccountDataCard title="Pricing Plan" iconPath={ICONS.PRICE_TAG}>
        {data.priceplan || 'N/A'}
      </AccountDataCard>
      
      <AccountDataCard title="Account Creation Date" iconPath={ICONS.CALENDAR}>
        {data.datecreated ? new Date(data.datecreated).toLocaleDateString() : 'N/A'}
      </AccountDataCard>
      
      <AccountDataCard title="Email" iconPath={ICONS.MAIL}>
        {data.email}
      </AccountDataCard>

      <AccountDataCard title="Public Account ID" iconPath={ICONS.SERVER}>
        <span className="small-text">{data.publicaccountid}</span>
      </AccountDataCard>
    </div>
  );
};

const ContactsView = ({ apiKey }) => {
    const [offset, setOffset] = useState(0);
    const [limit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [refetchIndex, setRefetchIndex] = useState(0);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [viewedContactEmail, setViewedContactEmail] = useState(null);
    const [viewedContactDetails, setViewedContactDetails] = useState(null);
    const [isViewModalLoading, setViewModalLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState({ type: null, message: '' });

    const { data: accountData } = useApi('/account/load', apiKey);
    
    const listApiParams: { limit: number; offset: number; search?: string; } = { limit, offset };
    if (debouncedSearchTerm) {
        listApiParams.search = debouncedSearchTerm;
    }

    const { data: contacts, loading, error } = useApi(
        '/contact/list', 
        apiKey, 
        listApiParams, 
        refetchIndex
    );
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setOffset(0);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const refetchContacts = () => setRefetchIndex(prev => prev + 1);

    const handleViewContact = async (email) => {
        setViewedContactEmail(email);
        setViewModalLoading(true);
        try {
            const details = await apiFetch('/contact/load', apiKey, { params: { email } });
            setViewedContactDetails(details);
        } catch (err) {
            setViewedContactDetails({ error: err.message });
        } finally {
            setViewModalLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (!accountData?.publicaccountid) {
            setActionStatus({ type: 'error', message: 'Could not retrieve Public Account ID. Please refresh and try again.' });
            return;
        }

        const newContact = {
            email: formData.get('email'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            publicaccountid: accountData.publicaccountid
        };

        setActionStatus({ type: 'loading', message: 'Adding contact...' });
        try {
            await apiFetch('/contact/add', apiKey, { method: 'POST', params: newContact });
            setActionStatus({ type: 'success', message: 'Contact added successfully!' });
            setAddModalOpen(false);
            refetchContacts();
        } catch (err) {
            setActionStatus({ type: 'error', message: `Failed to add contact: ${err.message}` });
        }
    };

    const ContactDetails = ({ details }) => {
        if (!details) return null;
        if (details.error) return <ErrorMessage error={{ endpoint: 'contact/load', message: details.error }} />;

        const detailItems = [
            { label: 'Email', value: details.email },
            { label: 'First Name', value: details.firstname },
            { label: 'Last Name', value: details.lastname },
            { label: 'Status', value: <Badge text={String(details.status || 'N/A')} type={String(details.status || '').toLowerCase() === 'active' ? 'success' : 'default'} /> },
            { label: 'Date Added', value: new Date(details.dateadded).toLocaleString() },
            { label: 'Total Opened', value: details.totalopened?.toLocaleString() },
            { label: 'Total Clicks', value: details.totalclicked?.toLocaleString() },
        ];
        
        return (
            <div className="contact-details-grid">
                {detailItems.map(({label, value}) => value ? (
                    <React.Fragment key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </React.Fragment>
                ) : null)}
            </div>
        );
    };

    return (
        <>
            <ActionStatus status={actionStatus} />
            <div className="contacts-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
                    <Icon path={ICONS.USER_PLUS} />
                    <span>Add Contact</span>
                </button>
            </div>
            
            {loading ? <CenteredMessage><Loader /></CenteredMessage> :
             error ? <ErrorMessage error={error} /> :
             !contacts || contacts.length === 0 ? <CenteredMessage>No contacts found.</CenteredMessage> : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Status</th>
                                    <th>Date Added</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact => (
                                    <tr key={contact.publiccontactid}>
                                        <td>{contact.email}</td>
                                        <td>{contact.firstname || '-'}</td>
                                        <td>{contact.lastname || '-'}</td>
                                        <td><Badge text={String(contact.status || 'N/A')} type={String(contact.status || '').toLowerCase() === 'active' ? 'success' : 'default'} /></td>
                                        <td>{new Date(contact.dateadded).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn-icon" title="View Details" onClick={() => handleViewContact(contact.email)}>
                                                <Icon path={ICONS.EYE} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination-controls">
                        <button onClick={() => setOffset(o => Math.max(0, o - limit))} disabled={offset === 0}>
                            Previous
                        </button>
                        <span>Page {offset / limit + 1}</span>
                        <button onClick={() => setOffset(o => o + limit)} disabled={contacts.length < limit}>
                            Next
                        </button>
                    </div>
                </>
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => { setAddModalOpen(false); setActionStatus({type:null, message:''})}} title="Add New Contact">
                <form onSubmit={handleAddContact} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input type="text" id="firstname" name="firstname" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" id="lastname" name="lastname" />
                    </div>
                    <button type="submit" className="btn btn-primary full-width">Save Contact</button>
                    {actionStatus.type === 'error' && <ActionStatus status={actionStatus} />}
                </form>
            </Modal>

            <Modal isOpen={!!viewedContactEmail} onClose={() => { setViewedContactEmail(null); setViewedContactDetails(null); }} title="Contact Details">
                {isViewModalLoading ? <CenteredMessage><Loader /></CenteredMessage> : <ContactDetails details={viewedContactDetails} />}
            </Modal>
        </>
    );
};

const ListContactsViewer = ({ apiKey, listName }) => {
    const { data: contacts, loading, error } = useApiV4(`/lists/${listName}/contacts`, apiKey);

    if (loading) return <CenteredMessage><Loader /></CenteredMessage>;
    if (error) return <ErrorMessage error={{...error, endpoint: `lists/${listName}/contacts`}} />;
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) return <CenteredMessage>No contacts found in this list.</CenteredMessage>;

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.Email}>
                            <td>{contact.Email}</td>
                            <td>{contact.FirstName || '-'}</td>
                            <td>{contact.LastName || '-'}</td>
                            <td><Badge text={contact.Status} type={contact.Status === 'Active' ? 'success' : 'default'} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EmailListView = ({ apiKey }) => {
    const [refetchIndex, setRefetchIndex] = useState(0);
    const { data: lists, loading: loadingLists, error: errorLists } = useApiV4('/lists', apiKey, {}, refetchIndex);
    const [actionStatus, setActionStatus] = useState({ type: null, message: '' });
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [viewedList, setViewedList] = useState(null);

    const refetchLists = () => setRefetchIndex(prev => prev + 1);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListName) return;

        setIsCreating(true);
        setActionStatus({ type: null, message: '' });

        try {
            await apiFetchV4('/lists', apiKey, {
                method: 'POST',
                body: { ListName: newListName, AllowUnsubscribe: true }
            });
            setActionStatus({ type: 'success', message: `List "${newListName}" created successfully.` });
            setNewListName('');
            refetchLists();
        } catch (err) {
            setActionStatus({ type: 'error', message: `Failed to create list: ${err.message}` });
        } finally {
            setIsCreating(false);
        }
    };

    const BoolBadge = ({ value }) => (
        <Badge text={value ? 'Yes' : 'No'} type={value ? 'success' : 'default'} />
    );

    return (
        <>
            <div className="form-container" style={{ maxWidth: 'none', marginBottom: '2rem' }}>
                <form onSubmit={handleCreateList} className="create-list-form">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Enter new list name"
                        disabled={isCreating}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={isCreating || !newListName}>
                        {isCreating ? 'Creating...' : 'Create List'}
                    </button>
                </form>
                <ActionStatus status={actionStatus} />
            </div>

            {loadingLists && <CenteredMessage><Loader /></CenteredMessage>}
            {errorLists && <ErrorMessage error={errorLists} />}
            {!loadingLists && (!lists || !Array.isArray(lists) || lists.length === 0) && (
                <CenteredMessage>No email lists found. Create one to get started!</CenteredMessage>
            )}
            
            {lists && Array.isArray(lists) && lists.length > 0 && (
                 <div className="card-grid list-grid">
                    {lists.map(list => (
                        <div key={list.ListName} className="card list-card clickable" onClick={() => setViewedList(list.ListName)}>
                            <div className="list-card-header">
                                <h3>{list.ListName}</h3>
                            </div>
                            <div className="list-card-body">
                               <div className="list-card-stat">
                                   <span>Contacts</span>
                                   <strong>{list.RecipientsCount?.toLocaleString() ?? '0'}</strong>
                               </div>
                               <div className="list-card-stat">
                                   <span>Date Added</span>
                                   <strong>{new Date(list.DateAdded).toLocaleDateString()}</strong>
                               </div>
                            </div>
                            <div className="list-card-footer">
                               <span>Allow Unsubscribe</span>
                               <BoolBadge value={list.AllowUnsubscribe} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <Modal isOpen={!!viewedList} onClose={() => setViewedList(null)} title={`Contacts in "${viewedList}"`}>
                {viewedList && <ListContactsViewer apiKey={apiKey} listName={viewedList} />}
            </Modal>
        </>
    );
};

const SendEmailView = ({ apiKey }) => {
    const [formState, setFormState] = useState({ to: '', from: '', subject: '', body: '' });
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState({ type: null, message: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formState.to || !formState.from || !formState.subject || !formState.body) {
            setSendStatus({ type: 'error', message: 'All fields are required.' });
            return;
        }
        setIsSending(true);
        setSendStatus({ type: null, message: '' });

        const emailParams = {
            to: formState.to,
            from: formState.from,
            subject: formState.subject,
            bodyText: formState.body,
        };

        try {
            const result = await apiFetch('/email/send', apiKey, {
                method: 'POST',
                params: emailParams,
            });
            setSendStatus({ type: 'success', message: `Email sent! Transaction ID: ${result.transactionid}` });
            setFormState({ to: '', from: '', subject: '', body: '' });
        } catch (err) {
            setSendStatus({ type: 'error', message: `Failed to send email: ${err.message}` });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="from">From Email</label>
                        <input type="email" id="from" name="from" value={formState.from} onChange={handleInputChange} placeholder="sender@example.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="to">To Email</label>
                        <input type="email" id="to" name="to" value={formState.to} onChange={handleInputChange} placeholder="recipient@example.com" required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" value={formState.subject} onChange={handleInputChange} placeholder="Your email subject" required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="body">Body (Plain Text)</label>
                        <textarea id="body" name="body" value={formState.body} onChange={handleInputChange} rows={8} placeholder="Compose your email..." required></textarea>
                    </div>
                </div>
                <div className="form-actions">
                    {sendStatus.message && (
                        <div className={`send-status-message ${sendStatus.type === 'success' ? 'success' : 'error'}`}>
                            {sendStatus.message}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const CampaignsView = ({ apiKey }) => {
    const { data, loading, error } = useApi('/campaign/list', apiKey);

    if (loading) return <CenteredMessage><Loader /></CenteredMessage>;
    if (error) return <ErrorMessage error={error} />;
    if (!data || data.length === 0) return <CenteredMessage>No campaigns found.</CenteredMessage>;

    const campaignStatusMap = {
        1: 'Draft',
        2: 'Sending',
        3: 'Processing',
        4: 'Completed',
        5: 'Cancelled',
        6: 'Paused'
    };

    const getCampaignStatusText = (status) => {
        if (typeof status === 'number') {
            return campaignStatusMap[status] || `Unknown (${status})`;
        }
        return String(status); // It's already a string like "Completed"
    };

    const getStatusType = (statusText) => {
        const s = String(statusText || '').toLowerCase();
        if (s.includes('completed') || s.includes('sending')) return 'success';
        if (s.includes('draft') || s.includes('paused')) return 'warning';
        if (s.includes('cancelled')) return 'danger';
        return 'default';
    };

    return (
        <div className="card-grid domain-grid">
            {data.map((campaign, index) => {
                const statusText = getCampaignStatusText(campaign.status);
                return (
                    <div key={campaign.campaignid || index} className="card list-card">
                        <div className="list-card-header">
                            <h3>{campaign.name}</h3>
                        </div>
                        <div className="list-card-body">
                           <div className="list-card-stat">
                               <span>Recipients</span>
                               <strong>{campaign.recipientcount?.toLocaleString() ?? '0'}</strong>
                           </div>
                           <div className="list-card-stat">
                               <span>Date Added</span>
                               <strong>{new Date(campaign.dateadded).toLocaleDateString()}</strong>
                           </div>
                        </div>
                        <div className="list-card-footer">
                            <span>Status</span>
                            <Badge text={statusText} type={getStatusType(statusText)} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const DomainsView = ({ apiKey }) => {
    const [refetchIndex, setRefetchIndex] = useState(0);
    const { data: domains, loading, error } = useApi('/domain/list', apiKey, {}, refetchIndex);
    const [actionStatus, setActionStatus] = useState({ type: null, message: '' });
    const [newDomain, setNewDomain] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedDomain, setExpandedDomain] = useState(null);

    const refetchDomains = () => setRefetchIndex(prev => prev + 1);
    
    const handleApiAction = async (action, params, successMessage) => {
        setActionLoading(true);
        setActionStatus({ type: null, message: '' });
        try {
            await apiFetch(`/domain/${action}`, apiKey, { method: 'POST', params });
            setActionStatus({ type: 'success', message: successMessage });
            refetchDomains();
        } catch (err) {
            setActionStatus({ type: 'error', message: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddDomain = (e) => {
        e.preventDefault();
        if (!newDomain) return;
        handleApiAction('add', { domain: newDomain }, `Domain "${newDomain}" added successfully.`);
        setNewDomain('');
    };

    const handleDelete = (domain) => {
        if (window.confirm(`Are you sure you want to delete the domain "${domain}"?`)) {
            handleApiAction('delete', { domain }, `Domain "${domain}" deleted successfully.`);
        }
    };
    
    const BoolBadge = ({ value }) => <Badge text={value ? 'Verified' : 'Missing'} type={value ? 'success' : 'danger'} />;

    const DnsRecord = ({ label, name, value }: { label: string; name?: string; value: string; }) => (
        <div className="dns-record">
            <label>{label}</label>
            {name && <div className="dns-record-name"><span>Name/Host:</span> {name}</div>}
            <input type="text" readOnly value={value} onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()} />
        </div>
    );

    return (
        <>
            <div className="form-container" style={{ maxWidth: 'none', marginBottom: '2rem' }}>
                <form onSubmit={handleAddDomain} className="add-domain-form">
                    <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example.com"
                        disabled={actionLoading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={actionLoading || !newDomain}>
                        {actionLoading ? 'Adding...' : 'Add Domain'}
                    </button>
                </form>
                <ActionStatus status={actionStatus} />
            </div>

            {loading && !domains && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            {domains && (
                <div className="card-grid domain-grid">
                    {domains.length === 0 && (
                        <div className="card"><CenteredMessage>No domains found. Add one to get started.</CenteredMessage></div>
                    )}
                    {domains.map((domain) => {
                        const domainName = domain.Domain || domain.domain;
                        if (!domainName) return null;

                        return (
                            <div key={domainName} className="card domain-card">
                                <div className="domain-card-header">
                                    <h3>{domainName}</h3>
                                    <div className="action-buttons">
                                        <button className="btn-icon" title="Verify Domain" onClick={() => handleApiAction('verify', { domain: domainName }, 'Verification check initiated.')}>
                                            <Icon path={ICONS.VERIFY} />
                                        </button>
                                        <button className="btn-icon" title="Set as Default" onClick={() => handleApiAction('setdefault', { domain: domainName }, 'Domain set as default.')}>
                                            <Icon path={ICONS.DEFAULT} />
                                        </button>
                                        <button className="btn-icon btn-icon-danger" title="Delete Domain" onClick={() => handleDelete(domainName)}>
                                            <Icon path={ICONS.DELETE} />
                                        </button>
                                    </div>
                                </div>
                                <div className="domain-card-body">
                                    <div className="domain-card-statuses">
                                        <div><span>Verified</span><BoolBadge value={domain.IsVerified} /></div>
                                        <div><span>Default</span><BoolBadge value={domain.IsDefault} /></div>
                                        <div><span>SPF</span><BoolBadge value={domain.IsSpf} /></div>
                                        <div><span>DKIM</span><BoolBadge value={domain.IsDkim} /></div>
                                    </div>
                                </div>
                                <div className="domain-card-footer" onClick={() => setExpandedDomain(prev => prev === domainName ? null : domainName)}>
                                    <span>DNS Records</span>
                                    <Icon path={ICONS.CHEVRON_DOWN} className={expandedDomain === domainName ? 'expanded' : ''} />
                                </div>
                                {expandedDomain === domainName && (
                                    <div className="domain-card-expanded-content">
                                        <h4 style={{marginBottom: '1rem', fontWeight: 600}}>DNS Records for {domainName}</h4>
                                        <DnsRecord 
                                            label="SPF (TXT Record)" 
                                            value="v=spf1 include:mailzila.com ~all" 
                                            name={`@ or ${domainName}`}
                                        />
                                        <DnsRecord 
                                            label="DKIM (TXT Record)" 
                                            value="k=rsa;t=s;p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbmGbQMzYeMvxwtNQoXN0waGYaciuKx8mtMh5czguT4EZlJXuCt6V+l56mmt3t68FEX5JJ0q4ijG71BGoFRkl87uJi7LrQt1ZZmZCvrEII0YO4mp8sDLXC8g1aUAoi8TJgxq2MJqCaMyj5kAm3Fdy2tzftPCV/lbdiJqmBnWKjtwIDAQAB"
                                            name="api._domainkey"
                                        />
                                        <DnsRecord 
                                            label="Tracking (CNAME Record)" 
                                            value="app.mailzila.com"
                                            name="tracking"
                                        />
                                        <DnsRecord 
                                            label="DMARC (TXT Record)" 
                                            value="v=DMARC1;p=none;pct=10;aspf=r;adkim=r;"
                                            name="_dmarc"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

// --- Segment Rule Builder ---
const SEGMENT_FIELDS = {
    Status: { type: 'enum', options: ['Active', 'Engaged', 'Inactive', 'Bounced', 'Unsubscribed', 'Abuse'] },
    DateAdded: { type: 'date' },
    LastClicked: { type: 'date' },
    LastOpened: { type: 'date' },
    ConsentDate: { type: 'date' },
    Source: { type: 'string' },
    FirstName: { type: 'string' },
};

const SEGMENT_COMPARISONS = {
    'string': [{ label: 'is', value: 'EQUALS' }, { label: 'is not', value: 'NOT_EQUALS' }, { label: 'contains', value: 'CONTAINS' }, { label: 'does not contain', value: 'NOT_CONTAINS' }],
    'enum': [{ label: 'is', value: 'EQUALS' }, { label: 'is not', value: 'NOT_EQUALS' }],
    'date': [{ label: 'is after', value: 'GREATER' }, { label: 'is before', value: 'LESS' }, { label: 'is on', value: 'EQUALS' }]
};

const SegmentRuleBuilder = ({ onChange }) => {
    const [rules, setRules] = useState([{ id: 1, field: 'Status', comparison: 'EQUALS', value: 'Active' }]);
    const [conjunction, setConjunction] = useState('AND');

    const buildRuleString = useCallback(() => {
        const ruleStrings = rules.map(rule => {
            if (!rule.field || !rule.comparison || !rule.value) return null;
            const fieldType = SEGMENT_FIELDS[rule.field]?.type;
            const operatorMap = {
                EQUALS: '=',
                NOT_EQUALS: '!=',
                GREATER: '>',
                LESS: '<',
                CONTAINS: 'CONTAINS',
                NOT_CONTAINS: 'NOT_CONTAINS'
            };
            const operator = operatorMap[rule.comparison];
            let value = rule.value;

            if (fieldType === 'date') {
                 value = `'${new Date(value).toISOString().slice(0, 10)} 00:00:00'`;
            } else if(fieldType === 'string' || fieldType === 'enum') {
                value = `'${value.replace(/'/g, "''")}'`; // escape single quotes
            }
            return `${rule.field} ${operator} ${value}`;
        }).filter(Boolean);

        return ruleStrings.join(` ${conjunction} `);
    }, [rules, conjunction]);
    
    useEffect(() => {
        onChange(buildRuleString());
    }, [rules, conjunction, buildRuleString, onChange]);

    const handleUpdateRule = (id, part, value) => {
        setRules(currentRules => currentRules.map(r => {
            if (r.id !== id) return r;
            const updatedRule = { ...r, [part]: value };
            // If field changes, reset comparison and value
            if (part === 'field') {
                const newFieldType = SEGMENT_FIELDS[value].type;
                updatedRule.comparison = SEGMENT_COMPARISONS[newFieldType][0].value;
                const newFieldOptions = SEGMENT_FIELDS[value].options;
                updatedRule.value = newFieldOptions ? newFieldOptions[0] : '';
            }
            return updatedRule;
        }));
    };
    
    const handleAddRule = () => {
        setRules(currentRules => [...currentRules, { id: Date.now(), field: 'Status', comparison: 'EQUALS', value: 'Active' }]);
    };
    
    const handleRemoveRule = (id) => {
        setRules(currentRules => currentRules.filter(r => r.id !== id));
    };

    return (
        <div className="rule-builder">
            <div className="rule-conjunction-toggle">
                <span>Match</span>
                <button type="button" className={conjunction === 'ALL' ? 'active' : ''} onClick={() => setConjunction('AND')}>All</button>
                <button type="button" className={conjunction === 'ANY' ? 'active' : ''} onClick={() => setConjunction('OR')}>Any</button>
                <span>of the following:</span>
            </div>
            <div className="rule-list">
                {rules.map((rule, index) => (
                    <div className="rule-row" key={rule.id}>
                        <select value={rule.field} onChange={e => handleUpdateRule(rule.id, 'field', e.target.value)}>
                            {Object.keys(SEGMENT_FIELDS).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select value={rule.comparison} onChange={e => handleUpdateRule(rule.id, 'comparison', e.target.value)}>
                            {SEGMENT_COMPARISONS[SEGMENT_FIELDS[rule.field].type].map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        {SEGMENT_FIELDS[rule.field].type === 'enum' ? (
                            <select value={rule.value} onChange={e => handleUpdateRule(rule.id, 'value', e.target.value)}>
                                {SEGMENT_FIELDS[rule.field].options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ) : SEGMENT_FIELDS[rule.field].type === 'date' ? (
                            <input type="date" value={rule.value} onChange={e => handleUpdateRule(rule.id, 'value', e.target.value)} />
                        ) : (
                            <input type="text" value={rule.value} onChange={e => handleUpdateRule(rule.id, 'value', e.target.value)} />
                        )}
                        <button type="button" className="btn-icon remove-rule-btn" onClick={() => handleRemoveRule(rule.id)} disabled={rules.length <= 1} title="Remove rule">
                            <Icon path={ICONS.DELETE} />
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" className="btn add-rule-btn" onClick={handleAddRule}>
                <Icon path={ICONS.PLUS} /> Add Condition
            </button>
        </div>
    );
};


const SegmentsView = ({ apiKey }) => {
    const [refetchIndex, setRefetchIndex] = useState(0);
    const { data: segments, loading, error } = useApiV4('/segments', apiKey, {}, refetchIndex);
    const [actionStatus, setActionStatus] = useState({ type: null, message: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentSegment, setCurrentSegment] = useState(null); // for editing
    const [newSegmentRule, setNewSegmentRule] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const refetchSegments = () => setRefetchIndex(prev => prev + 1);

    const openAddModal = () => {
        setCurrentSegment(null);
        setModalOpen(true);
        setActionStatus({ type: null, message: '' });
        setNewSegmentRule("Status = 'Active'"); // Default rule
    };

    const openEditModal = (segment) => {
        setCurrentSegment(segment);
        setModalOpen(true);
        setActionStatus({ type: null, message: '' });
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setCurrentSegment(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name') as string;
        const rule = currentSegment ? formData.get('rule') as string : newSegmentRule;

        if (!name || !rule) {
            setActionStatus({ type: 'error', message: 'Name and a valid Rule are required.' });
            return;
        }

        setIsSubmitting(true);
        setActionStatus({ type: 'loading', message: currentSegment ? 'Updating segment...' : 'Adding segment...' });
        
        try {
            if (currentSegment) { // Update mode
                await apiFetchV4(`/segments/${currentSegment.Name}`, apiKey, {
                    method: 'PUT',
                    body: { Name: name, Rule: rule }
                });
                setActionStatus({ type: 'success', message: `Segment "${name}" updated successfully.` });
            } else { // Add mode
                await apiFetchV4('/segments', apiKey, {
                    method: 'POST',
                    body: { Name: name, Rule: rule }
                });
                setActionStatus({ type: 'success', message: `Segment "${name}" added successfully.` });
            }
            refetchSegments();
            closeModal();
        } catch (err) {
            setActionStatus({ type: 'error', message: `Operation failed: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (segmentName) => {
        if (window.confirm(`Are you sure you want to delete the segment "${segmentName}"? This cannot be undone.`)) {
             setActionStatus({ type: 'loading', message: `Deleting segment "${segmentName}"...` });
            try {
                await apiFetchV4(`/segments/${segmentName}`, apiKey, { method: 'DELETE' });
                setActionStatus({ type: 'success', message: `Segment "${segmentName}" deleted.` });
                refetchSegments();
            } catch (err) {
                setActionStatus({ type: 'error', message: `Failed to delete segment: ${err.message}` });
            }
        }
    };
    
    return (
        <>
            <ActionStatus status={actionStatus} />
            <div className="view-header">
                <h3>Manage your contact segments.</h3>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Icon path={ICONS.PUZZLE} /> 
                    <span>Add Segment</span>
                </button>
            </div>

            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            
            {!loading && segments && (
                <div className="card-grid domain-grid">
                    {segments.length === 0 ? (
                        <CenteredMessage>No segments found. Add one to get started.</CenteredMessage>
                    ) : (
                        segments.map(segment => (
                            <div key={segment.Name} className="card segment-card">
                                <div className="segment-card-header">
                                    <h3>{segment.Name}</h3>
                                    <div className="action-buttons">
                                        <button className="btn-icon" title="Edit Segment" onClick={() => openEditModal(segment)}>
                                            <Icon path={ICONS.PENCIL} />
                                        </button>
                                        <button className="btn-icon btn-icon-danger" title="Delete Segment" onClick={() => handleDelete(segment.Name)}>
                                            <Icon path={ICONS.DELETE} />
                                        </button>
                                    </div>
                                </div>
                                <div className="segment-card-body">
                                    <p style={{ color: 'var(--subtle-text-color)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Rule:</p>
                                    <pre className="segment-rule">{segment.Rule}</pre>
                                </div>
                                <div className="segment-card-footer">
                                    <span>Recipients</span>
                                    <strong>{segment.RecipientsCount?.toLocaleString() ?? '0'}</strong>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentSegment ? 'Edit Segment' : 'Add New Segment'}>
                 <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Segment Name</label>
                        <input type="text" id="name" name="name" defaultValue={currentSegment?.Name} required disabled={!!currentSegment} />
                        {currentSegment && <small style={{marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--subtle-text-color)'}}>Segment name cannot be changed after creation.</small>}
                    </div>
                    <div className="form-group">
                        <label>{currentSegment ? 'Rule (SQL-like query)' : 'Define Rule'}</label>
                        {currentSegment ? (
                             <textarea id="rule" name="rule" rows={5} defaultValue={currentSegment?.Rule} placeholder="e.g., Status = 'Active' AND ConsentDate > '2023-01-01'" required></textarea>
                        ) : (
                            <SegmentRuleBuilder onChange={setNewSegmentRule} />
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Segment'}
                    </button>
                    {actionStatus.type === 'error' && <ActionStatus status={actionStatus} />}
                </form>
            </Modal>
        </>
    );
};

const CredentialSecretViewer = ({ credential }) => {
    const [copied, setCopied] = useState(false);

    if (!credential) return null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="info-message" style={{textAlign: 'left', maxWidth: 'none', marginBottom: '1.5rem'}}>
                <strong>Important:</strong>
                <p>This is the only time your secret will be displayed. Please copy it and store it in a safe place.</p>
            </div>
            
            <div className="secret-display">
                <label>Name</label>
                <div className="secret-value">{credential.Name}</div>
                
                <label>Access Key</label>
                <div className="secret-value">{credential.AccessKey}</div>

                <label>Secret</label>
                <div className="secret-value-wrapper">
                    <input type="text" readOnly value={credential.Secret} />
                    <button onClick={() => handleCopy(credential.Secret)} className="btn">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SMTPView = ({ apiKey }) => {
    const [refetchIndex, setRefetchIndex] = useState(0);
    const { data: credentials, loading, error } = useApiV4('/security/smtp', apiKey, {}, refetchIndex);
    const [actionStatus, setActionStatus] = useState({ type: null, message: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentCredential, setCurrentCredential] = useState(null); // for editing
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newlyCreatedCredential, setNewlyCreatedCredential] = useState(null);

    const refetchSmtp = () => setRefetchIndex(prev => prev + 1);

    const openAddModal = () => {
        setCurrentCredential(null);
        setModalOpen(true);
        setActionStatus({ type: null, message: '' });
    };

    const openEditModal = (credential) => {
        setCurrentCredential(credential);
        setModalOpen(true);
        setActionStatus({ type: null, message: '' });
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setCurrentCredential(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const body = {
            Name: formData.get('name') as string,
            Expires: formData.get('expires') ? new Date(formData.get('expires') as string).toISOString() : null,
            RestrictAccessToIPRange: (formData.get('ipRestriction') as string).split(',').map(ip => ip.trim()).filter(Boolean)
        };

        if (!body.Name) {
            setActionStatus({ type: 'error', message: 'Name is required.' });
            return;
        }

        setIsSubmitting(true);
        setActionStatus({ type: 'loading', message: currentCredential ? 'Updating credential...' : 'Adding credential...' });
        
        try {
            if (currentCredential) { // Update mode
                await apiFetchV4(`/security/smtp/${currentCredential.AccessKey}`, apiKey, {
                    method: 'PUT',
                    body: body
                });
                setActionStatus({ type: 'success', message: `Credential "${body.Name}" updated successfully.` });
            } else { // Add mode
                const result = await apiFetchV4('/security/smtp', apiKey, {
                    method: 'POST',
                    body: body
                });
                setNewlyCreatedCredential(result); // Show the secret modal
                setActionStatus({ type: 'success', message: `Credential "${body.Name}" created successfully.` });
            }
            refetchSmtp();
            closeModal();
        } catch (err) {
            setActionStatus({ type: 'error', message: `Operation failed: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (credential) => {
        if (window.confirm(`Are you sure you want to delete the credential "${credential.Name}"? This cannot be undone.`)) {
             setActionStatus({ type: 'loading', message: `Deleting credential...` });
            try {
                await apiFetchV4(`/security/smtp/${credential.AccessKey}`, apiKey, { method: 'DELETE' });
                setActionStatus({ type: 'success', message: `Credential "${credential.Name}" deleted.` });
                refetchSmtp();
            } catch (err) {
                setActionStatus({ type: 'error', message: `Failed to delete credential: ${err.message}` });
            }
        }
    };
    
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
    const maskKey = (key) => key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : 'N/A';

    return (
        <>
            <ActionStatus status={actionStatus} />
            <div className="view-header">
                <h3>Manage your SMTP credentials.</h3>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Icon path={ICONS.KEY} /> 
                    <span>Add Credential</span>
                </button>
            </div>

            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            
            {!loading && credentials && (
                <div className="card-grid smtp-grid">
                    {credentials.length === 0 ? (
                        <CenteredMessage>No SMTP credentials found. Add one to get started.</CenteredMessage>
                    ) : (
                        credentials.map(cred => (
                            <div key={cred.AccessKey} className="card smtp-card">
                                <div className="smtp-card-header">
                                    <h3>{cred.Name}</h3>
                                    <div className="action-buttons">
                                        <button className="btn-icon" title="Edit Credential" onClick={() => openEditModal(cred)}>
                                            <Icon path={ICONS.PENCIL} />
                                        </button>
                                        <button className="btn-icon btn-icon-danger" title="Delete Credential" onClick={() => handleDelete(cred)}>
                                            <Icon path={ICONS.DELETE} />
                                        </button>
                                    </div>
                                </div>
                                <div className="smtp-card-body">
                                    <div className="smtp-detail-item">
                                        <span>Access Key</span>
                                        <strong className="monospace">{maskKey(cred.AccessKey)}</strong>
                                    </div>
                                    <div className="smtp-detail-item">
                                        <span>Created</span>
                                        <strong>{formatDate(cred.DateCreated)}</strong>
                                    </div>
                                    <div className="smtp-detail-item">
                                        <span>Expires</span>
                                        <strong>{formatDate(cred.Expires)}</strong>
                                    </div>
                                    <div className="smtp-detail-item">
                                        <span>Last Used</span>
                                        <strong>{formatDate(cred.LastUsed)}</strong>
                                    </div>
                                    <div className="smtp-detail-item full-span">
                                        <span>IP Restriction</span>
                                        <strong>{cred.RestrictAccessToIPRange?.join(', ') || 'None'}</strong>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentCredential ? 'Edit Credential' : 'Add New Credential'}>
                 <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Credential Name</label>
                        <input type="text" id="name" name="name" defaultValue={currentCredential?.Name} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expires">Expires (optional)</label>
                        <input type="date" id="expires" name="expires" defaultValue={currentCredential?.Expires?.split('T')[0]} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ipRestriction">Restrict Access to IPs (comma-separated)</label>
                        <input type="text" id="ipRestriction" name="ipRestriction" defaultValue={currentCredential?.RestrictAccessToIPRange?.join(', ')} placeholder="e.g. 192.168.1.1, 20.20.0.0/16" />
                    </div>
                    <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Credential'}
                    </button>
                    {actionStatus.type === 'error' && <ActionStatus status={actionStatus} />}
                </form>
            </Modal>

            <Modal
                isOpen={!!newlyCreatedCredential}
                onClose={() => setNewlyCreatedCredential(null)}
                title="SMTP Credential Created"
            >
                <CredentialSecretViewer credential={newlyCreatedCredential} />
            </Modal>
        </>
    );
};

const DashboardView = ({ apiKey, onNavigate }) => {
    const { data: accountData, loading: loadingAccount, error: errorAccount } = useApi('/account/load', apiKey);
    
    const thirtyDaysAgo = getPastDateByDays(30);
    const apiParams = { from: formatDateForApiV4(thirtyDaysAgo) };
    const { data: statsData, loading: loadingStats, error: errorStats } = useApiV4(`/statistics`, apiKey, apiParams);
    
    const loading = loadingAccount || loadingStats;
    const error = errorAccount || errorStats;

    const navDescriptions = {
        'Statistics': 'Dive deep into your email performance metrics.',
        'Account': 'View your account details and sending reputation.',
        'Contacts': 'Manage your audience and view contact details.',
        'Email List': 'Organize your contacts into targeted lists.',
        'Segments': 'Create dynamic segments for precision targeting.',
        'Send Email': 'Craft and send beautiful emails in minutes.',
        'Campaigns': 'Track the performance of your bulk email campaigns.',
        'Domains': 'Manage and verify your sending domains for better deliverability.',
        'SMTP': 'Configure SMTP credentials for external applications.'
    };

    const getReputationInfo = (reputation) => {
      const score = Number(reputation || 0);
      if (score >= 90) return { className: 'good', text: 'Excellent' };
      if (score >= 70) return { className: 'medium', text: 'Good' };
      return { className: 'bad', text: 'Needs Improvement' };
    }

    if (loading) return <CenteredMessage><Loader /></CenteredMessage>;
    if (error) return <ErrorMessage error={error} />;
    
    const reputationInfo = getReputationInfo(accountData?.reputation);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Welcome to MegaMail</h2>
                    <p>Your complete email marketing command center. Here's a snapshot of your account.</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn btn-primary" onClick={() => onNavigate('Send Email')}>
                        <Icon path={ICONS.SEND_EMAIL} />
                        <span>Send an Email</span>
                    </button>
                    <button className="btn" onClick={() => onNavigate('Contacts')}>
                         <Icon path={ICONS.CONTACTS} />
                        <span>Manage Contacts</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                <div className="card stat-card">
                    <div className="card-icon-wrapper"><Icon path={ICONS.TRENDING_UP} /></div>
                    <div className="card-details">
                        <div className="card-title">Sending Reputation</div>
                        <div className="card-content">
                            <span className={`reputation-score ${reputationInfo.className}`}>{accountData?.reputation ? `${Number(accountData.reputation).toFixed(2)}%` : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="card-icon-wrapper"><Icon path={ICONS.MAIL} /></div>
                    <div className="card-details">
                        <div className="card-title">Emails Sent (Last 30d)</div>
                        <div className="card-content">{statsData?.EmailTotal?.toLocaleString() ?? '0'}</div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="card-icon-wrapper"><Icon path={ICONS.CONTACTS} /></div>
                    <div className="card-details">
                        <div className="card-title">Total Contacts</div>
                        <div className="card-content">{accountData?.contactscount?.toLocaleString() ?? '0'}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-section-header">
                <h3>Explore Your Tools</h3>
                <p>Everything you need to succeed with email marketing.</p>
            </div>

            <div className="dashboard-nav-grid">
                {navItems.filter(item => item.id !== 'Dashboard').map(item => (
                    <div key={item.id} className="card nav-card" onClick={() => onNavigate(item.id)}>
                        <Icon path={item.icon} className="nav-card-icon" />
                        <h4 className="nav-card-title">{item.label}</h4>
                        <p className="nav-card-description">{navDescriptions[item.id] || `Manage your ${item.label.toLowerCase()}.`}</p>
                    </div>
                ))}
            </div>

             <footer className="dashboard-branding-footer">
                <p><strong>MegaMail</strong> by <strong>ZAGROX.com Development</strong> — Powered by the <strong>Mailzila.com</strong> Email API</p>
            </footer>
        </div>
    );
};

// --- Auth Component ---
const AuthPage = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey) {
      onLogin(apiKey.trim());
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo-font">MegaMail</h1>
        <p>Enter your API Key to view your account data.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Elastic Email API Key"
              required
              autoFocus
            />
            <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowApiKey(!showApiKey)}
                aria-label={showApiKey ? 'Hide API Key' : 'Show API Key'}
            >
                <Icon path={showApiKey ? ICONS.EYE_OFF : ICONS.EYE} />
            </button>
          </div>
          <button type="submit" className="btn btn-primary">Connect Account</button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---

const views = {
    Dashboard: DashboardView,
    Statistics: StatisticsView,
    Account: AccountView,
    Contacts: ContactsView,
    "Email List": EmailListView,
    Segments: SegmentsView,
    "Send Email": SendEmailView,
    Campaigns: CampaignsView,
    Domains: DomainsView,
    SMTP: SMTPView,
};

const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: ICONS.DASHBOARD },
    { id: 'Statistics', label: 'Statistics', icon: ICONS.STATS },
    { id: 'Account', label: 'Account', icon: ICONS.ACCOUNT },
    { id: 'Contacts', label: 'Contacts', icon: ICONS.CONTACTS },
    { id: 'Email List', label: 'Email List', icon: ICONS.EMAIL_LIST },
    { id: 'Segments', label: 'Segments', icon: ICONS.PUZZLE },
    { id: 'Send Email', label: 'Send Email', icon: ICONS.SEND_EMAIL },
    { id: 'Campaigns', label: 'Campaigns', icon: ICONS.CAMPAIGNS },
    { id: 'Domains', label: 'Domains', icon: ICONS.DOMAINS },
    { id: 'SMTP', label: 'SMTP', icon: ICONS.KEY },
];

const App = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('elasticEmailApiKey'));
  const [view, setView] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = useCallback((key) => {
    localStorage.setItem('elasticEmailApiKey', key);
    setApiKey(key);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('elasticEmailApiKey');
    setApiKey(null);
    setIsMobileMenuOpen(false);
  }, []);

  const handleSetView = (newView: string) => {
      setView(newView);
      setIsMobileMenuOpen(false);
  };

  if (!apiKey) {
    return <AuthPage onLogin={handleLogin} />;
  }
  
  const CurrentView = views[view];

  return (
    <div className={`app-container ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
        <nav className="sidebar">
            <div>
                <div className="sidebar-header logo-font">MegaMail</div>
                <div className="nav">
                    {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${view === item.id ? 'active' : ''}`}
                        onClick={() => handleSetView(item.id)}
                        aria-label={item.label}
                    >
                        <Icon path={item.icon} />
                        <span>{item.label}</span>
                    </button>
                    ))}
                </div>
            </div>
            <div>
                <div className="sidebar-footer">
                    <p>A service by <strong>ZAGROX.com</strong></p>
                    <p>Powered by <strong>Mailzila.com</strong></p>
                </div>
                <button onClick={handleLogout} className="nav-btn logout-btn">
                    <Icon path={ICONS.LOGOUT} />
                    <span>Log Out</span>
                </button>
            </div>
        </nav>
        <div className="main-wrapper">
            <header className="mobile-header">
                <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                    <Icon path={ICONS.MENU} />
                </button>
                <div className="mobile-header-title">{view}</div>
                <div className="mobile-header-placeholder"></div>
            </header>
            <main className="content">
                <header className="content-header">
                    <h2>{view}</h2>
                    <p>View your latest {view.toLowerCase()} data from the Elastic Email API.</p>
                </header>
                <CurrentView apiKey={apiKey} onNavigate={handleSetView} />
            </main>
        </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);