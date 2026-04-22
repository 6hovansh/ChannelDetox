console.log("ChannelDetox Loaded 🚀");

let isInitialized = false;

// Check correct page
function isSubPage() {
  return location.href.includes("/feed/channels");
}

// Main starter
function start() {
  console.log("Start called");

  const interval = setInterval(() => {
    if (!isSubPage()) {
      isInitialized = false;
      removePanel();
      return;
    }

    const channels = document.querySelectorAll("ytd-channel-renderer");

    if (channels.length > 0 && !isInitialized) {
      console.log("Initializing...");

      addCheckboxes();
      createControlPanel();

      isInitialized = true;
    }
  }, 1000);
}

// Remove panel when leaving page
function removePanel() {
  const panel = document.getElementById("cd-panel");
  if (panel) panel.remove();
}

// Start immediately
start();


// STEP 1: Add checkboxes
function addCheckboxes() {
  const channels = document.querySelectorAll("ytd-channel-renderer");

  channels.forEach((channel) => {
    try {
      if (channel.querySelector(".cd-checkbox")) return;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "cd-checkbox";

      checkbox.style.position = "absolute";
      checkbox.style.left = "10px";
      checkbox.style.top = "10px";
      checkbox.style.zIndex = "9999";

      channel.style.position = "relative";
      channel.appendChild(checkbox);
    } catch (e) {}
  });
}

// STEP 2: Control panel
function createControlPanel() {
  if (document.getElementById("cd-panel")) return;

  const panel = document.createElement("div");
  panel.id = "cd-panel";

  panel.style.position = "fixed";
  panel.style.top = "20px";
  panel.style.right = "20px";
  panel.style.zIndex = "9999";
  panel.style.background = "#111";
  panel.style.color = "#fff";
  panel.style.padding = "15px";
  panel.style.borderRadius = "12px";
  panel.style.fontSize = "14px";
  panel.style.width = "220px";

  // Stats
  const stats = document.createElement("div");

  // Progress
  const progress = document.createElement("div");
  progress.innerText = "Progress: 0";

  // Speed
  const speedSelect = document.createElement("select");
  speedSelect.innerHTML = `
    <option value="2000">Slow</option>
    <option value="1200" selected>Medium</option>
    <option value="600">Fast</option>
  `;

  // Filter
  const filterInput = document.createElement("input");
  filterInput.placeholder = "Filter (e.g. tech)";
  filterInput.style.width = "100%";
  filterInput.style.marginTop = "8px";

  // Buttons
  const selectAllBtn = document.createElement("button");
  selectAllBtn.innerText = "Select All";

  const clearBtn = document.createElement("button");
  clearBtn.innerText = "Clear";

  const startBtn = document.createElement("button");
  startBtn.innerText = "Start";

  const stopBtn = document.createElement("button");
  stopBtn.innerText = "Stop";

  const aiBtn = document.createElement("button");
  aiBtn.innerText = "AI Filter";

  [selectAllBtn, clearBtn, startBtn, stopBtn, aiBtn].forEach(btn => {
    btn.style.marginTop = "6px";
    btn.style.width = "100%";
    btn.style.cursor = "pointer";
  });

  panel.append(stats, progress, speedSelect, filterInput, selectAllBtn, clearBtn, startBtn, stopBtn, aiBtn);
  document.body.appendChild(panel);

  // Filter logic
  filterInput.addEventListener("input", () => {
    const keyword = filterInput.value.toLowerCase();

    document.querySelectorAll("ytd-channel-renderer").forEach(channel => {
      const checkbox = channel.querySelector(".cd-checkbox");
      if (!checkbox) return;

      checkbox.checked = channel.innerText.toLowerCase().includes(keyword);
    });
  });

  // Stats update
  setInterval(() => {
    const total = document.querySelectorAll("ytd-channel-renderer").length;
    const selected = document.querySelectorAll(".cd-checkbox:checked").length;
    stats.innerText = `Total: ${total} | Selected: ${selected}`;
  }, 500);

  // Select all
  selectAllBtn.onclick = () => {
    document.querySelectorAll(".cd-checkbox").forEach(cb => cb.checked = true);
  };

  // Clear
  clearBtn.onclick = () => {
    document.querySelectorAll(".cd-checkbox").forEach(cb => cb.checked = false);
  };

  // Stop flag
  let stopFlag = false;
  stopBtn.onclick = () => stopFlag = true;

  // Unsubscribe
  startBtn.onclick = async () => {
    stopFlag = false;

    const selected = document.querySelectorAll(".cd-checkbox:checked");
    const delay = parseInt(speedSelect.value);
    let count = 0;

    for (let cb of selected) {
      if (stopFlag) return alert("Stopped ❌");

      const channel = cb.closest("ytd-channel-renderer");

      try {
        const subBtn = channel.querySelector("ytd-subscribe-button-renderer button");
        if (!subBtn) continue;

        subBtn.click();
        await new Promise(r => setTimeout(r, delay));

        const confirmBtns = document.querySelectorAll("tp-yt-paper-dialog button");
        let confirm = null;

        confirmBtns.forEach(btn => {
          if (btn.innerText.toLowerCase().includes("unsubscribe")) confirm = btn;
        });

        if (confirm) confirm.click();

        count++;
        progress.innerText = `Progress: ${count}/${selected.length}`;

        await new Promise(r => setTimeout(r, delay));

      } catch (e) {}
    }

    alert("Completed ✅");
  };

  // AI filter (fixed)
  aiBtn.onclick = async () => {
    const channels = Array.from(document.querySelectorAll("ytd-channel-renderer")).slice(0, 20);

    console.log("AI start");

    for (let channel of channels) {
      const nameEl = channel.querySelector("#channel-title");
      const name = nameEl ? nameEl.innerText : "Unknown";

      console.log("Checking:", name);

      try {
        channel.style.opacity = "0.5";

        const res = await fetch("http://localhost:3000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });

        const data = await res.json();

        console.log("AI:", name, data);

        if (data.result === "REMOVE") {
          const checkbox = channel.querySelector(".cd-checkbox");
          if (checkbox) checkbox.checked = true;
        }

      } catch (e) {
        console.log("AI error");
      }

      channel.style.opacity = "1";
      await new Promise(r => setTimeout(r, 600));
    }

    alert("AI done 🤖");
  };
}


