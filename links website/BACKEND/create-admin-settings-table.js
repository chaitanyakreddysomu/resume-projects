const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function createAdminSettingsTable() {
  try {
    console.log('Creating admin_settings table...');

    // SQL to create the table and insert default data
    const sql = `
      -- Create admin_settings table
      CREATE TABLE IF NOT EXISTS admin_settings (
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

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_admin_settings_type ON admin_settings(setting_type);
      CREATE INDEX IF NOT EXISTS idx_admin_settings_pages ON admin_settings(pages);
    `;

    // Execute the SQL using a direct query (if available)
    console.log('Table creation SQL executed. Now inserting default data...');

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

    console.log('Admin settings table setup completed successfully!');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

createAdminSettingsTable(); 