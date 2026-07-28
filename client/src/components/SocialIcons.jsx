function InstagramIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>;
}
function FacebookIcon(props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.3A21 21 0 0 0 14.3 4c-2.6 0-4.3 1.58-4.3 4.5v2H7.5v3H10V21h3.5Z" />
    </svg>;
}
function XIcon(props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4l7.2 9.1L4.4 20h1.9l6-6.6 4.6 6.6H20l-7.5-9.6L19 4h-1.9l-5.6 6.1L7.9 4H4Zm2.8 1.4h1.9l9.4 13.2h-1.9L6.8 5.4Z" />
    </svg>;
}
function LinkedInIcon(props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" />
    </svg>;
}
function YouTubeIcon(props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8c.4-1.5.4-4.7.4-4.7ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>;
}
function ThreadsIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 21c-4.5 0-7.5-2.8-7.5-9S7.5 3 12 3s7 2.3 7.2 6c.1 2.5-1.1 3.9-3.2 3.9-1.6 0-2.6-.8-2.9-2-.4 1.4-1.6 2.2-3.2 2.2-2 0-3.3-1.2-3.3-3 0-1.9 1.5-3.1 3.7-3.1.8 0 1.5.1 2.1.4" />
    </svg>;
}
export const SOCIAL_LINKS = [{
  name: "Instagram",
  href: "#",
  Icon: InstagramIcon
}, {
  name: "Facebook",
  href: "#",
  Icon: FacebookIcon
}, {
  name: "X",
  href: "#",
  Icon: XIcon
}, {
  name: "LinkedIn",
  href: "#",
  Icon: LinkedInIcon
}, {
  name: "YouTube",
  href: "#",
  Icon: YouTubeIcon
}, {
  name: "Threads",
  href: "#",
  Icon: ThreadsIcon
}];
export default function SocialIcons({
  className = ""
}) {
  return <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({
      name,
      href,
      Icon
    }) => <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-white">
          <Icon className="h-5 w-5" />
        </a>)}
    </div>;
}