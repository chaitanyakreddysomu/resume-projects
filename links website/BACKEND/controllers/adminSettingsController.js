const supabase = require('../utils/supabase');
const { getISTISOString } = require('../utils/dateUtils');

// Get all settings (accessible by all users)
exports.getSettings = async (req, res, next) => {
  try {

    // Get CPM settings
    const { data: cpmSettings, error: cpmError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_type', 'cpm')
      .order('pages', { ascending: true });

    if (cpmError) {
      console.error('Error fetching CPM settings:', cpmError);
      return res.status(500).json({ error: 'Failed to fetch CPM settings' });
    }

    // Get general settings
    const { data: generalSettings, error: generalError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_type', 'general')
      .single();

    if (generalError && generalError.code !== 'PGRST116') {
      console.error('Error fetching general settings:', generalError);
      return res.status(500).json({ error: 'Failed to fetch general settings' });
    }

    // Format CPM settings
    const formattedCpmSettings = cpmSettings.map(setting => ({
      id: setting.id,
      pages: setting.pages,
      cpm: setting.cpm_value || 0,
      multiplier: setting.multiplier || 2,
      description: setting.description || `${setting.pages} page${setting.pages > 1 ? 's' : ''}`
    }));

    res.json({
      cpmSettings: formattedCpmSettings,
      generalSettings: {
        shortLinkDomain: generalSettings?.short_link_domain || 'linkearn.pro',
        referralPercentage: parseFloat(generalSettings?.referral_percentage) || 5,
        withdrawalMinimum: parseFloat(generalSettings?.withdrawal_minimum) || 100,
        withdrawalMaximum: parseFloat(generalSettings?.withdrawal_maximum) || 10000
      }
    });
  } catch (err) {
    console.error('Error in getSettings:', err);
    next(err);
  }
};

// Admin-only: Update CPM settings
exports.updateCpmSettings = async (req, res, next) => {
  try {
    // Check if user is admin - enhanced validation
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
      console.log(`User ${req.user.id} (role: ${req.user.role}) attempted to update CPM settings`);
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { cpmSettings } = req.body;
    console.log(`Admin ${req.user.id} updating CPM settings:`, cpmSettings);

    if (!Array.isArray(cpmSettings)) {
      return res.status(400).json({ error: 'CPM settings must be an array' });
    }

    // Validate each setting
    for (const setting of cpmSettings) {
      if (!setting.pages || !setting.cpm || setting.pages < 1 || setting.cpm < 0) {
        return res.status(400).json({ 
          error: `Invalid CPM setting for ${setting.pages} pages: CPM must be positive` 
        });
      }
    }

    // Update each CPM setting
    const updatePromises = cpmSettings.map(async (setting) => {
      // Check if setting exists
      const { data: existing, error: checkError } = await supabase
        .from('admin_settings')
        .select('id')
        .eq('setting_type', 'cpm')
        .eq('pages', setting.pages)
        .single();

      let error;
      if (existing) {
        // Update existing setting
        const { error: updateError } = await supabase
          .from('admin_settings')
          .update({
            cpm_value: setting.cpm,
            multiplier: setting.multiplier || 2,
            description: `${setting.pages} page${setting.pages > 1 ? 's' : ''}`,
            updated_at: getISTISOString()
          })
          .eq('setting_type', 'cpm')
          .eq('pages', setting.pages);
        error = updateError;
      } else {
        // Insert new setting
        const { error: insertError } = await supabase
          .from('admin_settings')
          .insert({
            setting_type: 'cpm',
            pages: setting.pages,
            cpm_value: setting.cpm,
            multiplier: setting.multiplier || 2,
            description: `${setting.pages} page${setting.pages > 1 ? 's' : ''}`,
            created_at: getISTISOString(),
            updated_at: getISTISOString()
          });
        error = insertError;
      }

      if (error) {
        throw new Error(`Failed to update CPM for ${setting.pages} pages: ${error.message}`);
      }
    });

    await Promise.all(updatePromises);

    console.log(`Admin ${req.user.id} updated CPM settings successfully`);
    res.json({ message: 'CPM settings updated successfully' });
  } catch (err) {
    console.error('Error in updateCpmSettings:', err);
    next(err);
  }
};

// Admin-only: Update general settings
exports.updateGeneralSettings = async (req, res, next) => {
  try {
    // Check if user is admin - enhanced validation
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
      console.log(`User ${req.user.id} (role: ${req.user.role}) attempted to update general settings`);
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { shortLinkDomain, referralPercentage, withdrawalMinimum, withdrawalMaximum } = req.body;
    console.log(`Admin ${req.user.id} updating general settings:`, { 
      shortLinkDomain, 
      referralPercentage, 
      withdrawalMinimum, 
      withdrawalMaximum 
    });

    // Validate inputs
    if (!shortLinkDomain || shortLinkDomain.trim() === '') {
      return res.status(400).json({ error: 'Short link domain is required' });
    }

    if (referralPercentage < 0 || referralPercentage > 100) {
      return res.status(400).json({ error: 'Referral percentage must be between 0 and 100' });
    }

    if (withdrawalMinimum < 0) {
      return res.status(400).json({ error: 'Withdrawal minimum must be positive' });
    }

    if (withdrawalMaximum < withdrawalMinimum) {
      return res.status(400).json({ error: 'Withdrawal maximum must be greater than minimum' });
    }

    // Update general settings - first check if it exists
    const { data: existingGeneral, error: checkError } = await supabase
      .from('admin_settings')
      .select('id')
      .eq('setting_type', 'general')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking general settings:', checkError);
      return res.status(500).json({ error: 'Failed to check general settings' });
    }

    let error;
    if (existingGeneral) {
      // Update existing general settings
      const { error: updateError } = await supabase
        .from('admin_settings')
        .update({
          short_link_domain: shortLinkDomain.trim(),
          referral_percentage: referralPercentage,
          withdrawal_minimum: withdrawalMinimum,
          withdrawal_maximum: withdrawalMaximum,
          updated_at: getISTISOString()
        })
        .eq('setting_type', 'general');
      error = updateError;
    } else {
      // Insert new general settings
      const { error: insertError } = await supabase
        .from('admin_settings')
        .insert({
          setting_type: 'general',
          pages: 1, // Required for unique constraint
          short_link_domain: shortLinkDomain.trim(),
          referral_percentage: referralPercentage,
          withdrawal_minimum: withdrawalMinimum,
          withdrawal_maximum: withdrawalMaximum,
          created_at: getISTISOString(),
          updated_at: getISTISOString()
        });
      error = insertError;
    }

    if (error) {
      console.error('Error updating general settings:', error);
      return res.status(500).json({ error: 'Failed to update general settings' });
    }

    console.log(`Admin ${req.user.id} updated general settings successfully`);
    res.json({ message: 'General settings updated successfully' });
  } catch (err) {
    console.error('Error in updateGeneralSettings:', err);
    next(err);
  }
};

// Get CPM for specific number of pages (accessible by all users)
exports.getCpmForPages = async (pages) => {
  try {
    const { data: setting, error } = await supabase
      .from('admin_settings')
      .select('cpm_value, multiplier')
      .eq('setting_type', 'cpm')
      .eq('pages', pages)
      .single();

    if (error || !setting) {
      // Return default CPM if not found
      return {
        cpm: 320, // Default: 4 pages * 2 * 40
        multiplier: 2
      };
    }

    return {
      cpm: setting.cpm_value,
      multiplier: setting.multiplier || 2
    };
  } catch (err) {
    console.error('Error getting CPM for pages:', err);
    // Return default values
    return {
      cpm: 320,
      multiplier: 2
    };
  }
};

// Get short link domain (accessible by all users)
exports.getShortLinkDomain = async () => {
  try {
    const { data: setting, error } = await supabase
      .from('admin_settings')
      .select('short_link_domain')
      .eq('setting_type', 'general')
      .single();

    if (error || !setting) {
      return 'linkearn.pro'; // Default domain
    }

    return setting.short_link_domain;
  } catch (err) {
    console.error('Error getting short link domain:', err);
    return 'linkearn.pro'; // Default domain
  }
};

// Get referral percentage (accessible by all users)
exports.getReferralPercentage = async () => {
  try {
    const { data: setting, error } = await supabase
      .from('admin_settings')
      .select('referral_percentage')
      .eq('setting_type', 'general')
      .single();

    if (error || !setting) {
      return 5; // Default 5%
    }

    return setting.referral_percentage;
  } catch (err) {
    console.error('Error getting referral percentage:', err);
    return 5; // Default 5%
  }
};

// Admin-only: Initialize default settings (only if they don't exist)
exports.initializeSettings = async () => {
  try {
    console.log('Checking admin settings...');

    // Check if general settings exist
    const { data: existingGeneral, error: generalCheckError } = await supabase
      .from('admin_settings')
      .select('id')
      .eq('setting_type', 'general')
      .single();

    if (generalCheckError && generalCheckError.code === 'PGRST116') {
      // General settings don't exist, create them
      console.log('Creating default general settings...');
      const { error: generalError } = await supabase
        .from('admin_settings')
        .insert({
          setting_type: 'general',
          short_link_domain: 'linkearn.pro',
          referral_percentage: 5,
          withdrawal_minimum: 100,
          withdrawal_maximum: 10000,
          created_at: getISTISOString(),
          updated_at: getISTISOString()
        });

      if (generalError) {
        console.error('Error creating general settings:', generalError);
      } else {
        console.log('Default general settings created');
      }
    } else if (generalCheckError) {
      console.error('Error checking general settings:', generalCheckError);
    } else {
      console.log('General settings already exist, skipping creation');
    }

    // Check if CPM settings exist
    const { data: existingCpm, error: cpmCheckError } = await supabase
      .from('admin_settings')
      .select('id')
      .eq('setting_type', 'cpm')
      .limit(1);

    if (cpmCheckError) {
      console.error('Error checking CPM settings:', cpmCheckError);
    } else if (!existingCpm || existingCpm.length === 0) {
      // CPM settings don't exist, create them
      console.log('Creating default CPM settings...');
      
      const defaultCpmSettings = [
        { pages: 1, cpm: 160, multiplier: 2 },
        { pages: 2, cpm: 320, multiplier: 2 },
        { pages: 3, cpm: 480, multiplier: 2 },
        { pages: 4, cpm: 640, multiplier: 2 },
        { pages: 5, cpm: 800, multiplier: 2 }
      ];

      for (const setting of defaultCpmSettings) {
        const { error } = await supabase
          .from('admin_settings')
          .insert({
            setting_type: 'cpm',
            pages: setting.pages,
            cpm_value: setting.cpm,
            multiplier: setting.multiplier,
            description: `${setting.pages} page${setting.pages > 1 ? 's' : ''}`,
            created_at: getISTISOString(),
            updated_at: getISTISOString()
          });

        if (error) {
          console.error(`Error creating CPM setting for ${setting.pages} pages:`, error);
        }
      }
      console.log('Default CPM settings created');
    } else {
      console.log('CPM settings already exist, skipping creation');
    }

    console.log('Admin settings check completed');
  } catch (err) {
    console.error('Error checking admin settings:', err);
  }
}; 