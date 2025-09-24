import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, X } from "lucide-react";

interface SubscriptionCardProps {
  onUpgrade?: () => void;
  currentTier?: "free" | "premium" | "yearly";
}

export default function SubscriptionCard({ onUpgrade, currentTier = "free" }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    console.log("Upgrade to premium triggered");
    onUpgrade?.();
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const freeFeatures = [
    "Access to 10 practice questions",
    "Basic progress tracking",
    "Category selection",
    "Answer explanations"
  ];

  const premiumFeatures = [
    "Access to 2,800+ practice questions",
    "Unlimited mock exams with timers",
    "Detailed analytics and insights",
    "Performance tracking by category",
    "Weakness identification",
    "Spaced repetition algorithm",
    "Offline question download",
    "Priority support"
  ];

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Unlock your full potential with our comprehensive medical exam preparation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className={`relative ${currentTier === "free" ? "ring-2 ring-primary" : ""}`}>
          {currentTier === "free" && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              Current Plan
            </Badge>
          )}
          
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Free</CardTitle>
            <div className="text-3xl font-bold">€0<span className="text-sm font-normal">/month</span></div>
            <p className="text-sm text-muted-foreground">Perfect for getting started</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={currentTier === "free"}
              data-testid="button-free-plan"
            >
              {currentTier === "free" ? "Current Plan" : "Get Started Free"}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative border-primary ${currentTier === "premium" ? "ring-2 ring-primary" : ""}`}>
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
            {currentTier === "premium" ? "Current Plan" : "Most Popular"}
          </Badge>
          
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              Premium
              <Star className="h-5 w-5 text-primary" />
            </CardTitle>
            <div className="text-3xl font-bold">
              €55<span className="text-sm font-normal">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">Everything you need to succeed</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={isLoading || currentTier === "premium"}
              data-testid="button-premium-upgrade"
            >
              {isLoading ? "Processing..." : 
               currentTier === "premium" ? "Current Plan" : "Upgrade to Premium"}
            </Button>
            
            {currentTier === "free" && (
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No hidden fees.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card className={`relative border-primary ${currentTier === "yearly" ? "ring-2 ring-primary" : ""}`}>
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
            {currentTier === "yearly" ? "Current Plan" : "Best Value"}
          </Badge>
          
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              Premium Yearly
              <Crown className="h-5 w-5 text-green-600" />
            </CardTitle>
            <div className="text-3xl font-bold">
              €270<span className="text-sm font-normal">/year</span>
            </div>
            <div className="text-sm text-green-600 font-medium">
              Save €390 per year
            </div>
            <p className="text-sm text-muted-foreground">Best value for serious students</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={isLoading || currentTier === "yearly"}
              data-testid="button-yearly-upgrade"
            >
              {isLoading ? "Processing..." : 
               currentTier === "yearly" ? "Current Plan" : "Get Yearly Plan"}
            </Button>
            
            {currentTier === "free" && (
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. 14-day money back guarantee.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Premium</th>
                  <th className="text-center py-3 px-4">Yearly</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-3 px-4">Practice Questions</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">2,800+</td>
                  <td className="text-center py-3 px-4">2,800+</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Mock Exams</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /> Unlimited</td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /> Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Detailed Analytics</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Offline Access</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Priority Support</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Annual Savings</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">€390</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {(currentTier === "premium" || currentTier === "yearly") && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Crown className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-1">You're all set!</h3>
            <p className="text-sm text-green-700">
              You have full access to all premium features. Happy studying!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}