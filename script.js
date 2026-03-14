let game = { a:0, b:0, g:0, d:0, e:0, z:0, eta:0, theta:0, iota:0, kappa:0, lambda:0, mu:0, nu:0, xi:0, omicron:0, pi:0, rho:0, sigma:0, tau:0, upsilon:0, phi:0, chi:0, psi:0, omega:0 };
let pLevel = 0, costMult = 1.0, auto = false;

const tiers = [
    { id:'beta', from:'a', to:'b', cost:1000, label:'1k α ➔ β' },
    { id:'gamma', from:'b', to:'g', cost:2500, label:'2.5k β ➔ γ' },
    { id:'delta', from:'g', to:'d', cost:3000, label:'3k γ ➔ δ' },
    { id:'epsilon', from:'d', to:'e', cost:5000, label:'5k δ ➔ ε' },
    { id:'zeta', from:'e', to:'z', cost:7500, label:'7.5k ε ➔ ζ' },
    { id:'eta', from:'z', to:'eta', cost:10000, label:'10k ζ ➔ η' },
    { id:'theta', from:'eta', to:'theta', cost:25000, label:'25k η ➔ θ' },
    { id:'iota', from:'theta', to:'iota', cost:50000, label:'50k θ ➔ ι' },
    { id:'kappa', from:'iota', to:'kappa', cost:100000, label:'100k ι ➔ κ' },
    { id:'lambda', from:'kappa', to:'lambda', cost:250000, label:'250k κ ➔ λ' },
    { id:'mu', from:'lambda', to:'mu', cost:500000, label:'500k λ ➔ μ' },
    { id:'nu', from:'mu', to:'nu', cost:1000000, label:'1M μ ➔ ν' },
    { id:'xi', from:'nu', to:'xi', cost:2500000, label:'2.5M ν ➔ ξ' },
    { id:'omicron', from:'xi', to:'omicron', cost:5000000, label:'5M ξ ➔ ο' },
    { id:'pi', from:'omicron', to:'pi', cost:10000000, label:'10M ο ➔ π' },
    { id:'rho', from:'pi', to:'rho', cost:25000000, label:'25M π ➔ ρ' },
    { id:'sigma', from:'rho', to:'sigma', cost:50000000, label:'50M ρ ➔ σ' },
    { id:'tau', from:'sigma', to:'tau', cost:100000000, label:'100M σ ➔ τ' },
    { id:'upsilon', from:'tau', to:'upsilon', cost:250000000, label:'250M τ ➔ υ' },
    { id:'phi', from:'upsilon', to:'phi', cost:500000000, label:'500M υ ➔ φ' },
    { id:'chi', from:'phi', to:'chi', cost:1000000000, label:'1B φ ➔ χ' },
    { id:'psi', from:'chi', to:'psi', cost:2500000000, label:'2.5B χ ➔ ψ' },
    { id:'omega', from:'psi', to:'omega', cost:5000000000, label:'5B ψ ➔ ω' }
];

const container = document.getElementById('btn-container');
tiers.forEach(t => {
    let b = document.createElement('button');
    b.id = 'btn-' + t.id;
    b.textContent = t.label;
    b.onclick = (e) => { e.stopPropagation(); buy(t); };
    container.appendChild(b);
});

function buy(t) {
    let price = t.cost * costMult;
    if (game[t.from] >= price) {
        game[t.from] -= price;
        game[t.to]++;
        updateUI();
    }
}

document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
        game.a += 1 * (pLevel + 1);
        updateUI();
    }
});

function format(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "b";
    if (num >= 1e6) return num.toExponential(2).replace("+", "");
    return num.toLocaleString();
}

function updateUI() {
    const names = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];
    const keys = ['a', 'b', 'g', 'd', 'e', 'z', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];

    keys.forEach((k, i) => {
        let valEl = document.getElementById('val-' + names[i]);
        let rowEl = document.getElementById('row-' + names[i]);
        if (valEl) {
            valEl.textContent = format(game[k]);
            rowEl.style.display = (game[k] > 0 || k === 'a') ? 'block' : 'none';
        }
    });

    tiers.forEach(t => {
        let btn = document.getElementById('btn-' + t.id);
        if (btn) btn.className = (game[t.from] >= t.cost * costMult) ? 'ready' : '';
    });

    document.getElementById('p-level').textContent = pLevel;
    document.getElementById('p-mult').textContent = (costMult * 100).toFixed(1);
    document.getElementById('prestige-btn').className = 'prestige-btn ' + (game.iota >= 1 ? 'active' : '');
    if (game.kappa >= 1) { auto = true; document.getElementById('auto-status').style.display = 'block'; }
}

document.getElementById('prestige-btn').onclick = (e) => {
    e.stopPropagation();
    if (game.iota >= 1) {
        pLevel += game.iota;
        costMult = Math.pow(0.9, pLevel);
        let s = { mu:game.mu, nu:game.nu, xi:game.xi, omicron:game.omicron, pi:game.pi, rho:game.rho, sigma:game.sigma, tau:game.tau, upsilon:game.upsilon, phi:game.phi, chi:game.chi, psi:game.psi, omega:game.omega };
        game = { a:0, b:0, g:0, d:0, e:0, z:0, eta:0, theta:0, iota:0, kappa:0, lambda:0, ...s };
        updateUI();
    }
};

// GAME LOOP: Alle 100ms
setInterval(() => {
    // PASSIVE PRODUKTION (Exponentiell)
    // Jeder Layer produziert den darunterliegenden (Rate skaliert mit Prestige)
    if (game.b > 0) game.a += (game.b * 0.1) * (pLevel + 1);
    if (game.g > 0) game.b += (game.g * 0.05);
    if (game.d > 0) game.g += (game.d * 0.02);
    if (game.e > 0) game.d += (game.e * 0.01);
    if (game.z > 0) game.e += (game.z * 0.005);
    // ... und so weiter für höhere Layer (optional erweiterbar)

    if (auto) tiers.slice(0, 8).forEach(t => buy(t)); 
    updateUI();
}, 100);

updateUI();
