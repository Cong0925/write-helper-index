// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Animate stats number
function animateNum(el, target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 30);
}

// Load stats from production Gist
async function loadStats() {
  const statUsers = document.getElementById('stat-users');
  try {
    const gistId = 'f98ad72139e65fc755646e1f9f635fad';
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    let total = 0;
    for (const [name, file] of Object.entries(data.files || {})) {
      if (name.startsWith('devices_') && name.endsWith('.json')) {
        try {
          const records = JSON.parse(file.content);
          if (Array.isArray(records)) total += records.length;
        } catch {}
      }
    }
    if (total > 0) {
      animateNum(statUsers, total);
    } else {
      statUsers.textContent = '0';
    }
  } catch (e) {
    statUsers.textContent = '--';
  }
}

// Trigger stats animation when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      loadStats();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

statsObserver.observe(document.querySelector('.stats-section'));
