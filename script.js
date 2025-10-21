// ========================================
// ========================================
// Exit Modal (top-level)
// ========================================
function showExitModal() {
  cliContent.style.filter = 'blur(3px)';
  let modal = document.createElement('div');
  modal.id = 'exit-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgb(16 185 129 / 10%)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '50';
  modal.innerHTML = `
    <div class="cli-exit-modal">
      <div class="font-mono text-xl mb-6">Are you sure?</div>
      <div style="display:flex; gap:2em; justify-content:center;">
        <button id="exitYesBtn" class="cli-btn" style="width:90px;">Yes</button>
        <button id="exitNoBtn" class="cli-btn" style="width:90px;">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('exitYesBtn').onclick = () => {
    cliContent.style.filter = '';
    document.body.removeChild(modal);
    cliUI.classList.add('hidden');
    bootSequence.classList.remove('!hidden');
  };
  document.getElementById('exitNoBtn').onclick = () => {
    cliContent.style.filter = '';
    document.body.removeChild(modal);
  };
}

// ========================================
// Model Documentation Page (top-level)
// ========================================
function renderModelDocumentation() {
  cliContent.innerHTML = `
    <div class="cli-model-info-panel max-h-[65vh]">
      <div class="cli-model-info-header">Model Documentation</div>
      <div class="cli-model-info-details" style="font-size:1em; color:#a3e635;">
        <ul>
          <li><b>Algorithm:</b> Random Forest (class_weight='balanced')</li>
          <li><b>Features:</b> Transaction Type, Amount, Origin/Destination Balances</li>
          <li><b>Performance:</b> Accuracy, Precision, Recall (see right panel)</li>
          <li><b>Evaluation:</b> Model tested on 6M+ transactions, confusion matrix and metrics available</li>
        </ul>
        <div style="margin-top:1em; color:#a1a1aa;">
          <b>Confusion Matrix:</b><br>
          <pre style="background:#18181b; color:#a3e635; border:1px dashed #a3e635; padding:0.7em; font-size:0.95em;">
Actual \\ Pred | Not Fraud | Fraud
--------------+-----------+------
Not Fraud     | 1904925   | 1397
Fraud         | 113       | 2351
          </pre>
        </div>
        <div style="margin-top:.5em; color:#a1a1aa; font-size:0.95em;">
          <a href="https://colab.research.google.com/drive/128q2_2vRMqyjwd55m8eOJPQTd8_QEE4z?usp=sharing" target="_blank" style="color:#38bdf8; text-decoration:underline;">
            Fraud Detection Model Notebook
          </a>
        </div>
      </div>
      <button class="cli-btn mt-6" id="backBtn">Back</button>
    </div>
  `;
  document.getElementById('backBtn').addEventListener('click', renderTransactionForm);
}
// CRT Boot Sequence and CLI UI Logic
// ========================================

// Utility: sleep for async delays
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// DOM Elements

const crtContainer = document.getElementById('crt-container');
const bootSequence = document.getElementById('boot-sequence');
const bootText = document.getElementById('boot-text');
const bootProgress = document.getElementById('boot-progress');
const cliUI = document.getElementById('cli-ui');
const cliContent = document.getElementById('cli-content');
let globalModelDetails = null;

// Fade-in background, then boot sequence, then zoom-in CRT
async function startBootSequence() {

  bootSequence.style.display = 'flex';
  bootSequence.style.textAlign = 'center';
  bootSequence.classList.remove('hidden');
  cliUI.classList.add('hidden');

  // Boot sequence animation with cycling dots
  let bootSteps = [
    'Initializing CipherWatch System',
    'Establishing secure connection',
    'Loading security modules',
    'Verifying model integrity'
  ];
  for (let i = 0; i < bootSteps.length; i++) {
    let dots = 0;
    let running = true;
    bootText.innerHTML = `<span>${bootSteps[i]}</span><span id='boot-dots'></span><br><span id='boot-progress'>[${'█'.repeat(i+2).padEnd(10,' ')}]</span>`;
    const dotInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      const dotStr = '.'.repeat(dots);
      const dotSpan = document.getElementById('boot-dots');
      if (dotSpan) dotSpan.textContent = dotStr;
    }, 400);
    await sleep(1800);
    running = false;
    clearInterval(dotInterval);
  }

  // Check backend server health before finishing boot (with cycling dots)
  let dots = 0;
  let running = true;
  bootText.innerHTML = `<span>Checking model server status</span><span id='boot-dots'></span><br><span id='boot-progress'>[██████████]</span>`;
  const dotInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    const dotStr = '.'.repeat(dots);
    const dotSpan = document.getElementById('boot-dots');
    if (dotSpan) dotSpan.textContent = dotStr;
  }, 400);
  try {
    const res = await fetch('http://localhost:5000/model-details', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      globalModelDetails = data.data || null;
      clearInterval(dotInterval);
      bootText.innerHTML = `<span>System ready.</span><br><span id='boot-progress'>[██████████]</span>`;
      await sleep(1200);
      // Show only boot-sequence, hide cli-ui
      cliUI.classList.add('hidden');
      bootSequence.classList.remove('hidden');
      bootText.innerHTML = `
        <div class="flex flex-col items-center justify-center" style="gap:2em; margin-top:2em;">
          <button id="start-analyzing-btn" class="cli-btn" style="font-size:1.2em;">Start Analyzing</button>
          <button id="show-logs-btn" class="cli-btn" style="font-size:1.2em;">Show Logs</button>
        </div>
      `;
      document.getElementById('start-analyzing-btn').onclick = () => {
        bootSequence.classList.add('!hidden');
        cliUI.classList.remove('hidden');
        renderTransactionForm();
      };
      document.getElementById('show-logs-btn').onclick = () => {
        bootSequence.classList.add('!hidden');
        cliUI.classList.remove('hidden');
        renderLogsScreen();
      };
    } else {
      clearInterval(dotInterval);
      throw new Error('Server not responding');
    }
  } catch (err) {
    clearInterval(dotInterval);
    showBootErrorScreen();
  }
// ========================================
// Main Menu
// ========================================
function renderMainMenu() {
  cliContent.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full" style="gap:2em;">
      <button id="start-analyzing-btn" class="cli-btn" style="width:220px; font-size:1.2em;">Start Analyzing</button>
      <button id="show-logs-btn" class="cli-btn" style="width:220px; font-size:1.2em;">Show Logs</button>
    </div>
  `;
  document.getElementById('start-analyzing-btn').onclick = renderTransactionForm;
  document.getElementById('show-logs-btn').onclick = renderLogsScreen;
}

