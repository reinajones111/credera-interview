import './style.css';
import { getFriendsListData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Avatar } from '../avatar';

const getLastName = name => name.trim().split(/\s+/).pop();

// Top friends first, then alphabetical by last name (first name breaks ties).
// Sorts a copy so the cached query data isn't mutated.
const sortFriends = friends =>
  [...friends].sort(
    (a, b) =>
      Boolean(b.topFriend) - Boolean(a.topFriend) ||
      getLastName(a.name).localeCompare(getLastName(b.name)) ||
      a.name.localeCompare(b.name),
  );

// Case-insensitive match on name, job title or company
const matchesSearch = (friend, term) =>
  [friend.name, friend.jobTitle, friend.companyName].some(field =>
    field?.toLowerCase().includes(term),
  );

export const ProfileFriends = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriendsListData,
  });

  if (isLoading)
    return (
      <section id="profile-friends">
        <div className="content-card fade-in">
          <h2 className="page-heading-2">Friends</h2>
          <ul className="profile-friends-list">
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    );

  const term = search.trim().toLowerCase();
  const friends = sortFriends(data.friends).filter(friend =>
    matchesSearch(friend, term),
  );

  return (
    <section id="profile-friends">
      <div className="content-card fade-in">
        <h2 className="page-heading-2">Friends</h2>
        <input
          type="search"
          className="profile-friends-search"
          placeholder="Search friends"
          aria-label="Search friends by name, job title or company"
          autoComplete="off"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {friends.length === 0 && (
          <p className="page-body profile-friends-empty" role="status">
            No friends match &ldquo;{search.trim()}&rdquo;.
          </p>
        )}
        <ul className="profile-friends-list">
          {friends.map((friend, index) => (
            <li
              className="profile-list-item fade-in"
              key={friend.name}
              style={{ '--i': index }}
            >
              <Avatar
                className="profile-list-item-avatar"
                name={friend.name}
                src={friend.image}
              />
              <div className="profile-list-item-info">
                {friend.topFriend && (
                  <span className="top-friend-flag">★ Top Friend</span>
                )}
                <p className="page-paragraph">{friend.name}</p>
                <p className="page-micro">
                  {friend.jobTitle} @ {friend.companyName}
                </p>
                {/* <pre>{JSON.stringify(friend)}</pre> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
