import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface MealType {
  id: string;
  name: string;
  display_order: number;
}

interface MealTypesModalProps {
  coupleId: string;
  onClose: () => void;
  onSave: () => void;
}

export const MealTypesModal: React.FC<MealTypesModalProps> = ({ coupleId, onClose, onSave }) => {
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMealTypes();
  }, [coupleId]);

  const fetchMealTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meal_types')
      .select('*')
      .eq('couple_id', coupleId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching meal types:', error);
    } else if (data) {
      setMealTypes(data.map((mt: any) => ({
        id: mt.id,
        name: mt.name,
        display_order: mt.display_order
      })));
    }

    if (!data || data.length === 0) {
      const defaultMealTypes = [
        'Chicken',
        'Fish',
        'Beef',
        'Vegetarian',
        'Vegan',
        'Child Meal'
      ];
      setMealTypes(defaultMealTypes.map((name, index) => ({
        id: `temp-${index}`,
        name,
        display_order: index
      })));
    }
    setLoading(false);
  };

  const handleAddMealType = () => {
    if (mealTypes.length >= 10) {
      alert('Maximum of 10 meal types allowed');
      return;
    }
    setMealTypes([...mealTypes, {
      id: `temp-${Date.now()}`,
      name: '',
      display_order: mealTypes.length
    }]);
  };

  const handleUpdateMealType = (index: number, name: string) => {
    const updated = [...mealTypes];
    updated[index] = { ...updated[index], name };
    setMealTypes(updated);
  };

  const handleDeleteMealType = (index: number) => {
    const updated = mealTypes.filter((_, i) => i !== index);
    updated.forEach((mt, i) => {
      mt.display_order = i;
    });
    setMealTypes(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('meal_types')
        .delete()
        .eq('couple_id', coupleId);

      if (deleteError) {
        console.error('Error deleting old meal types:', deleteError);
        alert('Failed to save meal types. Please try again.');
        setSaving(false);
        return;
      }

      const validMealTypes = mealTypes.filter(mt => mt.name.trim() !== '');
      if (validMealTypes.length > 0) {
        const { error: insertError } = await supabase
          .from('meal_types')
          .insert(
            validMealTypes.map((mt, index) => ({
              couple_id: coupleId,
              name: mt.name.trim(),
              display_order: index
            }))
          );

        if (insertError) {
          console.error('Error inserting meal types:', insertError);
          alert('Failed to save meal types. Please try again.');
          setSaving(false);
          return;
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving meal types:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            Manage Meal Types
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading meal types...</div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Add up to 10 meal types. These will appear in the meal choice dropdown when adding or editing guests.
              </p>

              <div className="space-y-3">
                {mealTypes.map((mealType, index) => (
                  <div key={mealType.id} className="flex gap-2 items-center">
                    <div className="flex-shrink-0 w-8 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={mealType.name}
                      onChange={(e) => handleUpdateMealType(index, e.target.value)}
                      placeholder="Enter meal type name..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      maxLength={50}
                    />
                    <button
                      onClick={() => handleDeleteMealType(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete meal type"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              {mealTypes.length < 10 && (
                <button
                  onClick={handleAddMealType}
                  className="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-400 hover:text-primary-600 transition-colors"
                >
                  + Add Meal Type
                </button>
              )}

              {mealTypes.length >= 10 && (
                <p className="mt-4 text-sm text-amber-600 text-center">
                  Maximum of 10 meal types reached
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex gap-4 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Meal Types'}
          </button>
        </div>
      </div>
    </div>
  );
};
