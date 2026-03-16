import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Vendor } from '../types';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { supabase } from '../utils/supabase';

interface VendorModalProps {
  vendor?: Vendor | null;
  onClose: () => void;
  onSave: () => void;
  coupleId: string;
}

const vendorCategories = [
  'Photography', 'Videography', 'Venue', 'Catering', 'Florist',
  'DJ/Band', 'Hair/Makeup', 'Cake', 'Rentals', 'Planner',
  'Officiant', 'Transportation', 'Other'
];

const vendorStatuses: Vendor['status'][] = ['Researching', 'Contacted', 'Booked', 'Declined'];

export const VendorModal: React.FC<VendorModalProps> = ({ vendor, onClose, onSave, coupleId }) => {
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    category: 'Photography',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    status: 'Researching',
    contractSigned: false,
    contractDate: null,
    totalAmount: 0,
    depositAmount: 0,
    depositDueDate: null,
    depositPaid: false,
    balanceDue: 0,
    finalPaymentDate: null,
    finalPaymentPaid: false,
    paymentStatus: 'Not Paid',
    notes: [],
    linkedTasks: []
  });

  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (vendor) {
      setFormData(vendor);
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let balanceDue = formData.totalAmount || 0;
    if (formData.depositPaid && formData.finalPaymentPaid) {
      balanceDue = 0;
    } else if (formData.depositPaid) {
      balanceDue = (formData.totalAmount || 0) - (formData.depositAmount || 0);
    }

    let paymentStatus: Vendor['paymentStatus'] = 'Not Paid';

    if (formData.totalAmount && formData.totalAmount > 0) {
      if (formData.finalPaymentPaid) {
        paymentStatus = 'Fully Paid';
      } else if (formData.depositPaid) {
        paymentStatus = 'Deposit Paid';
      } else {
        paymentStatus = 'Not Paid';
      }
    }

    const updatedNotes = noteText.trim()
      ? [...(formData.notes || []), { text: noteText, timestamp: new Date() }]
      : formData.notes || [];

    try {
      const vendorData = {
        couple_id: coupleId,
        name: formData.name || '',
        category: formData.category || 'Other',
        contact_name: formData.contactName || '',
        phone: formData.phone || '',
        email: formData.email || '',
        website: formData.website || '',
        address: formData.address || '',
        status: formData.status || 'Researching',
        contract_signed: formData.contractSigned || false,
        contract_date: formData.contractDate?.toISOString(),
        total_amount: formData.totalAmount || 0,
        deposit_amount: formData.depositAmount || 0,
        deposit_due_date: formData.depositDueDate?.toISOString(),
        deposit_paid: formData.depositPaid || false,
        balance_due: balanceDue,
        final_payment_date: formData.finalPaymentDate?.toISOString(),
        final_payment_paid: formData.finalPaymentPaid || false,
        payment_status: paymentStatus,
        vendor_notes: updatedNotes,
        linked_tasks: formData.linkedTasks || []
      };

      if (vendor) {
        const { error } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', vendor.id);

        if (error) {
          console.error('Error updating vendor:', error);
          alert(`Failed to update vendor: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase
          .from('vendors')
          .insert([vendorData]);

        if (error) {
          console.error('Error inserting vendor:', error);
          alert(`Failed to add vendor: ${error.message}`);
          return;
        }
      }

      setNoteText('');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      alert(`An unexpected error occurred while saving the vendor: ${error.message || error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            {vendor ? 'Edit Vendor' : 'Add Vendor'}
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
                Vendor/Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Elegant Photography Studio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {vendorCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="John Smith"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="contact@vendor.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="https://vendor.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="123 Main St, City, ST 12345"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status & Contract</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Vendor['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  {vendorStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="contractSigned"
                  checked={formData.contractSigned}
                  onChange={(e) => setFormData({ ...formData, contractSigned: e.target.checked })}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                />
                <label htmlFor="contractSigned" className="ml-2 text-sm text-gray-700">
                  Contract signed
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Date
                </label>
                <input
                  type="date"
                  value={formData.contractDate ? new Date(formData.contractDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, contractDate: e.target.value ? new Date(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Contract Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Due Date
                </label>
                <input
                  type="date"
                  value={formData.depositDueDate ? new Date(formData.depositDueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, depositDueDate: e.target.value ? new Date(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="depositPaid"
                    checked={formData.depositPaid}
                    onChange={(e) => setFormData({ ...formData, depositPaid: e.target.checked })}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                  <label htmlFor="depositPaid" className="ml-2 text-sm text-gray-700">
                    Paid
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Payment Date
                </label>
                <input
                  type="date"
                  value={formData.finalPaymentDate ? new Date(formData.finalPaymentDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, finalPaymentDate: e.target.value ? new Date(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="finalPaymentPaid"
                    checked={formData.finalPaymentPaid}
                    onChange={(e) => setFormData({ ...formData, finalPaymentPaid: e.target.checked })}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                  <label htmlFor="finalPaymentPaid" className="ml-2 text-sm text-gray-700">
                    Paid
                  </label>
                </div>
              </div>
            </div>

            {formData.totalAmount && formData.totalAmount > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className="font-semibold text-orange-600">
                    ${(() => {
                      let balance = formData.totalAmount || 0;
                      if (formData.depositPaid && formData.finalPaymentPaid) {
                        balance = 0;
                      } else if (formData.depositPaid) {
                        balance = (formData.totalAmount || 0) - (formData.depositAmount || 0);
                      }
                      return balance.toLocaleString();
                    })()}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                placeholder="Add notes about this vendor..."
                rows={5}
              />
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
              {vendor ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
