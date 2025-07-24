-- Function to add a referred user to the referrer's referred_users array
CREATE OR REPLACE FUNCTION add_referred_user(referrer_id uuid, new_referred_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Update the referrer's referred_users array to include the new user
  UPDATE users 
  SET referred_users = array_append(referred_users, new_referred_user_id)
  WHERE id = referrer_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION add_referred_user(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION add_referred_user(uuid, uuid) TO service_role; 