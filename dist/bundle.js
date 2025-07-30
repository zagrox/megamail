import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const ELASTIC_EMAIL_API_BASE = 'https://api.elasticemail.com/v2';
const ELASTIC_EMAIL_API_V4_BASE = 'https://api.elasticemail.com/v4';

// --- Icon Components ---
const Icon = ({
  path,
  className = ''
}) => React.createElement("svg", {
  className: `icon ${className}`,
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg"
}, React.createElement("path", {
  d: path
}));
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
const apiFetch = async (endpoint, apiKey) => {
  const response = await fetch(`${ELASTIC_EMAIL_API_BASE}${endpoint}?apiKey=${apiKey}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
};
const useApi = (endpoint, apiKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, apiKey]);
  return {
    data,
    loading,
    error
  };
};
const apiFetchV4 = async (endpoint, apiKey, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-ElasticEmail-ApiKey': apiKey,
    ...options.headers
  };
  const response = await fetch(`${ELASTIC_EMAIL_API_V4_BASE}${endpoint}`, {
    ...options,
    headers
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
const useApiV4 = (endpoint, apiKey, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiKey, JSON.stringify(options)]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// --- UI Components ---
const Loader = () => React.createElement("div", {
  className: "loader"
});
const CenteredLoader = () => React.createElement("div", {
  className: "centered-container"
}, React.createElement(Loader, null));
const ErrorMessage = ({
  message,
  children
}) => React.createElement("div", {
  className: "error-message"
}, React.createElement("strong", null, "Error:"), " ", message, children);
const Modal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-content",
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h3", null, title), React.createElement("button", {
    onClick: onClose,
    className: "modal-close-btn"
  }, "\xD7")), children));
};
const SecretViewer = ({
  secretType,
  secret,
  onDone
}) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return React.createElement(Modal, {
    isOpen: true,
    onClose: onDone,
    title: `${secretType} Created Successfully`
  }, React.createElement("div", null, React.createElement("p", null, "Your new ", secretType.toLowerCase(), " has been created. For security reasons, this is the ", React.createElement("strong", null, "only time"), " the secret will be displayed. Please copy it and store it in a safe place."), React.createElement("div", {
    className: "secret-display"
  }, React.createElement("label", null, secretType), React.createElement("div", {
    className: "secret-value-wrapper"
  }, React.createElement("input", {
    type: "text",
    readOnly: true,
    value: secret
  }), React.createElement("button", {
    onClick: copyToClipboard,
    className: "btn"
  }, copied ? 'Copied!' : 'Copy'))), React.createElement("div", {
    className: "form-actions"
  }, React.createElement("button", {
    onClick: onDone,
    className: "btn btn-primary"
  }, "Done"))));
};

// --- App Views ---

const StatisticsView = ({
  apiKey
}) => {
  const {
    data,
    loading,
    error
  } = useApi('/log/summary', apiKey);
  const StatCard = ({
    title,
    value,
    icon
  }) => React.createElement("div", {
    className: "card account-card"
  }, React.createElement("div", {
    className: "card-icon-wrapper"
  }, React.createElement(Icon, {
    path: icon
  })), React.createElement("div", {
    className: "card-details"
  }, React.createElement("h3", {
    className: "card-title"
  }, title), React.createElement("div", {
    className: "card-content"
  }, loading ? '...' : value)));
  if (loading) return React.createElement(CenteredLoader, null);
  if (error) return React.createElement(ErrorMessage, {
    message: error
  });
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Statistics"), React.createElement("p", null, "An overview of your email activity.")), React.createElement("div", {
    className: "card-grid account-grid"
  }, React.createElement(StatCard, {
    title: "Emails Sent",
    value: data.log.TotalSent?.toLocaleString(),
    icon: ICONS.SEND
  }), React.createElement(StatCard, {
    title: "Emails Bounced",
    value: data.log.Bounced?.toLocaleString(),
    icon: ICONS.BOUNCED
  }), React.createElement(StatCard, {
    title: "Emails Opened",
    value: data.log.Opened?.toLocaleString() ?? '0',
    icon: ICONS.EYE
  }), React.createElement(StatCard, {
    title: "Emails Clicked",
    value: data.log.Clicked?.toLocaleString() ?? '0',
    icon: ICONS.CLICK
  }), React.createElement(StatCard, {
    title: "Complaints",
    value: data.log.Abuse?.toLocaleString(),
    icon: ICONS.COMPLAINT
  }), React.createElement(StatCard, {
    title: "Emails Unsubscribed",
    value: data.log.Unsubscribed?.toLocaleString(),
    icon: ICONS.LOG_OUT
  })));
};
const AccountDataCard = ({
  title,
  value,
  icon,
  children
}) => React.createElement("div", {
  className: "card account-card"
}, React.createElement("div", {
  className: "card-icon-wrapper"
}, React.createElement(Icon, {
  path: icon
})), React.createElement("div", {
  className: "card-details"
}, React.createElement("h3", {
  className: "card-title"
}, title), React.createElement("div", {
  className: "card-content"
}, children || value)));
const AccountView = ({
  apiKey
}) => {
  const {
    data,
    loading,
    error
  } = useApi('/account/load', apiKey);
  if (loading) return React.createElement(CenteredLoader, null);
  if (error) return React.createElement(ErrorMessage, {
    message: error
  });
  const getReputationColor = rep => {
    if (rep > 95) return 'good';
    if (rep > 80) return 'medium';
    return 'bad';
  };
  const reputation = data?.Reputation ? data.Reputation * 100 : 0;
  const getStatusInfo = status => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          className: 'badge-success',
          text: 'Active'
        };
      case 'in review':
        return {
          className: 'badge-warning',
          text: 'In Review'
        };
      case 'abuse':
        return {
          className: 'badge-danger',
          text: 'Abuse Block'
        };
      case 'needs verification':
        return {
          className: 'badge-info',
          text: 'Needs Verification'
        };
      default:
        return {
          className: 'badge-default',
          text: status || 'Unknown'
        };
    }
  };
  const statusInfo = getStatusInfo(data.Status);
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Account"), React.createElement("p", null, "Your account details and status.")), React.createElement("div", {
    className: "card-grid account-grid"
  }, React.createElement(AccountDataCard, {
    title: "Account Status",
    icon: ICONS.SETTINGS
  }, React.createElement("span", {
    className: `badge ${statusInfo.className}`
  }, statusInfo.text)), React.createElement(AccountDataCard, {
    title: "Total Emails Sent",
    value: data.TotalEmailsSent?.toLocaleString(),
    icon: ICONS.SEND
  }), React.createElement(AccountDataCard, {
    title: "Reputation",
    icon: ICONS.REPUTATION
  }, React.createElement("span", {
    className: `reputation-score ${getReputationColor(reputation)}`
  }, reputation.toFixed(2), "%")), React.createElement(AccountDataCard, {
    title: "Remaining Email Credits",
    value: data.EmailCredits?.toLocaleString(),
    icon: ICONS.CREDIT_CARD
  }), React.createElement(AccountDataCard, {
    title: "Total Contacts",
    value: data.ContactsCount?.toLocaleString(),
    icon: ICONS.USERS
  }), React.createElement(AccountDataCard, {
    title: "Account Creation Date",
    value: new Date(data.DateCreated).toLocaleDateString(),
    icon: ICONS.CALENDAR
  })));
};
const SendEmailView = ({
  apiKey
}) => {
  // This is a placeholder as per the original file. Full implementation can be added.
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Send Email"), React.createElement("p", null, "This feature is not yet implemented.")));
};
const CampaignsView = ({
  apiKey
}) => {
  const {
    data: campaigns,
    loading,
    error
  } = useApiV4('/campaigns', apiKey);
  const statusMap = {
    1: {
      text: 'Draft',
      className: 'badge-default'
    },
    2: {
      text: 'Sending',
      className: 'badge-info'
    },
    3: {
      text: 'Completed',
      className: 'badge-success'
    },
    4: {
      text: 'Cancelled',
      className: 'badge-warning'
    },
    5: {
      text: 'Scheduled',
      className: 'badge-info'
    }
  };
  if (loading) return React.createElement(CenteredLoader, null);
  if (error) return React.createElement(ErrorMessage, {
    message: error
  });
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Campaigns"), React.createElement("p", null, "Manage your email campaigns.")), React.createElement("div", {
    className: "card-grid list-grid",
    style: {
      gridTemplateColumns: '1fr'
    }
  }, !campaigns || campaigns.length === 0 ? React.createElement("p", null, "No campaigns found.") : campaigns.map(campaign => {
    const status = statusMap[campaign.Status] || {
      text: 'Unknown',
      className: 'badge-default'
    };
    return React.createElement("div", {
      key: campaign.Name,
      className: "list-card"
    }, React.createElement("div", {
      className: "list-card-header"
    }, React.createElement("h3", null, campaign.Name)), React.createElement("div", {
      className: "list-card-body"
    }, React.createElement("div", {
      className: "list-card-stat"
    }, React.createElement("span", null, "Recipients"), React.createElement("strong", null, campaign.Recipients?.toLocaleString() || 0)), React.createElement("div", {
      className: "list-card-stat"
    }, React.createElement("span", null, "Sent"), React.createElement("strong", null, campaign.Sent?.toLocaleString() || 0)), React.createElement("div", {
      className: "list-card-stat"
    }, React.createElement("span", null, "Opened"), React.createElement("strong", null, campaign.Opened?.toLocaleString() || 0)), React.createElement("div", {
      className: "list-card-stat"
    }, React.createElement("span", null, "Clicked"), React.createElement("strong", null, campaign.Clicked?.toLocaleString() || 0))), React.createElement("div", {
      className: "list-card-footer"
    }, React.createElement("span", null, "Status"), React.createElement("span", {
      className: `badge ${status.className}`
    }, status.text)));
  })));
};
const DomainsView = ({
  apiKey
}) => {
  const {
    data: domains,
    loading,
    error,
    refetch
  } = useApiV4('/domains', apiKey);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const toggleExpand = domainName => {
    setExpandedDomain(expandedDomain === domainName ? null : domainName);
  };
  if (loading) return React.createElement(CenteredLoader, null);
  if (error) return React.createElement(ErrorMessage, {
    message: error
  });
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Domains"), React.createElement("p", null, "Manage your sending domains and verify their DNS records.")), React.createElement("div", {
    className: "card-grid domain-grid"
  }, domains && domains.map(domain => {
    const domainName = domain.Domain; // Safe access
    if (!domainName) return null;
    const isExpanded = expandedDomain === domainName;
    return React.createElement("div", {
      key: domainName,
      className: "card domain-card"
    }, React.createElement("div", {
      className: "domain-card-header"
    }, React.createElement("h3", null, domainName), React.createElement("div", {
      className: "action-buttons"
    }, React.createElement("button", {
      className: "btn-icon",
      onClick: () => {}
    }, React.createElement(Icon, {
      path: ICONS.DELETE
    })), React.createElement("button", {
      className: "btn",
      onClick: () => {}
    }, "Verify"))), React.createElement("div", {
      className: "domain-card-body"
    }, React.createElement("div", {
      className: "domain-card-statuses"
    }, React.createElement("div", null, React.createElement("span", null, "SPF"), " ", React.createElement("span", {
      className: `badge ${domain.Spf ? 'badge-success' : 'badge-danger'}`
    }, domain.Spf ? 'Verified' : 'Unverified')), React.createElement("div", null, React.createElement("span", null, "DKIM"), React.createElement("span", {
      className: `badge ${domain.Dkim ? 'badge-success' : 'badge-danger'}`
    }, domain.Dkim ? 'Verified' : 'Unverified')), React.createElement("div", null, React.createElement("span", null, "Tracking"), React.createElement("span", {
      className: `badge ${domain.Tracking ? 'badge-success' : 'badge-danger'}`
    }, domain.Tracking ? 'Verified' : 'Unverified')), React.createElement("div", null, React.createElement("span", null, "MX"), React.createElement("span", {
      className: `badge ${domain.Mx ? 'badge-success' : 'badge-danger'}`
    }, domain.Mx ? 'Verified' : 'Unverified')))), React.createElement("div", {
      className: "domain-card-footer",
      onClick: () => toggleExpand(domainName)
    }, React.createElement("span", null, "DNS Records"), React.createElement(Icon, {
      path: ICONS.CHEVRON_DOWN,
      className: isExpanded ? 'expanded' : ''
    })), isExpanded && React.createElement("div", {
      className: "domain-card-expanded-content"
    }, React.createElement("p", null, "Add these records to your domain's DNS settings.")));
  })));
};
const EmailListView = ({
  apiKey
}) => {
  const {
    data: lists,
    loading,
    error,
    refetch
  } = useApiV4('/lists', apiKey);
  const [newListName, setNewListName] = useState('');
  const [actionStatus, setActionStatus] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const handleCreateList = async e => {
    e.preventDefault();
    if (!newListName) return;
    setIsCreating(true);
    setActionStatus(null);
    try {
      await apiFetchV4('/lists', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          ListName: newListName,
          AllowUnsubscribe: true
        })
      });
      setActionStatus({
        type: 'success',
        message: `List "${newListName}" created successfully!`
      });
      setNewListName('');
      refetch();
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: `Failed to create list: ${err.message}`
      });
    } finally {
      setIsCreating(false);
    }
  };
  const handleViewContacts = listName => {
    setSelectedList(listName);
    setIsModalOpen(true);
  };
  if (loading) return React.createElement(CenteredLoader, null);
  if (error) return React.createElement(ErrorMessage, {
    message: error
  });
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Email Lists"), React.createElement("p", null, "Manage your contact lists.")), React.createElement("div", {
    className: "view-header"
  }, React.createElement("h3", null, "Create New List")), React.createElement("form", {
    onSubmit: handleCreateList,
    className: "create-list-form"
  }, React.createElement("input", {
    type: "text",
    value: newListName,
    onChange: e => setNewListName(e.target.value),
    placeholder: "Enter new list name",
    disabled: isCreating
  }), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: isCreating || !newListName
  }, isCreating ? 'Creating...' : 'Create List')), actionStatus && React.createElement("div", {
    className: `action-status ${actionStatus.type}`
  }, actionStatus.message), React.createElement("div", {
    className: "card-grid list-grid",
    style: {
      marginTop: '2rem'
    }
  }, !lists || lists.length === 0 ? React.createElement("p", null, "No lists found.") : lists.map(list => React.createElement("div", {
    key: list.ListName,
    className: "card list-card clickable",
    onClick: () => handleViewContacts(list.ListName)
  }, React.createElement("div", {
    className: "list-card-header"
  }, React.createElement("h3", null, list.ListName)), React.createElement("div", {
    className: "list-card-body"
  }, React.createElement("div", {
    className: "list-card-stat"
  }, React.createElement("span", null, "Contacts"), React.createElement("strong", null, list.ContactsCount.toLocaleString()))), React.createElement("div", {
    className: "list-card-footer"
  }, React.createElement("span", null, "Created"), React.createElement("span", null, new Date(list.DateAdded).toLocaleDateString()))))), selectedList && React.createElement(ListContactsViewer, {
    apiKey: apiKey,
    listName: selectedList,
    isOpen: isModalOpen,
    onClose: () => {
      setIsModalOpen(false);
      setSelectedList(null);
    }
  }));
};
const ListContactsViewer = ({
  apiKey,
  listName,
  isOpen,
  onClose
}) => {
  const {
    data: contacts,
    loading,
    error
  } = useApiV4(`/lists/${listName}/contacts`, apiKey, {
    method: 'GET'
  });
  return React.createElement(Modal, {
    isOpen: isOpen,
    onClose: onClose,
    title: `Contacts in "${listName}"`
  }, loading && React.createElement(CenteredLoader, null), error && React.createElement(ErrorMessage, {
    message: error
  }), contacts && React.createElement("div", {
    className: "table-container"
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Email"), React.createElement("th", null, "First Name"), React.createElement("th", null, "Last Name"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, contacts.length === 0 ? React.createElement("tr", null, React.createElement("td", {
    colSpan: 4,
    style: {
      textAlign: 'center'
    }
  }, "No contacts found in this list.")) : contacts.map(contact => React.createElement("tr", {
    key: contact.Email
  }, React.createElement("td", null, contact.Email), React.createElement("td", null, contact.FirstName), React.createElement("td", null, contact.LastName), React.createElement("td", null, React.createElement("span", {
    className: `badge ${contact.Status === 'Active' ? 'badge-success' : 'badge-default'}`
  }, contact.Status))))))));
};
const ContactsView = ({
  apiKey
}) => {
  // This is a placeholder as per the original file. Full implementation can be added.
  const [modalAction, setModalAction] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const {
    data: contacts,
    loading,
    error,
    refetch
  } = useApiV4('/contacts', apiKey);
  const handleAddContact = async formData => {
    setActionStatus(null);
    try {
      await apiFetchV4('/contacts', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          Email: formData.Email,
          FirstName: formData.FirstName,
          LastName: formData.LastName
        })
      });
      setActionStatus({
        type: 'success',
        message: 'Contact added successfully!'
      });
      setModalAction(null);
      refetch();
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: `Failed to add contact: ${err.message}`
      });
      // Don't close modal on error
    }
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Contacts"), React.createElement("p", null, "Manage all your contacts.")), React.createElement("div", {
    className: "view-header"
  }, React.createElement("div", {
    className: "search-bar"
  }, React.createElement("input", {
    type: "text",
    placeholder: "Search contacts..."
  })), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setModalAction('add')
  }, React.createElement(Icon, {
    path: ICONS.USER_PLUS
  }), " Add Contact")), loading && React.createElement(CenteredLoader, null), error && React.createElement(ErrorMessage, {
    message: error
  }), React.createElement("div", {
    className: "table-container"
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Email"), React.createElement("th", null, "Name"), React.createElement("th", null, "Status"), React.createElement("th", null, "Date Added"), React.createElement("th", null))), React.createElement("tbody", null, contacts && contacts.map(contact => React.createElement("tr", {
    key: contact.Email
  }, React.createElement("td", null, contact.Email), React.createElement("td", null, contact.FirstName, " ", contact.LastName), React.createElement("td", null, contact.Status), React.createElement("td", null, new Date(contact.DateAdded).toLocaleDateString()), React.createElement("td", null, React.createElement("button", {
    className: "btn-icon",
    onClick: () => {
      setSelectedContact(contact);
      setModalAction('view');
    }
  }, React.createElement(Icon, {
    path: ICONS.EYE
  }))))))), modalAction === 'add' && React.createElement(AddContactModal, {
    onClose: () => setModalAction(null),
    onSubmit: handleAddContact,
    actionStatus: actionStatus
  }), modalAction === 'view' && selectedContact && React.createElement(ViewContactModal, {
    contact: selectedContact,
    onClose: () => {
      setModalAction(null);
      setSelectedContact(null);
    }
  }));
};
const AddContactModal = ({
  onClose,
  onSubmit,
  actionStatus
}) => {
  const [formData, setFormData] = useState({
    Email: '',
    FirstName: '',
    LastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };
  return React.createElement(Modal, {
    isOpen: true,
    onClose: onClose,
    title: "Add New Contact"
  }, React.createElement("form", {
    onSubmit: handleSubmit,
    className: "modal-form"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "Email Address"), React.createElement("input", {
    type: "email",
    name: "Email",
    value: formData.Email,
    onChange: handleChange,
    required: true
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "First Name"), React.createElement("input", {
    type: "text",
    name: "FirstName",
    value: formData.FirstName,
    onChange: handleChange
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "Last Name"), React.createElement("input", {
    type: "text",
    name: "LastName",
    value: formData.LastName,
    onChange: handleChange
  })), actionStatus && actionStatus.type === 'error' && React.createElement("div", {
    className: "action-status error"
  }, actionStatus.message), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary full-width",
    disabled: isSubmitting
  }, isSubmitting ? 'Adding...' : 'Add Contact')));
};
const ViewContactModal = ({
  contact,
  onClose
}) => {
  return React.createElement(Modal, {
    isOpen: true,
    onClose: onClose,
    title: "Contact Details"
  }, React.createElement("div", {
    className: "contact-details-grid"
  }, React.createElement("dt", null, "Email"), React.createElement("dd", null, contact.Email), React.createElement("dt", null, "Name"), React.createElement("dd", null, contact.FirstName, " ", contact.LastName), React.createElement("dt", null, "Status"), React.createElement("dd", null, contact.Status), React.createElement("dt", null, "Date Added"), React.createElement("dd", null, new Date(contact.DateAdded).toLocaleString())));
};
const SegmentsView = ({
  apiKey
}) => {
  // This is a placeholder as per the original file. Full implementation can be added.
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "Segments"), React.createElement("p", null, "This feature is not yet implemented.")));
};
const SmtpView = ({
  apiKey
}) => {
  // This is a placeholder as per the original file. Full implementation can be added.
  return React.createElement("div", null, React.createElement("div", {
    className: "content-header"
  }, React.createElement("h2", null, "SMTP Credentials"), React.createElement("p", null, "This feature is not yet implemented.")));
};
const ApiKeysView = ({
  apiKey
}) => {
  const {
    data: apiKeys,
    loading,
    error,
    refetch
  } = useApiV4('/security/apikeys', apiKey);
  const [modalAction, setModalAction] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [newSecret, setNewSecret] = useState(null);
  const handleModalOpen = (action, apiKeyData = null) => {
    setActionStatus(null);
    setSelectedKey(apiKeyData);
    setModalAction(action);
  };
  const handleModalClose = () => {
    setModalAction(null);
    setSelectedKey(null);
  };
  const handleSubmit = async formData => {
    setActionStatus(null);
    const isEditing = modalAction === 'edit';
    const endpoint = isEditing ? `/security/apikeys/${selectedKey.AccessKey}` : '/security/apikeys';
    const method = isEditing ? 'PUT' : 'POST';
    const payload = {
      Name: formData.Name,
      AccessLevel: formData.AccessLevel
    };
    if (formData.Expires) {
      payload.Expires = new Date(formData.Expires).toISOString();
    }
    try {
      const result = await apiFetchV4(endpoint, apiKey, {
        method,
        body: JSON.stringify(payload)
      });
      setActionStatus({
        type: 'success',
        message: `API Key ${isEditing ? 'updated' : 'created'} successfully!`
      });
      if (!isEditing && result.AccessKey) {
        setNewSecret(result.AccessKey);
      }
      handleModalClose();
      refetch();
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: `Operation failed: ${err.message}`
      });
    }
  };
  const handleDelete = async accessKey => {
    if (!window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }
    setActionStatus(null);
    try {
      await apiFetchV4(`/security/apikeys/${accessKey}`, apiKey, {
        method: 'DELETE'
      });
      setActionStatus({
        type: 'success',
        message: 'API Key deleted successfully.'
      });
      refetch();
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: `Failed to delete key: ${err.message}`
      });
    }
  };
  if (loading) return React.createElement(CenteredLoader, null);
  return React.createElement("div", null, newSecret && React.createElement(SecretViewer, {
    secretType: "API Key",
    secret: newSecret,
    onDone: () => setNewSecret(null)
  }), React.createElement("div", {
    className: "view-header"
  }, React.createElement("h2", null, "API Keys"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => handleModalOpen('add')
  }, React.createElement(Icon, {
    path: ICONS.PLUS
  }), " Add API Key")), actionStatus && React.createElement("div", {
    className: `action-status ${actionStatus.type}`
  }, actionStatus.message), error && React.createElement(ErrorMessage, {
    message: error
  }, error.includes("Account not found") && React.createElement("small", null, React.createElement("strong", null, "Hint:"), " Your master API key might be missing the required permissions (e.g., ", React.createElement("code", null, "View/Security"), ", ", React.createElement("code", null, "Modify/Security"), "). Please check its access level.")), React.createElement("div", {
    className: "card-grid smtp-grid"
  }, apiKeys && Array.isArray(apiKeys) && apiKeys.map(key => React.createElement("div", {
    key: key.AccessKey,
    className: "card apikey-card"
  }, React.createElement("div", {
    className: "smtp-card-header"
  }, React.createElement("h3", null, key.Name), React.createElement("div", {
    className: "action-buttons"
  }, React.createElement("button", {
    className: "btn-icon",
    onClick: () => handleModalOpen('edit', key)
  }, React.createElement(Icon, {
    path: ICONS.EDIT
  })), React.createElement("button", {
    className: "btn-icon btn-icon-danger",
    onClick: () => handleDelete(key.AccessKey)
  }, React.createElement(Icon, {
    path: ICONS.DELETE
  })))), React.createElement("div", {
    className: "apikey-card-body"
  }, React.createElement("div", {
    className: "smtp-detail-item"
  }, React.createElement("span", null, "Access Key"), React.createElement("strong", {
    className: "monospace"
  }, key.AccessKey.slice(0, 4), "...", key.AccessKey.slice(-4))), React.createElement("div", {
    className: "smtp-detail-item"
  }, React.createElement("span", null, "Expires"), React.createElement("strong", null, key.Expires ? new Date(key.Expires).toLocaleDateString() : 'Never')), React.createElement("div", {
    className: "smtp-detail-item full-span"
  }, React.createElement("span", null, "Permissions"), React.createElement("div", {
    className: "permissions-display"
  }, key.AccessLevel.map(p => React.createElement("span", {
    key: p,
    className: "badge badge-default"
  }, p))))))), apiKeys && apiKeys.length === 0 && React.createElement("p", null, "No API keys found.")), modalAction && React.createElement(ApiKeyModal, {
    isOpen: !!modalAction,
    onClose: handleModalClose,
    onSubmit: handleSubmit,
    apiKeyData: selectedKey,
    actionStatus: actionStatus
  }));
};
const ApiKeyModal = ({
  isOpen,
  onClose,
  onSubmit,
  apiKeyData,
  actionStatus
}) => {
  const [name, setName] = useState('');
  const [expires, setExpires] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
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
  const handlePermissionChange = permission => {
    setSelectedPermissions(prev => prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      Name: name,
      Expires: expires,
      AccessLevel: selectedPermissions
    });
    setIsSubmitting(false);
  };
  return React.createElement(Modal, {
    isOpen: isOpen,
    onClose: onClose,
    title: apiKeyData ? 'Edit API Key' : 'Create API Key'
  }, React.createElement("form", {
    onSubmit: handleSubmit,
    className: "modal-form"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "Name"), React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    required: true
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "Expires (optional)"), React.createElement("input", {
    type: "date",
    value: expires,
    onChange: e => setExpires(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", null, "Permissions"), React.createElement("div", {
    className: "permissions-grid"
  }, Object.entries(PERMISSIONS).map(([group, permissions]) => React.createElement("div", {
    key: group,
    className: "permission-group"
  }, React.createElement("h4", null, group), permissions.map(perm => React.createElement("label", {
    key: perm,
    className: "permission-item"
  }, React.createElement("input", {
    type: "checkbox",
    checked: selectedPermissions.includes(perm),
    onChange: () => handlePermissionChange(perm)
  }), React.createElement("span", null, perm.replace(/[-]/g, ' ')))))))), actionStatus && actionStatus.type === 'error' && React.createElement("div", {
    className: "action-status error"
  }, actionStatus.message), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary full-width",
    disabled: isSubmitting
  }, isSubmitting ? apiKeyData ? 'Saving...' : 'Creating...' : apiKeyData ? 'Save Changes' : 'Create API Key')));
};

// --- Main App Component ---
const App = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('elasticemail_apikey'));
  const [activeView, setActiveView] = useState('Statistics');
  const handleLogin = key => {
    localStorage.setItem('elasticemail_apikey', key);
    setApiKey(key);
  };
  const handleLogout = () => {
    localStorage.removeItem('elasticemail_apikey');
    setApiKey(null);
  };
  if (!apiKey) {
    return React.createElement(AuthPage, {
      onLogin: handleLogin
    });
  }
  const navItems = [{
    id: 'Statistics',
    label: 'Statistics',
    icon: ICONS.STATISTICS
  }, {
    id: 'Account',
    label: 'Account',
    icon: ICONS.ACCOUNT
  }, {
    id: 'SendEmail',
    label: 'Send Email',
    icon: ICONS.SEND
  }, {
    id: 'Campaigns',
    label: 'Campaigns',
    icon: ICONS.CAMPAIGNS
  }, {
    id: 'Domains',
    label: 'Domains',
    icon: ICONS.GLOBE
  }, {
    id: 'EmailLists',
    label: 'Email Lists',
    icon: ICONS.EMAIL_LIST
  }, {
    id: 'Contacts',
    label: 'Contacts',
    icon: ICONS.CONTACTS
  }, {
    id: 'Segments',
    label: 'Segments',
    icon: ICONS.PUZZLE
  }, {
    id: 'Smtp',
    label: 'SMTP',
    icon: ICONS.SMTP
  }, {
    id: 'ApiKeys',
    label: 'API Keys',
    icon: ICONS.API
  }];
  const views = {
    Statistics: React.createElement(StatisticsView, {
      apiKey: apiKey
    }),
    Account: React.createElement(AccountView, {
      apiKey: apiKey
    }),
    SendEmail: React.createElement(SendEmailView, {
      apiKey: apiKey
    }),
    Campaigns: React.createElement(CampaignsView, {
      apiKey: apiKey
    }),
    Domains: React.createElement(DomainsView, {
      apiKey: apiKey
    }),
    EmailLists: React.createElement(EmailListView, {
      apiKey: apiKey
    }),
    Contacts: React.createElement(ContactsView, {
      apiKey: apiKey
    }),
    Segments: React.createElement(SegmentsView, {
      apiKey: apiKey
    }),
    Smtp: React.createElement(SmtpView, {
      apiKey: apiKey
    }),
    ApiKeys: React.createElement(ApiKeysView, {
      apiKey: apiKey
    })
  };
  return React.createElement("div", {
    className: "app-layout"
  }, React.createElement("nav", {
    className: "sidebar"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "sidebar-header logo-font"
  }, "MegaMail"), React.createElement("div", {
    className: "nav"
  }, navItems.map(item => React.createElement("button", {
    key: item.id,
    className: `nav-btn ${activeView === item.id ? 'active' : ''}`,
    onClick: () => setActiveView(item.id)
  }, React.createElement(Icon, {
    path: item.icon
  }), item.label)))), React.createElement("button", {
    className: "nav-btn logout-btn",
    onClick: handleLogout
  }, React.createElement(Icon, {
    path: ICONS.LOG_OUT
  }), "Logout")), React.createElement("main", {
    className: "content"
  }, views[activeView]));
};
const AuthPage = ({
  onLogin
}) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Test API key by fetching account info
      await apiFetch('/account/load', key);
      onLogin(key);
    } catch (err) {
      setError('Invalid API Key. Please check and try again.');
    }
    setLoading(false);
  };
  return React.createElement("div", {
    className: "auth-container"
  }, React.createElement("div", {
    className: "auth-box"
  }, React.createElement("h1", {
    className: "logo-font"
  }, "MegaMail"), React.createElement("p", null, "Enter your Elastic Email API Key to continue"), React.createElement("form", {
    onSubmit: handleSubmit,
    className: "auth-form"
  }, React.createElement("div", {
    className: "input-group"
  }, React.createElement("input", {
    type: isKeyVisible ? 'text' : 'password',
    value: key,
    onChange: e => setKey(e.target.value),
    placeholder: "Your API Key",
    required: true
  }), React.createElement("button", {
    type: "button",
    className: "input-icon-btn",
    onClick: () => setIsKeyVisible(!isKeyVisible)
  }, React.createElement(Icon, {
    path: isKeyVisible ? ICONS.EYE : ICONS.UNLOCK
  }))), error && React.createElement("p", {
    style: {
      color: 'red',
      marginTop: '1rem'
    }
  }, error), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: loading
  }, loading && React.createElement(Loader, null), loading ? 'Verifying...' : 'Login'))));
};
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
