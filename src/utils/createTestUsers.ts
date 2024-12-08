import { supabase } from "@/integrations/supabase/client";

const travelStyles = ['backpacker', 'luxury', 'adventure', 'cultural', 'relaxation'];
const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Portuguese', 'Italian'];
const interests = [
  'hiking', 'photography', 'food', 'culture', 'history', 'architecture', 'museums', 
  'beaches', 'mountains', 'cities', 'nature', 'wildlife', 'art', 'music', 'festivals'
];
const destinations = [
  'Japan', 'Italy', 'France', 'Spain', 'Thailand', 'New Zealand', 'Brazil', 
  'Morocco', 'Iceland', 'Greece', 'Vietnam', 'Peru', 'Australia', 'India'
];

const getRandomItems = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomAge = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createUserWithProfile = async (email: string, profile: any) => {
  try {
    console.log(`Attempting to create/update user with email: ${email}`);
    
    // Try to sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: {
        data: {
          full_name: profile.full_name
        }
      }
    });

    let userId;

    if (authError) {
      // Check if error is due to existing user
      if (authError.message === "User already registered") {
        console.log(`User ${email} already exists, proceeding with profile update...`);
        // Get existing user data
        const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123',
        });

        if (signInError) {
          console.error('Error signing in existing user:', signInError);
          throw signInError;
        }

        userId = userData.user?.id;
      } else {
        console.error('Auth error:', authError);
        throw authError;
      }
    } else {
      userId = authData.user?.id;
      console.log(`Created new auth user ${email} with ID ${userId}`);
    }

    if (!userId) {
      throw new Error('No user ID available for profile update');
    }

    // Wait a bit to ensure the trigger has time to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the profile with additional data
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw profileError;
    }

    console.log(`Updated profile for ${email}`);
    return userId;
  } catch (error) {
    console.error(`Error creating/updating user ${email}:`, error);
    throw error;
  }
};

const testUsers = [
  {
    email: 'test.user1@example.com',
    profile: {
      full_name: 'Alex Thompson',
      age: getRandomAge(25, 35),
      location: 'London, UK',
      bio: 'Adventure seeker with a passion for photography',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 3),
      interests: getRandomItems(interests, 5),
      preferred_destinations: getRandomItems(destinations, 4),
      gender: 'other',
      preferred_gender: ['male', 'female', 'other']
    }
  },
  {
    email: 'test.user2@example.com',
    profile: {
      full_name: 'Maria Garcia',
      age: getRandomAge(28, 38),
      location: 'Barcelona, Spain',
      bio: 'Cultural explorer and foodie',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 3),
      interests: getRandomItems(interests, 5),
      preferred_destinations: getRandomItems(destinations, 4),
      gender: 'female',
      preferred_gender: ['male']
    }
  },
  {
    email: 'test.user3@example.com',
    profile: {
      full_name: 'James Wilson',
      age: getRandomAge(23, 33),
      location: 'Sydney, Australia',
      bio: 'Backpacker seeking authentic experiences',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 2),
      interests: getRandomItems(interests, 4),
      preferred_destinations: getRandomItems(destinations, 3),
      gender: 'male',
      preferred_gender: ['female']
    }
  }
];

export const createTestUsers = async () => {
  console.log('Starting to create test users...');
  
  for (const user of testUsers) {
    try {
      await createUserWithProfile(user.email, user.profile);
    } catch (error) {
      console.error(`Failed to create test user ${user.email}:`, error);
    }
  }

  console.log('Finished creating test users');
};