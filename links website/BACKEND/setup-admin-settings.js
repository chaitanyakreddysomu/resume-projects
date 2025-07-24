const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupAdminSettings() {
  try {
    console.log('Setting up admin_settings table...');

    // Create the admin_settings table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_settings (
          id SERIAL PRIMARY KEY,
          setting_type VARCHAR(50) NOT NULL,
          setting_key VARCHAR(100) NOT NULL,
          setting_value TEXT,
          pages INTEGER DEFAULT 1,
          cpm DECIMAL(10,4) DEFAULT 0.0000,
          multiplier DECIMAL(5,2) DEFAULT 2.00,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(setting_type, setting_key)
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_admin_settings_type ON admin_settings(setting_type);
        CREATE INDEX IF NOT EXISTS idx_admin_settings_pages ON admin_settings(pages);
      `
    });

    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }

    console.log('Table created successfully');

    // Insert default CPM settings
    const cpmSettings = [
      { pages: 1, cpm: 0.50, multiplier: 2.00, description: '1 page' },
      { pages: 2, cpm: 1.00, multiplier: 2.00, description: '2 pages' },
      { pages: 3, cpm: 1.50, multiplier: 2.00, description: '3 pages' },
      { pages: 4, cpm: 2.00, multiplier: 2.00, description: '4 pages' },
      { pages: 5, cpm: 2.50, multiplier: 2.00, description: '5 pages' }
    ];

    for (const setting of cpmSettings) {
      const { error: insertError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_type: 'cpm',
          setting_key: `pages_${setting.pages}`,
          pages: setting.pages,
          cpm: setting.cpm,
          multiplier: setting.multiplier,
          description: setting.description
        }, { onConflict: 'setting_type,setting_key' });

      if (insertError) {
        console.error(`Error inserting CPM setting for ${setting.pages} pages:`, insertError);
      } else {
        console.log(`Inserted CPM setting for ${setting.pages} pages`);
      }
    }

    // Insert default general settings
    const generalSettings = [
      { key: 'shortLinkDomain', value: 'linkearn.pro' },
      { key: 'referralPercentage', value: '5' },
      { key: 'withdrawalMinimum', value: '100' },
      { key: 'withdrawalMaximum', value: '10000' }
    ];

    for (const setting of generalSettings) {
      const { error: insertError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_type: 'general',
          setting_key: setting.key,
          setting_value: setting.value
        }, { onConflict: 'setting_type,setting_key' });

      if (insertError) {
        console.error(`Error inserting general setting ${setting.key}:`, insertError);
      } else {
        console.log(`Inserted general setting: ${setting.key}`);
      }
    }

    console.log('Admin settings setup completed successfully!');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupAdminSettings(); 