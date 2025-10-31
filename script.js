window.onload = () => {
  document.getElementById("filter-select").addEventListener("change", loadHistorique);
  document.getElementById("tag-select").addEventListener("change", confrontTag);
  document.getElementById("close-modal").addEventListener("click", closeModal);
  loadHistorique();
  updateStats();
};

function generatePrompt() {
  const prompts = [
    "Qu’est-ce que tu refuses d’écrire ?",
    "Tu veux fuir quoi aujourd’hui ?",
    "Écris ce que tu ne dirais jamais à voix haute.",
    "Tu veux te voir en face ? Alors vas-y.",
    "Quel masque tu portes en ce moment ?"
  ];
  const random = prompts[Math.floor(Math.random() * prompts.length)];
  document.getElementById("prompt").textContent = random;
}

function confrontTag() {
  const tag = document.getElementById("tag-select").value;
  const message = document.getElementById("tag-message");
  const phrases = {
    "EGO//Colère": "Tu assumes ta rage ? Alors écris sans filtre.",
    "EGO//Vide": "Tu veux écrire dans le vide ? Tu vas y tomber.",
    "EGO//Honte": "Tu assumes ce tag ? Alors relis ce que tu caches.",
    "EGO//Fuite": "Tu veux fuir encore ? Ce texte ne te sauvera pas.",
    "EGO//Masque": "Tu vas encore sourire en écrivant ?",
    "EGO//Rupture": "Tu veux couper ? Alors tranche net."
  };
  message.textContent = phrases[tag] || "";
}

function detectTag(text) {
  const lower = text.toLowerCase();
  if (lower.includes("rage") || lower.includes("exploser") || lower.includes("grrr")) return "EGO//Colère";
  if (lower.includes("vide") || lower.includes("fatigue") || lower.includes("rien")) return "EGO//Vide";
  if (lower.includes("honte") || lower.includes("regard") || lower.includes("masque")) return "EGO//Honte";
  if (lower.includes("fuir") || lower.includes("éviter") || lower.includes("peur")) return "EGO//Fuite";
  return "EGO//Masque";
}

function saveEntry() {
  const text = document.getElementById("journal").value;
  let tag = document.getElementById("tag-select").value;
  if (!tag) tag = detectTag(text);

  if (text.trim()) {
    const timestamp = new Date();
    const key = timestamp.toISOString();
    const formattedDate = timestamp.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const entry = { text, tag, date: formattedDate };
    localStorage.setItem(key, JSON.stringify(entry));

    document.getElementById("journal").value = "";
    document.getElementById("tag-select").value = "";
    document.getElementById("tag-message").textContent = "";
    loadHistorique();
    updateStats();
  } else {
    alert("Écris quelque chose.");
  }
}

function loadHistorique() {
  const list = document.getElementById("historique-list");
  const filter = document.getElementById("filter-select").value;
  list.innerHTML = "";

  const entries = [];

  Object.keys(localStorage).forEach(key => {
    try {
      const entry = JSON.parse(localStorage.getItem(key));
      if (!entry || !entry.text || !entry.tag || !entry.date) return;
      entries.push({ key, ...entry });
    } catch (e) {
      console.warn("Entrée corrompue ignorée :", key);
    }
  });

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  entries.forEach(entry => {
    if (filter && entry.tag !== filter) return;

    const li = document.createElement("li");
    li.classList.add("entry");

    const preview = document.createElement("p");
    preview.textContent = entry.text.slice(0, 100) + "...";

    const tag = document.createElement("strong");
    tag.textContent = entry.tag;

    const date = document.createElement("small");
    date.textContent = entry.date;

    const relireBtn = document.createElement("button");
    relireBtn.textContent = "Relire";
    relireBtn.onclick = () => openModal(entry.text, entry.tag, entry.date);

    const supprimerBtn = document.createElement("button");
    supprimerBtn.textContent = "Supprimer";
    supprimerBtn.onclick = () => {
      localStorage.removeItem(entry.key);
      loadHistorique();
      updateStats();
    };

    li.appendChild(preview);
    li.appendChild(tag);
    li.appendChild(date);
    li.appendChild(relireBtn);
    li.appendChild(supprimerBtn);
    list.appendChild(li);
  });
}

function openModal(text, tag, date) {
  document.getElementById("modal-text").textContent = text;
  document.getElementById("modal-tag").textContent = tag;
  document.getElementById("modal-date").textContent = date;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function updateStats() {
  const stats = document.getElementById("stats");
  const counts = {};
  let lastTag = "";

  Object.keys(localStorage).forEach(key => {
    try {
      const entry = JSON.parse(localStorage.getItem(key));
      if (!entry || !entry.tag) return;
      counts[entry.tag] = (counts[entry.tag] || 0) + 1;
      lastTag = entry.tag;
    } catch {}
  });

  let html = "<h3>Statistiques émotionnelles</h3><ul>";
  Object.keys(counts).forEach(tag => {
    html += `<li>${tag} : ${counts[tag]} textes</li>`;
  });
  html += `</ul><p>Dernière émotion dominante : <strong>${lastTag}</strong></p>`;
  stats.innerHTML = html;
}


  Object.keys(localStorage).forEach(key => {
    try {
      const entry = JSON.parse(localStorage.getItem(key));
      if (!entry || !entry.tag) return;
      counts[entry.tag] = (counts[entry.tag] || 0) + 1;
      lastTag = entry.tag;
    } catch {}
  });

  let html = "<h3>Statistiques émotionnelles</h3><ul>";
  Object.keys(counts).forEach(tag => {
    html += `<li>${tag }: ${counts[tag]} textes</li>`;
  });
  html += `</ul><p>Dernière émotion dominante : <strong>${lastTag}</strong></p>`;
  stats.innerHTML = html;
