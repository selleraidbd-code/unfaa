// import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
// import { Button } from "@repo/ui/components/ui/button";
// import { Input } from "@repo/ui/components/ui/input";
// import { Label } from "@repo/ui/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@repo/ui/components/ui/tabs";
// import { Textarea } from "@repo/ui/components/ui/textarea";
// import { Link, Star } from "lucide-react";
// const RatingsReviews = () => {
//   return (
//     <div className="">
//       {/* Tabs Section */}
//       <div className="mt-12">
//         <Tabs defaultValue="review">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="description">Description</TabsTrigger>
//             <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
//             <TabsTrigger value="review">Review</TabsTrigger>
//           </TabsList>
//           <TabsContent
//             value="description"
//             className="p-4 border rounded-md mt-4"
//           >
//             <h3 className="text-lg font-semibold mb-2">Product Description</h3>
//             <p className="text-muted-foreground">
//               The Water Drop BB Foundation is a revolutionary product designed
//               to provide lightweight coverage while offering skincare benefits.
//               Its oil-free formula ensures a natural, non-greasy finish, perfect
//               for all skin types. Infused with SPF 15, it protects your skin
//               from harmful UV rays, making it an ideal choice for daily wear.
//               This multi-tasking beauty essential helps to even out skin tone,
//               minimize the appearance of imperfections, and leave your skin
//               looking radiant and healthy.
//             </p>
//           </TabsContent>
//           <TabsContent
//             value="additional-info"
//             className="p-4 border rounded-md mt-4"
//           >
//             <h3 className="text-lg font-semibold mb-2">
//               Additional Information
//             </h3>
//             <ul className="list-disc pl-5 text-muted-foreground">
//               <li>
//                 Ingredients:Aqua, Cyclopentasiloxane, Titanium Dioxide,
//                 Glycerin, Ethylhexyl Methoxycinnamate, etc.
//               </li>
//               <li>Volume:200ml, 50ml, 300ml, 500ml options available</li>
//               <li>Shades:Rose Pink, Natural Beige, Warm Ivory</li>
//               <li>
//                 Application:Apply a small amount to face and blend evenly with
//                 fingertips or a brush.
//               </li>
//               <li>
//                 Storage:Store in a cool, dry place away from direct sunlight.
//               </li>
//             </ul>
//           </TabsContent>
//           <TabsContent value="review" className="p-4 border rounded-md mt-4">
//             <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>
//             <div className="flex items-center gap-2 mb-4">
//               <span className="text-2xl font-bold">5.0 / 5</span>
//               <div className="flex items-center gap-0.5">
//                 <Star className="h-5 w-5 fill-primary text-primary" />
//                 <Star className="h-5 w-5 fill-primary text-primary" />
//                 <Star className="h-5 w-5 fill-primary text-primary" />
//                 <Star className="h-5 w-5 fill-primary text-primary" />
//                 <Star className="h-5 w-5 fill-primary text-primary" />
//               </div>
//               <span className="text-muted-foreground">1 Ratings</span>
//             </div>

//             {/* Existing Reviews */}
//             <div className="grid gap-6 mb-8">
//               <div className="flex gap-4">
//                 <Avatar className="h-10 w-10">
//                   <AvatarFallback>SS</AvatarFallback>
//                 </Avatar>
//                 <div className="grid gap-1 flex-1">
//                   <div className="font-semibold">User</div>
//                   <p className="text-muted-foreground">It is good products</p>
//                   <div className="flex items-center gap-4 text-sm">
//                     <Link href="#" className="text-primary hover:underline">
//                       Reply
//                     </Link>
//                     <Link href="#" className="text-primary hover:underline">
//                       Thank you
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Add a Review Form */}
//             <h2 className="text-xl font-bold mb-4">Add a Review</h2>
//             <form className="grid gap-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="name">Your Name</Label>
//                   <Input id="name" placeholder="Your Name" />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="email">Your Email</Label>
//                   <Input id="email" type="email" placeholder="Your Email" />
//                 </div>
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="message">Message</Label>
//                 <Textarea
//                   id="message"
//                   placeholder="Write your review here..."
//                   className="min-h-[100px]"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="your-review">Your Review</Label>
//                 <RadioGroup
//                   id="your-review"
//                   defaultValue="5"
//                   className="flex items-center gap-1"
//                 >
//                   <Label htmlFor="star-1" className="cursor-pointer">
//                     <RadioGroupItem id="star-1" value="1" className="sr-only" />
//                     <Star className="h-6 w-6 fill-muted stroke-muted-foreground data-[state=checked]:fill-primary data-[state=checked]:stroke-primary" />
//                   </Label>
//                   <Label htmlFor="star-2" className="cursor-pointer">
//                     <RadioGroupItem id="star-2" value="2" className="sr-only" />
//                     <Star className="h-6 w-6 fill-muted stroke-muted-foreground data-[state=checked]:fill-primary data-[state=checked]:stroke-primary" />
//                   </Label>
//                   <Label htmlFor="star-3" className="cursor-pointer">
//                     <RadioGroupItem id="star-3" value="3" className="sr-only" />
//                     <Star className="h-6 w-6 fill-muted stroke-muted-foreground data-[state=checked]:fill-primary data-[state=checked]:stroke-primary" />
//                   </Label>
//                   <Label htmlFor="star-4" className="cursor-pointer">
//                     <RadioGroupItem id="star-4" value="4" className="sr-only" />
//                     <Star className="h-6 w-6 fill-muted stroke-muted-foreground data-[state=checked]:fill-primary data-[state=checked]:stroke-primary" />
//                   </Label>
//                   <Label htmlFor="star-5" className="cursor-pointer">
//                     <RadioGroupItem id="star-5" value="5" className="sr-only" />
//                     <Star className="h-6 w-6 fill-muted stroke-muted-foreground data-[state=checked]:fill-primary data-[state=checked]:stroke-primary" />
//                   </Label>
//                 </RadioGroup>
//               </div>
//               <Button
//                 type="submit"
//                 className="w-fit bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Submit Review
//               </Button>
//             </form>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default RatingsReviews;

export const RatingsReviews = () => {
  return <div>RatingsReviews</div>;
};
