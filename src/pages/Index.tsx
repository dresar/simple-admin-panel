import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Porto Admin Panel
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your portfolio website with an intuitive admin dashboard. 
          Access projects, blog posts, resume, and more.
        </p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Go to Admin Panel
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
