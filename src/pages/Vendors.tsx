import React, { useState, useEffect } from 'react';
import { Users, Grid, List, FolderOpen, Plus, Phone, Mail, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Vendor, VendorViewMode } from '../types';
import { VendorModal } from '../components/VendorModal';
import { supabase } from '../utils/supabase';
import { HelpTooltip } from '../components/HelpTooltip';

const vendorCategories = [
  'Photography', 'Videography', 'Venue', 'Catering', 'Florist',
  'DJ/Band', 'Hair/Makeup', 'Cake', 'Rentals', 'Planner',
  'Officiant', 'Transportation', 'Other'
];

export const Vendors: React.FC = () => {
  const { vendors, setVendors } = useApp();
  const [viewMode, setViewMode] = useState<VendorViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupleIdAndVendors = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: coupleData } = await supabase
          .from('couples')
          .select('id')
          .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
          .maybeSingle();

        if (coupleData) {
          setCoupleId(coupleData.id);

          const { data: vendorsData } = await supabase
            .from('vendors')
            .select('*')
            .eq('couple_id', coupleData.id);

          if (vendorsData) {
            const loadedVendors: Vendor[] = vendorsData.map((vendor: any) => ({
              id: vendor.id,
              name: vendor.name || '',
              category: vendor.category || '',
              contactName: vendor.contact_name || '',
              phone: vendor.phone || '',
              email: vendor.email || '',
              website: vendor.website || '',
              address: vendor.address || '',
              status: (vendor.status || 'Researching') as Vendor['status'],
              contractSigned: vendor.contract_signed || false,
              contractDate: vendor.contract_date ? new Date(vendor.contract_date) : null,
              totalAmount: vendor.total_amount || 0,
              depositAmount: vendor.deposit_amount || 0,
              depositDueDate: vendor.deposit_due_date ? new Date(vendor.deposit_due_date) : null,
              depositPaid: vendor.deposit_paid || false,
              balanceDue: vendor.balance_due || 0,
              finalPaymentDate: vendor.final_payment_date ? new Date(vendor.final_payment_date) : null,
              finalPaymentPaid: vendor.final_payment_paid || false,
              paymentStatus: (vendor.payment_status || 'Not Paid') as Vendor['paymentStatus'],
              notes: vendor.vendor_notes || [],
              linkedTasks: vendor.linked_tasks || []
            }));
            setVendors(loadedVendors);
          }
        }
      }
    };
    fetchCoupleIdAndVendors();
  }, []);

  const handleSaveVendor = async () => {
    if (!coupleId) return;

    const { data: vendorsData } = await supabase
      .from('vendors')
      .select('*')
      .eq('couple_id', coupleId);

    if (vendorsData) {
      const loadedVendors: Vendor[] = vendorsData.map((vendor: any) => ({
        id: vendor.id,
        name: vendor.name || '',
        category: vendor.category || '',
        contactName: vendor.contact_name || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        website: vendor.website || '',
        address: vendor.address || '',
        status: (vendor.status || 'Researching') as Vendor['status'],
        contractSigned: vendor.contract_signed || false,
        contractDate: vendor.contract_date ? new Date(vendor.contract_date) : null,
        totalAmount: vendor.total_amount || 0,
        depositAmount: vendor.deposit_amount || 0,
        depositDueDate: vendor.deposit_due_date ? new Date(vendor.deposit_due_date) : null,
        depositPaid: vendor.deposit_paid || false,
        balanceDue: vendor.balance_due || 0,
        finalPaymentDate: vendor.final_payment_date ? new Date(vendor.final_payment_date) : null,
        finalPaymentPaid: vendor.final_payment_paid || false,
        paymentStatus: (vendor.payment_status || 'Not Paid') as Vendor['paymentStatus'],
        notes: vendor.vendor_notes || [],
        linkedTasks: vendor.linked_tasks || []
      }));
      setVendors(loadedVendors);
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) {
        console.error('Error deleting vendor:', error);
        alert(`Failed to delete vendor: ${error.message}`);
        return;
      }

      setVendors(vendors.filter(v => v.id !== vendorId));
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      alert(`An unexpected error occurred while deleting the vendor: ${error.message || error}`);
    }
  };

  const getStatusColor = (status: Vendor['status']) => {
    const colors = {
      Researching: 'bg-gray-100 text-gray-700 border-gray-200',
      Contacted: 'bg-blue-100 text-blue-700 border-blue-200',
      Booked: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Paid: 'bg-green-100 text-green-700 border-green-200',
      Declined: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status];
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || vendor.category === categoryFilter;
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(vendor.status);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const groupedVendors = vendorCategories.reduce((acc, category) => {
    acc[category] = filteredVendors.filter(v => v.category === category);
    return acc;
  }, {} as Record<string, Vendor[]>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Vendors</h1>
          <HelpTooltip content="Track all your wedding vendors including photographers, caterers, venues, and more. Manage contacts, contracts, deposits, and payment schedules in one place." />
        </div>
        <p className="text-gray-600">Manage your wedding vendors and contracts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'category' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4 flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {vendorCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Vendor
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          {['Researching', 'Contacted', 'Booked', 'Paid', 'Declined'].map(status => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(prev =>
                  prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                statusFilter.includes(status)
                  ? getStatusColor(status as Vendor['status'])
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.contactName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {vendor.category}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {vendor.phone || 'No phone'}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {vendor.email || 'No email'}
                </div>
              </div>

              {vendor.totalAmount > 0 && (
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Contract:</span>
                    <span className="font-semibold text-gray-800">
                      ${vendor.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {vendor.balanceDue > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Balance:</span>
                      <span className="font-semibold text-orange-600">
                        ${vendor.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`tel:${vendor.phone}`)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  Call
                </button>
                <button
                  onClick={() => window.open(`mailto:${vendor.email}`)}
                  className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                >
                  Email
                </button>
                <button
                  onClick={() => handleEditVendor(vendor)}
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map(vendor => (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{vendor.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vendor.contactName && <div className="font-medium text-gray-700">{vendor.contactName}</div>}
                    <div>{vendor.phone}</div>
                    <div className="text-xs">{vendor.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ${vendor.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-orange-600">
                    ${vendor.balanceDue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVendor(vendor);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVendor(vendor.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'category' && (
        <div className="space-y-4">
          {vendorCategories.map(category => {
            const categoryVendors = groupedVendors[category];
            if (categoryVendors.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                    <span className="text-sm text-gray-600">{categoryVendors.length} vendor{categoryVendors.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryVendors.map(vendor => (
                      <div
                        key={vendor.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-800">{vendor.name}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                            {vendor.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{vendor.contactName}</div>
                        {vendor.totalAmount > 0 && (
                          <div className="text-sm font-semibold text-gray-800 mt-2">
                            ${vendor.totalAmount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredVendors.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No vendors found</h3>
          <p className="text-gray-600 mb-6">Start by adding your first vendor</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Vendor
          </button>
        </div>
      )}

      {showAddModal && coupleId && (
        <VendorModal
          vendor={editingVendor}
          onClose={handleCloseModal}
          onSave={handleSaveVendor}
          coupleId={coupleId}
        />
      )}
    </div>
  );
};
