import SubscriptionCard from '../SubscriptionCard';

export default function SubscriptionCardExample() {
  const handleUpgrade = () => {
    console.log("Upgrade to premium clicked");
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="mb-4 text-lg font-medium">Free User View</h3>
        <SubscriptionCard 
          onUpgrade={handleUpgrade}
          currentTier="free"
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Premium User View</h3>
        <SubscriptionCard 
          onUpgrade={handleUpgrade}
          currentTier="premium"
        />
      </div>
    </div>
  );
}