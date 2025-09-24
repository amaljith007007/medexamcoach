import Dashboard from '../Dashboard';

export default function DashboardExample() {
  // Mock user data
  const mockUserPremium = {
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    subscriptionTier: "premium"
  };

  const mockUserFree = {
    firstName: "Dr. John",
    lastName: "Smith", 
    subscriptionTier: "free"
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="mb-4 text-lg font-medium">Premium User Dashboard</h3>
        <Dashboard user={mockUserPremium} />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Free User Dashboard</h3>
        <Dashboard user={mockUserFree} />
      </div>
    </div>
  );
}