// ========================================
// Logs Screen
// ========================================
function renderLogsScreen() {
  const logs = JSON.parse(localStorage.getItem('analyzeLogs') || '[]');
  cliContent.innerHTML = `
    <div class="cli-logs-panel">
      <div class="cli-model-info-header">Analysis Logs</div>
      <div class="cli-logs-list" style="margin:1.5em 0;">
        ${logs.length === 0 ? '<div class="text-gray-400 font-mono">No logs found.</div>' :
          logs.map((log, i) => `
            <div class="cli-log-entry font-mono text-base mb-4 p-3 border border-gray-700 border-dashed bg-black/60">
              <div><b>Type:</b> ${log.transactionType}</div>
              <div><b>Amount:</b> ${log.amount}</div>
              <div><b>Origin Old/New:</b> ${log.originOldBalance} → ${log.originNewBalance}</div>
              <div><b>Dest Old/New:</b> ${log.destOldBalance} → ${log.destNewBalance}</div>
              <div><b>Result:</b> <span class="${log.is_fraud ? 'text-red-400' : 'text-green-400'}">${log.is_fraud ? 'FRAUD' : 'Legitimate'}</span></div>
              <div><b>Confidence:</b> ${(log.confidence * 100).toFixed(1)}%</div>
              <div class="text-xs text-gray-500 mt-1" style="place-self: end;">${log.timestamp || ''}</div>
            </div>
          `).join('')
        }
      </div>
      <div class="flex flex-col items-center mt-8" style="gap:1.5em;">
        <button id="exitBtnLogs" class="cli-close-btn w-full" style="font-size:1.1em;" onclick="">
          <div class="text">> </div><div class="line"></div>
        </button>
      </div>
    </div>
  `;
  // Attach modal logic to the existing exit button in logs screen
  const exitBtnLogs = document.getElementById('exitBtnLogs');
  if (exitBtnLogs) {
    exitBtnLogs.onclick = function(e) {
      e.preventDefault();
      showExitModal();
    };
  }
}
}

function showBootErrorScreen() {
  bootText.innerHTML = `
    <span style="color:#ef4444;">Error: Model server is unreachable.</span><br>
    <span style="color:#ef4444;">Please check your connection and try again.</span><br>
    <button id="reload-btn" class="cli-btn mt-4">Reload</button>
  `;
  const reloadBtn = document.getElementById('reload-btn');
  if (reloadBtn) reloadBtn.onclick = () => location.reload();
}

