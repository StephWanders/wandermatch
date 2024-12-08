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
      // Check if user already exists by email
      const { data: existingAuth } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (existingAuth.user) {
        console.log(`User ${user.email} already exists, updating profile...`);
        
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(user.profile)
          .eq('id', existingAuth.user.id);

        if (updateError) {
          console.error(`Error updating profile for ${user.email}:`, updateError);
        } else {
          console.log(`Updated profile for ${user.email}`);
        }
        
        continue;
      }

      // Create new user
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

      // Wait a bit to ensure the trigger has time to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update(user.profile)
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError);
        continue;
      }

      console.log(`Created/updated profile for ${user.email}`);
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error);
    }
  }

  console.log('Finished creating test users');
};