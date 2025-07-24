const supabase = require('../utils/supabase');
const adminSettingsController = require('./adminSettingsController');
const { getISTISOString, getISTDateString } = require('../utils/dateUtils');

// controllers/linkController.js
exports.createLink = async (req, res, next) => {
  try {
    // console.log('[Backend] createLink payload:', req.body);

    const { url, originalUrl, expiryDate, pages } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Check if custom alias already exists
    if (url) {
      const { data: existingLink } = await supabase
        .from('links')
        .select('id')
        .eq('url', url)
        .single();

      if (existingLink) {
        return res.status(400).json({ error: 'Custom alias already exists' });
      }
    }

    const shortCode = url || Math.random().toString(36).substring(2, 8);
    // console.log('[Backend] Using shortCode:', shortCode);

    // Get CPM from admin settings
    const pagesValue = pages || 4;
    const cpmData = await adminSettingsController.getCpmForPages(pagesValue);
    const cpm = cpmData.cpm;
    const createdAtIST = getISTISOString();

    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: userId,
        url: shortCode,
        originalurl: originalUrl,
        expirydate: expiryDate || null,
        pages: pages || 4,
        cpm: cpm || 160,
        clicks: 0,
        earnings: 0,
        createdat: createdAtIST,  // Use IST time
        status: 'active'  // Set initial status as active
      }])
      .select();

    if (error) {
      console.error('[Backend] Supabase insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data || !data.length) {
      console.error('[Backend] No data returned after insert');
      return res.status(500).json({ error: 'Insert succeeded but no row returned' });
    }

    // console.log('[Backend] Inserted row:', data[0]);
    return res.json(data[0]);
  } catch (err) {
    console.error('[Backend] Unexpected error:', err);
    next(err);
  }
};

// Track link view and calculate earnings
exports.trackLinkView = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    // console.log('Tracking view for link:', linkId);
    // console.log('User agent:', userAgent);
    // console.log('IP address:', ipAddress);

    // First, check if this is a unique view (same IP + user agent combination)
    const { data: existingView, error: checkError } = await supabase
      .from('link_views')
      .select('id')
      .eq('link_id', linkId)
      .eq('ip_address', ipAddress)
      .eq('user_agent', userAgent)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing view:', checkError);
      return res.status(500).json({ error: 'Failed to check view' });
    }

    // If view already exists, just return success
    if (existingView) {
      // console.log('View already exists for this IP + user agent combination');
      return res.json({ message: 'View tracked (duplicate)', isUnique: false });
    }

    // Get link details for earnings calculation
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (linkError || !link) {
      // console.error('Link not found:', linkError);
      return res.status(404).json({ error: 'Link not found' });
    }

    // Insert the view
    const { data: viewData, error: insertError } = await supabase
      .from('link_views')
      .insert([{
        link_id: linkId,
        user_agent: userAgent,
        ip_address: ipAddress,
        viewed_at: getISTISOString()
      }])
      .select();

    if (insertError) {
      console.error('Error inserting view:', insertError);
      return res.status(500).json({ error: 'Failed to track view' });
    }

    // Calculate earnings (CPM / 1000 * 1 view)
    const earningsPerView = (link.cpm / 1000);
    
    // Update link clicks and earnings
    const { error: updateError } = await supabase
      .from('links')
      .update({
        clicks: link.clicks + 1,
        earnings: link.earnings + earningsPerView
      })
      .eq('id', linkId);

    if (updateError) {
      console.error('Error updating link stats:', updateError);
      // Don't fail the request, just log the error
    }

    // Handle referral earnings (5% of earnings goes to referrer)
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('referred_by')
        .eq('id', link.user_id)
        .single();

      if (!userError && user && user.referred_by) {
        // Get referral percentage from admin settings
        const referralPercentage = await adminSettingsController.getReferralPercentage();
        const referralEarnings = earningsPerView * (referralPercentage / 100);
        console.log('Processing referral earnings:', {
          referrerId: user.referred_by,
          referredUserId: link.user_id,
          earningsPerView,
          referralEarnings
        });
        
        // First, get current referral record
        const { data: currentReferral, error: fetchError } = await supabase
          .from('referrals')
          .select('earnings_amount, total_referred_earnings')
          .eq('referrer_id', user.referred_by)
          .eq('referred_user_id', link.user_id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching current referral:', fetchError);
        } else {
          // Calculate new values
          const currentEarnings = currentReferral?.earnings_amount || 0;
          const currentTotal = currentReferral?.total_referred_earnings || 0;
          const newEarnings = currentEarnings + referralEarnings;
          const newTotal = currentTotal + earningsPerView;

          console.log('Referral earnings calculation:', {
            currentEarnings,
            currentTotal,
            newEarnings,
            newTotal
          });

          // Update referral earnings in referrals table
          const { error: referralError } = await supabase
            .from('referrals')
            .upsert({
              referrer_id: user.referred_by,
              referred_user_id: link.user_id,
              earnings_amount: newEarnings,
              total_referred_earnings: newTotal
            }, {
              onConflict: 'referrer_id,referred_user_id'
            });

          if (referralError) {
            console.error('Error updating referral earnings:', referralError);
          } else {
            console.log('Referral earnings updated successfully:', {
              referrerId: user.referred_by,
              referredUserId: link.user_id,
              earningsAdded: referralEarnings,
              totalEarnings: newEarnings
            });
          }

          // Log individual referral earning for withdrawal tracking
          const { error: logError } = await supabase
            .from('referral_earnings_log')
            .insert({
              referrer_id: user.referred_by,
              referred_user_id: link.user_id,
              amount: referralEarnings,
              source_link_id: link.id,
              earned_at: getISTISOString()
            });

          if (logError) {
            console.error('Error logging referral earning:', logError);
          } else {
            console.log('Referral earning logged for withdrawal tracking:', {
              referrerId: user.referred_by,
              referredUserId: link.user_id,
              amount: referralEarnings,
              sourceLinkId: link.id
            });
          }
        }

        // Also ensure the referred user is in the referrer's referred_users array
        const { data: referrer, error: referrerError } = await supabase
          .from('users')
          .select('referred_users')
          .eq('id', user.referred_by)
          .single();

        if (!referrerError && referrer) {
          const referredUsers = referrer.referred_users || [];
          if (!referredUsers.includes(link.user_id)) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                referred_users: [...referredUsers, link.user_id]
              })
              .eq('id', user.referred_by);

            if (updateError) {
              console.error('Error updating referred_users array:', updateError);
            }
          }
        }
      }
    } catch (referralErr) {
      console.error('Error processing referral earnings:', referralErr);
      // Don't fail the main request if referral processing fails
    }

    // console.log('View tracked successfully. Earnings added:', earningsPerView);
    res.json({ 
      message: 'View tracked successfully', 
      isUnique: true,
      earningsAdded: earningsPerView
    });
  } catch (err) {
    console.error('Error in trackLinkView:', err);
    next(err);
  }
};