// CRT scanline overlay effect

// On DOM ready, start boot sequence
window.addEventListener('DOMContentLoaded', () => {
  startBootSequence();
});

// ========================================
// Transaction Form Component
// ========================================
function renderTransactionForm() {
  if (!globalModelDetails) {
    cliContent.innerHTML = '<div class="text-red-400 font-mono">Unable to load model details from backend.</div>';
    return;
  }
  const model = globalModelDetails;
  cliContent.innerHTML = `
    <div class="cli-main-grid">
      <div class="cli-form-panel flex flex-col justify-between">
        <div>
          <form id="transaction-form" class="cli-form-grid text-green-400 font-mono text-xl">
            <div class="cli-form-row-grid">
              <label for="transactionType" class="cli-label">Transaction Type</label>
              <select id="transactionType" name="transactionType" class="cli-input" style="min-width:220px;">
                <option value="">Select Type</option>
                <option value="Payment">Payment</option>
                <option value="Cash In">Cash In</option>
                <option value="Cash Out">Cash Out</option>
                <option value="Transfer">Transfer</option>
                <option value="Debit">Debit</option>
              </select>
            </div>
            <div class="cli-form-row-grid">
              <label for="amount" class="cli-label">Transaction Amount</label>
              <span class="peso-input" style="width:100%;">
                <input type="number" id="amount" name="amount" class="cli-input" min="0" step="0.01" required placeholder="Enter amount">
              </span>
            </div>
            <div class="cli-form-row-grid">
              <label class="cli-label">Origin Account</label>
              <div style="display:flex; gap:1em; width:100%;">
                <input type="number" id="originOldBalance" name="originOldBalance" placeholder="Old Balance" class="cli-input" min="0" step="0.01" required style="width:50%;">
                <input type="number" id="originNewBalance" name="originNewBalance" placeholder="New Balance" class="cli-input" min="0" step="0.01" required style="width:50%;">
              </div>
            </div>
            <div class="cli-form-row-grid">
              <label class="cli-label">Destination Account</label>
              <div style="display:flex; gap:1em; width:100%;">
                <input type="number" id="destOldBalance" name="destOldBalance" placeholder="Old Balance" class="cli-input" min="0" step="0.01" required style="width:50%;">
                <input type="number" id="destNewBalance" name="destNewBalance" placeholder="New Balance" class="cli-input" min="0" step="0.01" required style="width:50%;">
              </div>
            </div>
            <div class="cli-form-row-grid mt-4">
              <button type="submit" class="cli-btn" id="analyzeBtn" style="font-size:1.1em;">Analyze Transaction</button>
              <button type="button" class="cli-btn" id="docBtn" style="font-size:1.1em;">Documentation</button>
            </div>
            <div id="form-error" class="text-red-400 mt-2" style="grid-column:1/3;"></div>
          </form>
          <div id="result-area" class="mt-8"></div>
        </div>
        <div>
          <button id="exitBtn" class="cli-close-btn w-full mb-4" id="modelDetailsBtn" style="font-size:1.1em;" onclick="">
            <div class="text">> </div><div class="line"></div>
          </button>
          <div class="cli-footer py-4">Powered by CipherWatch™ Fraud Detection System</div>
        </div>
      </div>
      <div class="cli-model-info-panel">
        <div class="cli-model-info-header">ML Model Information</div>
        <div class="cli-model-info-status">Status: <span class="cli-model-status-active">Active</span></div>
        <div class="cli-model-info-version">Model Version: <span>${model.version || '-'}</span></div>
        <div class="cli-model-info-accuracy">Accuracy: <span>${model.metrics && model.metrics.accuracy ? (model.metrics.accuracy * 100).toFixed(2) + '%' : '-'}</span></div>
        <div class="cli-model-info-details">
          <ul>
            <li>${model.algorithm || '-'}</li>
            <li>5 Input Features</li>
            <li>Trained on 6M+ transactions</li>
            <li>Real-time inference</li>
          </ul>
        </div>
        <div class="cli-model-info-metrics">
          <div>Precision: <span class="cli-metric">${model.metrics && model.metrics.precision ? (model.metrics.precision * 100).toFixed(2) + '%' : '-'}</span></div>
          <div>Recall: <span class="cli-metric">${model.metrics && model.metrics.recall ? (model.metrics.recall * 100).toFixed(2) + '%' : '-'}</span></div>
          <div>F1 Score: <span class="cli-metric">${model.metrics && model.metrics['f1-score'] ? (model.metrics['f1-score'] * 100).toFixed(2) + '%' : '-'}</span></div>
          <div>AUC-ROC: <span class="cli-metric">${model.metrics && model.metrics['roc-auc'] ? (model.metrics['roc-auc'] * 100).toFixed(2) + '%' : '-'}</span></div>
        </div>
        <div class="justify-center">
          <div class="cli-model-info-updated">Last updated: October 8, 2025</div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('transaction-form').addEventListener('submit', handleAnalyzeTransaction);
  document.getElementById('docBtn').addEventListener('click', renderModelDocumentation);
  // Attach modal logic to the existing exit button if present
  const exitBtn = document.getElementById('exitBtn');
  if (exitBtn) {
    exitBtn.onclick = function(e) {
      e.preventDefault();
      showExitModal();
    };
  }
}

// ========================================
// Analyze Transaction Handler (API call placeholder)
// ========================================
async function handleAnalyzeTransaction(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('form-error');
  errorDiv.textContent = '';

  // Collect form data
  const transactionType = document.getElementById('transactionType').value;
  const amount = document.getElementById('amount').value;
  const originOldBalance = document.getElementById('originOldBalance').value;
  const originNewBalance = document.getElementById('originNewBalance').value;
  const destOldBalance = document.getElementById('destOldBalance').value;
  const destNewBalance = document.getElementById('destNewBalance').value;

  // Basic validation
  if (!transactionType || !amount || !originOldBalance || !originNewBalance || !destOldBalance || !destNewBalance) {
    errorDiv.textContent = 'Please fill in all fields.';
    return;
  }

  // Show loading state with cycling dots
  const resultArea = document.getElementById('result-area');
  let loading = true;
  let dots = 0;
  resultArea.innerHTML = '<span class="text-yellow-400">Analyzing transaction</span>';
  const loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
            document.getElementById('docBtn').onclick = function(e) {
              e.preventDefault();
              renderModelDocumentation();
            };
  }, 400);

  // Actual API call
  try {
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionType,
        amount: parseFloat(amount),
        originOldBalance: parseFloat(originOldBalance),
        originNewBalance: parseFloat(originNewBalance),
        destOldBalance: parseFloat(destOldBalance),
        destNewBalance: parseFloat(destNewBalance)
      })
    });
    const data = await res.json();
    loading = false;
    clearInterval(loadingInterval);
    if (data.success) {
      // Save to logs in localStorage
      const logs = JSON.parse(localStorage.getItem('analyzeLogs') || '[]');
      logs.unshift({
        transactionType,
        amount: parseFloat(amount),
        originOldBalance: parseFloat(originOldBalance),
        originNewBalance: parseFloat(originNewBalance),
        destOldBalance: parseFloat(destOldBalance),
        destNewBalance: parseFloat(destNewBalance),
        is_fraud: data.data.is_fraud,
        confidence: data.data.confidence,
        timestamp: new Date().toLocaleString()
      });
      localStorage.setItem('analyzeLogs', JSON.stringify(logs.slice(0, 100)));
      resultArea.innerHTML = `
        <div class="font-mono text-xl ${data.data.is_fraud ? 'text-red-400' : 'text-green-400'}">
          ${data.data.is_fraud ? 'FRAUD DETECTED' : 'Transaction is Legitimate'}
        </div>
        <div class="text-gray-300 mt-2">Confidence: <span class="font-bold">${(data.data.confidence * 100).toFixed(1)}%</span></div>
      `;
    } else {
      resultArea.innerHTML = `<span class="text-red-400">${data.message || 'Prediction failed.'}</span>`;
    }
  // ========================================
  // Exit Modal
  // ========================================
  function showExitModal() {
    // Blur background
    cliContent.style.filter = 'blur(3px)';
    // Create modal overlay
    let modal = document.createElement('div');
    modal.id = 'exit-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = `
      <div style="background:#18181b; border:2px solid #a3e635; border-radius:10px; padding:2em 2.5em; text-align:center; min-width:320px;">
        <div class="font-mono text-xl mb-6">Are you sure?</div>
        <div style="display:flex; gap:2em; justify-content:center;">
          <button id="exitYesBtn" class="cli-btn" style="width:90px;">Yes</button>
          <button id="exitNoBtn" class="cli-btn" style="width:90px;">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('exitYesBtn').onclick = () => {
      cliContent.style.filter = '';
      document.body.removeChild(modal);
      // Go back to main menu: show boot-sequence, hide cli-ui
      cliUI.classList.add('hidden');
      bootSequence.classList.remove('hidden');
      startBootSequence();
    };
    document.getElementById('exitNoBtn').onclick = () => {
      cliContent.style.filter = '';
      document.body.removeChild(modal);
    };
  }
  } catch (err) {
    loading = false;
    clearInterval(loadingInterval);
    resultArea.innerHTML = '<span class="text-red-400">Error connecting to backend.</span>';
  }
}

