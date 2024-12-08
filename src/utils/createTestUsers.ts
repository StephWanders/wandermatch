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
const locations = [
  'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France', 'Sydney, Australia',
  'Berlin, Germany', 'Toronto, Canada', 'Barcelona, Spain', 'Amsterdam, Netherlands',
  'Singapore'
];
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Alexander', 'Amelia'
];
const lastNames = [
  'Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Anderson', 'Wilson',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'
];

const getRandomItems = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomAge = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generateRandomProfile = () => {
  const fullName = getRandomName();
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  
  return {
    full_name: fullName,
    age: getRandomAge(21, 45),
    location: locations[Math.floor(Math.random() * locations.length)],
    bio: `Travel enthusiast looking for amazing adventures! Love exploring new places and meeting new people.`,
    travel_style: travelStyles[Math.floor(Math.random() * travelStyles.length)],
    languages: getRandomItems(languages, Math.floor(Math.random() * 3) + 1),
    interests: getRandomItems(interests, Math.floor(Math.random() * 5) + 3),
    preferred_destinations: getRandomItems(destinations, Math.floor(Math.random() * 4) + 2),
    gender,
    preferred_gender: gender === 'male' ? ['female'] : ['male'],
    email_verified: true
  };
};

const createUserWithProfile = async (index: number) => {
  try {
    const email = `test.user${index}@example.com`;
    const password = 'password123';
    const profile = generateRandomProfile();
    
    console.log(`Creating user ${index + 1}: ${email}`);

    // Try to sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profile.full_name
        }
      }
    });

    if (authError) {
      if (authError.message === "User already registered") {
        console.log(`User ${email} already exists, skipping...`);
        return null;
      }
      throw authError;
    }

    const userId = authData.user?.id;
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

    console.log(`Created user ${index + 1} successfully: ${email}`);
    return userId;
  } catch (error) {
    console.error(`Error creating user ${index + 1}:`, error);
    return null;
  }
};

export const createTestUsers = async () => {
  console.log('Starting to create 5 test users...');
  
  const creationPromises = Array.from({ length: 5 }, (_, i) => createUserWithProfile(i));
  const results = await Promise.all(creationPromises);
  
  const successCount = results.filter(Boolean).length;
  console.log(`Finished creating test users. Successfully created: ${successCount}`);
  
  return successCount;
};