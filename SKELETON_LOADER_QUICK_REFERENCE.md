# 💀 Skeleton Loader - Quick Reference

## 🚀 Quick Start

### 1. Import the Component
```jsx
import { 
  SuggestionCardSkeleton, 
  StatsCardSkeleton, 
  ActivityLogSkeleton,
  ProfileSkeleton,
  Skeleton 
} from '../SkeletonLoader/SkeletonLoader';
```

### 2. Use in Your Component
```jsx
function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  return (
    <div>
      {loading ? (
        <SuggestionCardSkeleton />
      ) : (
        <div>{data}</div>
      )}
    </div>
  );
}
```

---

## 📦 Available Components

| Component | Use Case | Example |
|-----------|----------|---------|
| `Skeleton` | Basic skeleton element | `<Skeleton width="200px" height="20px" />` |
| `SuggestionCardSkeleton` | Suggestion cards | `<SuggestionCardSkeleton />` |
| `StatsCardSkeleton` | Statistics cards | `<StatsCardSkeleton />` |
| `ActivityLogSkeleton` | Activity log items | `<ActivityLogSkeleton />` |
| `ProfileSkeleton` | Profile page | `<ProfileSkeleton />` |
| `DashboardSkeleton` | Full dashboard | `<DashboardSkeleton />` |
| `ActivityLogsSkeleton` | Multiple activity logs | `<ActivityLogsSkeleton />` |
| `TableRowSkeleton` | Table rows | `<TableRowSkeleton columns={4} />` |
| `OnlineAdminSkeleton` | Online admin items | `<OnlineAdminSkeleton />` |

---

## 🎯 Common Patterns

### Pattern 1: Loading State
```jsx
{isLoading ? (
  <SuggestionCardSkeleton />
) : (
  <SuggestionCard data={data} />
)}
```

### Pattern 2: No Data Yet
```jsx
{!data ? (
  <StatsCardSkeleton />
) : (
  <StatsCard stats={data} />
)}
```

### Pattern 3: Multiple Items
```jsx
{isLoading ? (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <SuggestionCardSkeleton key={i} />
    ))}
  </>
) : (
  suggestions.map(s => <SuggestionCard key={s.id} data={s} />)
)}
```

### Pattern 4: Combined Condition
```jsx
{(isLoading || !data) && <ProfileSkeleton />}
{data && !isLoading && <ProfileContent data={data} />}
```

---

## 🎨 Customization

### Custom Width/Height
```jsx
<Skeleton width="300px" height="40px" />
<Skeleton width="100%" height="20px" />
<Skeleton width="50%" height="16px" />
```

### Custom Border Radius
```jsx
<Skeleton width="100px" height="100px" borderRadius="50%" /> // Circle
<Skeleton width="200px" height="40px" borderRadius="20px" /> // Rounded
<Skeleton width="150px" height="30px" borderRadius="4px" />  // Slight round
```

### Custom Class
```jsx
<Skeleton 
  width="200px" 
  height="20px" 
  className="my-custom-skeleton"
/>
```

---

## 📱 Responsive Examples

### Stats Grid
```jsx
<div className="stats-grid">
  {!stats ? (
    <>
      {[1, 2, 3, 4].map(i => (
        <StatsCardSkeleton key={i} />
      ))}
    </>
  ) : (
    stats.map(stat => <StatCard key={stat.id} data={stat} />)
  )}
</div>
```

### Suggestions List
```jsx
<div className="suggestions-list">
  {isLoading ? (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <SuggestionCardSkeleton key={i} />
      ))}
    </>
  ) : suggestions.length === 0 ? (
    <div className="empty">No suggestions found</div>
  ) : (
    suggestions.map(s => <SuggestionCard key={s.id} data={s} />)
  )}
</div>
```

### Activity Timeline
```jsx
<div className="activity-timeline">
  {activityRefreshing ? (
    <div className="activity-logs-skeleton">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <ActivityLogSkeleton key={i} />
      ))}
    </div>
  ) : activityLogs.length === 0 ? (
    <div className="empty-logs">No activity logs found</div>
  ) : (
    activityLogs.map(log => <ActivityLogItem key={log.id} data={log} />)
  )}
</div>
```

---

## ⚡ Performance Tips

### 1. Use Appropriate Count
```jsx
// ❌ Too many - slow rendering
{[...Array(100)].map((_, i) => <SuggestionCardSkeleton key={i} />)}

// ✅ Reasonable count
{[1, 2, 3, 4, 5].map(i => <SuggestionCardSkeleton key={i} />)}
```

### 2. Memoize When Possible
```jsx
const SkeletonList = React.memo(() => (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <SuggestionCardSkeleton key={i} />
    ))}
  </>
));
```

### 3. Conditional Rendering
```jsx
// ❌ Always renders skeleton (hidden with CSS)
<div style={{ display: isLoading ? 'block' : 'none' }}>
  <SuggestionCardSkeleton />
</div>

// ✅ Only renders when needed
{isLoading && <SuggestionCardSkeleton />}
```

