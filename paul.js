// ============================================================
// PAUL - Dashboard SPA JavaScript
// Hosted via GitHub + jsDelivr, loaded from the Webflow footer.
// Single source of truth: edit here, commit, tag, bump the src URL.
// ============================================================

function paulBoot() {

// ===== OFFENE POSTEN - filter bar & modal field HTML injection =====
const filterBar = document.getElementById("filterBarContainer");
if (filterBar) {
filterBar.innerHTML = `
<select id="filterType" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;">
<option value="all">Alle Typen</option>
<option value="receivable">Forderungen</option>
<option value="payable">Verbindlichkeiten</option>
</select>
<input id="minAmount" type="number" placeholder="Betrag min" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:110px;">
<input id="maxAmount" type="number" placeholder="Betrag max" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:110px;">
<input id="fromDate" type="date" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;">
<input id="toDate" type="date" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;">
<input id="filterName" type="text" placeholder="Name suchen" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;">
<input id="filterNumber" type="text" placeholder="Nr. suchen" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:110px;">
`;
["filterType","minAmount","maxAmount","fromDate","toDate","filterName","filterNumber"].forEach(id => {
const el = document.getElementById(id);
if (el) el.addEventListener("input", () => renderPositions(getFilters()));
});
}
const modalFields = document.getElementById("modalFieldsContainer");
if (modalFields) {
modalFields.innerHTML = `
<input id="modalName" type="text" placeholder="Name" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:100%;margin-bottom:4px;">
<input id="modalNumber" type="text" placeholder="Rechnungsnummer" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:100%;margin-bottom:4px;">
<input id="modalAmount" type="number" placeholder="Betrag (€)" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:100%;margin-bottom:4px;">
<select id="positionType" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:100%;margin-bottom:4px;">
<option value="receivable">Forderung</option>
<option value="payable">Verbindlichkeit</option>
</select>
<input id="modalDueDate" type="date" style="padding:8px 11px;border-radius:8px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;font-family:inherit;color:#1e2a38;outline:none;width:100%;margin-bottom:4px;">
`;
}

// ===== GLOBAL - sidebar navigation (all pages) =====
const navBtns = document.querySelectorAll(".sidebar-btn");
const pages = document.querySelectorAll(".page-section");
function getPageDisplay(pageId) {
return pageId === "kontenPage" ? "flex" : "block";
}
pages.forEach(page => {
page.style.display = page.id === "homePage" ? getPageDisplay("homePage") : "none";
});
navBtns.forEach(btn => {
btn.addEventListener("click", () => {
const targetId = btn.getAttribute("data-target");
pages.forEach(page => (page.style.display = "none"));
const targetPage = document.getElementById(targetId);
if (targetPage) targetPage.style.display = getPageDisplay(targetId);
navBtns.forEach(b => {
b.classList.remove("paul-nav-active");
b.style.background = "transparent";
b.style.borderLeft = "3px solid transparent";
b.style.fontWeight = "400";
b.style.color = "rgba(255,255,255,0.6)";
});
document.querySelectorAll(`.sidebar-btn[data-target="${targetId}"]`).forEach(b => {
b.classList.add("paul-nav-active");
b.style.background = "rgba(255,255,255,0.10)";
b.style.borderLeft = "3px solid #1f9d6b";
b.style.fontWeight = "600";
b.style.color = "#fff";
});
// Charts nach dem Sichtbarwerden neu zeichnen - versteckte Container haben Breite 0
if (typeof pgDrawChart === "function") pgDrawChart();
if (typeof kzDrawSparklines === "function") kzDrawSparklines();
});
});

// ===== KONTEN/UEBERSICHT - accounts data + liquidity summary card =====
const accounts = [
{ name: "Sparkasse Lindau", initials: "SK", sub: "Geschäftskonto · DE•• 1240", balance: 41230 },
{ name: "Volksbank Allgäu", initials: "VB", sub: "Tagesgeldkonto · DE•• 8830", balance: 12000 },
{ name: "Visa Business",     initials: "VI", sub: "Kreditkarte · ••• 4417",       balance: -1840 },
{ name: "Kasse",             initials: "BA", sub: "Bargeld · Werkstatt",           balance: 640  }
];
const accountsTotal = accounts.reduce(function(s, a) { return s + a.balance; }, 0);
const currentLiquidityEl = document.getElementById("currentLiquidityValue");
if (currentLiquidityEl) {
currentLiquidityEl.textContent = accountsTotal.toLocaleString("de-DE") + " €";
}
const liquiditySubEl = document.getElementById("liquiditySub");
if (liquiditySubEl) {
liquiditySubEl.textContent = "über " + accounts.length + " Konten";
}

// ===== UEBERSICHT - main liquidity chart (Chart.js) =====
const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"];
const income =   [12000, 15000, 13000, 17000, 16000, 18000];
const expenses = [8000,  9000,  9500,  11000, 10000, 10500];
function average(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
const avgIncome = average(income);
const avgExpenses = average(expenses);
const futureMonths = ["Jul", "Aug", "Sep"];
let liquidity = [];
let current = accountsTotal;
for (let i = 0; i < months.length; i++) {
current += income[i] - expenses[i];
liquidity.push(current);
}
for (let i = 0; i < futureMonths.length; i++) {
current += avgIncome - avgExpenses;
liquidity.push(current);
}
const allMonths = months.concat(futureMonths);
const incomeExtended = income.concat([null, null, null]);
const expensesExtended = expenses.concat([null, null, null]);
const chartCanvas = document.getElementById("liquidityChart");
if (chartCanvas) {
const ctx = chartCanvas.getContext("2d");
new Chart(ctx, {
data: {
labels: allMonths,
datasets: [
{ type: "bar", label: "Einnahmen", data: incomeExtended, backgroundColor: "#1f9d6b" },
{ type: "bar", label: "Ausgaben", data: expensesExtended, backgroundColor: "#e0533d" },
{ type: "line", label: "Liquidität", data: liquidity, borderColor: "#2f80ed", backgroundColor: "rgba(47,128,237,0.08)", borderWidth: 2, pointBackgroundColor: "#2f80ed", tension: 0.3, fill: true }
]
},
options: {
responsive: true, maintainAspectRatio: false,
plugins: {
tooltip: { callbacks: { label: ctx => ctx.parsed.y === null ? null : ctx.dataset.label + ": " + ctx.parsed.y.toLocaleString("de-DE") + " €" } },
legend: { position: "top" }
},
scales: { y: { ticks: { callback: val => val.toLocaleString("de-DE") + " €" } } }
}
});
}

// ===== KONTEN - page render + sidebar accounts widget =====
function renderKontenPage() {
var kontenPage = document.getElementById("kontenPage");
if (!kontenPage) return;
var now = new Date();
var timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
var rowsHTML = accounts.map(function(acc, idx) {
var border = idx < accounts.length - 1 ? 'border-bottom:1px solid #f0f3f6;' : '';
var amtColor = acc.balance < 0 ? '#c62828' : '#1e2a38';
var amtPrefix = acc.balance < 0 ? '−' : '';
var absBalance = Math.abs(acc.balance);
return '<div style="display:flex;align-items:center;gap:14px;padding:16px 20px;' + border + '">' +
'<div style="width:38px;height:38px;border-radius:10px;background:#eef2f6;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#46535f;flex:none">' + acc.initials + '</div>' +
'<div style="flex:1"><div style="font-size:14px;font-weight:600;color:#1e2a38">' + acc.name + '</div>' +
'<div style="font-size:12px;color:#9aa6b2">' + acc.sub + '</div></div>' +
'<div style="text-align:right"><div style="font-size:15.5px;font-weight:700;font-variant-numeric:tabular-nums;color:' + amtColor + '">' + amtPrefix + absBalance.toLocaleString('de-DE') + ',00 €</div>' +
'<div style="font-size:11px;color:#9aa6b2">Sync heute</div></div></div>';
}).join('');
kontenPage.innerHTML =
'<div style="padding:30px 38px;flex:1;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;">' +
'<div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px;">' +
'<div><h1 style="margin:0;font-size:25px;font-weight:700;letter-spacing:-0.02em;color:#1e2a38;">Konten</h1>' +
'<div style="font-size:13px;color:#8a96a3;margin-top:3px;">' + accounts.length + ' verbundene Konten · zuletzt aktualisiert heute, ' + timeStr + '</div></div>' +
'<button style="padding:9px 15px;border-radius:9px;border:1px solid #d6dde4;background:#fff;font-size:13px;font-weight:600;color:#46535f;font-family:inherit;cursor:pointer;">+ Konto verbinden</button>' +
'</div>' +
'<div style="display:flex;align-items:center;justify-content:space-between;background:#1e2a38;border-radius:14px;padding:20px 24px;margin-bottom:16px;">' +
'<span style="font-size:14px;color:rgba(255,255,255,0.7);font-weight:500;">Verfügbar über alle Konten</span>' +
'<span style="font-size:30px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-0.02em;color:#fff;">' + accountsTotal.toLocaleString('de-DE') + ',00 €</span>' +
'</div>' +
'<div style="background:#fff;border:1px solid #e7ebef;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(16,30,50,0.04);">' +
rowsHTML +
'<div style="padding:12px 20px;font-size:12px;color:#9aa6b2;display:flex;align-items:center;gap:6px;border-top:1px solid #f0f3f6;">🔒 Sichere Anbindung über PSD2 · FinAPI</div>' +
'</div></div>';
}
renderKontenPage();
const accountsList = document.getElementById("accountsList");
if (accountsList) {
accounts.forEach(function(acc) {
var item = document.createElement("div");
item.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #f0f3f6;";
var color = acc.balance >= 0 ? "#1e2a38" : "#c62828";
item.innerHTML =
"<span style='font-size:13px;color:#46535f'>" + acc.name + "</span>" +
"<span style='color:" + color + ";font-weight:700;font-variant-numeric:tabular-nums;font-size:13.5px'>" +
(acc.balance < 0 ? "−" : "") + Math.abs(acc.balance).toLocaleString("de-DE") + " €</span>";
accountsList.appendChild(item);
});
var totalRow = document.createElement("div");
totalRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding-top:10px;font-size:13px;font-weight:600;border-top:2px solid #1e2a38;margin-top:2px;";
totalRow.innerHTML = "<span>Gesamt</span><span style='font-size:15px;font-weight:800;font-variant-numeric:tabular-nums'>" + accountsTotal.toLocaleString("de-DE") + " €</span>";
accountsList.appendChild(totalRow);
}

// ===== OFFENE POSTEN - full logic (data, filters, render, modal, delete) =====
function dateOffset(days) {
var d = new Date();
d.setHours(0,0,0,0);
d.setDate(d.getDate() + days);
return d.toISOString().slice(0, 10);
}
let positions = [
{ name: "Bauunternehmen Keller",  number: "RE-2026-118", amount: 6420, type: "receivable", dueDate: "2026-07-10" },
{ name: "Hausverwaltung Brandt",  number: "RE-2026-104", amount: 3180, type: "receivable", dueDate: "2026-06-24" },
{ name: "Stadtwerke Lindau",      number: "RE-2026-121", amount: 4900, type: "receivable", dueDate: "2026-07-17" },
{ name: "Familie Demir",          number: "RE-2026-119", amount: 2340, type: "receivable", dueDate: "2026-07-24" },
{ name: "Café Morgentau",         number: "RE-2026-098", amount: 1800, type: "receivable", dueDate: "2026-07-03" },
{ name: "Sonepar Deutschland",    number: "Material",    amount: 4560, type: "payable",    dueDate: "2026-07-12" },
{ name: "Finanzamt Lindau",       number: "USt-Voranmeldung", amount: 3220, type: "payable", dueDate: "2026-07-15" },
{ name: "Würth",                  number: "Material",    amount: 1640, type: "payable",    dueDate: "2026-07-20" },
{ name: "Leasing Sparkasse",      number: "Transporter", amount: 550,  type: "payable",    dueDate: "2026-07-08" },
{ name: "Allianz",                number: "Betriebshaftpflicht", amount: 1310, type: "payable", dueDate: "2026-07-27" }
];
function getDaysStatus(dueDate) {
const today = new Date(); today.setHours(0,0,0,0);
const due = new Date(dueDate);
const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
if (diff > 7) return { text: diff + " Tage verbleibend", color: "#1f9d6b" };
if (diff >= 0) return { text: diff + " Tage verbleibend", color: "#e0a72e" };
return { text: Math.abs(diff) + " Tage überfällig", color: "#e0533d" };
}
function getShortDayLabel(dueDate) {
const today = new Date(); today.setHours(0,0,0,0);
const due = new Date(dueDate);
const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
if (diff < 0) return Math.abs(diff) + " T überfäll.";
return "in " + diff + " T.";
}
function getDayPill(dueDate) {
const today = new Date(); today.setHours(0,0,0,0);
const due = new Date(dueDate);
const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
const label = getShortDayLabel(dueDate);
const isOverdue = diff < 0;
const bg = isOverdue ? "#fdecea" : "#eef2f6";
const color = isOverdue ? "#c0432f" : "#5b6776";
return "<span style='font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:20px;background:" + bg + ";color:" + color + ";white-space:nowrap;flex:none'>" + label + "</span>";
}
function getFilters() {
var activePill = document.querySelector("#oposFilterPills .opos-pill-active");
return {
pill:      activePill ? activePill.getAttribute("data-filter") : "all",
type:      document.getElementById("filterType")?.value || "all",
minAmount: Number(document.getElementById("minAmount")?.value) || null,
maxAmount: Number(document.getElementById("maxAmount")?.value) || null,
fromDate:  document.getElementById("fromDate")?.value || "",
toDate:    document.getElementById("toDate")?.value || "",
name:      document.getElementById("filterName")?.value.toLowerCase() || "",
number:    document.getElementById("filterNumber")?.value || ""
};
}
function getUebersichtSummary() {
const today = new Date(); today.setHours(0,0,0,0);
let overdueAmount = 0, due7Amount = 0;
let payOverdueAmount = 0, payDue7Amount = 0;
const dueThisWeekItems = [];
positions.forEach(function(p) {
const due = new Date(p.dueDate);
const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
if (p.type === "receivable" && diffDays < 0) overdueAmount += p.amount;
if (p.type === "payable" && diffDays >= 0 && diffDays <= 7) due7Amount += p.amount;
if (p.type === "payable" && diffDays < 0) payOverdueAmount += p.amount;
if (p.type === "payable" && diffDays >= 0 && diffDays <= 7) payDue7Amount += p.amount;
if (diffDays >= -1 && diffDays <= 7) dueThisWeekItems.push(Object.assign({}, p, { diffDays }));
});
return { overdueAmount, due7Amount, payOverdueAmount, payDue7Amount, dueThisWeekItems };
}
function renderOposCards() {
var row = document.getElementById("oposSummaryRow");
if (!row) return;
const recTotal = positions.filter(function(p){ return p.type === "receivable"; }).reduce(function(s,p){ return s+p.amount; }, 0);
const payTotal = positions.filter(function(p){ return p.type === "payable"; }).reduce(function(s,p){ return s+p.amount; }, 0);
const summary = getUebersichtSummary();
var overdueSubHTML = summary.overdueAmount > 0
? "<div style='font-size:12px;color:#8a96a3;margin-top:6px'>davon <span style='color:#e0533d;font-weight:700'>" + summary.overdueAmount.toLocaleString("de-DE") + " € überfällig</span></div>"
: "<div style='font-size:12px;color:#1f9d6b;margin-top:6px;font-weight:600'>keine überfällig</div>";
var payNext7Total = summary.payOverdueAmount + summary.payDue7Amount;
var paySubHTML = payNext7Total > 0
? "<div style='font-size:12px;color:#8a96a3;margin-top:6px'>davon <span style='color:#e0a72e;font-weight:700'>" + payNext7Total.toLocaleString("de-DE") + " €</span> in den nächsten 7 Tagen zu zahlen</div>"
: "<div style='font-size:12px;color:#1f9d6b;margin-top:6px;font-weight:600'>keine in den nächsten 7 Tagen fällig</div>";
row.innerHTML =
"<div style='flex:1;background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:18px 20px;'>" +
"<div style='font-size:13px;font-weight:600;color:#46535f'>Forderungen</div>" +
"<div id='oposPageRecValue' style='font-size:26px;font-weight:800;letter-spacing:-0.02em;margin-top:6px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + recTotal.toLocaleString("de-DE") + " €</div>" +
overdueSubHTML +
"</div>" +
"<div style='flex:1;background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:18px 20px;'>" +
"<div style='font-size:13px;font-weight:600;color:#46535f'>Verbindlichkeiten</div>" +
"<div id='oposPagePayValue' style='font-size:26px;font-weight:800;letter-spacing:-0.02em;margin-top:6px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + payTotal.toLocaleString("de-DE") + " €</div>" +
paySubHTML +
"</div>";
}
function renderOposSummary() {
renderOposCards();
const summary = getUebersichtSummary();
var recSource = document.getElementById("oposPageRecValue");
var paySource = document.getElementById("oposPagePayValue");
var recText = recSource ? recSource.textContent.trim() : "—";
var payText = paySource ? paySource.textContent.trim() : "—";
var recCard = document.getElementById("homeRecCard");
if (recCard) {
var recSub = summary.overdueAmount > 0
? "davon <span style='color:#e0533d;font-weight:600'>" + summary.overdueAmount.toLocaleString("de-DE") + " € überfällig</span>"
: "<span style='color:#1f9d6b;font-weight:600'>keine überfällig</span>";
recCard.innerHTML = "<div style='font-size:12px;font-weight:600;color:#8a96a3'>Offene Forderungen</div>" +
"<div style='font-size:28px;font-weight:700;letter-spacing:-0.02em;margin-top:8px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + recText + "</div>" +
"<div style='font-size:12px;color:#8a96a3;margin-top:6px'>" + recSub + "</div>";
}
var payCard = document.getElementById("homePayCard");
if (payCard) {
var paySub = summary.due7Amount > 0
? summary.due7Amount.toLocaleString("de-DE") + " € in 7 Tagen fällig"
: "keine in 7 Tagen fällig";
payCard.innerHTML = "<div style='font-size:12px;font-weight:600;color:#8a96a3'>Offene Verbindlichkeiten</div>" +
"<div style='font-size:28px;font-weight:700;letter-spacing:-0.02em;margin-top:8px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + payText + "</div>" +
"<div style='font-size:12px;color:#8a96a3;margin-top:6px'>" + paySub + "</div>";
}
renderUmsatzCard();
var weekEl = document.getElementById("dieseWocheFaellig");
if (weekEl) {
if (summary.dueThisWeekItems.length === 0) {
weekEl.innerHTML = "<div style='font-size:13px;color:#9aa6b2;padding:8px 0'>Keine Posten diese Woche fällig.</div>";
} else {
weekEl.innerHTML = summary.dueThisWeekItems.map(function(p, idx) {
var isRec = p.type === "receivable";
var sign = isRec ? "+" : "−";
var amtColor = isRec ? "#1f9d6b" : "#e0533d";
var dayLabel = p.diffDays < 0 ? "heute überfällig" : p.diffDays === 0 ? "heute fällig" : "in " + p.diffDays + " " + (p.diffDays === 1 ? "Tag" : "Tagen");
var border = idx < summary.dueThisWeekItems.length - 1 ? "border-bottom:1px solid #f0f3f6;" : "";
return "<div style='display:flex;justify-content:space-between;align-items:center;padding:7px 0;" + border + "'>" +
"<div><div style='font-size:13px;font-weight:500;color:#1e2a38'>" + p.name + "</div>" +
"<div style='font-size:11.5px;color:#9aa6b2'>" + dayLabel + "</div></div>" +
"<span style='font-size:13.5px;font-weight:700;color:" + amtColor + ";font-variant-numeric:tabular-nums'>" + sign + p.amount.toLocaleString("de-DE") + " €</span></div>";
}).join("");
}
}
}
function applyFilters(filters) {
if (!filters) filters = {};
const today = new Date(); today.setHours(0,0,0,0);
return positions
.map(function(p, i) { return Object.assign({}, p, { originalIndex: i }); })
.filter(function(p) {
const due = new Date(p.dueDate);
const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
if (filters.pill === "overdue" && diffDays >= 0) return false;
if (filters.pill === "due7" && (diffDays < 0 || diffDays > 7)) return false;
if (filters.pill === "due30" && (diffDays < 0 || diffDays > 30)) return false;
if (filters.type && filters.type !== "all" && p.type !== filters.type) return false;
if (filters.minAmount && p.amount < filters.minAmount) return false;
if (filters.maxAmount && p.amount > filters.maxAmount) return false;
if (filters.fromDate && new Date(p.dueDate) < new Date(filters.fromDate)) return false;
if (filters.toDate && new Date(p.dueDate) > new Date(filters.toDate)) return false;
if (filters.name && !p.name.toLowerCase().includes(filters.name)) return false;
if (filters.number && !p.number.includes(filters.number)) return false;
return true;
});
}
function renderOposLists(filters) {
var recList = document.getElementById("oposRecRows");
var payList = document.getElementById("oposPayRows");
if (!recList && !payList) return;
var filtered = applyFilters(filters);
var recItems = filtered.filter(function(p) { return p.type === "receivable"; });
var payItems = filtered.filter(function(p) { return p.type === "payable"; });
function rowHTML(p, isLast) {
var pill = getDayPill(p.dueDate);
var border = isLast ? "" : "border-bottom:1px solid #f0f3f6;";
return "<div data-index='" + p.originalIndex + "' style='display:flex;align-items:center;gap:10px;padding:11px 16px;" + border + "'>" +
"<div style='flex:1;min-width:0'>" +
"<div style='font-size:13px;font-weight:600;color:#1e2a38'>" + p.name + "</div>" +
"<div style='font-size:11px;color:#9aa6b2'>" + p.number + "</div>" +
"</div>" +
pill +
"<span style='font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:#1e2a38;min-width:68px;text-align:right'>" + p.amount.toLocaleString("de-DE") + " €</span>" +
"<button data-index='" + p.originalIndex + "' class='delete-btn' style='width:22px;height:22px;border-radius:6px;border:none;background:transparent;color:#b3bdc7;font-size:15px;font-family:inherit;cursor:pointer;flex:none;padding:0;'>✕</button>" +
"</div>";
}
if (recList) {
recList.innerHTML = recItems.length
? recItems.map(function(p, idx) { return rowHTML(p, idx === recItems.length - 1); }).join("")
: "<div style='font-size:13px;color:#9aa6b2;padding:14px 16px'>Keine Forderungen für diesen Filter.</div>";
}
if (payList) {
payList.innerHTML = payItems.length
? payItems.map(function(p, idx) { return rowHTML(p, idx === payItems.length - 1); }).join("")
: "<div style='font-size:13px;color:#9aa6b2;padding:14px 16px'>Keine Verbindlichkeiten für diesen Filter.</div>";
}
}
function renderPositionsTable(filters) {
var container = document.getElementById("positionsList");
if (!container) return;
container.innerHTML = "";
var filtered = applyFilters(filters);
filtered.forEach(function(p) {
var status = getDaysStatus(p.dueDate);
var typeLabel = p.type === "receivable" ? "Forderung" : "Verbindlichkeit";
var badgeBg = p.type === "receivable" ? "#eef6ef" : "#fdecea";
var badgeColor = p.type === "receivable" ? "#1f9d6b" : "#e0533d";
var row = document.createElement("div");
row.className = "position-row";
row.innerHTML =
"<div style='font-weight:600'>" + p.name + "</div>" +
"<div style='color:#8a96a3'>" + p.number + "</div>" +
"<div style='font-weight:700;font-variant-numeric:tabular-nums'>" + p.amount.toLocaleString("de-DE") + " €</div>" +
"<div><span style='font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;background:" + badgeBg + ";color:" + badgeColor + "'>" + typeLabel + "</span></div>" +
"<div style='color:#6b7886'>" + p.dueDate + "</div>" +
"<div style='color:" + status.color + ";font-weight:600;font-size:12px'>" + status.text + "</div>" +
"<div><button data-index='" + p.originalIndex + "' class='delete-btn'>✕</button></div>";
container.appendChild(row);
});
}
function renderPositions(filters) {
renderOposSummary();
renderOposLists(filters);
renderPositionsTable(filters);
}
(function setupFilterPills() {
var pillBar = document.getElementById("oposFilterPills");
if (!pillBar) return;
var pillEls = pillBar.querySelectorAll("a, button, div");
var labelToFilter = { "Alle": "all", "Überfällig": "overdue", "≤ 7 Tage": "due7", "≤ 30 Tage": "due30" };
var matched = [];
pillEls.forEach(function(el) {
var txt = el.textContent.trim();
if (labelToFilter.hasOwnProperty(txt) && matched.indexOf(el) === -1) {
if (el.children.length <= 1) matched.push(el);
}
});
matched.forEach(function(el) {
var txt = el.textContent.trim();
el.setAttribute("data-filter", labelToFilter[txt]);
el.style.cursor = "pointer";
if (txt === "Alle") el.classList.add("opos-pill-active");
el.addEventListener("click", function(e) {
e.preventDefault();
matched.forEach(function(p) {
p.classList.remove("opos-pill-active");
p.style.background = "transparent";
p.style.color = "#46535f";
p.style.fontWeight = "500";
});
el.classList.add("opos-pill-active");
el.style.background = "#1e2a38";
el.style.color = "#fff";
el.style.fontWeight = "600";
renderPositions(getFilters());
});
});
matched.forEach(function(el) {
if (el.classList.contains("opos-pill-active")) {
el.style.background = "#1e2a38";
el.style.color = "#fff";
el.style.fontWeight = "600";
} else {
el.style.background = "transparent";
el.style.color = "#46535f";
el.style.fontWeight = "500";
}
});
})();
var modal = document.getElementById("addModal");
var openBtn = document.getElementById("openModal");
var openBtnPay = document.getElementById("openModalPay");
var closeBtn = document.getElementById("closeModal");
var saveBtn = document.getElementById("savePosition");
function openModalWithType(type) {
if (modal) modal.style.display = "flex";
var typeSelect = document.getElementById("positionType");
if (typeSelect) typeSelect.value = type;
}
if (openBtn) openBtn.addEventListener("click", function() { openModalWithType("receivable"); });
if (openBtnPay) openBtnPay.addEventListener("click", function() { openModalWithType("payable"); });
if (closeBtn) closeBtn.addEventListener("click", function() { if (modal) modal.style.display = "none"; });
if (saveBtn) {
saveBtn.addEventListener("click", function() {
var nameVal    = document.getElementById("modalName")?.value.trim();
var numberVal  = document.getElementById("modalNumber")?.value.trim();
var amountVal  = Number(document.getElementById("modalAmount")?.value);
var typeVal    = document.getElementById("positionType")?.value;
var dueDateVal = document.getElementById("modalDueDate")?.value;
if (!nameVal || !numberVal || !amountVal || !dueDateVal) { alert("Bitte alle Felder ausfüllen."); return; }
positions.push({ name: nameVal, number: numberVal, amount: amountVal, type: typeVal, dueDate: dueDateVal });
renderPositions(getFilters());
if (modal) modal.style.display = "none";
["modalName","modalNumber","modalAmount","modalDueDate"].forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ""; });
});
}
["positionsList", "oposRecRows", "oposPayRows"].forEach(function(containerId) {
var el = document.getElementById(containerId);
if (el) {
el.addEventListener("click", function(e) {
if (e.target.classList.contains("delete-btn")) {
positions.splice(Number(e.target.getAttribute("data-index")), 1);
renderPositions(getFilters());
}
});
}
});

