import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Avatar } from '../avatar';

// 3 lines of .page-body text (19px line height)
const COLLAPSED_HEIGHT = 57;

const PinnedPost = ({ post }) => {
  const bodyId = useId();
  const bodyRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  // Short posts have nothing to collapse, so no toggle is shown for them.
  const canExpand = fullHeight > COLLAPSED_HEIGHT + 1;
  const collapsed = canExpand && !expanded;

  // Measure the full height of the text, and re-measure when the width
  // changes (the text wraps differently at other breakpoints).
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setFullHeight(el.scrollHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [post.post]);

  const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="content-card">
      <div className="post-author fade-in">
        <Avatar
          className="post-author-avatar fade-in"
          name={`${post.authorFirstName} ${post.authorLastName}`}
          src={post.authorImage}
        />
        <div className="post-author-info fade-in">
          <p className="page-paragraph">
            {post.authorFirstName} {post.authorLastName}
          </p>
          <p className="page-micro">
            {post.jobTitle} @ {post.companyName}
          </p>
          <p className="page-micro post-meta">
            <time dateTime={post.publishDate}>{publishDate}</time>
            <span aria-hidden="true"> · </span>
            <span>
              {post.city}, {post.state}
            </span>
          </p>
        </div>
      </div>
      {/* The full text stays in the DOM when collapsed (it is only clipped),
          so screen readers always get all of it. */}
      <p
        id={bodyId}
        ref={bodyRef}
        className={`page-body post-content fade-in${
          collapsed ? ' post-content--collapsed' : ''
        }`}
        style={
          canExpand
            ? { maxHeight: expanded ? fullHeight : COLLAPSED_HEIGHT }
            : undefined
        }
      >
        {post.post}
      </p>
      {canExpand && (
        <button
          type="button"
          className="post-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Show more'}
          <svg
            className="post-toggle-chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4.5L6 8.5L10 4.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export const ProfilePosts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading) {
    return (
      <section id="profile-posts">
        <h2 className="page-heading-2">Pinned Posts</h2>
        <div className="profile-post-results">
          <div className="content-card fade-in">
            <div className="post-author">
              <div className="post-author-avatar loading"></div>
              <div className="post-author-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block skeleton-block--quarter loading"></div>
              </div>
            </div>
            <div className="post-content skeleton-block loading"></div>
          </div>
        </div>
      </section>
    );
  }

  const { pinnedPost } = data;

  return (
    <section id="profile-posts">
      <h2 className="page-heading-2">Pinned Posts</h2>
      <div className="profile-post-results">
        <PinnedPost post={pinnedPost} />
      </div>
    </section>
  );
};
