import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { Guest } from '../types';
import { formatPhoneNumber } from '../utils/phoneUtils';

interface GuestModalProps {
  guest?: Guest | null;
  onClose: () => void;
  onSave: (guest: Guest) => void;
  mealTypes?: string[];
}

const guestCategories = ['Family', 'Friends', 'Coworkers', "Groom's Side", "Bride's Side", 'Other'];
const rsvpStatuses: Guest['rsvpStatus'][] = ['Not Sent', 'Invited', 'Confirmed', 'Declined', 'Maybe'];

export const GuestModal: React.FC<GuestModalProps> = ({ guest, onClose, onSave, mealTypes = [] }) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: 'Family',
    rsvpStatus: 'Not Sent',
    responseDate: null,
    plusOneAllowed: false,
    plusOneName: '',
    numberInParty: 1,
    mealChoice: '',
    plusOneMealChoice: '',
    dietaryRestrictions: '',
    tableNumber: null,
    specialNotes: '',
    giftReceived: false,
    thankYouSent: false
  });

  const [addressFields, setAddressFields] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [mealChoices, setMealChoices] = useState<string[]>(['']);

  useEffect(() => {
    if (guest) {
      setFormData(guest);

      const addressParts = guest.address.split('|');
      if (addressParts.length === 4) {
        setAddressFields({
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          state: addressParts[2] || '',
          zipCode: addressParts[3] || ''
        });
      }

      const existingMeals = guest.mealChoice.split('|').filter(m => m);
      const partySize = guest.numberInParty || 1;
      const meals = [...existingMeals];
      while (meals.length < partySize) {
        meals.push('');
      }
      setMealChoices(meals);
    }
  }, [guest]);

  useEffect(() => {
    if (!formData.plusOneAllowed) {
      setFormData(prev => ({ ...prev, plusOneName: '', plusOneMealChoice: '' }));
    }
  }, [formData.plusOneAllowed]);

  useEffect(() => {
    const partySize = formData.numberInParty || 1;
    setMealChoices(prev => {
      const newChoices = [...prev];
      while (newChoices.length < partySize) {
        newChoices.push('');
      }
      while (newChoices.length > partySize) {
        newChoices.pop();
      }
      return newChoices;
    });
  }, [formData.numberInParty]);

  const handleAddressFieldChange = (field: keyof typeof addressFields, value: string) => {
    const newAddressFields = { ...addressFields, [field]: value };
    setAddressFields(newAddressFields);
    const combinedAddress = `${newAddressFields.street}|${newAddressFields.city}|${newAddressFields.state}|${newAddressFields.zipCode}`;
    setFormData({ ...formData, address: combinedAddress });
  };

  const handleMealChoiceChange = (index: number, value: string) => {
    const newMealChoices = [...mealChoices];
    newMealChoices[index] = value;
    setMealChoices(newMealChoices);
    setFormData({ ...formData, mealChoice: newMealChoices.join('|') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const guestData: Guest = {
      id: guest?.id || `guest-${Date.now()}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      category: formData.category || 'Other',
      rsvpStatus: formData.rsvpStatus || 'Not Sent',
      responseDate: formData.responseDate || null,
      plusOneAllowed: formData.plusOneAllowed || false,
      plusOneName: formData.plusOneName || '',
      numberInParty: formData.numberInParty || 1,
      mealChoice: formData.mealChoice || '',
      plusOneMealChoice: formData.plusOneMealChoice || '',
      dietaryRestrictions: formData.dietaryRestrictions || '',
      tableNumber: formData.tableNumber || null,
      specialNotes: formData.specialNotes || '',
      giftReceived: formData.giftReceived || false,
      thankYouSent: formData.thankYouSent || false
    };

    onSave(guestData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            {guest ? 'Edit Guest' : 'Add Guest'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="555-123-4567"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Mailing Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street
              </label>
              <input
                type="text"
                value={addressFields.street}
                onChange={(e) => handleAddressFieldChange('street', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={addressFields.city}
                  onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={addressFields.state}
                  onChange={(e) => handleAddressFieldChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="ST"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={addressFields.zipCode}
                  onChange={(e) => handleAddressFieldChange('zipCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="12345"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {guestCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center gap-1">
                  Invitation Status
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="space-y-1.5">
                        <div className="font-semibold mb-2">RSVP Status Flow:</div>
                        <div><span className="font-semibold">Not Sent:</span> Invitation not yet mailed</div>
                        <div><span className="font-semibold">Invited:</span> Invitation has been sent</div>
                        <div><span className="font-semibold">Confirmed:</span> Guest is attending</div>
                        <div><span className="font-semibold">Declined:</span> Guest cannot attend</div>
                        <div><span className="font-semibold">Maybe:</span> Guest is undecided</div>
                      </div>
                      <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </span>
              </label>
              <select
                value={formData.rsvpStatus}
                onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as Guest['rsvpStatus'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {rsvpStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plus One</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plusOneAllowed"
                  checked={formData.plusOneAllowed}
                  onChange={(e) => setFormData({ ...formData, plusOneAllowed: e.target.checked })}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                />
                <label htmlFor="plusOneAllowed" className="ml-2 text-sm text-gray-700">
                  Plus one allowed
                </label>
              </div>

              {formData.plusOneAllowed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plus One Name
                  </label>
                  <input
                    type="text"
                    value={formData.plusOneName}
                    onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Jane Smith"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number in Party
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberInParty}
                  onChange={(e) => setFormData({ ...formData, numberInParty: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal & Preferences</h3>
            <div className="space-y-4">
              {mealChoices.map((choice, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Choice - Guest {index + 1}
                  </label>
                  <select
                    value={choice}
                    onChange={(e) => handleMealChoiceChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  >
                    <option value="">Select meal...</option>
                    {mealTypes.map(meal => (
                      <option key={meal} value={meal}>{meal}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tableNumber || ''}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Table #"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Gluten-free, nut allergy, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes & Tracking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes
                </label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Any special notes or requests..."
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="giftReceived"
                    checked={formData.giftReceived}
                    onChange={(e) => setFormData({ ...formData, giftReceived: e.target.checked })}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                  <label htmlFor="giftReceived" className="ml-2 text-sm text-gray-700">
                    Gift received
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="thankYouSent"
                    checked={formData.thankYouSent}
                    onChange={(e) => setFormData({ ...formData, thankYouSent: e.target.checked })}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                  <label htmlFor="thankYouSent" className="ml-2 text-sm text-gray-700">
                    Thank you card sent
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {guest ? 'Update Guest' : 'Add Guest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