// ===== KENNZAHLEN - data + helpers + render + Umsatz card =====
const kennzahlenData = {
months:     ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"],
monthsFull: { "Jan": "Januar", "Feb": "Februar", "Mär": "März", "Apr": "April", "Mai": "Mai", "Jun": "Juni", "Jul": "Juli", "Aug": "August", "Sep": "September", "Okt": "Oktober", "Nov": "November", "Dez": "Dezember" },
// PLACEHOLDER: years[] muss parallel zu months[] laufen – kommt später aus der API
years:      [2026,  2026,  2026,  2026,  2026,  2026],
einnahmen:               [17200, 18600, 16900, 20100, 18700, 19800],
sonstigeErtraege:        [860,   640,   980,   1120,  920,   1240],
materialeinsatz:         [4200,  4600,  4100,  5350,  4900,  4920],
personalkosten:          [11800, 11800, 11800, 11800, 11800, 11800],
sonstigeAusgaben:        [1200,  1350,  1100,  1500,  1275,  1380],
zahlungszielKunden:      [36,    35,    33,    32,    34,    34],
zahlungszielLieferanten: [19,    20,    22,    20,    21,    21]
};
kennzahlenData.ausgaben = kennzahlenData.materialeinsatz.map(function(m, i) {
return m + kennzahlenData.personalkosten[i] + kennzahlenData.sonstigeAusgaben[i];
});
kennzahlenData.gewinn = kennzahlenData.einnahmen.map(function(e, i) {
return e - kennzahlenData.ausgaben[i];
});
let kennzahlenPeriod = "month";
function kzFmt(n) {
return Math.round(n).toLocaleString("de-DE") + " €";
}
function kzSum(arr, start, end) {
var s = 0;
for (var i = start; i <= end; i++) s += arr[i];
return s;
}
function kzAvg(arr, start, end) {
return kzSum(arr, start, end) / (end - start + 1);
}
function kzNum(n) {
var abs = Math.abs(n);
return abs < 10
? abs.toLocaleString("de-DE", { maximumFractionDigits: 1 })
: Math.round(abs).toLocaleString("de-DE");
}
function kzTrend(delta, suffix, invert) {
var up = delta >= 0;
var good = invert ? !up : up;
var color = good ? "#1f9d6b" : "#e0533d";
var arrow = up ? "▲" : "▼";
return "<span style='color:" + color + "'>" + arrow + " " + kzNum(delta) + suffix + "</span>";
}
function kzSparkline(values, monthLabels, color, width) {
var w = Math.max(Math.round(width || 220), 120), h = 76, padL = 6, padR = 6, padT = 10, padB = 16;
var n = values.length;
if (n === 0) return "";
var minV = Math.min.apply(null, values), maxV = Math.max.apply(null, values);
var range = (maxV - minV) || 1;
var pts = values.map(function(v, i) {
return {
x: n === 1 ? w / 2 : padL + ((w - padL - padR) * i / (n - 1)),
y: padT + (1 - (v - minV) / range) * (h - padT - padB)
};
});
var pathD = "M" + pts.map(function(p) { return p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" L");
var areaD = pathD + " L" + pts[pts.length - 1].x.toFixed(1) + "," + (h - padB).toFixed(1) + " L" + pts[0].x.toFixed(1) + "," + (h - padB).toFixed(1) + " Z";
var gradId = "kzgrad" + color.replace("#", "") + n;
var circles = pts.map(function(p, i) {
var last = i === pts.length - 1;
var monthFull = (kennzahlenData.monthsFull[monthLabels[i]]) || monthLabels[i];
var valFmt = kzFmt(values[i]);
var visible = last
? "<circle cx='" + p.x.toFixed(1) + "' cy='" + p.y.toFixed(1) + "' r='4' fill='" + color + "' style='pointer-events:none'></circle>"
: "<circle cx='" + p.x.toFixed(1) + "' cy='" + p.y.toFixed(1) + "' r='3' fill='#fff' stroke='" + color + "' stroke-width='2' style='pointer-events:none'></circle>";
var hit = "<circle class='kz-point' data-month=\"" + monthFull + "\" data-value=\"" + valFmt + "\" cx='" + p.x.toFixed(1) + "' cy='" + p.y.toFixed(1) + "' r='11' fill='transparent' style='cursor:pointer'></circle>";
return visible + hit;
}).join("");
var labels = pts.map(function(p, i) {
var anchor = i === 0 ? "start" : (i === pts.length - 1 ? "end" : "middle");
var weight = i === pts.length - 1 ? "700" : "500";
return "<text x='" + p.x.toFixed(1) + "' y='" + (h - 4) + "' text-anchor='" + anchor + "' font-size='10' fill='#9aa6b2' font-weight='" + weight + "'>" + monthLabels[i] + "</text>";
}).join("");
return "<svg width='" + w + "' height='" + h + "' viewBox='0 0 " + w + " " + h + "' style='display:block;overflow:visible'>" +
"<defs><linearGradient id='" + gradId + "' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='" + color + "' stop-opacity='0.18'></stop><stop offset='100%' stop-color='" + color + "' stop-opacity='0'></stop></linearGradient></defs>" +
"<path d='" + areaD + "' fill='url(#" + gradId + ")'></path>" +
"<path d='" + pathD + "' fill='none' stroke='" + color + "' stroke-width='2.25' stroke-linejoin='round' stroke-linecap='round'></path>" +
circles + labels + "</svg>";
}
var kzPointTooltip = document.createElement("div");
kzPointTooltip.id = "kzPointTooltip";
kzPointTooltip.style.cssText = "position:fixed;display:none;background:#1e2a38;color:#fff;font-size:12px;font-weight:700;padding:5px 9px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 8px 22px rgba(16,30,50,0.24);white-space:nowrap;font-family:Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums;";
document.body.appendChild(kzPointTooltip);
document.addEventListener("mouseover", function(e) {
var t = e.target.closest ? e.target.closest(".kz-point") : null;
if (!t) return;
var month = t.getAttribute("data-month");
var value = t.getAttribute("data-value");
kzPointTooltip.innerHTML = month + " · <span style='font-weight:800'>" + value + "</span>";
kzPointTooltip.style.display = "block";
});
document.addEventListener("mousemove", function(e) {
if (kzPointTooltip.style.display === "block") {
kzPointTooltip.style.left = (e.clientX + 14) + "px";
kzPointTooltip.style.top = (e.clientY - 30) + "px";
}
});
document.addEventListener("mouseout", function(e) {
var t = e.target.closest ? e.target.closest(".kz-point") : null;
if (t) kzPointTooltip.style.display = "none";
});
function kzTwoBarChart(prevLabel, prevVal, curLabel, curVal, color, lightColor) {
var maxVal = Math.max(prevVal, curVal, 1);
var prevH = Math.max(Math.round((prevVal / maxVal) * 100), 4);
var curH = Math.max(Math.round((curVal / maxVal) * 100), 4);
function bar(label, val, height, bg) {
return "<div style='flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%;justify-content:flex-end'>" +
"<span style='font-size:11.5px;font-weight:700;font-variant-numeric:tabular-nums;color:#3a4a57;white-space:nowrap'>" + kzFmt(val) + "</span>" +
"<div style='width:100%;border-radius:6px 6px 0 0;background:" + bg + ";height:" + height + "%'></div>" +
"<span style='font-size:11px;color:#9aa6b2;font-weight:600'>" + label + "</span></div>";
}
return "<div style='display:flex;align-items:flex-end;gap:14px;height:76px;margin-bottom:14px'>" +
bar(prevLabel, prevVal, prevH, lightColor) + bar(curLabel, curVal, curH, color) + "</div>";
}
function kzMetricRow(label, value, trendHTML, tooltip) {
return "<div style='padding:14px 0;border-top:1px solid #f0f3f6;position:relative'>" +
"<div class='kz-info-wrap' style='position:absolute;top:14px;right:0'>" +
"<div style='width:18px;height:18px;border-radius:50%;border:1.5px solid #c8d2dc;color:#9aa6b2;font-size:10.5px;font-weight:700;font-style:italic;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;cursor:help'>i</div>" +
"<div class='kz-tooltip'>" + tooltip + "</div>" +
"</div>" +
"<div style='font-size:12px;font-weight:600;color:#8a96a3;padding-right:24px'>" + label + "</div>" +
"<div style='font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-top:6px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + value + "</div>" +
"<div style='font-size:12px;margin-top:5px;font-weight:600'>" + trendHTML + "</div></div>";
}
function kzColumn(dotColor, title, subtitle, heroBlockHTML, kpiRowsHTML) {
return "<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:20px 22px;box-shadow:0 1px 2px rgba(16,30,50,0.04);display:flex;flex-direction:column;gap:18px'>" +
"<div style='display:flex;align-items:center;gap:9px'><span style='width:11px;height:11px;border-radius:50%;background:" + dotColor + ";flex:none'></span><span style='font-size:17px;font-weight:700;letter-spacing:-0.01em;color:#1e2a38'>" + title + "</span></div>" +
"<div style='font-size:12px;color:#1e2a38;font-weight:500;margin-top:-12px'>" + subtitle + "</div>" +
"<div style='background:#f8fafb;border:1px solid #eef1f4;border-radius:12px;padding:16px 18px'>" + heroBlockHTML + "</div>" +
"<div style='display:flex;flex-direction:column'>" + kpiRowsHTML + "</div>" +
"</div>";
}
// Gewünschte Fenstergröße, begrenzt auf die tatsächlich vorhandenen Monate
function kzWindowLen() {
var n = kennzahlenData.months.length;
if (kennzahlenPeriod === "month") return Math.min(1, n);
if (kennzahlenPeriod === "3m") return Math.min(3, n);
return Math.min(6, n);
}
function kzMonthLabel(i, withYear) {
var d = kennzahlenData, key = d.months[i];
var name = (d.monthsFull && d.monthsFull[key]) || key || "";
var year = d.years && d.years[i];
return withYear && year ? name + " " + year : name;
}
function kzPeriodValue(arr, mode) {
var n = kennzahlenData.months.length, len = kzWindowLen();
if (!n || !len) return { cur: 0, prev: null };
if (kennzahlenPeriod === "month") {
return { cur: arr[n - 1], prev: n >= 2 ? arr[n - 2] : null };
}
var fn = mode === "avg" ? kzAvg : kzSum;
var cur = fn(arr, n - len, n - 1);
var prev = null;
// Vorperiode nur, wenn wirklich ein zweites volles Fenster existiert
if (kennzahlenPeriod === "3m" && n >= len * 2) prev = fn(arr, n - len * 2, n - len - 1);
return { cur: cur, prev: prev };
}
function kzPeriodLabel() {
var d = kennzahlenData, n = d.months.length, len = kzWindowLen();
if (!n) return "";
if (len <= 1) return kzMonthLabel(n - 1, true);
var i0 = n - len, i1 = n - 1;
var crossesYear = !!(d.years && d.years[i0] !== d.years[i1]);
return "Summe · " + kzMonthLabel(i0, crossesYear) + " – " + kzMonthLabel(i1, true);
}
function kzBigTrendHTML(cur, prev, invert) {
var len = kzWindowLen();
var noPrev = prev === null || prev === undefined || isNaN(prev) || prev === 0;
if (noPrev) {
if (len > 1) return "<span style='color:#8a96a3'>Ø " + kzFmt(cur / len) + " pro Monat</span>";
return "<span style='color:#8a96a3'>Keine Vorperiode</span>";
}
var delta = ((cur - prev) / Math.abs(prev)) * 100;
var refText = len === 1 ? " vs. Vormonat" : " vs. vorherige " + len + " Monate";
return kzTrend(delta, " %", invert) + refText;
}
function kzSubTrendHTML(cur, prev, mode, suffix, invert) {
var len = kzWindowLen();
if (prev === null || prev === undefined || isNaN(prev)) {
return "<span style='color:#8a96a3'>" + (len > 1 ? "Ø letzte " + len + " Monate" : "Kein Vormonat") + "</span>";
}
if (mode === "abs") {
return kzTrend(cur - prev, suffix || "", invert);
}
var pct = prev ? ((cur - prev) / Math.abs(prev)) * 100 : 0;
return kzTrend(pct, " %", invert);
}
function kzDrawSparklines() {
var nodes = document.querySelectorAll(".kz-spark");
for (var i = 0; i < nodes.length; i++) {
var node = nodes[i];
var w = Math.round(node.getBoundingClientRect().width);
if (!w) continue;
if (node.getAttribute("data-w") === String(w)) continue;
node.setAttribute("data-w", String(w));
node.innerHTML = kzSparkline(
JSON.parse(node.getAttribute("data-values")),
JSON.parse(node.getAttribute("data-labels")),
node.getAttribute("data-color"),
w
);
}
}
var kzResizeTimer = null;
window.addEventListener("resize", function() {
clearTimeout(kzResizeTimer);
kzResizeTimer = setTimeout(kzDrawSparklines, 120);
});
function kzChartHTML(arr, color, lightColor) {
var m = kennzahlenData.months, n = m.length, len = kzWindowLen();
if (!n) return "";
if (kennzahlenPeriod === "month") {
if (n < 2) return "";
return kzTwoBarChart(m[n - 2], arr[n - 2], m[n - 1], arr[n - 1], color, lightColor);
}
var values = arr.slice(n - len);
var labels = m.slice(n - len);
return "<div class='kz-spark' data-values='" + JSON.stringify(values) + "' data-labels='" + JSON.stringify(labels) + "' data-color='" + color + "' style='height:76px;margin-bottom:14px'></div>";
}
function renderKennzahlen() {
var container = document.getElementById("kennzahlenContainer");
if (!container) return;
var d = kennzahlenData;
var nMonths = d.months.length;
var len3 = Math.min(3, nMonths), len6 = Math.min(6, nMonths);
// Auf einen gültigen Zeitraum zurückfallen, wenn zu wenig Monate vorhanden sind
if (kennzahlenPeriod === "3m" && len3 < 2) kennzahlenPeriod = "month";
if (kennzahlenPeriod === "6m" && len6 <= len3) kennzahlenPeriod = len3 > 1 ? "3m" : "month";
var winLen = kzWindowLen();
var subtitleSuffix = winLen <= 1 ? "aktueller Monat" : "letzte " + winLen + " Monate";
var labelSuffix = winLen <= 1 ? " (Monat)" : " (" + winLen + " Monate)";
var einV = kzPeriodValue(d.einnahmen, "sum");
var ztkV = kzPeriodValue(d.zahlungszielKunden, "avg");
var sonstV = kzPeriodValue(d.sonstigeErtraege, "sum");
var einnahmenHTML = kzColumn(
"#1f9d6b", "Einnahmen", "Einnahmen · " + subtitleSuffix,
kzChartHTML(d.einnahmen, "#1f9d6b", "#bfe3d3") +
"<div style='font-size:12.5px;font-weight:600;color:#8a96a3'>" + kzPeriodLabel() + "</div>" +
"<div style='font-size:34px;font-weight:700;letter-spacing:-0.02em;margin-top:5px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + kzFmt(einV.cur) + "</div>" +
"<div style='font-size:13px;margin-top:6px;font-weight:600'>" + kzBigTrendHTML(einV.cur, einV.prev) + "</div>",
kzMetricRow("Umsatz" + labelSuffix, kzFmt(einV.cur), kzSubTrendHTML(einV.cur, einV.prev, "pct"),
"Summe aller im laufenden Monat gestellten Rechnungen (netto). Berechnung: Σ Rechnungsbeträge mit Rechnungsdatum im " + d.monthsFull[d.months[d.months.length - 1]] + ".") +
kzMetricRow("Ø Zahlungsziel Kunden", Math.round(ztkV.cur) + " Tage", kzSubTrendHTML(ztkV.cur, ztkV.prev, "abs", " Tage", true),
"Wie lange Kunden im Schnitt bis zur Zahlung brauchen. Berechnung: Ø Tage zwischen Rechnungsdatum und Zahlungseingang.") +
kzMetricRow("Sonstige Erträge", kzFmt(sonstV.cur), kzSubTrendHTML(sonstV.cur, sonstV.prev, "pct"),
"Erträge außerhalb des Kerngeschäfts – z. B. Zinsen, Verkauf von Anlagevermögen oder Zuschüsse.")
);
var ausV = kzPeriodValue(d.ausgaben, "sum");
var ztlV = kzPeriodValue(d.zahlungszielLieferanten, "avg");
var matV = kzPeriodValue(d.materialeinsatz, "sum");
var perV = kzPeriodValue(d.personalkosten, "sum");
var sonAusV = kzPeriodValue(d.sonstigeAusgaben, "sum");
var ausgabenHTML = kzColumn(
"#e0533d", "Ausgaben", "Ausgaben · " + subtitleSuffix,
kzChartHTML(d.ausgaben, "#e0533d", "#f3cfc6") +
"<div style='font-size:12.5px;font-weight:600;color:#8a96a3'>" + kzPeriodLabel() + "</div>" +
"<div style='font-size:34px;font-weight:700;letter-spacing:-0.02em;margin-top:5px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + kzFmt(ausV.cur) + "</div>" +
"<div style='font-size:13px;margin-top:6px;font-weight:600'>" + kzBigTrendHTML(ausV.cur, ausV.prev, true) + "</div>",
kzMetricRow("Ø Zahlungsziel Lieferanten", Math.round(ztlV.cur) + " Tage", kzSubTrendHTML(ztlV.cur, ztlV.prev, "abs", " Tage"),
"Wie lange wir uns im Schnitt Zeit lassen, Lieferantenrechnungen zu zahlen. Ein längeres Ziel schont die Liquidität – PAUL plant Verbindlichkeiten entsprechend später ein.") +
kzMetricRow("Materialeinsatz", kzFmt(matV.cur), kzSubTrendHTML(matV.cur, matV.prev, "pct", null, true),
"Kosten für Material und Waren, die in Aufträge eingeflossen sind. Berechnung: Σ Wareneinkäufe (z. B. Sonepar, Würth) im Monat.") +
kzMetricRow("Personalkosten", kzFmt(perV.cur), kzSubTrendHTML(perV.cur, perV.prev, "pct", null, true),
"Löhne und Gehälter inkl. Lohnnebenkosten aller Mitarbeiter. Berechnung: Bruttolöhne + Arbeitgeberanteil zur Sozialversicherung.") +
kzMetricRow("Sonstige Ausgaben", kzFmt(sonAusV.cur), kzSubTrendHTML(sonAusV.cur, sonAusV.prev, "pct", null, true),
"Laufende Betriebskosten ohne Material und Personal – Miete, Versicherungen, Leasing, Energie und Bürobedarf.")
);
var gewV = kzPeriodValue(d.gewinn, "sum");
var margeCur = einV.cur ? (gewV.cur / einV.cur) * 100 : 0;
var margePrev = (einV.prev && gewV.prev !== null && gewV.prev !== undefined) ? (gewV.prev / einV.prev) * 100 : null;
var periodMonths = winLen || 1;
var liqCur = ausV.cur ? accountsTotal / (ausV.cur / periodMonths) : 0;
var liqPrev = ausV.prev ? accountsTotal / (ausV.prev / periodMonths) : null;
var gewinnHTML = kzColumn(
"#4f5bd5", "Gewinn", "Gewinn · " + subtitleSuffix,
kzChartHTML(d.gewinn, "#4f5bd5", "#c9d0f5") +
"<div style='font-size:12.5px;font-weight:600;color:#8a96a3'>" + kzPeriodLabel() + "</div>" +
"<div style='font-size:34px;font-weight:700;letter-spacing:-0.02em;margin-top:5px;font-variant-numeric:tabular-nums;color:#1e2a38'>" + kzFmt(gewV.cur) + "</div>" +
"<div style='font-size:13px;margin-top:6px;font-weight:600'>" + kzBigTrendHTML(gewV.cur, gewV.prev) + "</div>",
kzMetricRow("Gewinn" + labelSuffix, kzFmt(gewV.cur), kzSubTrendHTML(gewV.cur, gewV.prev, "pct"),
"Was nach Abzug aller Kosten vom Umsatz übrig bleibt. Berechnung: Umsatz − Materialeinsatz − Personalkosten − sonstige Ausgaben.") +
kzMetricRow("Gewinnmarge", Math.round(margeCur) + " %", kzSubTrendHTML(margeCur, margePrev, "abs", " Pkt"),
"Anteil des Gewinns am Umsatz – wie viel von jedem Euro übrig bleibt. Berechnung: (Umsatz − alle Kosten) ÷ Umsatz × 100.") +
kzMetricRow("Liquiditätsreichweite", liqCur.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " Mon.", kzSubTrendHTML(liqCur, liqPrev, "abs", ""),
"Wie lange dein Geld bei gleichbleibenden Ausgaben reicht. Berechnung: Verfügbare Liquidität ÷ durchschnittliche Monatsausgaben.")
);
var tabOrder = ["month"];
if (len3 > 1) tabOrder.push("3m");
if (len6 > len3) tabOrder.push("6m");
var tabLabels = { month: "Aktueller Monat", "3m": len3 + " Monate", "6m": len6 + " Monate" };
var tabsHTML = tabOrder.map(function(t) {
var active = t === kennzahlenPeriod;
return "<button data-kz-period='" + t + "' style='padding:7px 13px;border-radius:7px;border:none;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;background:" + (active ? "#1e2a38" : "transparent") + ";color:" + (active ? "#fff" : "#5b6776") + "'>" + tabLabels[t] + "</button>";
}).join("");
container.innerHTML =
"<style>.kz-info-wrap{position:relative;display:inline-flex}.kz-info-wrap .kz-tooltip{display:none;position:absolute;top:34px;right:0;width:230px;background:#1e2a38;color:#fff;font-size:12px;font-weight:500;line-height:1.5;padding:12px 14px;border-radius:11px;box-shadow:0 12px 32px rgba(16,30,50,0.24);z-index:30;text-align:left;pointer-events:none}.kz-info-wrap:hover .kz-tooltip{display:block}</style>" +
"<div style='display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif'>" +
"<div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px'>" +
"<h1 style='margin:0;font-size:25px;font-weight:700;letter-spacing:-0.02em;color:#1e2a38'>Kennzahlen <span style='font-size:15px;font-weight:500;color:#9aa6b2'>· " + kzMonthLabel(nMonths - 1, true) + "</span></h1>" +
"<div style='display:flex;gap:4px;background:#eef1f4;padding:4px;border-radius:9px'>" + tabsHTML + "</div>" +
"</div>" +
"<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:start'>" + einnahmenHTML + ausgabenHTML + gewinnHTML + "</div>" +
"</div>";
container.querySelectorAll("[data-kz-period]").forEach(function(btn) {
btn.addEventListener("click", function() {
kennzahlenPeriod = btn.getAttribute("data-kz-period");
renderKennzahlen();
});
});
kzDrawSparklines();
}
function renderUmsatzCard() {
var valueEl = document.getElementById("kpiBurnRateValue");
var subEl = document.getElementById("umsatzSub");
if (!valueEl) return;
var arr = kennzahlenData.einnahmen;
var n = arr.length;
var cur = arr[n - 1];
var prev = n >= 2 ? arr[n - 2] : null;
valueEl.textContent = kzFmt(cur);
if (subEl) {
if (!prev) { subEl.innerHTML = "<span style='color:#8a96a3'>Kein Vormonat</span>"; }
else { subEl.innerHTML = kzTrend(((cur - prev) / Math.abs(prev)) * 100, " %", false) + " vs. Vormonat"; }
}
}

// ===== PROGNOSE - Szenarien, Chart, Tabelle, Annahmen =====
// PLACEHOLDER: kommt später aus den Einstellungen bzw. der API
const prognoseSettings = {
mindestreserve: 15000,
horizonMonths:  6,
baseWindow:     6   // wie viele vergangene Monate als Durchschnitt herangezogen werden
};
// Szenario-Faktoren auf die durchschnittlichen Einnahmen/Ausgaben
const prognoseScenarios = {
vorsichtig:   { label: "Vorsichtig",   inc: 0.85, exp: 1.08 },
basis:        { label: "Basis",        inc: 1.00, exp: 1.00 },
optimistisch: { label: "Optimistisch", inc: 1.12, exp: 0.97 }
};
const prognoseOrder = ["vorsichtig", "basis", "optimistisch"];
let prognoseScenario = "basis";
const pgMonthOrder = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
function pgFmt(n) {
return Math.round(n).toLocaleString("de-DE") + " €";
}
function pgSigned(n) {
var s = Math.round(n);
var sign = s > 0 ? "+" : (s < 0 ? "−" : "");
return sign + Math.abs(s).toLocaleString("de-DE") + " €";
}
function pgPct(f) {
var p = Math.round((f - 1) * 100);
return (p > 0 ? "+" : "") + p + " %";
}
function pgMonthName(key) {
return (kennzahlenData.monthsFull && kennzahlenData.monthsFull[key]) || key;
}
// Durchschnittswerte aus den Kennzahlen-Daten – identische Datenbasis wie die anderen Seiten
function pgBase() {
var d = kennzahlenData, n = d.months.length;
var len = Math.min(prognoseSettings.baseWindow, n);
if (!n) return { len: 0, inc: 0, exp: 0, ztk: 0, ztl: 0, per: 0 };
var i0 = n - len, i1 = n - 1;
return {
len: len,
inc: (kzSum(d.einnahmen, i0, i1) + kzSum(d.sonstigeErtraege, i0, i1)) / len,
exp: kzSum(d.ausgaben, i0, i1) / len,
ztk: kzAvg(d.zahlungszielKunden, i0, i1),
ztl: kzAvg(d.zahlungszielLieferanten, i0, i1),
per: kzAvg(d.personalkosten, i0, i1)
};
}
// Liquiditätsverlauf: Startpunkt = aktueller Kontostand, danach Monat für Monat fortgeschrieben
function pgSeries() {
var d = kennzahlenData, n = d.months.length;
var b = pgBase();
var sc = prognoseScenarios[prognoseScenario] || prognoseScenarios.basis;
var inc = b.inc * sc.inc, exp = b.exp * sc.exp;
var startKey = n ? d.months[n - 1] : pgMonthOrder[new Date().getMonth()];
var year = (n && d.years) ? d.years[n - 1] : null;
var mi = pgMonthOrder.indexOf(startKey);
if (mi < 0) mi = new Date().getMonth();
var cur = accountsTotal;
var pts = [{ key: startKey, year: year, liq: cur, delta: null, isNow: true }];
for (var i = 0; i < prognoseSettings.horizonMonths; i++) {
mi += 1;
if (mi > 11) { mi = 0; if (year) year += 1; }
cur += inc - exp;
pts.push({ key: pgMonthOrder[mi], year: year, liq: cur, delta: inc - exp, isNow: false });
}
return { points: pts, inc: inc, exp: exp, base: b, scenario: sc };
}
// Tiefpunkt der Prognose – der Startmonat zählt nicht mit, er ist bereits Realität
function pgLowest(pts) {
var low = pts[1] || pts[0];
for (var i = 2; i < pts.length; i++) { if (pts[i].liq < low.liq) low = pts[i]; }
return low;
}
// Chart wird erst nach dem Rendern gezeichnet, damit die echte Containerbreite bekannt ist
function pgDrawChart() {
var node = document.getElementById("prognoseChart");
if (!node) return;
var w = Math.round(node.getBoundingClientRect().width);
if (!w) return;
var s = pgSeries();
var pts = s.points, n = pts.length;
var reserve = prognoseSettings.mindestreserve;
var h = 250, padL = 8, padR = 8, padT = 34, padB = 30;
var innerW = w - padL - padR, innerH = h - padT - padB;
var vals = pts.map(function(p) { return p.liq; }).concat([reserve]);
var minV = Math.min.apply(null, vals), maxV = Math.max.apply(null, vals);
var span = (maxV - minV) || Math.max(Math.abs(maxV), 1);
minV -= span * 0.2; maxV += span * 0.2;
var range = (maxV - minV) || 1;
function X(i) { return n === 1 ? padL + innerW / 2 : padL + innerW * i / (n - 1); }
function Y(v) { return padT + (1 - (v - minV) / range) * innerH; }
var low = pgLowest(pts);
var below = low.liq < reserve;
var lineColor = "#1f9d6b";
var coords = pts.map(function(p, i) { return { x: X(i), y: Y(p.liq) }; });
var pathD = "M" + coords.map(function(c) { return c.x.toFixed(1) + "," + c.y.toFixed(1); }).join(" L");
var areaD = pathD + " L" + coords[n - 1].x.toFixed(1) + "," + (h - padB).toFixed(1) +
" L" + coords[0].x.toFixed(1) + "," + (h - padB).toFixed(1) + " Z";
var yr = Y(reserve);
var circles = pts.map(function(p, i) {
var c = coords[i];
var isLow = p === low;
var dot;
if (isLow && below) {
dot = "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='5.5' fill='#fff' stroke='#c62828' stroke-width='2.5' style='pointer-events:none'></circle>";
} else if (p.isNow) {
dot = "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='4.5' fill='" + lineColor + "' style='pointer-events:none'></circle>";
} else {
dot = "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='3.5' fill='#fff' stroke='" + lineColor + "' stroke-width='2' style='pointer-events:none'></circle>";
}
var label = pgMonthName(p.key) + (p.year ? " " + p.year : "");
var hit = "<circle class='kz-point' data-month=\"" + label + "\" data-value=\"" + pgFmt(p.liq) + "\" cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='13' fill='transparent' style='cursor:pointer'></circle>";
return dot + hit;
}).join("");
var labels = pts.map(function(p, i) {
var anchor = i === 0 ? "start" : (i === n - 1 ? "end" : "middle");
var txt = p.key + (p.isNow ? " · jetzt" : "");
var weight = p.isNow ? "700" : "600";
var fill = p.isNow ? "#1e2a38" : "#8a96a3";
return "<text x='" + X(i).toFixed(1) + "' y='" + (h - 9) + "' text-anchor='" + anchor + "' font-size='11.5' font-weight='" + weight + "' fill='" + fill + "'>" + txt + "</text>";
}).join("");
var reserveLine =
"<line x1='" + padL + "' y1='" + yr.toFixed(1) + "' x2='" + (w - padR) + "' y2='" + yr.toFixed(1) + "' stroke='#e07b00' stroke-width='1.25' stroke-dasharray='5 5' opacity='0.8'></line>" +
"<text x='" + (w - padR) + "' y='" + (yr - 8).toFixed(1) + "' text-anchor='end' font-size='11.5' font-weight='700' fill='#e07b00'>Mindestreserve " + pgFmt(reserve) + "</text>";
node.innerHTML =
"<svg width='" + w + "' height='" + h + "' viewBox='0 0 " + w + " " + h + "' style='display:block;overflow:visible'>" +
"<defs><linearGradient id='pggrad' x1='0' y1='0' x2='0' y2='1'>" +
"<stop offset='0%' stop-color='" + lineColor + "' stop-opacity='0.18'></stop>" +
"<stop offset='100%' stop-color='" + lineColor + "' stop-opacity='0'></stop></linearGradient></defs>" +
"<path d='" + areaD + "' fill='url(#pggrad)'></path>" +
reserveLine +
"<path d='" + pathD + "' fill='none' stroke='" + lineColor + "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'></path>" +
circles + labels + "</svg>";
}
function pgRow(label, value, valueColor, bold) {
return "<div style='display:flex;justify-content:space-between;align-items:center;gap:14px;padding:11px 0;border-top:1px solid #f0f3f6'>" +
"<span style='font-size:13px;color:#5b6776;font-weight:500'>" + label + "</span>" +
"<span style='font-size:13px;font-weight:" + (bold ? "700" : "600") + ";font-variant-numeric:tabular-nums;color:" + (valueColor || "#1e2a38") + ";white-space:nowrap'>" + value + "</span></div>";
}
function renderPrognose() {
var container = document.getElementById("prognoseContainer");
if (!container) return;
var s = pgSeries();
var pts = s.points, reserve = prognoseSettings.mindestreserve;
var low = pgLowest(pts);
var below = low.liq < reserve;
var lowLabel = pgMonthName(low.key);
var gap = reserve - low.liq;
var alertColor = below ? "#c62828" : "#1f9d6b";
var alertBg = below ? "#fdf3f2" : "#f3f8f4";
var alertTail = below
? " · unter der Mindestreserve – Achtung."
: " · du bleibst über der Mindestreserve.";
var alertHTML =
"<div style='display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:10px;background:" + alertBg + ";margin-bottom:14px'>" +
"<span style='width:9px;height:9px;border-radius:50%;background:" + alertColor + ";flex:none'></span>" +
"<span style='font-size:13.5px;color:#3a4a57'><b style='color:" + alertColor + "'>Tiefster Stand: " + pgFmt(low.liq) + " im " + lowLabel + "</b>" + alertTail + "</span></div>";
if (below) {
alertHTML +=
"<div style='display:flex;align-items:flex-start;gap:9px;padding:0 14px 12px;font-size:13px;color:#5b6776;line-height:1.55'>" +
"<span style='flex:none;width:9px'></span><span>Im " + lowLabel + " fehlen dir <b style='color:#c62828'>" + pgFmt(gap) + "</b> bis zur Mindestreserve. " +
"Hol offene Forderungen früher rein, verschiebe größere Anschaffungen oder sprich rechtzeitig mit deiner Bank.</span></div>";
}
var tabsHTML = prognoseOrder.map(function(k) {
var active = k === prognoseScenario;
return "<button data-pg-scenario='" + k + "' style='padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;background:" +
(active ? "#1e2a38" : "transparent") + ";color:" + (active ? "#fff" : "#5b6776") + "'>" + prognoseScenarios[k].label + "</button>";
}).join("");
var rowsHTML = pts.map(function(p) {
var under = p.liq < reserve;
var liqColor = under ? "#c62828" : "#1e2a38";
var deltaHTML = p.delta === null
? "<span style='color:#9aa6b2'>—</span>"
: "<span style='color:" + (p.delta >= 0 ? "#1f9d6b" : "#c62828") + "'>" + pgSigned(p.delta) + "</span>";
return "<div style='display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;padding:12px 18px;border-top:1px solid #f0f3f6;background:" + (under ? "#fdf6f5" : "transparent") + "'>" +
"<span style='font-size:13.5px;font-weight:" + (p.isNow ? "700" : "500") + ";color:#1e2a38'>" + pgMonthName(p.key) + (p.isNow ? " <span style=\"font-weight:500;color:#9aa6b2\">· jetzt</span>" : "") + "</span>" +
"<span style='font-size:13.5px;font-weight:700;font-variant-numeric:tabular-nums;color:" + liqColor + ";text-align:right;min-width:88px'>" + pgFmt(p.liq) + "</span>" +
"<span style='font-size:13.5px;font-weight:600;font-variant-numeric:tabular-nums;text-align:right;min-width:88px'>" + deltaHTML + "</span></div>";
}).join("");
var tableHTML =
"<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(16,30,50,0.04)'>" +
"<div style='display:grid;grid-template-columns:1fr auto auto;gap:16px;padding:12px 18px;background:#f8fafb'>" +
"<span style='font-size:12px;font-weight:600;color:#8a96a3'>Monat</span>" +
"<span style='font-size:12px;font-weight:600;color:#8a96a3;text-align:right;min-width:88px'>Liquidität</span>" +
"<span style='font-size:12px;font-weight:600;color:#8a96a3;text-align:right;min-width:88px'>Veränderung</span></div>" +
rowsHTML + "</div>";
var sc = s.scenario;
var scNote = prognoseScenario === "basis"
? "Durchschnitt der letzten " + s.base.len + " Monate"
: pgPct(sc.inc) + " Einnahmen · " + pgPct(sc.exp) + " Ausgaben";
var annahmenHTML =
"<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:18px 20px;box-shadow:0 1px 2px rgba(16,30,50,0.04)'>" +
"<div style='font-size:15px;font-weight:700;color:#1e2a38;margin-bottom:4px'>Annahmen</div>" +
"<div style='font-size:12.5px;color:#8a96a3;margin-bottom:6px'>Szenario " + sc.label + " · " + scNote + "</div>" +
pgRow("Startliquidität", pgFmt(accountsTotal), "#1e2a38", true) +
pgRow("Einnahmen Ø / Monat", pgFmt(s.inc)) +
pgRow("Ausgaben Ø / Monat", pgFmt(s.exp)) +
pgRow("Ergebnis Ø / Monat", pgSigned(s.inc - s.exp), (s.inc - s.exp) >= 0 ? "#1f9d6b" : "#c62828", true) +
pgRow("Ø Zahlungsziel Kunden", Math.round(s.base.ztk) + " Tage") +
pgRow("Ø Zahlungsziel Lieferanten", Math.round(s.base.ztl) + " Tage") +
pgRow("Personalkosten / Monat", pgFmt(s.base.per)) +
pgRow("Mindestreserve", pgFmt(reserve), "#e07b00", true) +
"</div>";
var infoText =
"<b>So rechnet PAUL</b><br>" +
"Startpunkt ist deine aktuelle Liquidität über alle Konten (" + pgFmt(accountsTotal) + "). " +
"Für jeden Prognosemonat werden die durchschnittlichen Einnahmen und Ausgaben der letzten " + s.base.len + " Monate fortgeschrieben und aufaddiert." +
"<br><br><b>Szenarien</b><br>" +
"Vorsichtig: " + pgPct(prognoseScenarios.vorsichtig.inc) + " Einnahmen, " + pgPct(prognoseScenarios.vorsichtig.exp) + " Ausgaben – für Zahlungsausfälle und Kostensteigerungen.<br>" +
"Basis: unveränderte Durchschnittswerte.<br>" +
"Optimistisch: " + pgPct(prognoseScenarios.optimistisch.inc) + " Einnahmen, " + pgPct(prognoseScenarios.optimistisch.exp) + " Ausgaben – gute Auftragslage." +
"<br><br>Die gestrichelte Linie ist deine Mindestreserve. Fällt die Prognose darunter, warnt dich PAUL.";
container.innerHTML =
"<style>.pg-info-wrap{position:relative;display:inline-flex;vertical-align:middle}" +
".pg-info-wrap .pg-tooltip{display:none;position:absolute;top:28px;left:0;width:300px;background:#1e2a38;color:#fff;font-size:12px;font-weight:500;line-height:1.6;padding:14px 16px;border-radius:11px;box-shadow:0 12px 32px rgba(16,30,50,0.24);z-index:40;text-align:left;pointer-events:none}" +
".pg-info-wrap:hover .pg-tooltip{display:block}</style>" +
"<div style='display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;color:#1e2a38'>" +
"<div style='display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px'>" +
"<div><h1 style='margin:0;font-size:25px;font-weight:700;letter-spacing:-0.02em;color:#1e2a38;display:flex;align-items:center;gap:9px'>Prognose" +
"<span class='pg-info-wrap'><span style='width:19px;height:19px;border-radius:50%;border:1.5px solid #c8d2dc;color:#9aa6b2;font-size:11px;font-weight:700;font-style:italic;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;cursor:help'>i</span>" +
"<span class='pg-tooltip'>" + infoText + "</span></span></h1>" +
"<div style='font-size:13px;color:#8a96a3;margin-top:4px'>Liquidität der nächsten " + prognoseSettings.horizonMonths + " Monate · Szenario wählen</div></div>" +
"<div style='display:flex;gap:6px;background:#eef1f4;padding:4px;border-radius:11px'>" + tabsHTML + "</div>" +
"</div>" +
"<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:18px 20px;box-shadow:0 1px 2px rgba(16,30,50,0.04);margin-bottom:16px'>" +
alertHTML +
"<div id='prognoseChart' style='width:100%;height:250px'></div>" +
"</div>" +
"<div style='display:grid;grid-template-columns:1.55fr 1fr;gap:16px;align-items:start'>" + tableHTML + annahmenHTML + "</div>" +
"</div>";
container.querySelectorAll("[data-pg-scenario]").forEach(function(btn) {
btn.addEventListener("click", function() {
prognoseScenario = btn.getAttribute("data-pg-scenario");
renderPrognose();
});
});
pgDrawChart();
}
var pgResizeTimer = null;
window.addEventListener("resize", function() {
clearTimeout(pgResizeTimer);
pgResizeTimer = setTimeout(pgDrawChart, 120);
});

// ===== INIT CALLS + CSV UPLOAD =====
renderKennzahlen();
renderPrognose();
renderPositions(getFilters());
setTimeout(function() { renderOposSummary(); }, 300);
var csvInput = document.createElement("input");
csvInput.type = "file"; csvInput.accept = ".csv"; csvInput.style.display = "none";
document.body.appendChild(csvInput);
var csvBtn = document.querySelector(".btn-csv-upload");
if (csvBtn) { csvBtn.addEventListener("click", function(e) { e.preventDefault(); csvInput.click(); }); }
csvInput.addEventListener("change", function() {
var file = csvInput.files[0]; if (!file) return;
var reader = new FileReader();
reader.onload = function(e) {
var parsed = parseCSV(e.target.result);
if (parsed.length === 0) { alert("Die CSV-Datei enthält keine gültigen Einträge."); return; }
parsed.forEach(function(p) { positions.push(p); });
renderPositions(getFilters());
alert(parsed.length + " Positionen aus CSV importiert.");
};
reader.readAsText(file, "UTF-8"); csvInput.value = "";
});
function parseCSV(text) {
var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ""; });
if (lines.length < 2) return [];
var headers = lines[0].split(/[;,]/).map(function(h) { return h.trim().toLowerCase().replace(/["']/g, ""); });
function colIndex(c) { for (var i=0;i<c.length;i++){var x=headers.indexOf(c[i]);if(x!==-1)return x;} return -1; }
var iName=colIndex(["name"]),iNumber=colIndex(["number","rechnungsnummer","nr","nummer"]);
var iAmount=colIndex(["amount","betrag"]),iType=colIndex(["type","typ"]);
var iDue=colIndex(["duedate","faelligkeitsdatum","faelligkeit","faellig","due"]);
var result=[];
for (var i=1;i<lines.length;i++) {
var cols=lines[i].split(/[;,]/).map(function(c){return c.trim().replace(/^["']|["']$/g,"");});
var name=iName!==-1?cols[iName]:"", number=iNumber!==-1?cols[iNumber]:"";
var amount=iAmount!==-1?parseFloat(cols[iAmount].replace(",",".")):NaN;
var rawType=iType!==-1?cols[iType].toLowerCase():"", dueDate=iDue!==-1?cols[iDue]:"";
if (!name||isNaN(amount)) continue;
var type=(rawType==="payable"||rawType==="verbindlichkeit")?"payable":"receivable";
result.push({name:name,number:number||"—",amount:amount,type:type,dueDate:dueDate||""});
}
return result;
}
}

// Startet sofort, wenn das DOM schon geladen ist – sonst nach DOMContentLoaded.
// Nötig, weil das Skript asynchron nachgeladen wird und das Event
// sonst bereits gefeuert haben kann, bevor der Listener existiert.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", paulBoot);
} else {
  paulBoot();
}


