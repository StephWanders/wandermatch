import { supabase } from "@/integrations/supabase/client";

const travelStyles = ['backpacker', 'luxury', 'adventure', 'cultural', 'relaxation'];
const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Portuguese', 'Italian'];
const interests = [
  'hiking', 'photography', 'food', 'culture', 'history', 'architecture', 'museums', 
  'beaches', 'mountains', 'cities', 'nature', 'wildlife', 'art', 'music', 'festivals',
  'local markets', 'adventure sports', 'yoga', 'meditation', 'cooking'
];
const destinations = [
  'Japan', 'Italy', 'France', 'Spain', 'Thailand', 'New Zealand', 'Brazil', 
  'Morocco', 'Iceland', 'Greece', 'Vietnam', 'Peru', 'Australia', 'India', 
  'South Africa', 'Canada', 'Portugal', 'Croatia', 'Mexico', 'Switzerland'
];

const getRandomItems = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomAge = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const testUsers = [
  {
    email: 'alice.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Alice Chen',
      age: getRandomAge(25, 35),
      location: 'San Francisco, USA',
      bio: 'Adventure seeker with a passion for capturing moments through my lens. Always ready for the next expedition!',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 3),
      interests: getRandomItems(interests, 5),
      preferred_destinations: getRandomItems(destinations, 4),
      gender: 'female',
      preferred_gender: ['male', 'female']
    }
  },
  {
    email: 'marco.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Marco Silva',
      age: getRandomAge(28, 38),
      location: 'Barcelona, Spain',
      bio: 'Cultural explorer and foodie. Living life one destination at a time. Let\'s share travel stories!',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 4),
      interests: getRandomItems(interests, 6),
      preferred_destinations: getRandomItems(destinations, 5),
      gender: 'male',
      preferred_gender: ['female']
    }
  },
  {
    email: 'sophie.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Sophie Martin',
      age: getRandomAge(23, 30),
      location: 'Paris, France',
      bio: 'Luxury travel enthusiast with a love for art and fine dining. Always seeking unique experiences.',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 2),
      interests: getRandomItems(interests, 4),
      preferred_destinations: getRandomItems(destinations, 3),
      gender: 'female',
      preferred_gender: ['male']
    }
  },
  {
    email: 'alex.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Alex Thompson',
      age: getRandomAge(27, 37),
      location: 'London, UK',
      bio: 'Digital nomad and backpacker. Finding beauty in off-the-beaten-path destinations.',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 3),
      interests: getRandomItems(interests, 5),
      preferred_destinations: getRandomItems(destinations, 4),
      gender: 'other',
      preferred_gender: ['male', 'female', 'other']
    }
  },
  {
    email: 'yuki.test@example.com',
    password: 'password123',
    profile: {
      full_name: 'Yuki Tanaka',
      age: getRandomAge(24, 32),
      location: 'Tokyo, Japan',
      bio: 'Seeking authentic experiences through travel. Love connecting with fellow adventurers!',
      travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
      languages: getRandomItems(languages, 3),
      interests: getRandomItems(interests, 5),
      preferred_destinations: getRandomItems(destinations, 4),
      gender: 'female',
      preferred_gender: ['female']
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