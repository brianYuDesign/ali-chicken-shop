import { MenuItem as MenuItemType } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
  onClick: () => void;
}

const MenuItem = ({ item, onClick }: MenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-lg transition-shadow ${
        !item.available ? 'opacity-50' : ''
      }`}
    >
      {/* Item Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center text-6xl">
        {item.categoryId === 'fried-chicken' && '🍗'}
        {item.categoryId === 'side-dishes' && '🍟'}
        {item.categoryId === 'beverages' && '🥤'}
      </div>

      {/* Item Info */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          {!item.available && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              售完
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price}
          </span>
          <button
            disabled={!item.available}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {item.available ? '加入購物車' : '已售完'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
