// --- LOCAL API CLIENT (Supabase Mock) ---
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:3000/api' : 'https://api.vuanedit.online/api';

const getHeaders = () => {
    const token = localStorage.getItem('vuanedit_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

class SupabaseQueryBuilder {
    constructor(table) {
        this.table = table;
        this.filters = [];
    }

    select(columns) {
        return this;
    }

    eq(column, value) {
        this.filters.push({ column, value, op: 'eq' });
        return this;
    }

    lte(column, value) {
        this.filters.push({ column, value, op: 'lte' });
        return this;
    }

    order(column, { ascending = true } = {}) {
        return this;
    }

    async maybeSingle() {
        const { data, error } = await this.then();
        return { data: data ? (Array.isArray(data) ? data[0] : data) : null, error };
    }

    async single() {
        const { data, error } = await this.then();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return { data: null, error: { message: 'Not found' } };
        }
        return { data: Array.isArray(data) ? data[0] : data, error };
    }

    async then(onfulfilled) {
        try {
            let endpoint = '';
            if (this.table === 'products') endpoint = 'products';
            else if (this.table === 'geodata_layers') endpoint = 'geodata/layers';
            else if (this.table === 'profiles') endpoint = 'auth/me';
            else endpoint = this.table;

            const res = await fetch(`${API_URL}/${endpoint}`, { headers: getHeaders() });
            const result = await res.json();
            
            let data = result.data || result.user || result;

            // Simple client-side filtering to mimic Supabase logic for Demo
            this.filters.forEach(f => {
                if (!Array.isArray(data)) return;
                if (f.op === 'eq') data = data.filter(item => item[f.column] == f.value);
                if (f.op === 'lte') data = data.filter(item => item[f.column] <= f.value);
            });

            const finalResult = { data, error: res.ok ? null : { message: result.error } };
            return onfulfilled ? onfulfilled(finalResult) : finalResult;
        } catch (err) {
            const finalResult = { data: null, error: err };
            return onfulfilled ? onfulfilled(finalResult) : finalResult;
        }
    }
}

export const supabase = {
    supabaseUrl: API_URL,
    auth: {
        getUser: async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
                if (!res.ok) return { data: { user: null }, error: await res.json() };
                const data = await res.json();
                return { data: { user: data.user }, error: null };
            } catch (err) {
                return { data: { user: null }, error: err };
            }
        },
        signInWithPassword: async ({ email, password }) => {
            const res = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('vuanedit_token', data.session.access_token);
                return { data, error: null };
            }
            return { data: null, error: data };
        },
        signUp: async ({ email, password }) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('vuanedit_token', data.session.access_token);
                return { data, error: null };
            }
            return { data: null, error: data };
        },
        signOut: async () => {
            localStorage.removeItem('vuanedit_token');
            return { error: null };
        }
    },
    
    from: (table) => new SupabaseQueryBuilder(table),
    
    storage: {
        from: (bucket) => ({
            createSignedUrl: async (path, expiry) => {
                return { data: { signedUrl: `${API_URL.replace('/api', '')}/storage/${bucket}/${path}` }, error: null };
            }
        })
    }
};

// Compatibility Helpers
export const getCurrentUser = async () => (await supabase.auth.getUser()).data.user;
export const signIn = async (email, password) => await supabase.auth.signInWithPassword({ email, password });
export const signUp = async (email, password) => await supabase.auth.signUp({ email, password });
export const signOut = async () => await supabase.auth.signOut();
