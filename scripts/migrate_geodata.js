import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmjxcgblzfjqhaavgjgh.supabase.co'
const supabaseAnonKey = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrate() {
    const { data, error } = await supabase.from('geodata_layers')
        .update({ file_path: 'provinces/vietnam_provinces.geojson' })
        .eq('file_path', 'vietnam_provinces.geojson')
    
    if (error) {
        console.error("Migration error:", error)
    } else {
        console.log("Migration successful!")
    }
}

migrate()
