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
    ACCOUNT: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    API: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    BOUNCED: "M9 10l-5 5 5 5M20 4v7a4 4 0 01-4 4H4",
    CALENDAR: "M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    CAMPAIGNS: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    CHEVRON_DOWN: "M6 9l6 6 6-6",
    CLICK: "M9 11.3l3.71 2.7-1.42 1.42a.5.5 0 01-.71 0l-1.58-1.58a1 1 0 00-1.42 0l-1.42 1.42a1 1 0 000 1.42l4.24 4.24a.5.5 0 00.71 0l7.07-7.07",
    COMPLAINT: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10zM12 9v2m0 4h.01",
    CONTACTS: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    CREDIT_CARD: "M22 8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8zM6 14h4v-2H6v2z",
    DEFAULT: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    DELETE: "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
    DOMAINS: "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-4-9h8m-4-4v8",
    EDIT: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-5-6l6 6M12.5 7.5L20 15",
    EMAIL: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    EMAIL_LIST: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM14 11h9m-9 4h9m-9 4h9",
    EYE: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    FILTER: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    GLOBE: "M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    LOG_OUT: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    PLUS: "M12 5v14m-7-7h14",
    PUZZLE: "M20.5 10H19V8.5a1.5 1.5 0 0 0-3 0V10H14.5a1.5 1.5 0 0 0 0 3H16v1.5a1.5 1.5 0 0 0 3 0V13h1.5a1.5 1.5 0 0 0 0-3zM3.5 10H5v1.5a1.5 1.5 0 0 0 3 0V10h1.5a1.5 1.5 0 0 0 0-3H8V5.5a1.5 1.5 0 0 0-3 0V7H3.5a1.5 1.5 0 0 0 0 3zM10 14.5a1.5 1.5 0 0 0-3 0V16H5.5a1.5 1.5 0 0 0 0 3H7v1.5a1.5 1.5 0 0 0 3 0V19h1.5a1.5 1.5 0 0 0 0-3H10v-1.5zM13 3.5a1.5 1.5 0 0 0 0 3H14.5a1.5 1.5 0 0 0 3 0V5h1.5a1.5 1.5 0 0 0 0-3H19V0.5a1.5 1.5 0 0 0-3 0V2h-1.5a1.5 1.5 0 0 0-1.5 1.5z",
    REPUTATION: "M22 12h-4l-3 9L9 3l-3 9H2",
    SEARCH: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    SEND: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    SETTINGS: "M12 6V3M12 21v-3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12",
    SMTP: "M12 22a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4zM12 2a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4zM22 12a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-4z",
    STATISTICS: "M12 20V10M18 20V4M6 20v-4",
    UNLOCK: "M7 11V7a5 5 0 0 1 10 0v4m-5 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM5 11h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V11z",
    USER_PLUS: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6m-3-3h6",
    USERS: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
};

// --- API Helpers ---
const apiFetch = async (endpoint: string, apiKey: string) => {
    const response = await fetch(`${ELASTIC_EMAIL_API_BASE}${endpoint}?apiKey=${apiKey}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
    }
    return response.json();
};

const useApi = (endpoint: string, apiKey: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!apiKey) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const result = await apiFetch(endpoint, apiKey);
                setData(result.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint, apiKey]);

    return { data, loading, error };
};

const apiFetchV4 = async (endpoint: string, apiKey: string, options: RequestInit = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': apiKey,
        ...options.headers,
    };

    const response = await fetch(`${ELASTIC_EMAIL_API_V4_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.Error || 'V4 API request failed');
        } catch (e) {
             throw new Error(`V4 API request failed with status ${response.status}`);
        }
    }
    
    if (response.status === 204 || options.method === 'DELETE') {
        return null; // No content to parse
    }

    return response.json();
};

const useApiV4 = <T,>(endpoint: string, apiKey: string, options: RequestInit = {}) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!apiKey) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const result = await apiFetchV4(endpoint, apiKey, options);
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint, apiKey, JSON.stringify(options)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};


