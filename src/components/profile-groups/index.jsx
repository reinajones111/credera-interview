import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useId, useRef, useState } from 'react';

const ACTIVITY_LABELS = {
  active: 'Active',
  moderate: 'Moderate',
  low: 'Low',
  inactive: 'Inactive',
};

// Wording is a placeholder: the API only returns the level, not a definition.
const ACTIVITY_DESCRIPTIONS = {
  active: 'Frequent posts and conversation. Worth visiting now.',
  moderate: 'Steady activity with regular updates.',
  low: 'Occasional posts. Check in once in a while.',
  inactive: 'No recent activity.',
};

// "Explain activity levels" button that toggles a popover with the legend.
const ActivityInfo = () => {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on Escape (returning focus to the button) or a click outside.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = e => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  return (
    <div className="profile-group-info" ref={wrapperRef}>
      <button
        type="button"
        ref={buttonRef}
        className="profile-group-info-button"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen(!open)}
      >
        Explain activity levels
      </button>
      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Activity levels"
          className="profile-group-info-popover"
        >
          <ul className="profile-group-legend">
            {Object.keys(ACTIVITY_LABELS).map(level => (
              <li
                className={`profile-group-legend-item profile-group-activity--${level}`}
                key={level}
              >
                <strong className="profile-group-legend-name">
                  {ACTIVITY_LABELS[level]}
                </strong>
                <span>{ACTIVITY_DESCRIPTIONS[level]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const ProfileGroups = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading)
    return (
      <section id="profile-groups">
        <h2 className="page-heading-2">Groups</h2>
        <ul className="profile-group-results fade-in">
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
        </ul>
      </section>
    );

  const { groups } = data;

  return (
    <section id="profile-groups">
      <div className="profile-group-header">
        <h2 className="page-heading-2">Groups</h2>
        <ActivityInfo />
      </div>
      <ul className="profile-group-results fade-in">
        {groups.map((group, index) => (
          <li
            className="profile-group-results-item"
            key={group.id}
            style={{ '--i': index }}
          >
            <a
              className={`profile-group-results-card content-card fade-in profile-group-activity--${group.activity}`}
              href={group.href}
            >
              {group.favorite ? (
                <span className="profile-group-favorite-flag">
                  <span aria-hidden="true">★</span> Favorite
                </span>
              ) : null}
              <div className="profile-group-avatar">
                <img src={group.image} />
              </div>
              <div className="profile-group-content">
                <p className="page-paragraph">{group.name}</p>
              </div>
              {ACTIVITY_LABELS[group.activity] && (
                <span className="profile-group-activity-label">
                  <span
                    className="profile-group-activity-dot"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Activity: </span>
                  {ACTIVITY_LABELS[group.activity]}
                </span>
              )}
            </a>
            {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
          </li>
        ))}
      </ul>
    </section>
  );
};
