import { useState } from 'react';
import menuData from '../../data/menu.json';
import { MenuItem as MenuItemType } from '../../types';
import MenuItem from './MenuItem';
import ItemDetailModal from './ItemDetailModal';

interface MenuProps {
  onGoToCart: () => void;
}

const Menu = ({ onGoToCart }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  const categories = [
    { id: 'all', name: '全部' },
    ...menuData.categories,
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuData.items
    : menuData.items.filter(item => item.categoryId === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl">目前沒有可供應的餐點</p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={() => {
            setSelectedItem(null);
            // 可選：自動跳轉到購物車或顯示提示
          }}
        />
      )}
    </div>
  );
};

export default Menu;
