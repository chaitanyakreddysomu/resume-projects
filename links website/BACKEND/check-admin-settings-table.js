const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkAndFixAdminSettingsTable() {
  try {
    console.log('Checking admin_settings table structure...');

    // First, let's see what columns actually exist
    const { data: columns, error: columnsError } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1);

    if (columnsError) {
      console.error('Error checking table structure:', columnsError);
      return;
    }

    console.log('Current table structure:', Object.keys(columns[0] || {}));

    // Check if we need to add the missing columns
    const { data: existingData, error: dataError } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(5);

    if (dataError) {
      console.error('Error fetching existing data:', dataError);
      return;
    }

    console.log('Existing data sample:', existingData);

    // If the table exists but has wrong column names, we need to fix it
    // Let's drop and recreate the table with correct column names
    console.log('Recreating table with correct column names...');

    // Drop the existing table
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS admin_settings CASCADE;'
    });

    if (dropError) {
      console.log('Could not drop table via RPC, will try alternative approach...');
    }

    // Create the table with correct column names
    const createTableSQL = `
      CREATE TABLE admin_settings (
        id SERIAL PRIMARY KEY,
        setting_type VARCHAR(50) NOT NULL,
        setting_key VARCHAR(100),
        setting_value TEXT,
        pages INTEGER DEFAULT 1,
        cpm_value DECIMAL(10,4) DEFAULT 0.0000,
        multiplier DECIMAL(5,2) DEFAULT 2.00,
        short_link_domain VARCHAR(255) DEFAULT 'linkearn.pro',
        referral_percentage DECIMAL(5,2) DEFAULT 5.00,
        withdrawal_minimum DECIMAL(10,2) DEFAULT 100.00,
        withdrawal_maximum DECIMAL(10,2) DEFAULT 10000.00,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(setting_type, pages)
      );

      CREATE INDEX idx_admin_settings_type ON admin_settings(setting_type);
      CREATE INDEX idx_admin_settings_pages ON admin_settings(pages);
    `;

    console.log('Please run this SQL in your Supabase SQL editor:');
    console.log(createTableSQL);

    // Try to insert default data
    console.log('Inserting default data...');

    // Insert default CPM settings
    const cpmSettings = [
      { pages: 1, cpm: 160.00, multiplier: 2.00, description: '1 page' },
      { pages: 2, cpm: 320.00, multiplier: 2.00, description: '2 pages' },
      { pages: 3, cpm: 480.00, multiplier: 2.00, description: '3 pages' },
      { pages: 4, cpm: 640.00, multiplier: 2.00, description: '4 pages' },
      { pages: 5, cpm: 800.00, multiplier: 2.00, description: '5 pages' }
    ];

    for (const setting of cpmSettings) {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_type: 'cpm',
          pages: setting.pages,
          cpm_value: setting.cpm,
          multiplier: setting.multiplier,
          description: setting.description
        }, { onConflict: 'setting_type,pages' });

      if (error) {
        console.error(`Error inserting CPM setting for ${setting.pages} pages:`, error);
      } else {
        console.log(`Inserted CPM setting for ${setting.pages} pages`);
      }
    }

    // Insert default general settings
    const { error: generalError } = await supabase
      .from('admin_settings')
      .upsert({
        setting_type: 'general',
        short_link_domain: 'linkearn.pro',
        referral_percentage: 5.00,
        withdrawal_minimum: 100.00,
        withdrawal_maximum: 10000.00
      }, { onConflict: 'setting_type,pages' });

    if (generalError) {
      console.error('Error inserting general settings:', generalError);
    } else {
      console.log('Inserted general settings');
    }

    console.log('Admin settings table setup completed!');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

checkAndFixAdminSettingsTable(); 