import Header from '../Header';

export default function HeaderExample() {
  // Mock user data
  const mockUser = {
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    subscriptionTier: "premium"
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">Authenticated User - Premium</h3>
        <Header 
          user={mockUser}
          onLogout={() => console.log("Logout clicked")}
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Authenticated User - Free</h3>
        <Header 
          user={{...mockUser, subscriptionTier: "free"}}
          onLogout={() => console.log("Logout clicked")}
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Not Authenticated</h3>
        <Header />
      </div>
    </div>
  );
}