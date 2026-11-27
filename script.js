/* ---- Edit these lines to make the page yours ---- */
const CONFIG = {
  name: "Akash :)",
  upiId: "slalakash123@oksbi",
  presets: [
    { amount: 30,  label: "Cutting chai" },
    { amount: 60,  label: "Chai & samosa" },
    { amount: 180, label: "Biriyani" }
  ]
};

const $ = (id) => document.getElementById(id);
const amt = $("amt"), donor = $("donor"), msg = $("msg");
const pay = $("pay"), warn = $("warn"), qrEl = $("qr"), copyBtn = $("copy");
const enc = encodeURIComponent;

function buildPresets() {
  const wrap = $("presets");
  CONFIG.presets.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.dataset.amount = p.amount;
    b.setAttribute("aria-pressed", "false");
    const price = document.createElement("span");
    price.className = "p";
    price.textContent = "₹" + p.amount;
    const label = document.createElement("span");
    label.className = "l";
    label.textContent = p.label;
    b.append(price, label);
    b.addEventListener("click", () => { amt.value = p.amount; render(); });
    wrap.appendChild(b);
  });
}

function drawQR(link) {
  if (typeof qrcode !== "function") {
    qrEl.textContent = "Code unavailable. Use the Pay button.";
    return;
  }
  const qr = qrcode(0, "M");
  qr.addData(link);
  qr.make();
  qrEl.innerHTML = qr.createSvgTag(4, 0);
}

function render() {
  const value = Math.floor(Number(amt.value));
  const valid = Number.isFinite(value) && value >= 10 && value <= 100000;

  document.querySelectorAll(".opt").forEach((b) => {
    b.setAttribute("aria-pressed", String(Number(b.dataset.amount) === value && amt.value !== ""));
  });

  if (!valid) {
    pay.removeAttribute("href");
    pay.setAttribute("aria-disabled", "true");
    pay.textContent = "Pay with UPI";
    warn.hidden = false;
    qrEl.textContent = "Enter an amount";
    return;
  }

  const who = donor.value.trim();
  const note = msg.value.trim();
  const tn = ["Tip", who && "from " + who, note && "- " + note]
    .filter(Boolean).join(" ").slice(0, 80);

  const link = `upi://pay?pa=${enc(CONFIG.upiId)}&pn=${enc(CONFIG.name)}` +
               `&am=${value}&cu=INR&tn=${enc(tn)}`;

  pay.href = link;
  pay.removeAttribute("aria-disabled");
  pay.textContent = `Pay ₹${value} with UPI`;
  warn.hidden = true;
  drawQR(link);
}

function init() {
  $("upi-id").textContent = CONFIG.upiId;

  buildPresets();
  amt.value = CONFIG.presets[1] ? CONFIG.presets[1].amount : "";

  [amt, donor, msg].forEach((el) => el.addEventListener("input", render));

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.upiId);
      copyBtn.textContent = "Copied";
    } catch {
      copyBtn.textContent = "Copy failed. Select the ID above";
    }
    setTimeout(() => { copyBtn.textContent = "Copy UPI ID"; }, 2000);
  });

  render();
}

init();
