const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data, error } = await supabase.from('geodata_layers').select('*');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}
check();
