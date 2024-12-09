import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Anna K.",
    location: "Hiking in Patagonia",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "Found my perfect hiking buddy through WanderMatch! We've explored trails across South America together."
  },
  {
    name: "James R.",
    location: "Backpacking in Southeast Asia",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote: "The app made it so easy to connect with fellow travelers. Made lifelong friends during my Asia trip!"
  },
  {
    name: "Sofia M.",
    location: "Road Trip in Iceland",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote: "Thanks to WanderMatch, I found the perfect travel companion for my Iceland adventure."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">
          What Our Travelers Say
        </h2>
        
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="object-cover" />
                </Avatar>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <img src={testimonial.image} alt={testimonial.name} className="object-cover" />
                      </Avatar>
                      <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;