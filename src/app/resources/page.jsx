"use client"; 
import { BookOpen, AppWindow, Users, ArrowRight } from "lucide-react"; 
import Footer from "../../components/home/Footer";
// --- Resource Card Component --- 
const ResourceCard = ({ imageUrl, category, title, description, link }) => ( 
  <a href={link} target="_blank" rel="noopener noreferrer" className="block group"> 
    <div className="relative overflow-hidden rounded-xl shadow-lg h-64"> 
      <img  
        src={imageUrl}  
        alt={title}  
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      /> 
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div> 
      <div className="absolute bottom-0 left-0 p-6"> 
        <span className="text-sm font-semibold text-white bg-blue-600 px-3 py-1 rounded-full">{category}</span> 
        <h3 className="mt-2 text-2xl font-bold text-white">{title}</h3> 
      </div> 
    </div> 
    <div className="bg-white p-6 rounded-b-xl shadow-lg"> 
      <p className="text-gray-600 mb-4">{description}</p> 
      <span className="font-semibold text-blue-600 flex items-center group-hover:underline"> 
        Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> 
      </span> 
    </div> 
  </a> 
); 

// --- Main Resources Page Component --- 
export default function ResourcesPage() { 
  const resources = [ 
    { 
      imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2950&auto=format&fit=crop", 
      category: "Recommended Reading", 
      title: "Driven to Distraction", 
      description: "An essential guide to understanding ADHD, co-authored by Dr. Edward M. Hallowell and Dr. John J. Ratey.", 
      link: "https://www.amazon.com/Driven-Distraction-Revised-Recognizing-Attention/dp/0307743152", 
    }, 
    { 
      imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb1557172?q=80&w=2940&auto=format&fit=crop", 
      category: "Helpful Tools", 
      title: "Todoist", 
      description: "A powerful to-do list and task manager that helps you organize your work and life, perfect for managing ADHD.", 
      link: "https://todoist.com/", 
    }, 
    { 
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop", 
      category: "Community Support", 
      title: "ADHD Subreddit", 
      description: "A large and active online community on Reddit where individuals share experiences, advice, and support.", 
      link: "https://www.reddit.com/r/ADHD/", 
    }, 
    { 
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2940&auto=format&fit=crop", 
      category: "Recommended Reading", 
      title: "ADDitude Magazine", 
      description: "A leading publication offering strategies and support for adults and children with ADHD and related conditions.", 
      link: "https://www.additudemag.com/", 
    }, 
    { 
      imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2874&auto=format&fit=crop", 
      category: "Helpful Tools", 
      title: "Calm App", 
      description: "An award-winning app for meditation and sleep, helping to reduce anxiety and improve focus.", 
      link: "https://www.calm.com/", 
    }, 
    { 
      imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop", 
      category: "Community Support", 
      title: "CHADD", 
      description: "Children and Adults with Attention-Deficit/Hyperactivity Disorder (CHADD) is a national non-profit organization.", 
      link: "https://chadd.org/", 
    }, 
  ]; 

  return ( 
    <div className="bg-gray-50"> 
      {/* --- Hero Section --- */} 
      <div className="relative h-[60vh] flex items-center justify-center text-center text-white"> 
        <div className="absolute inset-0 z-0"> 
          <img  
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2940&auto=format&fit=crop"  
            alt="Empowering individual looking out over a calm landscape"  
            className="w-full h-full object-cover" 
          /> 
          <div className="absolute inset-0 bg-black/50"></div> 
        </div> 
        <div className="relative z-10 px-4 animate-fadeIn"> 
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight"> 
            Empower Your Journey 
          </h1> 
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200"> 
            Explore our curated collection of tools, communities, and literature to support your path to clarity and focus. 
          </p> 
        </div> 
      </div> 

      {/* --- Resources Grid Section --- */} 
      <div className="py-24"> 
        <div className="max-w-7xl mx-auto px-4"> 
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Curated Resources for You</h2> 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"> 
            {resources.map((resource, index) => ( 
              <ResourceCard key={index} {...resource} /> 
            ))} 
          </div> 
        </div> 
      </div> 

      {/* --- Newsletter CTA Section --- */} 
      <div className="bg-white py-20"> 
        <div className="max-w-4xl mx-auto text-center px-4"> 
          <h2 className="text-3xl font-extrabold text-gray-900"> 
            Stay Inspired & Informed 
          </h2> 
          <p className="mt-4 text-lg text-gray-600"> 
            Subscribe to our newsletter for the latest articles, tips, and success stories delivered right to your inbox. 
          </p> 
          <form className="mt-8 flex flex-col md:flex-row justify-center max-w-lg mx-auto gap-4"> 
            <input  
              type="email"  
              placeholder="Enter your email address"  
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            /> 
            <button  
              type="submit"  
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors" 
            > 
              Subscribe 
            </button> 
          </form> 
        </div> 
      </div> 
      <Footer />
    </div> 
  ); 
}
