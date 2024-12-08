import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">WanderMatch</h3>
            <p className="text-gray-400">Connect. Explore. Experience.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Safety</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <Button variant="ghost" size="icon" className="hover:text-teal-500">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-teal-500">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-teal-500">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-2">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png" 
                   alt="Download on App Store" 
                   className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                   alt="Get it on Google Play" 
                   className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WanderMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;