// --- UI Components ---
const Loader = () => <div className="loader"></div>;

const CenteredLoader = () => <div className="centered-container"><Loader /></div>;

const ErrorMessage = ({ message, children }: { message: string, children?: ReactNode }) => (
    <div className="error-message">
        <strong>Error:</strong> {message}
        {children}
    </div>
);

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

const SecretViewer = ({ secretType, secret, onDone }: {secretType: string, secret: string, onDone: () => void}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={true} onClose={onDone} title={`${secretType} Created Successfully`}>
            <div>
                <p>Your new {secretType.toLowerCase()} has been created. For security reasons, this is the **only time** the secret will be displayed. Please copy it and store it in a safe place.</p>
                <div className="secret-display">
                    <label>{secretType}</label>
                     <div className="secret-value-wrapper">
                        <input type="text" readOnly value={secret} />
                        <button onClick={copyToClipboard} className="btn">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
                <div className="form-actions">
                    <button onClick={onDone} className="btn btn-primary">Done</button>
                </div>
            </div>
        </Modal>
    );
};

// --- App Views ---

const StatisticsView = ({ apiKey }: { apiKey: string }) => {
    const { data, loading, error } = useApi('/log/summary', apiKey);

    const StatCard = ({ title, value, icon }: { title: string, value: any, icon: string }) => (
        <div className="card account-card">
            <div className="card-icon-wrapper">
                <Icon path={icon} />
            </div>
            <div className="card-details">
                <h3 className="card-title">{title}</h3>
                <div className="card-content">{loading ? '...' : value}</div>
            </div>
        </div>
    );

    if (loading) return <CenteredLoader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
            <div className="content-header">
                <h2>Statistics</h2>
                <p>An overview of your email activity.</p>
            </div>
            <div className="card-grid account-grid">
                <StatCard title="Emails Sent" value={data.log.TotalSent?.toLocaleString()} icon={ICONS.SEND} />
                <StatCard title="Emails Bounced" value={data.log.Bounced?.toLocaleString()} icon={ICONS.BOUNCED} />
                <StatCard title="Emails Opened" value={(data.log.Opened?.toLocaleString() ?? '0')} icon={ICONS.EYE} />
                <StatCard title="Emails Clicked" value={(data.log.Clicked?.toLocaleString() ?? '0')} icon={ICONS.CLICK} />
                <StatCard title="Complaints" value={data.log.Abuse?.toLocaleString()} icon={ICONS.COMPLAINT} />
                <StatCard title="Emails Unsubscribed" value={data.log.Unsubscribed?.toLocaleString()} icon={ICONS.LOG_OUT} />
            </div>
        </div>
    );
};

const AccountDataCard = ({ title, value, icon, children }: { title: string, value?: any, icon: string, children?: ReactNode }) => (
    <div className="card account-card">
        <div className="card-icon-wrapper">
            <Icon path={icon} />
        </div>
        <div className="card-details">
            <h3 className="card-title">{title}</h3>
            <div className="card-content">
                {children || value}
            </div>
        </div>
    </div>
);

