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

-- Insert default CPM settings
INSERT INTO admin_settings (setting_type, pages, cpm_value, multiplier, description) VALUES
('cpm', 1, 160.00, 2.00, '1 page'),
('cpm', 2, 320.00, 2.00, '2 pages'),
('cpm', 3, 480.00, 2.00, '3 pages'),
('cpm', 4, 640.00, 2.00, '4 pages'),
('cpm', 5, 800.00, 2.00, '5 pages')
ON CONFLICT (setting_type, pages) DO NOTHING;

-- Insert default general settings
INSERT INTO admin_settings (setting_type, short_link_domain, referral_percentage, withdrawal_minimum, withdrawal_maximum) VALUES
('general', 'linkearn.pro', 5.00, 100.00, 10000.00)
ON CONFLICT (setting_type, pages) DO NOTHING;

-- Show the created table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'admin_settings'
ORDER BY ordinal_position;

-- Show current settings
SELECT 
    setting_type,
    pages,
    cpm_value,
    multiplier,
    description,
    short_link_domain,
    referral_percentage,
    withdrawal_minimum,
    withdrawal_maximum,
    created_at,
    updated_at
FROM admin_settings
ORDER BY setting_type, pages; 