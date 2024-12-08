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
      languages: ['English', 'Mandarin'],
      interests: ['hiking', 'photography', 'food', 'culture'],
      preferred_destinations: ['Japan', 'New Zealand', 'Thailand'],
      gender: 'female',
      preferred_gender: ['male', 'female']
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
      languages: ['English', 'Spanish', 'Portuguese'],
      interests: ['food', 'history', 'architecture', 'museums'],
      preferred_destinations: ['Italy', 'France', 'Portugal'],
      gender: 'male',
      preferred_gender: ['female']
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
      languages: ['French', 'English'],
      interests: ['art', 'fine dining', 'shopping', 'wine tasting'],
      preferred_destinations: ['Maldives', 'Dubai', 'Switzerland'],
      gender: 'female',
      preferred_gender: ['male']
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
      languages: ['English', 'German'],
      interests: ['backpacking', 'hostels', 'street food', 'hiking'],
      preferred_destinations: ['Vietnam', 'Cambodia', 'Peru'],
      gender: 'other',
      preferred_gender: ['male', 'female', 'other']
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
      languages: ['Japanese', 'English'],
      interests: ['temples', 'nature', 'city exploration', 'traditional arts'],
      preferred_destinations: ['South Korea', 'Taiwan', 'Australia'],
      gender: 'female',
      preferred_gender: ['female']
    }
  }
];

export const createTestUsers = async () => {
  console.log('Starting to create test users...');
  
  for (const user of testUsers) {
    try {
      // First create the user
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

      // Then call our function to insert the profile
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