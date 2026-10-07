/**
 * Dolce Candele — API Client
 *
 * Centralises all fetch() calls to the PHP backend.
 * Base URL is read from the VITE_API_URL env variable,
 * falling back to /api (works when the frontend is served
 * from the same cPanel domain as the PHP files).
 */

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE}${endpoint}`, opts);
  } catch (networkErr) {
    // Network failure (offline, DNS, CORS preflight blocked, etc.)
    throw new Error(`Sem ligação à API (${endpoint}): ${networkErr.message}`);
  }

  // Try to parse JSON; if the server returned HTML (PHP error page) catch it
  let json;
  try {
    json = await res.json();
  } catch {
    const text = await res.text().catch(() => '(sem resposta)');
    throw new Error(
      `O servidor devolveu uma resposta inválida [HTTP ${res.status}].\n` +
      `Verifica se o PHP está ativo e o ficheiro ${endpoint} existe.\n` +
      `Primeiros 200 chars: ${text.slice(0, 200)}`
    );
  }

  if (!json.ok) {
    throw new Error(json.error ?? `API error ${res.status}`);
  }
  return json.data;
}


// ── Suppliers ────────────────────────────────────────────────────
export const api = {
  suppliers: {
    list:   ()         => request('/suppliers.php'),
    create: (data)     => request('/suppliers.php', 'POST', data),
    update: (id, data) => request(`/suppliers.php?id=${id}`, 'PUT', data),
    delete: (id)       => request(`/suppliers.php?id=${id}`, 'DELETE'),
  },

  // ── Ingredients ─────────────────────────────────────────────────
  ingredients: {
    list:    ()              => request('/ingredients.php'),
    create:  (data)          => request('/ingredients.php', 'POST', data),
    update:  (id, data)      => request(`/ingredients.php?id=${id}`, 'PUT', data),
    restock: (id, additionalQty) =>
      request(`/ingredients.php?id=${id}`, 'PATCH', { additionalQty }),
    delete:  (id)            => request(`/ingredients.php?id=${id}`, 'DELETE'),
  },

  // ── Products ─────────────────────────────────────────────────────
  products: {
    list:   ()         => request('/products.php'),
    create: (data)     => request('/products.php', 'POST', data),
    update: (id, data) => request(`/products.php?id=${id}`, 'PUT', data),
    delete: (id)       => request(`/products.php?id=${id}`, 'DELETE'),
  },

  // ── Fixed Costs ──────────────────────────────────────────────────
  fixedCosts: {
    list:   ()         => request('/fixed_costs.php'),
    create: (data)     => request('/fixed_costs.php', 'POST', data),
    update: (id, data) => request(`/fixed_costs.php?id=${id}`, 'PUT', data),
    delete: (id)       => request(`/fixed_costs.php?id=${id}`, 'DELETE'),
  },

  // ── Sales ────────────────────────────────────────────────────────
  sales: {
    list:         ()         => request('/sales.php'),
    create:       (data)     => request('/sales.php', 'POST', data),
    updateStatus: (id, status) =>
      request(`/sales.php?id=${id}`, 'PUT', { status }),
    delete:       (id)       => request(`/sales.php?id=${id}`, 'DELETE'),
  },

  // ── Expenses ─────────────────────────────────────────────────────
  expenses: {
    list:   ()     => request('/expenses.php'),
    create: (data) => request('/expenses.php', 'POST', data),
    delete: (id)   => request(`/expenses.php?id=${id}`, 'DELETE'),
  },
};
