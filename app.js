/* =============================================
   PROMPT LIBRARY — Core App v2.0
   Lee directamente desde data.js
   Sin fetch, sin servidor, sin complicaciones
   ============================================= */

const DOM = {
    categorySelect : document.getElementById('category-select'),
    promptSelect   : document.getElementById('prompt-select'),
    promptDisplay  : document.getElementById('prompt-display'),
    promptTitle    : document.getElementById('prompt-title'),
    copyBtn        : document.getElementById('copy-btn'),
    copyText       : document.getElementById('copy-text'),
    charCount      : document.getElementById('char-count'),
    toast          : document.getElementById('toast'),
};

/* ===== INICIALIZACIÓN ===== */
function init() {
    PROMPT_DATA.forEach((category, index) => {
        const option       = document.createElement('option');
        option.value       = index;
        option.textContent = `${category.name} (${category.prompts.length})`;
        DOM.categorySelect.appendChild(option);
    });
}

/* ===== EVENTO: Cambio de Categoría ===== */
DOM.categorySelect.addEventListener('change', () => {
    const index = DOM.categorySelect.value;

    resetViewer();

    if (index === '') {
        DOM.promptSelect.disabled  = true;
        DOM.promptSelect.innerHTML = '<option value="">—</option>';
        return;
    }

    const category = PROMPT_DATA[index];

    DOM.promptSelect.disabled  = false;
    DOM.promptSelect.innerHTML = '<option value="">Selecciona un prompt</option>';

    category.prompts.forEach((prompt, i) => {
        const option       = document.createElement('option');
        option.value       = i;
        option.textContent = prompt.label;
        DOM.promptSelect.appendChild(option);
    });
});

/* ===== EVENTO: Cambio de Prompt ===== */
DOM.promptSelect.addEventListener('change', () => {
    const categoryIndex = DOM.categorySelect.value;
    const promptIndex   = DOM.promptSelect.value;

    if (promptIndex === '') {
        resetViewer();
        return;
    }

    const prompt = PROMPT_DATA[categoryIndex].prompts[promptIndex];

    DOM.promptDisplay.value   = prompt.content;
    DOM.promptTitle.innerHTML = `<span class="dot active"></span>${prompt.label}`;
    DOM.copyBtn.disabled      = false;
    DOM.charCount.textContent = `${prompt.content.length} chars`;
});

/* ===== EVENTO: Copiar ===== */
DOM.copyBtn.addEventListener('click', async () => {
    const text = DOM.promptDisplay.value;
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        onCopySuccess();
    } catch {
        DOM.promptDisplay.select();
        document.execCommand('copy');
        onCopySuccess();
    }
});

function onCopySuccess() {
    DOM.copyText.textContent = '¡Copiado!';
    DOM.copyBtn.classList.add('copied');
    showToast('✅ Copiado al portapapeles', 'success');

    setTimeout(() => {
        DOM.copyText.textContent = 'Copiar';
        DOM.copyBtn.classList.remove('copied');
    }, 2000);
}

/* ===== RESET ===== */
function resetViewer() {
    DOM.promptDisplay.value   = '';
    DOM.promptTitle.innerHTML = '<span class="dot"></span>Ningún prompt seleccionado';
    DOM.copyBtn.disabled      = true;
    DOM.charCount.textContent = '';
}

/* ===== TOAST ===== */
function showToast(message, type) {
    DOM.toast.textContent = message;
    DOM.toast.className   = `toast visible ${type}`;
    setTimeout(() => DOM.toast.classList.remove('visible'), 2500);
}

/* ===== ATAJO: Ctrl+Shift+C ===== */
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (!DOM.copyBtn.disabled) DOM.copyBtn.click();
    }
});

/* ===== START ===== */
document.addEventListener('DOMContentLoaded', init);