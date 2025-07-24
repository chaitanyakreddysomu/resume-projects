import { useState } from "react";
import ""; // Make sure to include custom styles separately

export default function SendButton() {
  const [sent, setSent] = useState(false);

  const handleClick = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2000); // Reset after 2s
  };

  return (
    <button className="button" onClick={handleClick} aria-pressed={sent}>
      <div className="outline"></div>

      {/* Default State */}
      <div className={`state state--default ${sent ? "hidden" : ""}`}>
        <div className="icon">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#shadow)">
              <path
                d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63Z"
                fill="currentColor"
              ></path>
              <path
                d="M10.11 14.4C9.92 14.4 9.73 14.33 9.58 14.18C9.29 13.89 9.29 13.41 9.58 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5" />
              </filter>
            </defs>
          </svg>
        </div>
        <p>
          {"SendMessage".split("").map((char, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </p>
      </div>

      {/* Sent State */}
      <div className={`state state--sent ${sent ? "" : "hidden"}`}>
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            strokeWidth="0.5px"
            stroke="black"
          >
            <g filter="url(#shadow)">
              <path
                fill="currentColor"
                d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75Z"
              />
              <path
                fill="currentColor"
                d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
              />
            </g>
          </svg>
        </div>
        <p>
          {"Sent".split("").map((char, i) => (
            <span key={i} style={{ "--i": i + 5 } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </p>
      </div>
    </button>
  );
}
