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
if (typeof kzDrawMainChart === "function") kzDrawMainChart();
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
// kategorie steuert, wie die Prognose den Posten verrechnet:
//   "fix"    = Miete/Leasing/Versicherung – steckt schon im Fixkosten-Durchschnitt, wird nicht doppelt gezählt
//   "steuer" = Finanzamt – taucht in den Kennzahlen-Ausgaben gar nicht auf, kommt oben drauf
//   sonst    = variabel (Material, Fremdleistung) – konkurriert mit dem Materialdurchschnitt
{ name: "Sonepar Deutschland",    number: "Material",    amount: 4560, type: "payable",    dueDate: "2026-07-12", kategorie: "material" },
{ name: "Finanzamt Lindau",       number: "USt-Voranmeldung", amount: 3220, type: "payable", dueDate: "2026-07-15", kategorie: "steuer" },
{ name: "Würth",                  number: "Material",    amount: 1640, type: "payable",    dueDate: "2026-07-20", kategorie: "material" },
{ name: "Leasing Sparkasse",      number: "Transporter", amount: 550,  type: "payable",    dueDate: "2026-07-08", kategorie: "fix" },
{ name: "Allianz",                number: "Betriebshaftpflicht", amount: 1310, type: "payable", dueDate: "2026-07-27", kategorie: "fix" }
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
// ===== MAHNUNG - Textvorlage je Mahnstufe, zum Kopieren =====
// PLACEHOLDER: Absender kommt aus unternehmenData (Einstellungen).
// Rechnungsdatum, Bankverbindung und Ansprechpartner liegen noch nicht in den
// Positionsdaten - sobald die API sie liefert, hier ergaenzen. Bis dahin stehen
// eckige Klammern [ ] im Text, damit der Nutzer sofort sieht, was er ergaenzen muss.
var mahnStufen = [
{ label: "Zahlungserinnerung", frist: 10 },
{ label: "1. Mahnung",         frist: 7  },
{ label: "2. Mahnung",         frist: 7  },
{ label: "Letzte Mahnung",     frist: 5  }
];
function mahnDaysOverdue(dueDate) {
var today = new Date(); today.setHours(0,0,0,0);
var due = new Date(dueDate);
return -Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}
function mahnDefaultStufe(dueDate) {
var d = mahnDaysOverdue(dueDate);
if (d <= 7)  return 0;
if (d <= 21) return 1;
if (d <= 45) return 2;
return 3;
}
function mahnFmtDate(d) {
return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function mahnFristDate(days) {
var d = new Date(); d.setHours(0,0,0,0);
d.setDate(d.getDate() + days);
return mahnFmtDate(d);
}
function mahnBetrag(v) {
return v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
function mahnText(p, stufeIdx) {
var st      = mahnStufen[stufeIdx] || mahnStufen[0];
var tage    = mahnDaysOverdue(p.dueDate);
var faellig = mahnFmtDate(new Date(p.dueDate));
var frist   = mahnFristDate(st.frist);
var betrag  = mahnBetrag(p.amount);
var firma   = (typeof unternehmenData === "object" && unternehmenData.firma) ? unternehmenData.firma : "[Dein Firmenname]";
var tageTxt = tage > 0 ? "seit " + tage + " " + (tage === 1 ? "Tag" : "Tagen") + " " : "";

var kopf = "Betreff: " + st.label + " zu Rechnung " + p.number + "\n\n" +
p.name + "\n\n" +
"Sehr geehrte Damen und Herren,\n\n";

var fuss = "\nSollten Sie die Zahlung zwischenzeitlich veranlasst haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.\n\n" +
"Mit freundlichen Grüßen\n" +
firma + "\n" +
"[Ansprechpartner · Telefon · Bankverbindung]";

var kern;
if (stufeIdx === 0) {
kern =
"sicher ist es Ihrer Aufmerksamkeit entgangen, dass unsere Rechnung " + p.number + " über " + betrag +
" am " + faellig + " zur Zahlung fällig war. Eine Zahlung ist bei uns bisher nicht eingegangen.\n\n" +
"Wir bitten Sie, den offenen Betrag bis zum " + frist + " auf das in der Rechnung genannte Konto zu überweisen.\n";
} else if (stufeIdx === 1) {
kern =
"unsere Rechnung " + p.number + " über " + betrag + " ist " + tageTxt + "überfällig. Fällig war der Betrag am " +
faellig + ". Eine Zahlung ist bei uns bisher nicht eingegangen.\n\n" +
"Bitte gleichen Sie den offenen Betrag bis zum " + frist + " aus.\n";
} else if (stufeIdx === 2) {
kern =
"trotz Zahlungserinnerung und Mahnung ist unsere Rechnung " + p.number + " über " + betrag + " weiterhin offen. " +
"Der Betrag war am " + faellig + " fällig und ist damit " + tageTxt + "überfällig.\n\n" +
"Wir fordern Sie auf, den offenen Betrag bis spätestens " + frist + " zu begleichen. " +
"Für den weiteren Verzug behalten wir uns vor, Verzugszinsen und Mahnkosten geltend zu machen.\n";
} else {
kern =
"unsere Rechnung " + p.number + " über " + betrag + " ist trotz mehrfacher Mahnung bis heute nicht ausgeglichen. " +
"Fällig war der Betrag am " + faellig + " – er ist damit " + tageTxt + "überfällig.\n\n" +
"Wir setzen Ihnen eine letzte Frist bis zum " + frist + ". Geht bis dahin kein Zahlungseingang bei uns ein, " +
"geben wir die Forderung ohne weitere Ankündigung zur gerichtlichen Geltendmachung bzw. an ein Inkassounternehmen ab. " +
"Die dadurch entstehenden Kosten gehen zu Ihren Lasten.\n";
}
return kopf + kern + fuss;
}
// Der Button erscheint nur bei Forderungen, die heute faellig oder ueberfaellig sind.
// (Eine Zeile weiter unten aendern, falls er auf allen Forderungszeilen stehen soll.)
function mahnEligible(p) {
return p.type === "receivable" && mahnDaysOverdue(p.dueDate) >= 0;
}
function mahnButtonHTML(p) {
if (!mahnEligible(p)) return "";
return "<button data-index='" + p.originalIndex + "' class='mahn-btn' style='padding:4px 10px;border-radius:7px;border:1px solid #ecd2cb;background:#fff;color:#c0432f;font-size:11px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;flex:none'>Mahnung</button>";
}
var mahnCurrentIndex = null, mahnCurrentStufe = 0, mahnCopyTimer = null;
function mahnEnsureModal() {
var m = document.getElementById("mahnModal");
if (m) return m;
m = document.createElement("div");
m.id = "mahnModal";
m.style.cssText = "display:none;position:fixed;inset:0;z-index:9999;background:rgba(16,30,50,0.45);align-items:center;justify-content:center;padding:24px;font-family:inherit";
m.innerHTML =
"<div id='mahnCard' style='background:#fff;border-radius:16px;width:100%;max-width:580px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 18px 60px rgba(16,30,50,0.28);overflow:hidden'>" +
"<div style='display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px 14px;border-bottom:1px solid #f0f3f6'>" +
"<div><div style='font-size:16px;font-weight:700;color:#1e2a38'>Mahnung erstellen</div>" +
"<div id='mahnSub' style='font-size:12.5px;color:#9aa6b2;margin-top:2px'></div></div>" +
"<button id='mahnClose' style='width:26px;height:26px;border-radius:7px;border:none;background:transparent;color:#b3bdc7;font-size:17px;font-family:inherit;cursor:pointer;flex:none;padding:0;line-height:1'>✕</button>" +
"</div>" +
"<div style='padding:14px 20px 0'>" +
"<div style='font-size:11.5px;font-weight:600;color:#8a96a3;margin-bottom:7px'>Mahnstufe</div>" +
"<div id='mahnStufenBar' style='display:flex;gap:4px;background:#eef1f4;padding:4px;border-radius:9px;flex-wrap:wrap'></div>" +
"</div>" +
"<div style='padding:14px 20px;overflow:auto;flex:1'>" +
"<textarea id='mahnTextarea' spellcheck='false' style='width:100%;min-height:300px;padding:14px;border-radius:10px;border:1px solid #d6dde4;background:#f8fafb;font-size:13px;line-height:1.55;font-family:inherit;color:#1e2a38;outline:none;resize:vertical;box-sizing:border-box'></textarea>" +
"<div style='font-size:11.5px;color:#9aa6b2;margin-top:8px'>Text lässt sich vor dem Kopieren direkt hier anpassen. Platzhalter in [ ] bitte ergänzen.</div>" +
"</div>" +
"<div style='display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #f0f3f6;background:#fbfcfd'>" +
"<button id='mahnCancel' style='padding:9px 15px;border-radius:9px;border:1px solid #d6dde4;background:#fff;color:#46535f;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer'>Schließen</button>" +
"<button id='mahnCopy' style='padding:9px 16px;border-radius:9px;border:none;background:#1f9d6b;color:#fff;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer'>Text kopieren</button>" +
"</div>" +
"</div>";
document.body.appendChild(m);

m.addEventListener("click", function(e) { if (e.target === m) mahnClose(); });
document.getElementById("mahnClose").addEventListener("click", mahnClose);
document.getElementById("mahnCancel").addEventListener("click", mahnClose);
document.getElementById("mahnCopy").addEventListener("click", mahnCopy);
document.getElementById("mahnStufenBar").addEventListener("click", function(e) {
var b = e.target.closest ? e.target.closest("button[data-stufe]") : null;
if (!b) return;
mahnCurrentStufe = Number(b.getAttribute("data-stufe"));
mahnRender();
});
document.addEventListener("keydown", function(e) {
if (e.key === "Escape") {
var el = document.getElementById("mahnModal");
if (el && el.style.display === "flex") mahnClose();
}
});
return m;
}
function mahnRender() {
var p = positions[mahnCurrentIndex];
if (!p) return;
var tage = mahnDaysOverdue(p.dueDate);
var sub = p.name + " · " + p.number + " · " + mahnBetrag(p.amount) +
(tage > 0 ? " · " + tage + " " + (tage === 1 ? "Tag" : "Tage") + " überfällig" : " · heute fällig");
document.getElementById("mahnSub").textContent = sub;
document.getElementById("mahnStufenBar").innerHTML = mahnStufen.map(function(s, i) {
var on = i === mahnCurrentStufe;
return "<button data-stufe='" + i + "' style='padding:6px 11px;border-radius:7px;border:none;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;background:" +
(on ? "#1e2a38" : "transparent") + ";color:" + (on ? "#fff" : "#5b6776") + "'>" + s.label + "</button>";
}).join("");
document.getElementById("mahnTextarea").value = mahnText(p, mahnCurrentStufe);
var copyBtn = document.getElementById("mahnCopy");
if (copyBtn) { copyBtn.textContent = "Text kopieren"; copyBtn.style.background = "#1f9d6b"; }
}
function mahnOpen(index) {
var p = positions[index];
if (!p) return;
mahnEnsureModal();
mahnCurrentIndex = index;
mahnCurrentStufe = mahnDefaultStufe(p.dueDate);
mahnRender();
document.getElementById("mahnModal").style.display = "flex";
}
function mahnClose() {
var m = document.getElementById("mahnModal");
if (m) m.style.display = "none";
if (mahnCopyTimer) { clearTimeout(mahnCopyTimer); mahnCopyTimer = null; }
}
function mahnCopy() {
var ta = document.getElementById("mahnTextarea");
var btn = document.getElementById("mahnCopy");
if (!ta || !btn) return;
function done(ok) {
btn.textContent = ok ? "Kopiert ✓" : "Bitte manuell kopieren";
btn.style.background = ok ? "#1f9d6b" : "#e0a72e";
if (mahnCopyTimer) clearTimeout(mahnCopyTimer);
mahnCopyTimer = setTimeout(function() {
btn.textContent = "Text kopieren";
btn.style.background = "#1f9d6b";
}, 1800);
}
// navigator.clipboard braucht https - im Zweifel auf execCommand zurueckfallen.
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(ta.value).then(function() { done(true); }, function() { mahnCopyFallback(ta, done); });
} else {
mahnCopyFallback(ta, done);
}
}
function mahnCopyFallback(ta, done) {
try {
ta.focus();
ta.select();
var ok = document.execCommand("copy");
done(!!ok);
} catch (e) { done(false); }
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
// Feste Slot-Breite, damit Betrag und ✕ auch in Zeilen ohne Mahn-Button buendig bleiben.
var mahnSlot = p.type === "receivable"
? "<span style='width:80px;flex:none;display:flex;justify-content:flex-end'>" + mahnButtonHTML(p) + "</span>"
: "";
return "<div data-index='" + p.originalIndex + "' style='display:flex;align-items:center;gap:10px;padding:11px 16px;" + border + "'>" +
"<div style='flex:1;min-width:0'>" +
"<div style='font-size:13px;font-weight:600;color:#1e2a38'>" + p.name + "</div>" +
"<div style='font-size:11px;color:#9aa6b2'>" + p.number + "</div>" +
"</div>" +
pill +
"<span style='font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:#1e2a38;min-width:68px;text-align:right'>" + p.amount.toLocaleString("de-DE") + " €</span>" +
mahnSlot +
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
renderPrognose();
if (modal) modal.style.display = "none";
["modalName","modalNumber","modalAmount","modalDueDate"].forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ""; });
});
}
["positionsList", "oposRecRows", "oposPayRows"].forEach(function(containerId) {
var el = document.getElementById(containerId);
if (el) {
el.addEventListener("click", function(e) {
var mBtn = e.target.closest ? e.target.closest(".mahn-btn") : null;
if (mBtn) {
mahnOpen(Number(mBtn.getAttribute("data-index")));
return;
}
if (e.target.classList.contains("delete-btn")) {
positions.splice(Number(e.target.getAttribute("data-index")), 1);
renderPositions(getFilters());
renderPrognose();
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
// Zeitraum gilt global fuer Kennzahlen UND Uebersicht - "month" | "3m" | "6m"
let kennzahlenPeriod = "6m";
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
var kzPointTooltip = document.createElement("div");
kzPointTooltip.id = "kzPointTooltip";
kzPointTooltip.style.cssText = "position:fixed;display:none;background:#1e2a38;color:#fff;font-size:12px;font-weight:700;padding:5px 9px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 8px 22px rgba(16,30,50,0.24);white-space:nowrap;font-family:Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums;";
document.body.appendChild(kzPointTooltip);
document.addEventListener("mouseover", function(e) {
var t = e.target.closest ? e.target.closest(".kz-point") : null;
if (!t) return;
var month = t.getAttribute("data-month");
var value = t.getAttribute("data-value");
var note  = t.getAttribute("data-note");
kzPointTooltip.innerHTML = month + " · <span style='font-weight:800'>" + value + "</span>" +
(note ? "<div style='font-weight:500;font-size:11px;color:#b3bfcb;margin-top:3px'>" + note + "</div>" : "");
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
function kzColumn(dotColor, title, subtitle, kpiRowsHTML) {
return "<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:20px 22px;box-shadow:0 1px 2px rgba(16,30,50,0.04);display:flex;flex-direction:column;gap:14px'>" +
"<div style='display:flex;align-items:center;gap:9px'><span style='width:11px;height:11px;border-radius:50%;background:" + dotColor + ";flex:none'></span><span style='font-size:17px;font-weight:700;letter-spacing:-0.01em;color:#1e2a38'>" + title + "</span></div>" +
"<div style='font-size:12px;color:#8a96a3;font-weight:500;margin-top:-10px'>" + subtitle + "</div>" +
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
// Zeitraum des Charts: im Monats-Tab Vormonat + aktueller Monat als Vergleich
function kzChartLen() {
var n = kennzahlenData.months.length;
if (kennzahlenPeriod === "month") return Math.min(2, n);
return kzWindowLen();
}
// Hauptchart der Kennzahlen - gleiche Bildsprache wie die Prognose, nur rueckwaerts gerichtet.
// Wird erst nach dem Rendern gezeichnet, damit die echte Containerbreite bekannt ist.
// Laufende Nummer fuer SVG-Gradient-IDs - jeder Container braucht eine eigene, sonst kollidieren die defs
var paulGradSeq = 0;
// Zeichnet in JEDEN Container mit data-paul-chart="kz" - Kennzahlen-Seite und Uebersicht teilen sich dieselbe Funktion
function kzDrawMainChart() {
var nodes = document.querySelectorAll("[data-paul-chart='kz']");
for (var ni = 0; ni < nodes.length; ni++) kzDrawChartInto(nodes[ni]);
}
function kzDrawChartInto(node) {
if (!node) return;
var w = Math.round(node.getBoundingClientRect().width);
if (!w) return;
var gid = node.__paulGrad || (node.__paulGrad = "kzgrad" + (++paulGradSeq));
var d = kennzahlenData, n = d.months.length, len = kzChartLen();
if (!n || !len) { node.innerHTML = ""; return; }
var pts = [];
for (var i = n - len; i < n; i++) {
pts.push({
key: d.months[i],
full: kzMonthLabel(i, true),
inc: d.einnahmen[i],
exp: d.ausgaben[i],
gew: d.gewinn[i],
isNow: i === n - 1
});
}
var m = pts.length;
var incColor = "#1f9d6b", expColor = "#e0533d", lineColor = "#4f5bd5", avgColor = "#e07b00";
var h = 300, padL = 70, padR = 16, padT = 18, padB = 30;
var innerW = w - padL - padR, innerH = h - padT - padB;
if (innerW < 40) { padL = 44; innerW = w - padL - padR; }
if (innerW < 20) return;
// Gemeinsame Skala fuer Balken und Linie - die Nulllinie gehoert dazu,
// damit ein Verlustmonat sichtbar unter Null faellt
var avgGew = pts.reduce(function(a, p) { return a + p.gew; }, 0) / m;
var maxV = 0, minV = 0;
pts.forEach(function(p) {
maxV = Math.max(maxV, p.inc, p.exp, p.gew);
minV = Math.min(minV, p.gew);
});
maxV = Math.max(maxV, avgGew) * 1.08;
minV = Math.min(minV, avgGew);
var step = pgNiceStep((maxV - minV) / 5);
minV = Math.floor(minV / step) * step;
maxV = Math.ceil(maxV / step) * step;
var range = (maxV - minV) || 1;
var tickCount = Math.round((maxV - minV) / step);
function X(i) { return padL + innerW * (i + 0.5) / m; }
function Y(v) { return padT + (1 - (v - minV) / range) * innerH; }
// Raster + Beschriftung der Y-Achse
var grid = "", axis = "";
for (var t = 0; t <= tickCount; t++) {
var tv = minV + t * step;
var gy = Y(tv);
grid += "<line x1='" + padL + "' y1='" + gy.toFixed(1) + "' x2='" + (w - padR) + "' y2='" + gy.toFixed(1) +
"' stroke='" + (Math.abs(tv) < 0.5 ? "#dbe2ea" : "#f0f3f6") + "' stroke-width='1'></line>";
axis += "<text x='" + (padL - 10) + "' y='" + (gy + 4).toFixed(1) + "' text-anchor='end' font-size='11' font-weight='500' fill='#9aa6b2'>" + pgAxisFmt(tv) + "</text>";
}
// Balken: Einnahmen und Ausgaben je Monat
var band = innerW / m;
var barW = Math.max(6, Math.min(28, band * 0.34));
var barGap = 2;
var y0 = Y(0);
var bars = pts.map(function(p, i) {
var cx = X(i);
function bar(val, color, bx, name) {
var yv = Y(val), bh = Math.max(1, y0 - yv);
return "<rect class='kz-point' data-month=\"" + name + " \u00b7 " + p.full + "\" data-value=\"" + kzFmt(val) + "\"" +
" x='" + bx.toFixed(1) + "' y='" + yv.toFixed(1) + "' width='" + barW.toFixed(1) + "' height='" + bh.toFixed(1) +
"' rx='2.5' fill='" + color + "' style='cursor:pointer'></rect>";
}
return bar(p.inc, incColor, cx - barW - barGap, "Einnahmen") +
bar(p.exp, expColor, cx + barGap, "Ausgaben");
}).join("");
// Gewinnlinie ueber den Balken
var coords = pts.map(function(p, i) { return { x: X(i), y: Y(p.gew) }; });
var pathD = "M" + coords.map(function(c) { return c.x.toFixed(1) + "," + c.y.toFixed(1); }).join(" L");
var areaD = pathD + " L" + coords[m - 1].x.toFixed(1) + "," + y0.toFixed(1) +
" L" + coords[0].x.toFixed(1) + "," + y0.toFixed(1) + " Z";
var circles = pts.map(function(p, i) {
var c = coords[i];
var dot = p.gew < 0
? "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='5.5' fill='#fff' stroke='#c62828' stroke-width='2.5' style='pointer-events:none'></circle>"
: (p.isNow
? "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='4.5' fill='" + lineColor + "' style='pointer-events:none'></circle>"
: "<circle cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='3.5' fill='#fff' stroke='" + lineColor + "' stroke-width='2' style='pointer-events:none'></circle>");
var hit = "<circle class='kz-point' data-month=\"Gewinn \u00b7 " + p.full + "\" data-value=\"" + kzFmt(p.gew) +
"\" cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='12' fill='transparent' style='cursor:pointer'></circle>";
return dot + hit;
}).join("");
var labels = pts.map(function(p, i) {
var txt = p.key + (p.isNow ? " \u00b7 jetzt" : "");
return "<text x='" + X(i).toFixed(1) + "' y='" + (h - 9) + "' text-anchor='middle' font-size='11.5' font-weight='" +
(p.isNow ? "700" : "600") + "' fill='" + (p.isNow ? "#1e2a38" : "#8a96a3") + "' style='pointer-events:none'>" + txt + "</text>";
}).join("");
// Referenzlinie: durchschnittlicher Gewinn im gewaehlten Zeitraum
var ya = Y(avgGew);
var avgLine = "<line x1='" + padL + "' y1='" + ya.toFixed(1) + "' x2='" + (w - padR) + "' y2='" + ya.toFixed(1) +
"' stroke='" + avgColor + "' stroke-width='1.25' stroke-dasharray='5 5' opacity='0.85' style='pointer-events:none'></line>";
var legend =
"<div style='display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px;margin-bottom:6px'>" +
pgLegendItem(incColor, "Einnahmen", "box") +
pgLegendItem(expColor, "Ausgaben", "box") +
pgLegendItem(lineColor, "Gewinn", "line") +
pgLegendItem(avgColor, "\u00d8 Gewinn " + kzFmt(avgGew), "dash") +
"</div>";
node.innerHTML = legend +
"<svg width='" + w + "' height='" + h + "' viewBox='0 0 " + w + " " + h + "' style='display:block;overflow:visible'>" +
"<defs><linearGradient id='" + gid + "' x1='0' y1='0' x2='0' y2='1'>" +
"<stop offset='0%' stop-color='" + lineColor + "' stop-opacity='0.16'></stop>" +
"<stop offset='100%' stop-color='" + lineColor + "' stop-opacity='0'></stop></linearGradient></defs>" +
grid + axis + bars +
"<path d='" + areaD + "' fill='url(#" + gid + ")' style='pointer-events:none'></path>" +
avgLine +
"<path d='" + pathD + "' fill='none' stroke='" + lineColor + "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round' style='pointer-events:none'></path>" +
circles + labels + "</svg>";
}
var kzResizeTimer = null;
window.addEventListener("resize", function() {
clearTimeout(kzResizeTimer);
kzResizeTimer = setTimeout(kzDrawMainChart, 120);
});
// Zeitraum-Tabs - werden auf der Kennzahlen-Seite und in der Uebersicht identisch verwendet
function kzPeriodTabsHTML() {
var n = kennzahlenData.months.length;
var len3 = Math.min(3, n), len6 = Math.min(6, n);
var order = ["month"];
if (len3 > 1) order.push("3m");
if (len6 > len3) order.push("6m");
var labels = { month: "Aktueller Monat", "3m": len3 + " Monate", "6m": len6 + " Monate" };
return order.map(function(t) {
var active = t === kennzahlenPeriod;
return "<button data-kz-period='" + t + "' style='padding:7px 13px;border-radius:7px;border:none;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;background:" + (active ? "#1e2a38" : "transparent") + ";color:" + (active ? "#fff" : "#5b6776") + "'>" + labels[t] + "</button>";
}).join("");
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
var labelSuffix = winLen <= 1 ? " (Monat)" : " (" + winLen + " Monate)";
var einV = kzPeriodValue(d.einnahmen, "sum");
var ztkV = kzPeriodValue(d.zahlungszielKunden, "avg");
var sonstV = kzPeriodValue(d.sonstigeErtraege, "sum");
var einnahmenHTML = kzColumn(
"#1f9d6b", "Einnahmen", kzPeriodLabel(),
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
"#e0533d", "Ausgaben", kzPeriodLabel(),
kzMetricRow("Ausgaben" + labelSuffix, kzFmt(ausV.cur), kzSubTrendHTML(ausV.cur, ausV.prev, "pct", null, true),
"Alle betrieblichen Ausgaben im Zeitraum. Berechnung: Materialeinsatz + Personalkosten + sonstige Ausgaben.") +
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
"#4f5bd5", "Gewinn", kzPeriodLabel(),
kzMetricRow("Gewinn" + labelSuffix, kzFmt(gewV.cur), kzSubTrendHTML(gewV.cur, gewV.prev, "pct"),
"Was nach Abzug aller Kosten vom Umsatz übrig bleibt. Berechnung: Umsatz − Materialeinsatz − Personalkosten − sonstige Ausgaben.") +
kzMetricRow("Gewinnmarge", Math.round(margeCur) + " %", kzSubTrendHTML(margeCur, margePrev, "abs", " Pkt"),
"Anteil des Gewinns am Umsatz – wie viel von jedem Euro übrig bleibt. Berechnung: (Umsatz − alle Kosten) ÷ Umsatz × 100.") +
kzMetricRow("Liquiditätsreichweite", liqCur.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " Mon.", kzSubTrendHTML(liqCur, liqPrev, "abs", ""),
"Wie lange dein Geld bei gleichbleibenden Ausgaben reicht. Berechnung: Verfügbare Liquidität ÷ durchschnittliche Monatsausgaben.")
);
var tabsHTML = kzPeriodTabsHTML();
container.innerHTML =
"<style>.kz-info-wrap{position:relative;display:inline-flex}.kz-info-wrap .kz-tooltip{display:none;position:absolute;top:34px;right:0;width:230px;background:#1e2a38;color:#fff;font-size:12px;font-weight:500;line-height:1.5;padding:12px 14px;border-radius:11px;box-shadow:0 12px 32px rgba(16,30,50,0.24);z-index:30;text-align:left;pointer-events:none}.kz-info-wrap:hover .kz-tooltip{display:block}</style>" +
"<div style='display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif'>" +
"<div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px'>" +
"<h1 style='margin:0;font-size:25px;font-weight:700;letter-spacing:-0.02em;color:#1e2a38'>Kennzahlen <span style='font-size:15px;font-weight:500;color:#9aa6b2'>· " + kzMonthLabel(nMonths - 1, true) + "</span></h1>" +
"<div style='display:flex;gap:4px;background:#eef1f4;padding:4px;border-radius:9px'>" + tabsHTML + "</div>" +
"</div>" +
"<div style='background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:18px 20px 12px;box-shadow:0 1px 2px rgba(16,30,50,0.04);margin-bottom:18px'>" +
"<div id='kzChart' data-paul-chart='kz'></div></div>" +
"<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:start'>" + einnahmenHTML + ausgabenHTML + gewinnHTML + "</div>" +
"</div>";
kzDrawMainChart();
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
baseWindow:     6,  // wie viele vergangene Monate als Durchschnitt herangezogen werden
// Offene Posten (Forderungen/Verbindlichkeiten) in die Prognose einrechnen
oposEinbeziehen: true,
// Zahlungsverhalten: Kunden zahlen im Schnitt ein paar Tage nach Fälligkeit,
// eigene Rechnungen werden zum Fälligkeitstag bezahlt. Geld kommt später, geht pünktlich raus.
verzugTageKunden:      7,
verzugTageLieferanten: 0,
// Forderungen, die länger als X Tage überfällig sind, fließen nicht mehr in die Prognose ein.
// Sie verschwinden nicht – sie werden separat als "nicht eingerechnet" ausgewiesen.
ueberfaelligMaxTage: 30
};
// Szenario-Faktoren auf die durchschnittlichen Einnahmen/Ausgaben.
// pwb = Pauschalwertberichtigung auf den offenen Forderungsbestand (Ausfallrisiko).
// Bekannte Verbindlichkeiten bleiben unverändert – eine Rechnung, die da ist, ist da.
const prognoseScenarios = {
vorsichtig:   { label: "Vorsichtig",   inc: 0.85, exp: 1.08, pwb: 0.05 },
basis:        { label: "Basis",        inc: 1.00, exp: 1.00, pwb: 0.01 },
optimistisch: { label: "Optimistisch", inc: 1.12, exp: 0.97, pwb: 0.01 }
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
if (!n) return { len: 0, inc: 0, exp: 0, ztk: 0, ztl: 0, per: 0, fixCost: 0, varCost: 0 };
var i0 = n - len, i1 = n - 1;
// Fixkosten = Personal + Miete/Leasing/Versicherung/Energie (steckt in sonstigeAusgaben).
// Diese laufen unabhängig von offenen Posten weiter.
// Variable Kosten = Materialeinsatz – nur dieser Block konkurriert mit fälligen Verbindlichkeiten.
var fixCost = kzAvg(d.personalkosten, i0, i1) + kzAvg(d.sonstigeAusgaben, i0, i1);
var varCost = kzAvg(d.materialeinsatz, i0, i1);
return {
len: len,
inc: (kzSum(d.einnahmen, i0, i1) + kzSum(d.sonstigeErtraege, i0, i1)) / len,
exp: kzSum(d.ausgaben, i0, i1) / len,
ztk: kzAvg(d.zahlungszielKunden, i0, i1),
ztl: kzAvg(d.zahlungszielLieferanten, i0, i1),
per: kzAvg(d.personalkosten, i0, i1),
fixCost: fixCost,
varCost: varCost
};
}
// "YYYY-MM" – gleiches Format wie der Anfang von dueDate, damit sich beides direkt vergleichen lässt
function pgMonthKey(year, mi) {
return year + "-" + (mi < 9 ? "0" : "") + (mi + 1);
}
function pgParseDate(iso) {
var d = new Date(String(iso).slice(0, 10) + "T00:00:00Z");
return isNaN(d.getTime()) ? null : d;
}
function pgKeyOfDate(d) {
return pgMonthKey(d.getUTCFullYear(), d.getUTCMonth());
}
// Kostenart eines Postens – entscheidet, wie die Prognose ihn verrechnet
function pgKategorie(p) {
var k = String(p.kategorie || "").toLowerCase();
if (k === "steuer" || k === "steuern" || k === "finanzamt") return "steuer";
if (k === "fix" || k === "fixkosten" || k === "miete" || k === "leasing" || k === "versicherung") return "fix";
return "var";
}
// Offene Posten nach ERWARTETEM Zahlungsmonat bündeln – nicht nach Fälligkeitsdatum.
// Kunden zahlen im Schnitt einige Tage zu spät, wir zahlen pünktlich.
// refDate = Ende des Startmonats, also der Stand, ab dem die Prognose läuft.
function pgOposBuckets(firstKey, refDate) {
var map = {};
var abgeschrieben = { sum: 0, n: 0 };   // > ueberfaelligMaxTage überfällige Forderungen
function slot(key) {
if (!map[key]) map[key] = { rec: 0, recN: 0, payVar: 0, payFix: 0, paySteuer: 0, payN: 0, verspaetet: 0 };
return map[key];
}
(typeof positions !== "undefined" ? positions : []).forEach(function(p) {
var amt = Number(p.amount) || 0;
if (!amt || !p.dueDate) return;
var due = pgParseDate(p.dueDate);
if (!due) return;
var isRec = p.type !== "payable";
var ueberfaelligTage = Math.floor((refDate - due) / 86400000);
// Alte Forderungen gelten als nicht mehr planbar – sie stützen die Liquidität nicht
if (isRec && ueberfaelligTage > prognoseSettings.ueberfaelligMaxTage) {
abgeschrieben.sum += amt; abgeschrieben.n += 1;
return;
}
var delay = isRec ? prognoseSettings.verzugTageKunden : prognoseSettings.verzugTageLieferanten;
var zahltag = new Date(due.getTime());
zahltag.setUTCDate(zahltag.getUTCDate() + delay);
var key = pgKeyOfDate(zahltag);
// Was rechnerisch in der Vergangenheit liegt, wird im ersten Prognosemonat ausgeglichen
if (key < firstKey) key = firstKey;
var b = slot(key);
if (isRec) {
b.rec += amt; b.recN += 1;
if (ueberfaelligTage > 0) b.verspaetet += amt;
} else {
var kat = pgKategorie(p);
if (kat === "steuer") b.paySteuer += amt;
else if (kat === "fix") b.payFix += amt;
else b.payVar += amt;
b.payN += 1;
}
});
map.__abgeschrieben = abgeschrieben;
return map;
}
// Liquiditätsverlauf: Startpunkt = aktueller Kontostand, danach Monat für Monat fortgeschrieben
function pgSeries() {
var d = kennzahlenData, n = d.months.length;
var b = pgBase();
var sc = prognoseScenarios[prognoseScenario] || prognoseScenarios.basis;
var incBase = b.inc * sc.inc;
// Ausgaben aufteilen: Fixkosten (Personal, Miete, Leasing, Versicherung) laufen immer weiter.
// Nur der variable Block (Material) konkurriert mit fälligen Verbindlichkeiten.
var fix = b.fixCost * sc.exp;
var expVar = b.varCost * sc.exp;
var expBase = fix + expVar;
var startKey = n ? d.months[n - 1] : pgMonthOrder[new Date().getMonth()];
var year = (n && d.years) ? d.years[n - 1] : new Date().getFullYear();
var mi = pgMonthOrder.indexOf(startKey);
if (mi < 0) mi = new Date().getMonth();
// Erster Prognosemonat = Startmonat + 1
var fmi = mi + 1, fyear = year;
if (fmi > 11) { fmi = 0; fyear += 1; }
// Stichtag = letzter Tag des Startmonats. Bewusst aus den Daten abgeleitet und nicht
// aus new Date(), damit Chart und Überfälligkeits-Logik dieselbe Zeitachse benutzen.
var refDate = new Date(Date.UTC(fyear, fmi, 0));
var useOpos = prognoseSettings.oposEinbeziehen;
var buckets = useOpos ? pgOposBuckets(pgMonthKey(fyear, fmi), refDate) : { __abgeschrieben: { sum: 0, n: 0 } };
var abg = buckets.__abgeschrieben || { sum: 0, n: 0 };
var cur = accountsTotal;
// Startmonat = echte Werte aus den Kennzahlen, die Folgemonate sind fortgeschrieben
var lastInc = n ? (d.einnahmen[n - 1] + d.sonstigeErtraege[n - 1]) : incBase;
var lastExp = n ? d.ausgaben[n - 1] : expBase;
var pts = [{ key: startKey, year: year, liq: cur, delta: null, inc: lastInc, exp: lastExp, isNow: true,
oposIn: 0, oposOut: 0, oposN: 0, incKnown: false, expKnown: false }];
var totIn = 0, totOut = 0, totN = 0;
var leer = { rec: 0, recN: 0, payVar: 0, payFix: 0, paySteuer: 0, payN: 0, verspaetet: 0 };
for (var i = 0; i < prognoseSettings.horizonMonths; i++) {
mi += 1;
if (mi > 11) { mi = 0; year += 1; }
var bk = buckets[pgMonthKey(year, mi)] || leer;
// Pauschalwertberichtigung auf den erwarteten Zahlungseingang
var oposIn = bk.rec * (1 - (sc.pwb || 0));
// Fixkosten-Rechnungen (Leasing, Versicherung) NICHT addieren – sie stecken schon im Fixblock.
// Steuern dagegen tauchen in den Kennzahlen-Ausgaben gar nicht auf und kommen oben drauf.
var oposOut = bk.payVar + bk.payFix + bk.paySteuer;
// Bekannte Posten sind eine Untergrenze: liegt in einem Monat mehr an als der
// Durchschnitt hergibt, rechnet PAUL mit dem bekannten Betrag statt mit dem Durchschnitt.
var inc = Math.max(incBase, oposIn);
var exp = fix + Math.max(expVar, bk.payVar) + bk.paySteuer;
totIn += oposIn; totOut += oposOut; totN += (bk.recN + bk.payN);
cur += inc - exp;
pts.push({ key: pgMonthOrder[mi], year: year, liq: cur, delta: inc - exp, inc: inc, exp: exp, isNow: false,
oposIn: oposIn, oposOut: oposOut, oposN: bk.recN + bk.payN,
oposSteuer: bk.paySteuer, oposFix: bk.payFix, oposVar: bk.payVar, verspaetet: bk.verspaetet,
incKnown: oposIn > incBase, expKnown: bk.payVar > expVar || bk.paySteuer > 0 });
}
return { points: pts, inc: incBase, exp: expBase, fix: fix, expVar: expVar,
base: b, scenario: sc, oposIn: totIn, oposOut: totOut, oposN: totN, oposActive: useOpos,
abgeschrieben: abg };
}
// Tiefpunkt der Prognose – der Startmonat zählt nicht mit, er ist bereits Realität
function pgLowest(pts) {
var low = pts[1] || pts[0];
for (var i = 2; i < pts.length; i++) { if (pts[i].liq < low.liq) low = pts[i]; }
return low;
}
// Achsenschritt auf einen "runden" Wert bringen (1/2/2,5/5 x 10^n)
function pgNiceStep(raw) {
if (!(raw > 0)) return 1;
var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
var norm = raw / mag;
var step = norm <= 1 ? 1 : (norm <= 2 ? 2 : (norm <= 2.5 ? 2.5 : (norm <= 5 ? 5 : 10)));
return step * mag;
}
function pgAxisFmt(v) {
return Math.round(v).toLocaleString("de-DE") + " €";
}
function pgLegendItem(color, label, kind) {
var swatch = kind === "line"
? "<span style='width:17px;height:0;border-top:2.5px solid " + color + ";display:inline-block'></span>"
: (kind === "dash"
? "<span style='width:17px;height:0;border-top:2px dashed " + color + ";display:inline-block'></span>"
: "<span style='width:11px;height:11px;border-radius:3px;background:" + color + ";display:inline-block'></span>");
return "<span style='display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#5b6776'>" + swatch + label + "</span>";
}
// Chart wird erst nach dem Rendern gezeichnet, damit die echte Containerbreite bekannt ist
// Zeichnet in JEDEN Container mit data-paul-chart="pg" - Prognose-Seite und Uebersicht teilen sich dieselbe Funktion
function pgDrawChart() {
var nodes = document.querySelectorAll("[data-paul-chart='pg']");
for (var ni = 0; ni < nodes.length; ni++) pgDrawChartInto(nodes[ni]);
}
function pgDrawChartInto(node) {
if (!node) return;
var w = Math.round(node.getBoundingClientRect().width);
if (!w) return;
var gid = node.__paulGrad || (node.__paulGrad = "pggrad" + (++paulGradSeq));
var s = pgSeries();
var pts = s.points, n = pts.length;
var reserve = prognoseSettings.mindestreserve;
var lineColor = "#2f80ed", incColor = "#1f9d6b", expColor = "#e0533d";
var h = 300, padL = 70, padR = 16, padT = 18, padB = 30;
var innerW = w - padL - padR, innerH = h - padT - padB;
if (innerW < 40) { padL = 44; innerW = w - padL - padR; }
if (innerW < 20) return;
// Gemeinsame Skala für Balken und Linie – die Nulllinie gehört dazu, sonst schweben die Balken
var maxV = reserve, minV = 0;
pts.forEach(function(p) {
maxV = Math.max(maxV, p.liq, p.inc, p.exp);
minV = Math.min(minV, p.liq);
});
maxV = maxV * 1.08;
var step = pgNiceStep((maxV - minV) / 5);
minV = Math.floor(minV / step) * step;
maxV = Math.ceil(maxV / step) * step;
var range = (maxV - minV) || 1;
var tickCount = Math.round((maxV - minV) / step);
function X(i) { return padL + innerW * (i + 0.5) / n; }
function Y(v) { return padT + (1 - (v - minV) / range) * innerH; }
// Raster + Beschriftung der Y-Achse
var grid = "", axis = "";
for (var t = 0; t <= tickCount; t++) {
var tv = minV + t * step;
var gy = Y(tv);
grid += "<line x1='" + padL + "' y1='" + gy.toFixed(1) + "' x2='" + (w - padR) + "' y2='" + gy.toFixed(1) +
"' stroke='" + (Math.abs(tv) < 0.5 ? "#dbe2ea" : "#f0f3f6") + "' stroke-width='1'></line>";
axis += "<text x='" + (padL - 10) + "' y='" + (gy + 4).toFixed(1) + "' text-anchor='end' font-size='11' font-weight='500' fill='#9aa6b2'>" + pgAxisFmt(tv) + "</text>";
}
// Balken: Einnahmen und Ausgaben je Monat, Prognosemonate etwas heller
var band = innerW / n;
var barW = Math.max(6, Math.min(24, band * 0.39));
var barGap = 2;
var y0 = Y(0);
var bars = pts.map(function(p, i) {
var cx = X(i);
var op = p.isNow ? "1" : "0.55";
var mLabel = pgMonthName(p.key) + (p.year ? " " + p.year : "") + (p.isNow ? "" : " (Prognose)");
function bar(val, color, bx, name, note) {
var yv = Y(val), bh = Math.max(1, y0 - yv);
return "<rect class='kz-point' data-month=\"" + name + " " + mLabel + "\" data-value=\"" + pgFmt(val) + "\"" +
(note ? " data-note=\"" + note + "\"" : "") +
" x='" + bx.toFixed(1) +
"' y='" + yv.toFixed(1) + "' width='" + barW.toFixed(1) + "' height='" + bh.toFixed(1) +
"' rx='2.5' fill='" + color + "' opacity='" + op + "' style='cursor:pointer'></rect>";
}
var incNote = p.incKnown ? "aus fälligen Forderungen (" + pgFmt(p.oposIn) + " nach PWB)"
: (p.oposIn ? "davon " + pgFmt(p.oposIn) + " fällige Forderungen" : (p.isNow ? "" : "Durchschnitt der letzten Monate"));
var expParts = [];
if (p.oposVar > s.expVar) expParts.push("inkl. " + pgFmt(p.oposVar) + " fällige Lieferantenrechnungen");
if (p.oposSteuer) expParts.push("+ " + pgFmt(p.oposSteuer) + " Steuern");
var expNote = expParts.length ? expParts.join(" · ") : (p.isNow ? "" : "Fixkosten + Ø Material");
return bar(p.inc, incColor, cx - barW - barGap, "Einnahmen", incNote) +
bar(p.exp, expColor, cx + barGap, "Ausgaben", expNote);
}).join("");
var low = pgLowest(pts);
var below = low.liq < reserve;
var coords = pts.map(function(p, i) { return { x: X(i), y: Y(p.liq) }; });
var pathD = "M" + coords.map(function(c) { return c.x.toFixed(1) + "," + c.y.toFixed(1); }).join(" L");
var areaD = pathD + " L" + coords[n - 1].x.toFixed(1) + "," + y0.toFixed(1) +
" L" + coords[0].x.toFixed(1) + "," + y0.toFixed(1) + " Z";
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
var label = "Liquidität · " + pgMonthName(p.key) + (p.year ? " " + p.year : "");
var hit = "<circle class='kz-point' data-month=\"" + label + "\" data-value=\"" + pgFmt(p.liq) + "\" cx='" + c.x.toFixed(1) + "' cy='" + c.y.toFixed(1) + "' r='12' fill='transparent' style='cursor:pointer'></circle>";
return dot + hit;
}).join("");
var labels = pts.map(function(p, i) {
var txt = p.key + (p.isNow ? " · jetzt" : "");
var weight = p.isNow ? "700" : "600";
var fill = p.isNow ? "#1e2a38" : "#8a96a3";
return "<text x='" + X(i).toFixed(1) + "' y='" + (h - 9) + "' text-anchor='middle' font-size='11.5' font-weight='" + weight + "' fill='" + fill + "' style='pointer-events:none'>" + txt + "</text>";
}).join("");
// Der Wert steht in der Legende – im Chart würde die Beschriftung mit den Balken kollidieren
var reserveLine =
"<line x1='" + padL + "' y1='" + yr.toFixed(1) + "' x2='" + (w - padR) + "' y2='" + yr.toFixed(1) + "' stroke='#e07b00' stroke-width='1.25' stroke-dasharray='5 5' opacity='0.85' style='pointer-events:none'></line>";
var legend =
"<div style='display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px;margin-bottom:6px'>" +
pgLegendItem(incColor, "Einnahmen", "box") +
pgLegendItem(expColor, "Ausgaben", "box") +
pgLegendItem(lineColor, "Liquidität", "line") +
pgLegendItem("#e07b00", "Mindestreserve " + pgFmt(reserve), "dash") +
"<span style='font-size:11.5px;color:#9aa6b2'>helle Balken = Prognose</span></div>";
node.innerHTML = legend +
"<svg width='" + w + "' height='" + h + "' viewBox='0 0 " + w + " " + h + "' style='display:block;overflow:visible'>" +
"<defs><linearGradient id='" + gid + "' x1='0' y1='0' x2='0' y2='1'>" +
"<stop offset='0%' stop-color='" + lineColor + "' stop-opacity='0.16'></stop>" +
"<stop offset='100%' stop-color='" + lineColor + "' stop-opacity='0'></stop></linearGradient></defs>" +
grid + axis + bars +
"<path d='" + areaD + "' fill='url(#" + gid + ")' style='pointer-events:none'></path>" +
reserveLine +
"<path d='" + pathD + "' fill='none' stroke='" + lineColor + "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round' style='pointer-events:none'></path>" +
circles + labels + "</svg>";
}
function pgRow(label, value, valueColor, bold) {
return "<div style='display:flex;justify-content:space-between;align-items:center;gap:14px;padding:11px 0;border-top:1px solid #f0f3f6'>" +
"<span style='font-size:13px;color:#5b6776;font-weight:500'>" + label + "</span>" +
"<span style='font-size:13px;font-weight:" + (bold ? "700" : "600") + ";font-variant-numeric:tabular-nums;color:" + (valueColor || "#1e2a38") + ";white-space:nowrap'>" + value + "</span></div>";
}
// Szenario-Tabs - werden auf der Prognose-Seite und in der Uebersicht identisch verwendet
function pgScenarioTabsHTML() {
return prognoseOrder.map(function(k) {
var active = k === prognoseScenario;
return "<button data-pg-scenario='" + k + "' style='padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;background:" +
(active ? "#1e2a38" : "transparent") + ";color:" + (active ? "#fff" : "#5b6776") + "'>" + prognoseScenarios[k].label + "</button>";
}).join("");
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
var tabsHTML = pgScenarioTabsHTML();
var rowsHTML = pts.map(function(p) {
var under = p.liq < reserve;
var liqColor = under ? "#c62828" : "#1e2a38";
var deltaHTML = p.delta === null
? "<span style='color:#9aa6b2'>—</span>"
: "<span style='color:" + (p.delta >= 0 ? "#1f9d6b" : "#c62828") + "'>" + pgSigned(p.delta) + "</span>";
var noteParts = [];
if (p.oposIn)     noteParts.push("<span style='color:#1f9d6b'>" + pgFmt(p.oposIn) + " Forderungen erwartet</span>");
if (p.oposVar)    noteParts.push("<span style='color:#c62828'>" + pgFmt(p.oposVar) + " Lieferanten</span>");
if (p.oposSteuer) noteParts.push("<span style='color:#c62828'>" + pgFmt(p.oposSteuer) + " Steuern</span>");
var oposNote = noteParts.length
? "<div style='font-size:11.5px;font-weight:500;color:#8a96a3;margin-top:3px'>" + noteParts.join(" · ") + "</div>"
: "";
return "<div style='display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;padding:12px 18px;border-top:1px solid #f0f3f6;background:" + (under ? "#fdf6f5" : "transparent") + "'>" +
"<span style='font-size:13.5px;font-weight:" + (p.isNow ? "700" : "500") + ";color:#1e2a38'>" + pgMonthName(p.key) + (p.isNow ? " <span style=\"font-weight:500;color:#9aa6b2\">· jetzt</span>" : "") + oposNote + "</span>" +
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
pgRow("Fixkosten / Monat", pgFmt(s.fix)) +
pgRow("Variable Kosten Ø / Monat", pgFmt(s.expVar)) +
pgRow("Ergebnis Ø / Monat", pgSigned(s.inc - s.exp), (s.inc - s.exp) >= 0 ? "#1f9d6b" : "#c62828", true) +
(s.oposActive
? pgRow("Erwartete Forderungen im Zeitraum", pgFmt(s.oposIn), s.oposIn ? "#1f9d6b" : "#9aa6b2") +
pgRow("Fällige Verbindlichkeiten im Zeitraum", pgFmt(s.oposOut), s.oposOut ? "#c62828" : "#9aa6b2") +
pgRow("Pauschalwertberichtigung", (Math.round((s.scenario.pwb || 0) * 1000) / 10).toLocaleString("de-DE") + " %", "#8a96a3") +
(s.abgeschrieben.sum
? pgRow("Nicht eingerechnet (> " + prognoseSettings.ueberfaelligMaxTage + " Tage überfällig)",
pgFmt(s.abgeschrieben.sum), "#e07b00")
: "")
: "") +
pgRow("Ø Zahlungsziel Kunden", Math.round(s.base.ztk) + " Tage") +
pgRow("Zahlungsverzug Kunden", "+" + prognoseSettings.verzugTageKunden + " Tage") +
pgRow("Mindestreserve", pgFmt(reserve), "#e07b00", true) +
"</div>";
var infoText =
"<b>So rechnet PAUL</b><br>" +
"Startpunkt ist deine aktuelle Liquidität über alle Konten (" + pgFmt(accountsTotal) + "). " +
"Grundlage sind die Durchschnitte der letzten " + s.base.len + " Monate, getrennt nach Fixkosten (" + pgFmt(s.fix) +
" – Personal, Miete, Leasing, Versicherung) und variablen Kosten (" + pgFmt(s.expVar) + " – Material)." +
"<br><br><b>Offene Posten</b><br>" +
"Zusätzlich schaut PAUL in deine offenen Posten. Ist in einem Monat mehr an Forderungen oder Lieferantenrechnungen fällig, als der Durchschnitt hergibt, rechnet PAUL mit dem bekannten Betrag. " +
"Fixkosten-Rechnungen wie Leasing oder Versicherung werden nicht doppelt gezählt, Steuerzahlungen kommen oben drauf, weil sie in den Ausgaben-Kennzahlen nicht enthalten sind." +
"<br><br><b>Zahlungsverhalten</b><br>" +
"Forderungen werden " + prognoseSettings.verzugTageKunden + " Tage nach Fälligkeit erwartet, eigene Rechnungen zum Fälligkeitstag gezahlt. " +
"Auf den Forderungsbestand liegt eine Pauschalwertberichtigung von " + (Math.round((sc.pwb || 0) * 1000) / 10).toLocaleString("de-DE") + " %. " +
"Forderungen, die länger als " + prognoseSettings.ueberfaelligMaxTage + " Tage überfällig sind, fließen nicht in die Prognose ein – sie werden unter den Annahmen separat ausgewiesen." +
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
"<div id='prognoseChart' data-paul-chart='pg' style='width:100%;min-height:300px'></div>" +
"</div>" +
"<div style='display:grid;grid-template-columns:1.55fr 1fr;gap:16px;align-items:start'>" + tableHTML + annahmenHTML + "</div>" +
"</div>";
pgDrawChart();
}
var pgResizeTimer = null;
window.addEventListener("resize", function() {
clearTimeout(pgResizeTimer);
pgResizeTimer = setTimeout(pgDrawChart, 120);
});

// ===== UEBERSICHT - Kennzahlen- und Prognose-Chart spiegeln =====
// Beide Charts kommen aus denselben Funktionen wie auf den Unterseiten (kzDrawMainChart / pgDrawChart).
// Aendert sich dort etwas, aendert es sich hier automatisch mit - es gibt keine zweite Chart-Logik.
function renderUebersichtCharts() {
var card = document.getElementById("uebersichtCharts");
if (!card) return;
var szenario = prognoseScenarios[prognoseScenario] ? prognoseScenarios[prognoseScenario].label : "";
card.innerHTML =
"<div style='font-family:Inter,system-ui,sans-serif;color:#1e2a38'>" +
"<div style='display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px'>" +
"<div><div style='font-size:15.5px;font-weight:700;letter-spacing:-0.01em'>Einnahmen, Ausgaben und Gewinn</div>" +
"<div style='font-size:12px;color:#8a96a3;margin-top:3px'>" + kzPeriodLabel() + "</div></div>" +
"<div style='display:flex;gap:4px;background:#eef1f4;padding:4px;border-radius:9px'>" + kzPeriodTabsHTML() + "</div>" +
"</div>" +
"<div data-paul-chart='kz'></div>" +
"<div style='height:1px;background:#f0f3f6;margin:24px 0 18px'></div>" +
"<div style='display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px'>" +
"<div><div style='font-size:15.5px;font-weight:700;letter-spacing:-0.01em'>Liquiditätsprognose</div>" +
"<div style='font-size:12px;color:#8a96a3;margin-top:3px'>nächste " + prognoseSettings.horizonMonths + " Monate · Szenario " + szenario + "</div></div>" +
"<div style='display:flex;gap:4px;background:#eef1f4;padding:4px;border-radius:9px'>" + pgScenarioTabsHTML() + "</div>" +
"</div>" +
"<div data-paul-chart='pg' style='width:100%;min-height:300px'></div>" +
"</div>";
kzDrawMainChart();
pgDrawChart();
}
// Zeitraum und Szenario sind global: ein Klick auf einen Tab wirkt auf allen Seiten gleichzeitig.
// Deshalb laeuft die Tab-Steuerung ueber einen einzigen delegierten Listener statt pro Container.
function paulSyncViews() {
renderKennzahlen();
renderPrognose();
renderUebersichtCharts();
}
document.addEventListener("click", function(e) {
if (!e.target || !e.target.closest) return;
var kzBtn = e.target.closest("[data-kz-period]");
if (kzBtn) {
kennzahlenPeriod = kzBtn.getAttribute("data-kz-period");
paulSyncViews();
return;
}
var pgBtn = e.target.closest("[data-pg-scenario]");
if (pgBtn) {
prognoseScenario = pgBtn.getAttribute("data-pg-scenario");
paulSyncViews();
}
});

// ===== EINSTELLUNGEN - Unternehmensdaten & Mindestreserve =====
// PLACEHOLDER: Firmenstammdaten kommen später aus dem Nutzerkonto bzw. der API.
// Solange es kein Backend gibt, werden Änderungen im localStorage des Browsers gehalten.
var unternehmenData = {
firma:       "Vogt Elektrotechnik GmbH",
gewerk:      "Elektroinstallation",
mitarbeiter: 5,
standort:    "88131 Lindau"
};
var ES_KEY = "paul.einstellungen.v1";
var esFields = [
{ key: "firma",       label: "Firma",       type: "text",   placeholder: "Firmenname",              required: true  },
{ key: "gewerk",      label: "Gewerk",      type: "text",   placeholder: "z. B. Elektroinstallation", required: false },
{ key: "mitarbeiter", label: "Mitarbeiter", type: "number", placeholder: "0",                       required: false },
{ key: "standort",    label: "Standort",    type: "text",   placeholder: "PLZ und Ort",             required: false }
];
function esEsc(v) {
return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function esWrite() {
// Kein Backend: fehlschlagender Speicherzugriff (Privat-Modus, blockierte Cookies) darf die App nicht stoppen.
try {
localStorage.setItem(ES_KEY, JSON.stringify({
unternehmen:    unternehmenData,
mindestreserve: prognoseSettings.mindestreserve
}));
} catch (e) {}
}
function esLoad() {
var saved = null;
try { var raw = localStorage.getItem(ES_KEY); if (raw) saved = JSON.parse(raw); } catch (e) { saved = null; }
if (saved && saved.unternehmen) {
esFields.forEach(function(f) {
var v = saved.unternehmen[f.key];
if (v !== undefined && v !== null) unternehmenData[f.key] = v;
});
}
if (saved && typeof saved.mindestreserve === "number" && isFinite(saved.mindestreserve) && saved.mindestreserve >= 0) {
prognoseSettings.mindestreserve = saved.mindestreserve;
}
esSyncSidebar();
}
// Firmenname und Reserve stehen auch in der Sidebar - beides muss sofort mitziehen.
function esSyncSidebar() {
var comp = document.querySelectorAll(".paul-company");
for (var i = 0; i < comp.length; i++) comp[i].textContent = unternehmenData.firma;
var res = document.querySelectorAll(".paul-reserve-value");
for (var j = 0; j < res.length; j++) res[j].textContent = pgFmt(prognoseSettings.mindestreserve);
}
// Obergrenze des Sliders: rund drei Monatsausgaben, auf 5.000 € gerundet, mindestens 30.000 €.
function esReserveMax() {
var exp = pgBase().exp || 0;
return Math.max(30000, Math.ceil((exp * 3) / 5000) * 5000);
}
function esReserveHint(v) {
var exp = pgBase().exp || 0;
if (!exp) return "Puffer, den PAUL nie unterschreiten soll.";
var months = v / exp;
return "entspricht rund " + months.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) +
" Monatsausgaben (Ø " + pgFmt(exp) + " pro Monat)";
}
function esPaintRange(el) {
var min = Number(el.min), max = Number(el.max), v = Number(el.value);
var pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
el.style.background = "linear-gradient(90deg,#e07b00 0%,#e07b00 " + pct + "%,#eef1f4 " + pct + "%,#eef1f4 100%)";
}
var esSavedTimer = null, esSyncTimer = null;
function renderEinstellungen() {
var container = document.getElementById("einstellungenContainer");
if (!container) return;
var reserve = prognoseSettings.mindestreserve;
var rMax = esReserveMax();
if (reserve > rMax) rMax = Math.ceil(reserve / 5000) * 5000;

var formHTML = esFields.map(function(f) {
var extra = f.type === "number" ? " min='0' step='1'" : "";
return "<label style='display:block;margin-bottom:12px'>" +
"<span style='display:block;font-size:12px;font-weight:600;color:#8a96a3;margin-bottom:5px'>" + f.label + "</span>" +
"<input class='es-input' id='es-" + f.key + "' type='" + f.type + "' value=\"" + esEsc(unternehmenData[f.key]) +
"\" placeholder=\"" + esEsc(f.placeholder) + "\"" + extra + ">" +
"</label>";
}).join("");

container.innerHTML =
"<style>" +
".es-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}" +
"@media (max-width:900px){.es-grid{grid-template-columns:1fr}}" +
".es-card{background:#fff;border:1px solid #e7ebef;border-radius:14px;padding:20px 22px;box-shadow:0 1px 2px rgba(16,30,50,0.04)}" +
".es-input{width:100%;box-sizing:border-box;padding:9px 12px;border-radius:9px;border:1px solid #d6dde4;background:#f8fafb;" +
"font-size:13.5px;font-family:inherit;color:#1e2a38;outline:none;transition:border-color .15s,background .15s}" +
".es-input:focus{border-color:#1f9d6b;background:#fff}" +
".es-btn{padding:9px 18px;border-radius:9px;border:none;background:#1f9d6b;color:#fff;font-size:13px;font-weight:600;" +
"font-family:inherit;cursor:pointer;transition:background .15s}" +
".es-btn:hover{background:#1a865b}" +
".es-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;background:#eef1f4;outline:none;margin:0;cursor:pointer}" +
".es-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;" +
"border:2px solid #e07b00;box-shadow:0 1px 3px rgba(16,30,50,0.25);cursor:pointer}" +
".es-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #e07b00;" +
"box-shadow:0 1px 3px rgba(16,30,50,0.25);cursor:pointer;border-color:#e07b00}" +
".es-range:focus-visible{box-shadow:0 0 0 3px rgba(224,123,0,0.18)}" +
"</style>" +
"<div style='font-family:Inter,system-ui,sans-serif;color:#1e2a38'>" +
"<h1 style='margin:0;font-size:25px;font-weight:700;letter-spacing:-0.02em;color:#1e2a38'>Einstellungen</h1>" +
"<div style='font-size:13px;color:#8a96a3;margin:4px 0 18px'>Stammdaten und Liquiditäts-Reserve</div>" +
"<div class='es-grid'>" +

// --- Karte 1: Unternehmen ---
"<div class='es-card'>" +
"<div style='font-size:14px;font-weight:700;margin-bottom:4px'>Unternehmen</div>" +
"<div style='font-size:12.5px;color:#8a96a3;margin-bottom:16px;line-height:1.5'>Diese Angaben erscheinen in der Seitenleiste und in Auswertungen.</div>" +
formHTML +
"<div style='display:flex;align-items:center;gap:12px;margin-top:16px'>" +
"<button type='button' class='es-btn' id='es-save'>Speichern</button>" +
"<span id='es-saved' style='font-size:12.5px;font-weight:600;color:#1f9d6b;opacity:0;transition:opacity .2s'>Gespeichert ✓</span>" +
"</div>" +
"</div>" +

// --- Karte 2: Liquiditäts-Reserve ---
"<div class='es-card'>" +
"<div style='font-size:14px;font-weight:700;margin-bottom:4px'>Liquiditäts-Reserve</div>" +
"<div style='font-size:12.5px;color:#8a96a3;margin-bottom:16px;line-height:1.5'>PAUL warnt dich, sobald die Prognose unter diesen Betrag fällt.</div>" +
"<div id='es-reserve-value' style='font-size:30px;font-weight:800;letter-spacing:-0.02em;font-variant-numeric:tabular-nums'>" + pgFmt(reserve) + "</div>" +
"<div id='es-reserve-hint' style='font-size:12.5px;color:#8a96a3;margin-top:5px;line-height:1.5'>" + esReserveHint(reserve) + "</div>" +
"<input class='es-range' id='es-reserve-range' type='range' min='0' max='" + rMax + "' step='500' value='" + reserve + "' style='margin-top:18px'>" +
"<div style='display:flex;justify-content:space-between;font-size:11.5px;color:#9aa6b2;margin-top:7px'>" +
"<span>0 €</span><span id='es-reserve-max'>" + pgFmt(rMax) + "</span></div>" +
"<div style='display:flex;align-items:center;gap:10px;margin-top:18px;padding-top:16px;border-top:1px solid #f0f3f6'>" +
"<span style='font-size:12px;font-weight:600;color:#8a96a3'>Genauer Wert</span>" +
"<input class='es-input' id='es-reserve-input' type='number' min='0' step='100' value='" + reserve + "' style='width:130px'>" +
"<span style='font-size:13px;color:#8a96a3'>€</span>" +
"</div>" +
"</div>" +

"</div></div>";

// ----- Unternehmensdaten speichern -----
function esSaveCompany() {
esFields.forEach(function(f) {
var el = document.getElementById("es-" + f.key);
if (!el) return;
var v = String(el.value).trim();
if (f.type === "number") {
var n = parseInt(v, 10);
unternehmenData[f.key] = (isNaN(n) || n < 0) ? 0 : n;
el.value = String(unternehmenData[f.key]);
} else if (f.required && v === "") {
el.value = unternehmenData[f.key];   // Pflichtfeld nicht leeren - alten Wert zurückschreiben
} else {
unternehmenData[f.key] = v;
}
});
esWrite();
esSyncSidebar();
var note = document.getElementById("es-saved");
if (note) {
note.style.opacity = "1";
clearTimeout(esSavedTimer);
esSavedTimer = setTimeout(function() { note.style.opacity = "0"; }, 2200);
}
}
var saveBtn = document.getElementById("es-save");
if (saveBtn) saveBtn.addEventListener("click", esSaveCompany);
esFields.forEach(function(f) {
var el = document.getElementById("es-" + f.key);
if (el) el.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); esSaveCompany(); } });
});

// ----- Mindestreserve -----
var range  = document.getElementById("es-reserve-range");
var num    = document.getElementById("es-reserve-input");
var valEl  = document.getElementById("es-reserve-value");
var hintEl = document.getElementById("es-reserve-hint");
var maxEl  = document.getElementById("es-reserve-max");
// source = welches Feld die Änderung ausgelöst hat. Dieses Feld wird NICHT zurückgeschrieben,
// sonst springt der Cursor beim Tippen bzw. der Slider beim Ziehen.
function esSetReserve(v, source) {
if (!isFinite(v) || v < 0) v = 0;
prognoseSettings.mindestreserve = v;
if (valEl)  valEl.textContent = pgFmt(v);
if (hintEl) hintEl.textContent = esReserveHint(v);
if (range && source !== "range") {
if (v > Number(range.max)) {
range.max = String(Math.ceil(v / 5000) * 5000);
if (maxEl) maxEl.textContent = pgFmt(Number(range.max));
}
range.value = String(v);
}
if (num && source !== "num") num.value = String(v);
if (range) esPaintRange(range);
esSyncSidebar();
// Prognose und Übersicht sind teuer zu zeichnen - beim Ziehen gebündelt nachziehen.
clearTimeout(esSyncTimer);
esSyncTimer = setTimeout(function() {
renderPrognose();
renderUebersichtCharts();
esWrite();
}, 140);
}
if (range) {
esPaintRange(range);
range.addEventListener("input", function() { esSetReserve(Number(range.value), "range"); });
}
if (num) {
num.addEventListener("input", function() {
var v = parseFloat(num.value);
if (isNaN(v)) return;                       // leeres Feld beim Tippen nicht als 0 werten
esSetReserve(v, "num");
});
num.addEventListener("change", function() {
var v = parseFloat(num.value);
if (isNaN(v) || v < 0) v = 0;
esSetReserve(Math.round(v / 100) * 100, "normalize");
});
}
}

// ===== INIT CALLS + CSV UPLOAD =====
esLoad();                 // gespeicherte Stammdaten/Reserve VOR dem ersten Rendern anwenden
renderKennzahlen();
renderPrognose();
renderEinstellungen();
renderUebersichtCharts();
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
renderPrognose();
renderUebersichtCharts();
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


