import './style.css';

// First letter of the first and last words, e.g. "Henry Jordan" -> "HJ"
export const getInitials = name => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
};

// Shows the person's photo when one is available, otherwise their initials.
// `className` supplies the size/shape of the surrounding circle.
export const Avatar = ({ name, src, className = '' }) => {
  if (src)
    return (
      <div className={className} role="img" aria-label={name}>
        <img src={src} alt="" />
      </div>
    );

  return (
    <div
      className={`${className} avatar-initials`}
      role="img"
      aria-label={name}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </div>
  );
};
