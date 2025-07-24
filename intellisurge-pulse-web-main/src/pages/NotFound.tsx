import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const type = (el, str, delay = 0) => {
      let i = 0;
      el.textContent = "";

      setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent = str.slice(0, i) + "|";
          i++;
          if (i > str.length) {
            clearInterval(interval);
            el.textContent = str;
          }
        }, 10);
      }, delay);
    };

    const lines = document.querySelectorAll(".code-line");
    const codeContent = [
      `this_page.not_found = true;`,
      `if (you_spelt_it_wrong) {`,
      `  try_again();`,
      `} else if (we_screwed_up) {`,
      `  alert("We're really sorry about that.");`,
      `  window.location = home;`,
      `}`
    ];

    lines.forEach((el, idx) => {
      type(el, codeContent[idx], idx * 400);
    });
  }, []);

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12 text-gray-300 font-mono">
      {/* 404 Header */}
      <p className="text-5xl md:text-7xl lg:text-[130px] font-bold text-white tracking-widest font-[Bevan] text-center">
        HTTP: <span className="text-red-500">404</span>
      </p>

      {/* Code block */}
        {/* <div className="ml-96 w-full max-w-3xl rounded-md shadow-lg mt-10 p-6 text-sm leading-relaxed whitespace-pre">
          <pre className="items-center">
            <code className="code-line block text-yellow-300" />
            <code className="code-line block">
              <span className="text-yellow-300">if</span>{" "}
              (you_spelt_it_wrong) {"{"}
            </code>
            <code className="code-line block">  try_again();</code>
            <code className="code-line block">
              {"}"} <span className="text-yellow-300">else if</span>{" "}
              (we_screwed_up) {"{"}
            </code>
            <code className="code-line block">
              {"  "}
              <span className="text-purple-400">alert</span>
              (<span className="text-green-400">
                "We're really sorry about that."
              </span>);
            </code>
            <code className="code-line block">
              {"  "}
              window.<span className="text-purple-400">location</span> = home;
            </code>
            <code className="code-line block">{"}"}</code>
          </pre>
        </div> */}

      {/* HOME Button */}
      <button
        onClick={() => navigate("/")}
        className="py-2 px-4 rounded-md bg-blue-700"
      >
        Back To Main
      </button>
    </div>
  );
};

export default NotFound;
