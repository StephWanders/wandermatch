import { supabase } from "@/integrations/supabase/client";

const testUsers = [
  {
    email: 'alice.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Alice Chen',
      age: 28,
      location: 'San Francisco',
      bio: 'Adventure seeker looking for travel buddies! Love hiking and photography.',
      travel_style: 'adventure',
      languages: ['English', 'Mandarin'] as string[],
      interests: ['hiking', 'photography', 'food', 'culture'] as string[],
      preferred_destinations: ['Japan', 'New Zealand', 'Thailand'] as string[],
      gender: 'female',
      preferred_gender: ['male', 'female'] as string[]
    }
  },
  {
    email: 'marco.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Marco Silva',
      age: 32,
      location: 'Barcelona',
      bio: 'Cultural explorer and foodie. Always ready for the next adventure!',
      travel_style: 'cultural',
      languages: ['English', 'Spanish', 'Portuguese'] as string[],
      interests: ['food', 'history', 'architecture', 'museums'] as string[],
      preferred_destinations: ['Italy', 'France', 'Portugal'] as string[],
      gender: 'male',
      preferred_gender: ['female'] as string[]
    }
  },
  {
    email: 'sophie.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Sophie Martin',
      age: 25,
      location: 'Paris',
      bio: 'Luxury travel enthusiast with a passion for art and fine dining.',
      travel_style: 'luxury',
      languages: ['French', 'English'] as string[],
      interests: ['art', 'fine dining', 'shopping', 'wine tasting'] as string[],
      preferred_destinations: ['Maldives', 'Dubai', 'Switzerland'] as string[],
      gender: 'female',
      preferred_gender: ['male'] as string[]
    }
  },
  {
    email: 'alex.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Alex Thompson',
      age: 30,
      location: 'London',
      bio: 'Backpacker who loves meeting new people and exploring off-the-beaten-path destinations.',
      travel_style: 'backpacker',
      languages: ['English', 'German'] as string[],
      interests: ['backpacking', 'hostels', 'street food', 'hiking'] as string[],
      preferred_destinations: ['Vietnam', 'Cambodia', 'Peru'] as string[],
      gender: 'other',
      preferred_gender: ['male', 'female', 'other'] as string[]
    }
  },
  {
    email: 'yuki.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Yuki Tanaka',
      age: 27,
      location: 'Tokyo',
      bio: 'Looking for travel companions who enjoy both city life and nature retreats.',
      travel_style: 'cultural',
      languages: ['Japanese', 'English'] as string[],
      interests: ['temples', 'nature', 'city exploration', 'traditional arts'] as string[],
      preferred_destinations: ['South Korea', 'Taiwan', 'Australia'] as string[],
      gender: 'female',
      preferred_gender: ['female'] as string[]
    }
  }
];

export const createTestUsers = async () => {
  console.log('Starting to create test users...');
  
  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', user.profile.full_name)
        .single();

      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping...`);
        continue;
      }

      // Create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      });

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError);
        continue;
      }

      if (!authData.user) {
        console.error(`No user data returned for ${user.email}`);
        continue;
      }

      console.log(`Created user ${user.email} with ID ${authData.user.id}`);

      // Insert the profile
      const { error: rpcError } = await supabase.rpc('insert_test_profile', {
        user_id: authData.user.id,
        user_full_name: user.profile.full_name,
        user_age: user.profile.age,
        user_location: user.profile.location,
        user_bio: user.profile.bio,
        user_travel_style: user.profile.travel_style,
        user_languages: user.profile.languages,
        user_interests: user.profile.interests,
        user_preferred_destinations: user.profile.preferred_destinations,
        user_gender: user.profile.gender,
        user_preferred_gender: user.profile.preferred_gender
      });

      if (rpcError) {
        console.error(`Error creating profile for ${user.email}:`, rpcError);
        continue;
      }

      console.log(`Created profile for ${user.email}`);
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error);
    }
  }

  console.log('Finished creating test users');
};