const AccountView = ({ apiKey }: { apiKey: string }) => {
    const { data, loading, error } = useApi('/account/load', apiKey);

    if (loading) return <CenteredLoader />;
    if (error) return <ErrorMessage message={error} />;

    const getReputationColor = (rep: number) => {
        if (rep > 95) return 'good';
        if (rep > 80) return 'medium';
        return 'bad';
    };
    
    const reputation = data?.Reputation ? data.Reputation * 100 : 0;

    const getStatusInfo = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return { className: 'badge-success', text: 'Active' };
            case 'in review': return { className: 'badge-warning', text: 'In Review' };
            case 'abuse': return { className: 'badge-danger', text: 'Abuse Block' };
            case 'needs verification': return { className: 'badge-info', text: 'Needs Verification' };
            default: return { className: 'badge-default', text: status || 'Unknown' };
        }
    };

    const statusInfo = getStatusInfo(data.Status);

    return (
        <div>
            <div className="content-header">
                <h2>Account</h2>
                <p>Your account details and status.</p>
            </div>
            <div className="card-grid account-grid">
                <AccountDataCard title="Account Status" icon={ICONS.SETTINGS}>
                    <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>
                </AccountDataCard>
                <AccountDataCard title="Total Emails Sent" value={data.TotalEmailsSent?.toLocaleString()} icon={ICONS.SEND} />
                <AccountDataCard title="Reputation" icon={ICONS.REPUTATION}>
                     <span className={`reputation-score ${getReputationColor(reputation)}`}>
                        {reputation.toFixed(2)}%
                    </span>
                </AccountDataCard>
                <AccountDataCard title="Remaining Email Credits" value={data.EmailCredits?.toLocaleString()} icon={ICONS.CREDIT_CARD} />
                <AccountDataCard title="Total Contacts" value={data.ContactsCount?.toLocaleString()} icon={ICONS.USERS} />
                <AccountDataCard title="Account Creation Date" value={new Date(data.DateCreated).toLocaleDateString()} icon={ICONS.CALENDAR} />
            </div>
        </div>
    );
};

const SendEmailView = ({ apiKey }: { apiKey: string }) => {
    // This is a placeholder as per the original file. Full implementation can be added.
    return (
        <div>
            <div className="content-header">
                <h2>Send Email</h2>
                <p>This feature is not yet implemented.</p>
            </div>
        </div>
    );
};