---

## 🐛 Common Mistakes

### Mistake 1: Wrong Condition
```jsx
// ❌ Skeleton never shows
{isLoading && data && <Skeleton />}

// ✅ Shows skeleton when loading OR no data
{(isLoading || !data) && <Skeleton />}
```

### Mistake 2: Mismatched Structure
```jsx
// ❌ Skeleton doesn't match actual content
{isLoading ? (
  <Skeleton width="100%" height="20px" />
) : (
  <div className="complex-card">
    <div className="header">...</div>
    <div className="body">...</div>
    <div className="footer">...</div>
  </div>
)}

// ✅ Use specialized skeleton that matches
{isLoading ? (
  <SuggestionCardSkeleton />
) : (
  <SuggestionCard data={data} />
)}
```

### Mistake 3: No Key Prop
```jsx
// ❌ Missing key in list
{[1, 2, 3].map(i => <SuggestionCardSkeleton />)}

// ✅ Always provide key
{[1, 2, 3].map(i => <SuggestionCardSkeleton key={i} />)}
```

---

## 🎬 Animation Control

### Default Animation
```scss
.skeleton {
  animation: shimmer 2s infinite linear;
}
```

### Pause Animation
```scss
.skeleton.paused {
  animation-play-state: paused;
}
```

### Faster Animation
```scss
.skeleton.fast {
  animation-duration: 1s;
}
```

### Delayed Start
```jsx
<SuggestionCardSkeleton 
  style={{ animationDelay: '0.2s' }}
/>
```

---

## 🎨 Styling Examples

### Custom Colors
```scss
.my-skeleton {
  background: linear-gradient(
    90deg,
    #your-color-1 0%,
    #your-color-2 50%,
    #your-color-1 100%
  );
}
```

### Pulse Effect (Alternative)
```scss
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Wave Effect
```scss
@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton.wave::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: wave 1.5s infinite;
}
```

---

## 📊 Testing Checklist

- [ ] Skeleton appears during loading
- [ ] Skeleton matches content layout
- [ ] Smooth transition to actual content
- [ ] Works on mobile devices
- [ ] Works on tablet devices
- [ ] Works on desktop devices
- [ ] Dark mode appearance correct
- [ ] Light mode appearance correct
- [ ] Animation is smooth
- [ ] No layout shift when content loads

---

## 🔍 Debugging

### Check Loading State
```jsx
console.log('Loading:', isLoading);
console.log('Data:', data);
```

### Inspect Element
1. Open DevTools
2. Find skeleton element
3. Check computed styles
4. Verify animation is running

### Network Throttling
1. DevTools → Network tab
2. Select "Slow 3G"
3. Reload page
4. Observe skeleton behavior

---

## 📝 Code Snippets

### Full Example: Suggestions Page
```jsx
import { useState, useEffect } from 'react';
import { SuggestionCardSkeleton } from '../SkeletonLoader/SkeletonLoader';

function SuggestionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/suggestions');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="suggestions-page">
      <h1>Suggestions</h1>
      <div className="suggestions-list">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map(i => (
              <SuggestionCardSkeleton key={i} />
            ))}
          </>
        ) : suggestions.length === 0 ? (
          <div className="empty">No suggestions found</div>
        ) : (
          suggestions.map(suggestion => (
            <SuggestionCard 
              key={suggestion.id} 
              data={suggestion} 
            />
          ))
        )}
      </div>
    </div>
  );
}
```

### Full Example: Stats Dashboard
```jsx
import { useState, useEffect } from 'react';
import { StatsCardSkeleton } from '../SkeletonLoader/SkeletonLoader';

function StatsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="stats-dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {!stats ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <StatsCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <StatCard title="Total" value={stats.total} />
            <StatCard title="Recent" value={stats.recent} />
            <StatCard title="Anonymous" value={stats.anonymous} />
            <StatCard title="Identified" value={stats.identified} />
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 🎓 Best Practices Summary

1. ✅ **Always use keys** in lists
2. ✅ **Match content structure** with skeleton
3. ✅ **Show reasonable count** (5-8 items)
4. ✅ **Use appropriate skeleton** for content type
5. ✅ **Test on slow network** to verify behavior
6. ✅ **Check responsive design** on all devices
7. ✅ **Verify smooth transitions** to actual content
8. ✅ **Keep animations subtle** and professional

---

## 📞 Need Help?

### Common Questions

**Q: Skeleton not showing?**
A: Check your loading condition. Use `(isLoading || !data)` instead of just `isLoading`.

**Q: Animation not working?**
A: Verify `background-size: 1000px 100%` is set on the skeleton element.

**Q: Skeleton doesn't match content?**
A: Use specialized skeletons (e.g., `SuggestionCardSkeleton`) or create a custom one.

**Q: Too many skeletons rendering slowly?**
A: Reduce the count to 5-8 items maximum.

---

**Quick Reference Version**: 1.0  
**Last Updated**: May 22, 2026  
**Status**: ✅ Ready to Use