exports.getLinks = async (req, res, next) => {
  try {
    // console.log('getLinks called for user:', req.user.id);
    // Fetch all links for user
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', req.user.id)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Error in getLinks:', error);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    res.json(links);
  } catch (err) { 
    console.error('getLinks error:', err);
    next(err); 
  }
};

exports.updateLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { originalurl, expirydate, pages, status } = req.body;
    
    // console.log('Updating link:', { id, originalurl, expirydate, pages, status });
    
    // Validate required fields
    if (!originalurl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Update the link
    const { data, error } = await supabase
      .from('links')
      .update({
        originalurl,
        expirydate: expirydate || null,
        pages: pages || 4,
        status: status || 'active'
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Link not found' });
    }

    //  console.log('Link updated successfully:', data);
    res.json(data);
  } catch (err) {
    console.error('Update link error:', err);
    next(err);
  }
};

exports.deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // console.log('Deleting link:', id);
    
    // Check if link exists and belongs to user
    const { data: existingLink, error: checkError } = await supabase
      .from('links')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (checkError || !existingLink) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Delete the link
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Error deleting link:', error);
      return res.status(500).json({ error: error.message });
    }

    // console.log('Link deleted successfully');
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    console.error('Delete link error:', err);
    next(err);
  }
};

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;
    
    // Get link details first
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (linkError || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Get views grouped by day
    const { data: views, error } = await supabase
      .from('link_views')
      .select('viewed_at')
      .eq('link_id', linkId)
      .order('viewed_at', { ascending: true });

    if (error) {
      console.error('Error fetching views:', error);
      return res.status(500).json({ error: error.message });
    }

    // Group by day and calculate daily stats
    const daily = {};
    views.forEach(view => {
      const day = view.viewed_at.split('T')[0];
      if (!daily[day]) {
        daily[day] = { 
          clicks: 0, 
          earnings: 0,
          date: day
        };
      }
      daily[day].clicks += 1;
      daily[day].earnings += (link.cpm / 1000); // CPM / 1000 per view
    });

    // Convert to array and sort by date
    const dailyArray = Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate total stats
    const totalClicks = views.length;
    const totalEarnings = totalClicks * (link.cpm / 1000);

    res.json({
      link: {
        id: link.id,
        url: link.url,
        originalurl: link.originalurl,
        cpm: link.cpm,
        pages: link.pages
      },
      totalClicks,
      totalEarnings,
      daily: dailyArray
    });
  } catch (err) {
    console.error('Error in getLinkAnalytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if alias is available
exports.checkAlias = async (req, res, next) => {
  try {
    const { alias } = req.query;
    
    if (!alias) {
      return res.status(400).json({ error: 'Alias parameter is required' });
    }

    // console.log('Checking alias availability for:', alias);

    // Check if alias already exists in links table url column
    const { data: existingLinks, error } = await supabase
      .from('links')
      .select('id, url')
      .eq('url', alias);

    if (error) {
      console.error('Error checking alias:', error);
      return res.status(500).json({ error: 'Failed to check alias availability' });
    }

    const isAvailable = existingLinks.length === 0;
    
    //    console.log('Alias check result:', {
    //   alias,
    //   foundLinks: existingLinks.length,
    //   isAvailable
    // });
    
    res.json({ 
      alias,
      available: isAvailable,
      message: isAvailable ? 'Alias is available' : 'Alias is already taken',
      foundCount: existingLinks.length
    });
  } catch (err) {
    // console.error('Error in checkAlias:', err);
    next(err);
  }
};

// Update expired links status in database
const updateExpiredLinksInDB = async () => {
  try {
    const currentDate = getISTDateString(); // Get current date in YYYY-MM-DD format
    
    // console.log('Checking for expired links on:', currentDate);
    
    // First, let's check what links exist and their current status
    const { data: allLinks, error: fetchError } = await supabase
      .from('links')
      .select('id, url, expirydate, status');

    if (fetchError) {
      console.error('Error fetching all links:', fetchError);
      return;
    }

    // console.log('All links in database:', allLinks);
    
    // Find all links that have expired but status is not 'expired'
    const { data: expiredLinks, error } = await supabase
      .from('links')
      .select('id, url, expirydate, status')
      .lt('expirydate', currentDate)
      .neq('status', 'expired');

    if (error) {
      console.error('Error fetching expired links:', error);
      return;
    }

    // console.log('Expired links found:', expiredLinks);

    if (expiredLinks && expiredLinks.length > 0) {
      // console.log(`Found ${expiredLinks.length} expired links to update`);
      
      // Update status to 'expired' for all expired links
      const { data: updateResult, error: updateError } = await supabase
        .from('links')
        .update({ status: 'expired' })
        .lt('expirydate', currentDate)
        .neq('status', 'expired')
        .select();

      if (updateError) {
        console.error('Error updating expired links:', updateError);
      } else {
        // console.log(`Successfully updated ${expiredLinks.length} links to expired status`);
        // console.log('Update result:', updateResult);
      }
    } else {
      // console.log('No expired links found');
    }
  } catch (err) {
    console.error('Error in updateExpiredLinksInDB:', err);
  }
};

// Get links with automatic database status update
exports.getLinksWithStatus = async (req, res, next) => {
  try {
    // console.log('Fetching links for user:', req.user.id);
    
    // First, update any expired links in the database
    await updateExpiredLinksInDB();
    
    // Then fetch all links for user with updated status
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', req.user.id)
      .order('createdat', { ascending: false });

    if (error) {
      // console.error('Error fetching links:', error);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    // console.log('Found links:', links);
    
    // Transform the data to include computed fields
    const transformedLinks = links.map(link => ({
      id: link.id,
      url: link.url,
      originalurl: link.originalurl,
      clicks: link.clicks || 0,
      earnings: link.earnings || 0,
      status: link.status || 'active',
      createdat: link.createdat,
      expirydate: link.expirydate,
      pages: link.pages,
      cpm: link.cpm,
      user_id: link.user_id
    }));

    res.json(transformedLinks);
  } catch (err) {
    console.error('Error in getLinksWithStatus:', err);
    next(err);
  }
};

// Get link by short url (public)
exports.getLinkByUrl = async (req, res) => {
  try {
    const { url } = req.params;
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('url', url)
      .single();

    if (error || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Optionally, check for expiry and update status
    if (link.expirydate && new Date(link.expirydate) < new Date()) {
      if (link.status !== 'expired') {
        await supabase.from('links').update({ status: 'expired' }).eq('id', link.id);
      }
      link.status = 'expired';
    }

    res.json(link);
  } catch (err) {
    console.error('Error in getLinkByUrl:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 