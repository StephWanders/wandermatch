import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Profile pictures from Unsplash showing people (higher weight)
const personImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
];

// Profile pictures from Unsplash NOT showing people (lower weight)
const nonPersonImages = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
];

const getRandomProfileImage = (): string | null => {
  // 20% chance of no profile picture
  if (Math.random() < 0.2) return null;
  
  // 60% chance of person image, 20% chance of non-person image
  const usePersonImage = Math.random() < 0.75;
  const imageArray = usePersonImage ? personImages : nonPersonImages;
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
};

export const createTestUsers = async () => {
  try {
    console.log('Creating test users...');
    
    // Create 10 test users
    for (let i = 0; i < 10; i++) {
      const email = `test${i + 1}@example.com`;
      const password = 'testpassword123';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      
      const userId = authData.user?.id;
      if (!userId) continue;

      const profileImage = getRandomProfileImage();
      
      // Insert test profile data
      const { error: profileError } = await supabase.rpc('insert_test_profile', {
        user_id: userId,
        user_full_name: `Test User ${i + 1}`,
        user_age: 20 + Math.floor(Math.random() * 40),
        user_location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][Math.floor(Math.random() * 5)],
        user_bio: `I'm test user ${i + 1}, excited to meet new travel companions!`,
        user_travel_style: ['adventure', 'cultural', 'luxury', 'backpacker', 'relaxation'][Math.floor(Math.random() * 5)],
        user_languages: ['English', 'Spanish', 'French', 'Japanese', 'German'].slice(0, 1 + Math.floor(Math.random() * 4)),
        user_interests: ['hiking', 'photography', 'food', 'history', 'art'].slice(0, 2 + Math.floor(Math.random() * 3)),
        user_preferred_destinations: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].slice(0, 2 + Math.floor(Math.random() * 3)),
        user_gender: ['male', 'female'][Math.floor(Math.random() * 2)],
        user_preferred_gender: ['male', 'female']
      });

      if (profileError) throw profileError;

      if (profileImage) {
        const { error: pictureError } = await supabase
          .from('profile_pictures')
          .insert({
            profile_id: userId,
            image_url: profileImage,
            is_default: true
          });

        if (pictureError) throw pictureError;

        // Update profile with the image URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ profile_image_url: profileImage })
          .eq('id', userId);

        if (updateError) throw updateError;
      }
    }

    console.log('Test users created successfully');
    return true;
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
};