'use client';

import { FaGithub, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container container-xl">
        <div className="footer-icons">
          <a
            href="https://github.com/uikoo9/web-claude-code"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="footer-icon-link"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="mailto:hello@webcc.dev"
            aria-label="Email"
            className="footer-icon-link"
          >
            <FaEnvelope size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