// ========================================
// Model Details Page (Placeholder)
// ========================================
function renderModelDetails() {
  if (!globalModelDetails) {
    cliContent.innerHTML = '<div class="text-red-400 font-mono">Unable to load model details from backend.</div>';
    return;
  }
  const model = globalModelDetails;
  cliContent.innerHTML = `
    <div class="cli-model-info-panel" style="margin: 2em auto;">
      <div class="cli-model-info-header">ML Model Information</div>
      <div class="cli-model-info-status">Status: <span class="cli-model-status-active">Active</span></div>
      <div class="cli-model-info-version">Model Version: <span>${model.version || '-'}</span></div>
      <div class="cli-model-info-accuracy">Accuracy: <span>${model.metrics && model.metrics.accuracy ? (model.metrics.accuracy * 100).toFixed(1) + '%' : '-'}</span></div>
      <div class="cli-model-info-details">
        <ul>
          <li>${model.algorithm || '-'}</li>
          <li>5 Input Features</li>
          <li>Trained on 6M+ transactions</li>
          <li>Real-time inference</li>
        </ul>
      </div>
      <div class="cli-model-info-metrics">
        <div>Precision: <span class="cli-metric">${model.metrics && model.metrics.precision ? (model.metrics.precision * 100).toFixed(1) + '%' : '-'}</span></div>
        <div>Recall: <span class="cli-metric">${model.metrics && model.metrics.recall ? (model.metrics.recall * 100).toFixed(1) + '%' : '-'}</span></div>
        <div>F1 Score: <span class="cli-metric">${model.metrics && model.metrics['f1-score'] ? (model.metrics['f1-score'] * 100).toFixed(1) + '%' : '-'}</span></div>
        <div>AUC-ROC: <span class="cli-metric">${model.metrics && model.metrics['roc-auc'] ? (model.metrics['roc-auc'] * 100).toFixed(1) + '%' : '-'}</span></div>
      </div>
      <div class="cli-model-info-updated">Last updated: October 8, 2025</div>
      <button class="cli-btn mt-6" id="backBtn">Back</button>
    </div>
  `;
  document.getElementById('backBtn').addEventListener('click', renderTransactionForm);

// ========================================
// Model Documentation Page
// ========================================
// function renderModelDocumentation() {
//   cliContent.innerHTML = `
//     <div class="cli-model-info-panel" style="margin: 2em auto; max-width:700px;">
//       <div class="cli-model-info-header">Model Documentation</div>
//       <div class="cli-model-info-details" style="font-size:1em; color:#a3e635;">
//         <ul>
//           <li><b>Algorithm:</b> Random Forest (class_weight='balanced')</li>
//           <li><b>Features:</b> Transaction Type, Amount, Origin/Destination Balances</li>
//           <li><b>Performance:</b> Accuracy, Precision, Recall (see right panel)</li>
//           <li><b>Evaluation:</b> Model tested on 6M+ transactions, confusion matrix and metrics available</li>
//         </ul>
//         <div style="margin-top:1em; color:#a1a1aa;">
//           <b>Confusion Matrix Example:</b><br>
//           <pre style="background:#18181b; color:#a3e635; border:1px dashed #a3e635; padding:0.7em; border-radius:6px; font-size:0.95em;">
// Actual \ Pred | Not Fraud | Fraud
// --------------+-----------+------
// Not Fraud     | 1905188   | 1134
// Fraud         | 163       | 2301
//           </pre>
//         </div>
//         <div style="margin-top:1em; color:#a1a1aa; font-size:0.95em;">
//           <b>Notebook Reference:</b> See <code>Fraud_Detection.ipynb</code> for full training and evaluation details.
//         </div>
//       </div>
//       <button class="cli-btn mt-6" id="backBtn">Back</button>
//     </div>
//   `;
//   document.getElementById('backBtn').addEventListener('click', renderTransactionForm);
// }
}

// Render form on CLI UI load
window.renderTransactionForm = renderTransactionForm;
window.renderModelDetails = renderModelDetails;

// After boot sequence, show transaction form
const observer = new MutationObserver(() => {
  if (!cliUI.classList.contains('hidden')) {
    renderMainMenu();
    observer.disconnect();
  }
});
observer.observe(cliUI, { attributes: true });
