import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, List, Grid2x2 as Grid, LayoutGrid, Plus, CreditCard as Edit2, PieChart, Mail, Send } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Guest, GuestViewMode } from '../types';
import { GuestModal } from '../components/GuestModal';
import { MealTypesModal } from '../components/MealTypesModal';
import { supabase } from '../utils/supabase';
import { HelpTooltip } from '../components/HelpTooltip';
import { sendWeddingInvitation } from '../utils/emailService';

// Guest list with email invitations v2.0
export const Guests: React.FC = () => {
  const { guests, setGuests } = useApp();
  const [viewMode, setViewMode] = useState<GuestViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<string[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [showMealTypesModal, setShowMealTypesModal] = useState(false);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [weddingDetails, setWeddingDetails] = useState<{ date: string; venue: string; names: string } | null>(null);

  useEffect(() => {
    const fetchCoupleIdAndGuests = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: coupleData } = await supabase
          .from('couples')
          .select('id, wedding_date, venue, partner1_name, partner2_name')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (coupleData) {
          setCoupleId(coupleData.id);

          const formattedDate = coupleData.wedding_date
            ? new Date(coupleData.wedding_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : 'TBD';

          const names = [coupleData.partner1_name, coupleData.partner2_name]
            .filter(Boolean)
            .join(' & ') || 'Our';

          setWeddingDetails({
            date: formattedDate,
            venue: coupleData.venue || 'TBD',
            names: names
          });

          const { data: guestsData } = await supabase
            .from('guests')
            .select('*')
            .eq('couple_id', coupleData.id);

          if (guestsData) {
            const loadedGuests: Guest[] = guestsData.map((guest: any) => ({
              id: guest.id,
              firstName: guest.first_name || '',
              lastName: guest.last_name || '',
              email: guest.email || '',
              phone: guest.phone || '',
              address: guest.address || '',
              category: guest.category || '',
              rsvpStatus: (guest.rsvp_status || 'Not Sent') as Guest['rsvpStatus'],
              responseDate: guest.response_date ? new Date(guest.response_date) : null,
              plusOneAllowed: guest.plus_one_allowed || false,
              plusOneName: guest.plus_one_name || '',
              numberInParty: guest.number_in_party || 1,
              mealChoice: guest.meal_choice || '',
              plusOneMealChoice: guest.plus_one_meal_choice || '',
              dietaryRestrictions: guest.dietary_restrictions || '',
              tableNumber: guest.table_number || null,
              specialNotes: guest.special_notes || '',
              giftReceived: guest.gift_received || false,
              thankYouSent: guest.thank_you_sent || false
            }));
            setGuests(loadedGuests);
          }

          await fetchMealTypes(coupleData.id);
        }
      }
    };
    fetchCoupleIdAndGuests();
  }, []);

  const fetchMealTypes = async (id: string) => {
    const { data, error } = await supabase
      .from('meal_types')
      .select('name')
      .eq('couple_id', id)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching meal types:', error);
    } else if (data && data.length > 0) {
      setMealTypes(data.map((mt: any) => mt.name));
    } else {
      setMealTypes(['Chicken', 'Fish', 'Beef', 'Vegetarian', 'Vegan', 'Child Meal']);
    }
  };

  const handleSaveGuest = async (guest: Guest) => {
    if (!coupleId) {
      console.error('No couple ID found');
      alert('Unable to save guest. Please try refreshing the page.');
      return;
    }

    try {
      const guestData = {
        couple_id: coupleId,
        first_name: guest.firstName,
        last_name: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        address: guest.address,
        category: guest.category,
        rsvp_status: guest.rsvpStatus,
        response_date: guest.responseDate?.toISOString(),
        plus_one_allowed: guest.plusOneAllowed,
        plus_one_name: guest.plusOneName,
        number_in_party: guest.numberInParty,
        meal_choice: guest.mealChoice,
        plus_one_meal_choice: guest.plusOneMealChoice,
        dietary_restrictions: guest.dietaryRestrictions,
        table_number: guest.tableNumber,
        special_notes: guest.specialNotes,
        gift_received: guest.giftReceived,
        thank_you_sent: guest.thankYouSent
      };

      if (editingGuest) {
        const { data, error } = await supabase
          .from('guests')
          .update(guestData)
          .eq('id', guest.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating guest:', error);
          alert(`Failed to update guest: ${error.message}`);
          return;
        }

        if (data) {
          const updatedGuest: Guest = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            category: data.category || '',
            rsvpStatus: data.rsvp_status as Guest['rsvpStatus'],
            responseDate: data.response_date ? new Date(data.response_date) : null,
            plusOneAllowed: data.plus_one_allowed || false,
            plusOneName: data.plus_one_name || '',
            numberInParty: data.number_in_party || 1,
            mealChoice: data.meal_choice || '',
            plusOneMealChoice: data.plus_one_meal_choice || '',
            dietaryRestrictions: data.dietary_restrictions || '',
            tableNumber: data.table_number || null,
            specialNotes: data.special_notes || '',
            giftReceived: data.gift_received || false,
            thankYouSent: data.thank_you_sent || false
          };
          setGuests(guests.map(g => g.id === guest.id ? updatedGuest : g));
        }
      } else {
        const { data, error } = await supabase
          .from('guests')
          .insert([guestData])
          .select()
          .single();

        if (error) {
          console.error('Error inserting guest:', error);
          alert(`Failed to add guest: ${error.message}`);
          return;
        }

        if (data) {
          const newGuest: Guest = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            category: data.category || '',
            rsvpStatus: data.rsvp_status as Guest['rsvpStatus'],
            responseDate: data.response_date ? new Date(data.response_date) : null,
            plusOneAllowed: data.plus_one_allowed || false,
            plusOneName: data.plus_one_name || '',
            numberInParty: data.number_in_party || 1,
            mealChoice: data.meal_choice || '',
            plusOneMealChoice: data.plus_one_meal_choice || '',
            dietaryRestrictions: data.dietary_restrictions || '',
            tableNumber: data.table_number || null,
            specialNotes: data.special_notes || '',
            giftReceived: data.gift_received || false,
            thankYouSent: data.thank_you_sent || false
          };
          setGuests([...guests, newGuest]);
        }
      }
      setShowAddModal(false);
      setEditingGuest(null);
    } catch (error: any) {
      console.error('Error saving guest:', error);
      alert(`An unexpected error occurred while saving the guest: ${error.message || error}`);
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingGuest(null);
  };

  const handleSendInvitation = async (guest: Guest) => {
    if (!guest.email) {
      alert('This guest does not have an email address.');
      return;
    }

    if (!weddingDetails) {
      alert('Wedding details are not available. Please update your wedding information in Settings.');
      return;
    }

    setSendingEmails(prev => new Set(prev).add(guest.id));

    try {
      const guestName = `${guest.firstName} ${guest.lastName}`;
      const success = await sendWeddingInvitation(
        guest.email,
        guestName,
        weddingDetails.names,
        weddingDetails.date,
        weddingDetails.venue
      );

      if (success) {
        await supabase
          .from('guests')
          .update({ rsvp_status: 'Invited' })
          .eq('id', guest.id);

        setGuests(guests.map(g =>
          g.id === guest.id ? { ...g, rsvpStatus: 'Invited' } : g
        ));

        alert(`Invitation sent to ${guestName}!`);
      } else {
        alert('Failed to send invitation. Please check your email configuration.');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('An error occurred while sending the invitation.');
    } finally {
      setSendingEmails(prev => {
        const next = new Set(prev);
        next.delete(guest.id);
        return next;
      });
    }
  };

  const getStatusColor = (status: Guest['rsvpStatus']) => {
    const colors = {
      'Not Sent': 'bg-gray-100 text-gray-700 border-gray-200',
      'Invited': 'bg-blue-100 text-blue-700 border-blue-200',
      'Confirmed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Declined': 'bg-red-100 text-red-700 border-red-200',
      'Maybe': 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return colors[status];
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch =
      guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRSVP = rsvpFilter.length === 0 || rsvpFilter.includes(guest.rsvpStatus);
    return matchesSearch && matchesRSVP;
  });

  const stats = {
    total: guests.reduce((sum, g) => sum + g.numberInParty, 0),
    confirmed: guests.filter(g => g.rsvpStatus === 'Confirmed').reduce((sum, g) => sum + g.numberInParty, 0),
    declined: guests.filter(g => g.rsvpStatus === 'Declined').reduce((sum, g) => sum + g.numberInParty, 0),
    pending: guests.filter(g => g.rsvpStatus === 'Not Sent' || g.rsvpStatus === 'Invited').reduce((sum, g) => sum + g.numberInParty, 0),
    maybe: guests.filter(g => g.rsvpStatus === 'Maybe').reduce((sum, g) => sum + g.numberInParty, 0),
    totalParty: guests.reduce((sum, g) => sum + (g.rsvpStatus === 'Confirmed' ? g.numberInParty : 0), 0)
  };

  const mealCounts = guests
    .filter(g => g.rsvpStatus === 'Confirmed' && g.mealChoice)
    .reduce((acc, g) => {
      const meals = g.mealChoice.split('|').filter(m => m);
      meals.forEach(meal => {
        acc[meal] = (acc[meal] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

  const displayMealCounts = mealTypes.map(category => ({
    name: category,
    count: mealCounts[category] || 0
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2" style={{ backgroundColor: '#ffeb3b', padding: '4px 8px' }}>Guest List - UPDATED v3.0</h1>
          <HelpTooltip content="Track all your wedding guests, RSVPs, meal choices, and seating. Export your guest list for printing or sharing with vendors." />
        </div>
        <p className="text-gray-600">Manage your wedding guests and RSVPs - If you see this text, the page has updated</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Invited</div>
            <UsersIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Confirmed</div>
            <PieChart className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-600">{stats.confirmed}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Declined</div>
            <PieChart className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.declined}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Pending</div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
          {stats.maybe > 0 && (
            <div className="text-xs text-amber-600 mt-1">{stats.maybe} maybe</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">Total Meal Count</h3>
            <HelpTooltip content="Track meal preferences for confirmed guests. Click 'Add/Edit/Delete Meal Types' to customize your menu options. Export this data for your caterer." />
          </div>
          <button
            onClick={() => setShowMealTypesModal(true)}
            className="text-sm text-primary-600 hover:text-primary-700 underline transition-colors"
          >
            Add/Edit/Delete Meal Types
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayMealCounts.map(({ name, count }) => (
            <div key={name} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">{name}</div>
              <div className="text-3xl font-bold text-gray-800">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'card' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('seating')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'seating' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Guest
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          {['Not Sent', 'Invited', 'Confirmed', 'Declined', 'Maybe'].map(status => (
            <button
              key={status}
              onClick={() => {
                setRsvpFilter(prev =>
                  prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                rsvpFilter.includes(status)
                  ? getStatusColor(status as Guest['rsvpStatus'])
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">RSVP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Party</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Meal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGuests.map(guest => (
                <tr
                  key={guest.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedGuest(guest)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-800 text-sm">
                      {guest.firstName} {guest.lastName}
                    </div>
                    {guest.plusOneAllowed && guest.plusOneName && (
                      <div className="text-xs text-gray-600">+ {guest.plusOneName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap">{guest.email}</span>
                      {guest.email && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendInvitation(guest);
                          }}
                          disabled={sendingEmails.has(guest.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium whitespace-nowrap"
                          title="Send invitation"
                        >
                          {sendingEmails.has(guest.id) ? (
                            <Send className="w-3 h-3 animate-pulse" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          <span>Send</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{guest.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(guest.rsvpStatus)}`}>
                      {guest.rsvpStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">{guest.numberInParty}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{guest.mealChoice || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{guest.tableNumber || '-'}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 justify-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGuest(guest);
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Edit guest"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map(guest => (
            <div
              key={guest.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedGuest(guest)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {guest.firstName} {guest.lastName}
                  </h3>
                  {guest.plusOneAllowed && guest.plusOneName && (
                    <p className="text-sm text-gray-600">+ {guest.plusOneName}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(guest.rsvpStatus)}`}>
                  {guest.rsvpStatus}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  {guest.email}
                  {guest.email && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendInvitation(guest);
                      }}
                      disabled={sendingEmails.has(guest.id)}
                      className="p-1 hover:bg-primary-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send invitation"
                    >
                      {sendingEmails.has(guest.id) ? (
                        <Send className="w-3 h-3 text-primary-600 animate-pulse" />
                      ) : (
                        <Mail className="w-3 h-3 text-primary-600" />
                      )}
                    </button>
                  )}
                </div>
                <div>{guest.phone}</div>
              </div>

              <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                <div>
                  <div className="text-gray-600">Party Size</div>
                  <div className="font-semibold text-gray-800">{guest.numberInParty}</div>
                </div>
                {guest.mealChoice && (
                  <div>
                    <div className="text-gray-600">Meal</div>
                    <div className="font-semibold text-gray-800">{guest.mealChoice}</div>
                  </div>
                )}
                {guest.tableNumber && (
                  <div>
                    <div className="text-gray-600">Table</div>
                    <div className="font-semibold text-gray-800">{guest.tableNumber}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'seating' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center py-12">
            <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Seating Chart</h3>
            <p className="text-gray-600">Drag and drop guests to assign tables</p>
            <p className="text-sm text-gray-500 mt-2">Feature coming soon</p>
          </div>
        </div>
      )}

      {filteredGuests.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No guests found</h3>
          <p className="text-gray-600 mb-6">Start by adding your first guest</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Guest
          </button>
        </div>
      )}

      {showAddModal && (
        <GuestModal
          guest={editingGuest}
          onClose={handleCloseModal}
          onSave={handleSaveGuest}
          mealTypes={mealTypes}
        />
      )}

      {showMealTypesModal && coupleId && (
        <MealTypesModal
          coupleId={coupleId}
          onClose={() => setShowMealTypesModal(false)}
          onSave={() => {
            if (coupleId) {
              fetchMealTypes(coupleId);
            }
          }}
        />
      )}
    </div>
  );
};
