import './SkeletonLoader.scss';

// Base Skeleton Component
export const Skeleton = ({ width, height, borderRadius = '4px', className = '' }) => (
  <div 
    className={`skeleton ${className}`}
    style={{ 
      width: width || '100%', 
      height: height || '20px',
      borderRadius 
    }}
  />
);

// Suggestion Card Skeleton
export const SuggestionCardSkeleton = () => (
  <div className="suggestion-card skeleton-card">
    <div className="suggestion-card-header">
      <div className="skeleton-row">
        <Skeleton width="80px" height="24px" borderRadius="12px" />
        <Skeleton width="60px" height="20px" borderRadius="10px" />
      </div>
      <Skeleton width="120px" height="16px" />
    </div>
    <div className="suggestion-card-body">
      <Skeleton width="70%" height="20px" className="skeleton-title" />
      <Skeleton width="100%" height="14px" />
      <Skeleton width="90%" height="14px" />
      <Skeleton width="60%" height="14px" />
    </div>
    <div className="suggestion-card-footer">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="80px" height="16px" />
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="stat-card skeleton-card">
    <div className="stat-icon-wrapper">
      <Skeleton width="48px" height="48px" borderRadius="50%" />
    </div>
    <div className="stat-content">
      <Skeleton width="60px" height="14px" />
      <Skeleton width="40px" height="28px" />
    </div>
  </div>
);

// Activity Log Skeleton
export const ActivityLogSkeleton = () => (
  <div className="activity-item skeleton-card">
    <div className="activity-icon-wrapper">
      <Skeleton width="40px" height="40px" borderRadius="50%" />
    </div>
    <div className="activity-content">
      <Skeleton width="200px" height="16px" />
      <Skeleton width="150px" height="14px" />
      <Skeleton width="100px" height="12px" />
    </div>
    <div className="activity-time">
      <Skeleton width="80px" height="14px" />
    </div>
  </div>
);

// Profile Section Skeleton
export const ProfileSkeleton = () => (
  <div className="profile-skeleton">
    <div className="profile-header-skeleton">
      <Skeleton width="200px" height="32px" />
      <Skeleton width="300px" height="16px" />
    </div>
    
    <div className="profile-section-skeleton">
      <Skeleton width="150px" height="20px" className="section-title" />
      <div className="profile-picture-skeleton">
        <Skeleton width="100px" height="100px" borderRadius="50%" />
        <div>
          <Skeleton width="120px" height="36px" borderRadius="6px" />
          <Skeleton width="180px" height="14px" />
        </div>
      </div>
    </div>

    <div className="profile-section-skeleton">
      <Skeleton width="180px" height="20px" className="section-title" />
      <div className="form-skeleton">
        <Skeleton width="100%" height="40px" borderRadius="6px" />
        <Skeleton width="100%" height="40px" borderRadius="6px" />
        <Skeleton width="100%" height="80px" borderRadius="6px" />
      </div>
    </div>
  </div>
);

// Dashboard Skeleton (Multiple Cards)
export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    {/* Stats Grid */}
    <div className="stats-grid-skeleton">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Suggestions List */}
    <div className="suggestions-skeleton">
      {[1, 2, 3, 4, 5].map(i => (
        <SuggestionCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Activity Logs Skeleton
export const ActivityLogsSkeleton = () => (
  <div className="activity-logs-skeleton">
    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <ActivityLogSkeleton key={i} />
    ))}
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <div className="table-row-skeleton">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} width="100%" height="16px" />
    ))}
  </div>
);

// Online Admin Skeleton
export const OnlineAdminSkeleton = () => (
  <div className="online-admin-skeleton">
    <Skeleton width="32px" height="32px" borderRadius="50%" />
    <div className="admin-info-skeleton">
      <Skeleton width="100px" height="14px" />
      <Skeleton width="60px" height="12px" />
    </div>
  </div>
);

export default Skeleton;