const CampaignsView = ({ apiKey }: { apiKey: string }) => {
    const { data: campaigns, loading, error } = useApiV4<any[]>('/campaigns', apiKey);
    
    const statusMap: { [key: number]: { text: string; className: string } } = {
        1: { text: 'Draft', className: 'badge-default' },
        2: { text: 'Sending', className: 'badge-info' },
        3: { text: 'Completed', className: 'badge-success' },
        4: { text: 'Cancelled', className: 'badge-warning' },
        5: { text: 'Scheduled', className: 'badge-info' },
    };

    if (loading) return <CenteredLoader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
            <div className="content-header">
                <h2>Campaigns</h2>
                <p>Manage your email campaigns.</p>
            </div>
             <div className="card-grid list-grid" style={{ gridTemplateColumns: '1fr' }}>
                {!campaigns || campaigns.length === 0 ? (
                    <p>No campaigns found.</p>
                ) : (
                    campaigns.map((campaign) => {
                        const status = statusMap[campaign.Status] || { text: 'Unknown', className: 'badge-default' };
                        return (
                            <div key={campaign.Name} className="list-card">
                                <div className="list-card-header">
                                    <h3>{campaign.Name}</h3>
                                </div>
                                <div className="list-card-body">
                                    <div className="list-card-stat">
                                        <span>Recipients</span>
                                        <strong>{campaign.Recipients?.toLocaleString() || 0}</strong>
                                    </div>
                                    <div className="list-card-stat">
                                        <span>Sent</span>
                                        <strong>{campaign.Sent?.toLocaleString() || 0}</strong>
                                    </div>
                                    <div className="list-card-stat">
                                        <span>Opened</span>
                                        <strong>{campaign.Opened?.toLocaleString() || 0}</strong>
                                    </div>
                                    <div className="list-card-stat">
                                        <span>Clicked</span>
                                        <strong>{campaign.Clicked?.toLocaleString() || 0}</strong>
                                    </div>
                                </div>
                                <div className="list-card-footer">
                                    <span>Status</span>
                                    <span className={`badge ${status.className}`}>{status.text}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const DomainsView = ({ apiKey }: { apiKey: string }) => {
    const { data: domains, loading, error, refetch } = useApiV4<any[]>('/domains', apiKey);
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

    const toggleExpand = (domainName: string) => {
        setExpandedDomain(expandedDomain === domainName ? null : domainName);
    };

    if (loading) return <CenteredLoader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
            <div className="content-header">
                <h2>Domains</h2>
                <p>Manage your sending domains and verify their DNS records.</p>
            </div>
             <div className="card-grid domain-grid">
                {domains && domains.map(domain => {
                    const domainName = domain.Domain; // Safe access
                    if (!domainName) return null;

                    const isExpanded = expandedDomain === domainName;
                    return (
                        <div key={domainName} className="card domain-card">
                             <div className="domain-card-header">
                                <h3>{domainName}</h3>
                                <div className="action-buttons">
                                    <button className="btn-icon" onClick={() => {}}><Icon path={ICONS.DELETE} /></button>
                                    <button className="btn" onClick={() => {}}>Verify</button>
                                </div>
                            </div>
                            <div className="domain-card-body">
                                <div className="domain-card-statuses">
                                    <div><span>SPF</span> <span className={`badge ${domain.Spf ? 'badge-success':'badge-danger'}`}>{domain.Spf ? 'Verified':'Unverified'}</span></div>
                                    <div><span>DKIM</span><span className={`badge ${domain.Dkim ? 'badge-success':'badge-danger'}`}>{domain.Dkim ? 'Verified':'Unverified'}</span></div>
                                    <div><span>Tracking</span><span className={`badge ${domain.Tracking ? 'badge-success':'badge-danger'}`}>{domain.Tracking ? 'Verified':'Unverified'}</span></div>
                                    <div><span>MX</span><span className={`badge ${domain.Mx ? 'badge-success':'badge-danger'}`}>{domain.Mx ? 'Verified':'Unverified'}</span></div>
                                </div>
                            </div>
                             <div className="domain-card-footer" onClick={() => toggleExpand(domainName)}>
                                <span>DNS Records</span>
                                <Icon path={ICONS.CHEVRON_DOWN} className={isExpanded ? 'expanded' : ''}/>
                            </div>
                            {isExpanded && (
                                <div className="domain-card-expanded-content">
                                    <p>Add these records to your domain's DNS settings.</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EmailListView = ({ apiKey }: { apiKey: string }) => {
    const { data: lists, loading, error, refetch } = useApiV4<any[]>('/lists', apiKey);
    const [newListName, setNewListName] = useState('');
    const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // New state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedList, setSelectedList] = useState<string | null>(null);


    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;

        setIsCreating(true);
        setActionStatus(null);
        try {
            await apiFetchV4('/lists', apiKey, {
                method: 'POST',
                body: JSON.stringify({ ListName: newListName, AllowUnsubscribe: true }),
            });
            setActionStatus({ type: 'success', message: `List "${newListName}" created successfully!` });
            setNewListName('');
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to create list: ${err.message}` });
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleViewContacts = (listName: string) => {
        setSelectedList(listName);
        setIsModalOpen(true);
    };

    if (loading) return <CenteredLoader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
            <div className="content-header">
                <h2>Email Lists</h2>
                <p>Manage your contact lists.</p>
            </div>
            
            <div className="view-header">
                <h3>Create New List</h3>
            </div>
            <form onSubmit={handleCreateList} className="create-list-form">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter new list name"
                    disabled={isCreating}
                />
                <button type="submit" className="btn btn-primary" disabled={isCreating || !newListName}>
                    {isCreating ? 'Creating...' : 'Create List'}
                </button>
            </form>
             {actionStatus && (
                <div className={`action-status ${actionStatus.type}`}>
                    {actionStatus.message}
                </div>
            )}
            
            <div className="card-grid list-grid" style={{marginTop: '2rem'}}>
                {!lists || lists.length === 0 ? (
                    <p>No lists found.</p>
                ) : (
                    lists.map((list) => (
                        <div key={list.ListName} className="card list-card clickable" onClick={() => handleViewContacts(list.ListName)}>
                           <div className="list-card-header">
                                <h3>{list.ListName}</h3>
                           </div>
                           <div className="list-card-body">
                               <div className="list-card-stat">
                                   <span>Contacts</span>
                                   <strong>{list.ContactsCount.toLocaleString()}</strong>
                               </div>
                           </div>
                           <div className="list-card-footer">
                                <span>Created</span>
                                <span>{new Date(list.DateAdded).toLocaleDateString()}</span>
                           </div>
                        </div>
                    ))
                )}
            </div>
            {selectedList && (
                <ListContactsViewer 
                    apiKey={apiKey} 
                    listName={selectedList} 
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedList(null);
                    }} 
                />
            )}
        </div>
    );
};

const ListContactsViewer = ({ apiKey, listName, isOpen, onClose }: { apiKey: string, listName: string, isOpen: boolean, onClose: () => void }) => {
    const { data: contacts, loading, error } = useApiV4<any[]>(`/lists/${listName}/contacts`, apiKey, { method: 'GET' });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Contacts in "${listName}"`}>
            {loading && <CenteredLoader />}
            {error && <ErrorMessage message={error} />}
            {contacts && (
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
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>No contacts found in this list.</td>
                                </tr>
                            ) : (
                                contacts.map(contact => (
                                    <tr key={contact.Email}>
                                        <td>{contact.Email}</td>
                                        <td>{contact.FirstName}</td>
                                        <td>{contact.LastName}</td>
                                        <td><span className={`badge ${contact.Status === 'Active' ? 'badge-success' : 'badge-default'}`}>{contact.Status}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};

const ContactsView = ({ apiKey }: { apiKey: string }) => {
    // This is a placeholder as per the original file. Full implementation can be added.
    const [modalAction, setModalAction] = useState<'add' | 'view' | null>(null);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const { data: contacts, loading, error, refetch } = useApiV4<any[]>('/contacts', apiKey);

    const handleAddContact = async (formData: any) => {
        setActionStatus(null);
        try {
            await apiFetchV4('/contacts', apiKey, {
                method: 'POST',
                body: JSON.stringify({
                    Email: formData.Email,
                    FirstName: formData.FirstName,
                    LastName: formData.LastName,
                }),
            });
            setActionStatus({ type: 'success', message: 'Contact added successfully!' });
            setModalAction(null);
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to add contact: ${err.message}` });
            // Don't close modal on error
        }
    };
    
    return (
        <div>
            <div className="content-header">
                <h2>Contacts</h2>
                <p>Manage all your contacts.</p>
            </div>
             <div className="view-header">
                 <div className="search-bar">
                    <input type="text" placeholder="Search contacts..." />
                </div>
                <button className="btn btn-primary" onClick={() => setModalAction('add')}>
                    <Icon path={ICONS.USER_PLUS} /> Add Contact
                </button>
            </div>
            
            {loading && <CenteredLoader />}
            {error && <ErrorMessage message={error} />}
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Date Added</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts && contacts.map(contact => (
                            <tr key={contact.Email}>
                                <td>{contact.Email}</td>
                                <td>{contact.FirstName} {contact.LastName}</td>
                                <td>{contact.Status}</td>
                                <td>{new Date(contact.DateAdded).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn-icon" onClick={() => { setSelectedContact(contact); setModalAction('view'); }}>
                                        <Icon path={ICONS.EYE} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {modalAction === 'add' && (
                <AddContactModal 
                    onClose={() => setModalAction(null)} 
                    onSubmit={handleAddContact}
                    actionStatus={actionStatus}
                />
            )}
            {modalAction === 'view' && selectedContact && (
                <ViewContactModal 
                    contact={selectedContact}
                    onClose={() => { setModalAction(null); setSelectedContact(null); }}
                />
            )}
        </div>
    );
};

const AddContactModal = ({ onClose, onSubmit, actionStatus }: { onClose: () => void, onSubmit: (data: any) => Promise<void>, actionStatus: any }) => {
    const [formData, setFormData] = useState({ Email: '', FirstName: '', LastName: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Contact">
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="Email" value={formData.Email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} />
                </div>
                {actionStatus && actionStatus.type === 'error' && (
                    <div className="action-status error">{actionStatus.message}</div>
                )}
                <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Contact'}
                </button>
            </form>
        </Modal>
    );
};

const ViewContactModal = ({ contact, onClose }: { contact: any, onClose: () => void }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Contact Details">
            <div className="contact-details-grid">
                <dt>Email</dt><dd>{contact.Email}</dd>
                <dt>Name</dt><dd>{contact.FirstName} {contact.LastName}</dd>
                <dt>Status</dt><dd>{contact.Status}</dd>
                <dt>Date Added</dt><dd>{new Date(contact.DateAdded).toLocaleString()}</dd>
            </div>
        </Modal>
    );
};

const SegmentsView = ({ apiKey }: { apiKey: string }) => {
    // This is a placeholder as per the original file. Full implementation can be added.
    return (
        <div>
            <div className="content-header">
                <h2>Segments</h2>
                <p>This feature is not yet implemented.</p>
            </div>
        </div>
    );
};

const SmtpView = ({ apiKey }: { apiKey: string }) => {
    // This is a placeholder as per the original file. Full implementation can be added.
    return (
        <div>
            <div className="content-header">
                <h2>SMTP Credentials</h2>
                <p>This feature is not yet implemented.</p>
            </div>
        </div>
    );
};

const ApiKeysView = ({ apiKey }: { apiKey: string }) => {
    const { data: apiKeys, loading, error, refetch } = useApiV4<any[]>('/security/apikeys', apiKey);
    const [modalAction, setModalAction] = useState<'add' | 'edit' | null>(null);
    const [selectedKey, setSelectedKey] = useState<any>(null);
    const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [newSecret, setNewSecret] = useState<string | null>(null);
    
    const handleModalOpen = (action: 'add' | 'edit', apiKeyData: any = null) => {
        setActionStatus(null);
        setSelectedKey(apiKeyData);
        setModalAction(action);
    };

    const handleModalClose = () => {
        setModalAction(null);
        setSelectedKey(null);
    };

    const handleSubmit = async (formData: any) => {
        setActionStatus(null);
        const isEditing = modalAction === 'edit';
        const endpoint = isEditing ? `/security/apikeys/${selectedKey.AccessKey}` : '/security/apikeys';
        const method = isEditing ? 'PUT' : 'POST';

        const payload: any = {
            Name: formData.Name,
            AccessLevel: formData.AccessLevel,
        };

        if (formData.Expires) {
            payload.Expires = new Date(formData.Expires).toISOString();
        }

        try {
            const result = await apiFetchV4(endpoint, apiKey, {
                method,
                body: JSON.stringify(payload)
            });
            setActionStatus({ type: 'success', message: `API Key ${isEditing ? 'updated' : 'created'} successfully!`});
            if (!isEditing && result.AccessKey) {
                setNewSecret(result.AccessKey);
            }
            handleModalClose();
            refetch();
        } catch (err: any) {
             setActionStatus({ type: 'error', message: `Operation failed: ${err.message}` });
        }
    };
    
    const handleDelete = async (accessKey: string) => {
        if (!window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
            return;
        }
        setActionStatus(null);
        try {
            await apiFetchV4(`/security/apikeys/${accessKey}`, apiKey, { method: 'DELETE' });
            setActionStatus({ type: 'success', message: 'API Key deleted successfully.' });
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to delete key: ${err.message}` });
        }
    };

    if (loading) return <CenteredLoader />;

    return (
        <div>
            {newSecret && <SecretViewer secretType="API Key" secret={newSecret} onDone={() => setNewSecret(null)} />}
            <div className="view-header">
                <h2>API Keys</h2>
                <button className="btn btn-primary" onClick={() => handleModalOpen('add')}>
                    <Icon path={ICONS.PLUS} /> Add API Key
                </button>
            </div>
             {actionStatus && <div className={`action-status ${actionStatus.type}`}>{actionStatus.message}</div>}

            {error && (
                <ErrorMessage message={error}>
                    {error.includes("Account not found") && (
                        <small><strong>Hint:</strong> Your master API key might be missing the required permissions (e.g., `View/Security`, `Modify/Security`). Please check its access level.</small>
                    )}
                </ErrorMessage>
            )}

            <div className="card-grid smtp-grid">
                {apiKeys && Array.isArray(apiKeys) && apiKeys.map(key => (
                    <div key={key.AccessKey} className="card apikey-card">
                        <div className="smtp-card-header">
                            <h3>{key.Name}</h3>
                            <div className="action-buttons">
                                <button className="btn-icon" onClick={() => handleModalOpen('edit', key)}><Icon path={ICONS.EDIT} /></button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(key.AccessKey)}><Icon path={ICONS.DELETE} /></button>
                            </div>
                        </div>
                         <div className="apikey-card-body">
                            <div className="smtp-detail-item">
                                <span>Access Key</span>
                                <strong className="monospace">{key.AccessKey.slice(0, 4)}...{key.AccessKey.slice(-4)}</strong>
                            </div>
                            <div className="smtp-detail-item">
                                <span>Expires</span>
                                <strong>{key.Expires ? new Date(key.Expires).toLocaleDateString() : 'Never'}</strong>
                            </div>
                            <div className="smtp-detail-item full-span">
                                <span>Permissions</span>
                                <div className="permissions-display">
                                    {key.AccessLevel.map((p: string) => <span key={p} className="badge badge-default">{p}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {apiKeys && apiKeys.length === 0 && <p>No API keys found.</p>}
            </div>

            {modalAction && (
                <ApiKeyModal
                    isOpen={!!modalAction}
                    onClose={handleModalClose}
                    onSubmit={handleSubmit}
                    apiKeyData={selectedKey}
                    actionStatus={actionStatus}
                />
            )}
        </div>
    );
};

const ApiKeyModal = ({ isOpen, onClose, onSubmit, apiKeyData, actionStatus }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => Promise<void>, apiKeyData: any, actionStatus: any }) => {
    const [name, setName] = useState('');
    const [expires, setExpires] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const PERMISSIONS = {
        Account: ['View Account', 'Modify Account', 'Modify Contacts', 'Modify Files', 'Modify-templates'],
        Security: ['View Security', 'Modify Security', 'Modify Smtp'],
        Sending: ['Send Http', 'Send Smtp'],
        Email: ['View Email', 'Modify Email'],
        Campaigns: ['View Campaigns', 'Modify Campaigns'],
        Channels: ['View Channels', 'Modify Channels'],
        Contacts: ['View Contacts', 'Modify Contacts'],
        Lists: ['View Lists', 'Modify Lists'],
        Segments: ['View Segments', 'Modify Segments'],
        Subaccounts: ['View Subaccounts', 'Modify Subaccounts', 'Manage Subaccounts'],
        Reports: ['View Reports'],
        Settings: ['Modify Settings']
    };

    useEffect(() => {
        if (apiKeyData) {
            setName(apiKeyData.Name || '');
            setExpires(apiKeyData.Expires ? apiKeyData.Expires.split('T')[0] : '');
            setSelectedPermissions(apiKeyData.AccessLevel || []);
        } else {
            setName('');
            setExpires('');
            setSelectedPermissions([]);
        }
    }, [apiKeyData]);
    
    const handlePermissionChange = (permission: string) => {
        setSelectedPermissions(prev => 
            prev.includes(permission) 
            ? prev.filter(p => p !== permission)
            : [...prev, permission]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit({ Name: name, Expires: expires, AccessLevel: selectedPermissions });
        setIsSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={apiKeyData ? 'Edit API Key' : 'Create API Key'}>
            <form onSubmit={handleSubmit} className="modal-form">
                 <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                 <div className="form-group">
                    <label>Expires (optional)</label>
                    <input type="date" value={expires} onChange={e => setExpires(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Permissions</label>
                    <div className="permissions-grid">
                        {Object.entries(PERMISSIONS).map(([group, permissions]) => (
                            <div key={group} className="permission-group">
                                <h4>{group}</h4>
                                {permissions.map(perm => (
                                    <label key={perm} className="permission-item">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedPermissions.includes(perm)}
                                            onChange={() => handlePermissionChange(perm)}
                                        />
                                        <span>{perm.replace(/[-]/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {actionStatus && actionStatus.type === 'error' && <div className="action-status error">{actionStatus.message}</div>}
                <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                    {isSubmitting ? (apiKeyData ? 'Saving...' : 'Creating...') : (apiKeyData ? 'Save Changes' : 'Create API Key')}
                </button>
            </form>
        </Modal>
    );
};


// --- Main App Component ---
const App = () => {
    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('elasticemail_apikey'));
    const [activeView, setActiveView] = useState('Statistics');
    
    const handleLogin = (key: string) => {
        localStorage.setItem('elasticemail_apikey', key);
        setApiKey(key);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('elasticemail_apikey');
        setApiKey(null);
    };

    if (!apiKey) {
        return <AuthPage onLogin={handleLogin} />;
    }

    const navItems = [
        { id: 'Statistics', label: 'Statistics', icon: ICONS.STATISTICS },
        { id: 'Account', label: 'Account', icon: ICONS.ACCOUNT },
        { id: 'SendEmail', label: 'Send Email', icon: ICONS.SEND },
        { id: 'Campaigns', label: 'Campaigns', icon: ICONS.CAMPAIGNS },
        { id: 'Domains', label: 'Domains', icon: ICONS.GLOBE },
        { id: 'EmailLists', label: 'Email Lists', icon: ICONS.EMAIL_LIST },
        { id: 'Contacts', label: 'Contacts', icon: ICONS.CONTACTS },
        { id: 'Segments', label: 'Segments', icon: ICONS.PUZZLE },
        { id: 'Smtp', label: 'SMTP', icon: ICONS.SMTP },
        { id: 'ApiKeys', label: 'API Keys', icon: ICONS.API },
    ];
    
    const views: { [key: string]: ReactNode } = {
        Statistics: <StatisticsView apiKey={apiKey} />,
        Account: <AccountView apiKey={apiKey} />,
        SendEmail: <SendEmailView apiKey={apiKey} />,
        Campaigns: <CampaignsView apiKey={apiKey} />,
        Domains: <DomainsView apiKey={apiKey} />,
        EmailLists: <EmailListView apiKey={apiKey} />,
        Contacts: <ContactsView apiKey={apiKey} />,
        Segments: <SegmentsView apiKey={apiKey} />,
        Smtp: <SmtpView apiKey={apiKey} />,
        ApiKeys: <ApiKeysView apiKey={apiKey} />,
    };

    return (
        <div className="app-layout">
            <nav className="sidebar">
                <div>
                    <h1 className="sidebar-header logo-font">MegaMail</h1>
                    <div className="nav">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                                onClick={() => setActiveView(item.id)}
                            >
                                <Icon path={item.icon} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                    <Icon path={ICONS.LOG_OUT} />
                    Logout
                </button>
            </nav>
            <main className="content">
                {views[activeView]}
            </main>
        </div>
    );
};

const AuthPage = ({ onLogin }: { onLogin: (apiKey: string) => void }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Test API key by fetching account info
            await apiFetch('/account/load', key);
            onLogin(key);
        } catch (err: any) {
            setError('Invalid API Key. Please check and try again.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="logo-font">MegaMail</h1>
                <p>Enter your Elastic Email API Key to continue</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type={isKeyVisible ? 'text' : 'password'}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Your API Key"
                            required
                        />
                         <button type="button" className="input-icon-btn" onClick={() => setIsKeyVisible(!isKeyVisible)}>
                            <Icon path={isKeyVisible ? ICONS.EYE : ICONS.UNLOCK} />
                        </button>
                    </div>
                    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading && <Loader />}
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
