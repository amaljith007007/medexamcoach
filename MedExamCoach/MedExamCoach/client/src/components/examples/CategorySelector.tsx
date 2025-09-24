import CategorySelector from '../CategorySelector';

export default function CategorySelectorExample() {
  const handleCategorySelect = (categoryId: string) => {
    console.log("Selected category:", categoryId);
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="mb-4 text-lg font-medium">Premium User - All Categories</h3>
        <CategorySelector 
          onCategorySelect={handleCategorySelect}
          userTier="premium"
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">Free User - Limited Categories</h3>
        <CategorySelector 
          onCategorySelect={handleCategorySelect}
          userTier="free"
        />
      </div>
    </div>
  );
}